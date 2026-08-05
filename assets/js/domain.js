/* =====================================================================
   domain.js — İŞ KURALI YORDAMLARI (ortak katman)

   NEDEN VAR: Aynı işlem birden çok ekrandan yürütülüyordu ve her ekran
   kendi mutasyonunu yazdığı için sonuçlar AYRIŞIYORDU:

   · VB-06 — fatura "Ödendi" işaretlenince bağlı tahsilat açık kalıyordu;
     tahsilat kapanınca fatura açık kalıyordu. Kullanıcı faturayı ödendi
     yaptıktan sonra tahsilat sekmesinde hâlâ açık alacak görüyordu:
     **ekran kendi içinde çelişiyordu.**
   · VB-23 — teslim onayı üç ekranda üç farklı yürütülüyordu: liste yalnız
     `musteriOnay` yazıyor, detay `durum`u da `Onaylandı` yapıyordu; yetki
     ekseni liste tarafında `onay`, detay tarafında `duzenle`ydi.
   · VB-25 — `DB.milestones[].odemeDurum` bağlı faturanın ayna alanıydı ve
     fatura değişince sessizce ayrışıyordu.

   KURAL: Bir olgu birden çok koleksiyona dokunuyorsa mutasyon BURADA
   tanımlanır; ekran yalnız çağırır ve sonucu raporlar. Yetki kapısı da
   burada tek eksende durur — iki ekran farklı yetki soramaz.

   `ui.js`'ten ayrı bir dosyadır: `ui.js` alana kör bileşen katmanıdır,
   bu dosya GaviaWorks iş kuralını bilir. Yükleme sırası: veri → shell →
   ui → domain.
   ===================================================================== */
(function(){
  'use strict';
  var GV = window.GV = window.GV || {};

  function can(action){ return !(GV.perm && GV.perm.can) || !!GV.perm.can(action); }
  function saat(){ return (window.DB ? DB.today : '') + 'T09:00'; }
  function kim(){ return (GV.session && GV.session.ad) || 'Sistem'; }
  function log(kayit, metin, eski, yeni, tone, icon){
    if(!window.DB || !DB.activities) return;
    DB.activities.unshift({ kayit:kayit, tarih:saat(), kisi:kim(), metin:metin,
                            eski:eski == null ? '' : eski, yeni:yeni == null ? '' : yeni,
                            tone:tone || 'ok', icon:icon || 'i-check' });
  }

  /* ===================================================================
     FİNANS — fatura ↔ tahsilat ↔ taksit zinciri (VB-06 · VB-25)
     Zincir: sözleşme → taksit(milestone) → fatura → tahsilat(payment).
     Kapanış hangi uçtan tetiklenirse tetiklensin **tamamı** kapanır ve
     müşterinin `bekleyenTahsilat` alanı yeniden türetilir.
     =================================================================== */
  var Fin = {
    /* Faturayı öder: fatura + bağlı tahsilat + taksitin ödeme durumu + müşteri özeti */
    settleInvoice:function(kod, tarih){
      if(!window.DB) return null;
      if(!can('finans')) return { ok:false, why:'yetki' };
      var f = DB.invoices.filter(function(x){ return x.kod === kod; })[0];
      if(!f) return { ok:false, why:'kayıt yok' };
      if(f.durum === 'Ödendi') return { ok:false, why:'zaten kapalı' };
      var t = tarih || DB.today;
      var eski = f.durum;
      f.durum = 'Ödendi'; f.odemeTarihi = t;
      var p = DB.payments.filter(function(x){ return x.fatura === f.kod; })[0];
      if(p && p.durum !== 'Ödendi'){
        p.durum = 'Ödendi'; p.gecikmeGun = 0;
        p.sonAksiyon = 'Tahsil edildi'; p.sonAksiyonTarihi = t;
      }
      var ms = senkronTaksit(f);
      musteriOzet(f.musteri);
      log(f.kod, 'Fatura ödendi işaretlendi', eski, 'Ödendi', 'ok', 'i-check-circle');
      if(p) log(p.kod, 'Bağlı fatura kapandığı için tahsilat da kapatıldı', '', f.kod, 'ok', 'i-link');
      return { ok:true, fatura:f, tahsilat:p || null, taksit:ms || null };
    },

    /* Tahsilatı kapatır: tahsilat + bağlı fatura + taksit + müşteri özeti */
    settlePayment:function(kod, tarih){
      if(!window.DB) return null;
      if(!can('finans')) return { ok:false, why:'yetki' };
      var p = DB.payments.filter(function(x){ return x.kod === kod; })[0];
      if(!p) return { ok:false, why:'kayıt yok' };
      if(p.durum === 'Ödendi') return { ok:false, why:'zaten kapalı' };
      var t = tarih || DB.today;
      var eski = p.durum;
      p.durum = 'Ödendi'; p.gecikmeGun = 0;
      p.sonAksiyon = 'Tahsil edildi'; p.sonAksiyonTarihi = t;
      var f = DB.invoices.filter(function(x){ return x.kod === p.fatura; })[0];
      if(f && f.durum !== 'Ödendi'){ f.durum = 'Ödendi'; f.odemeTarihi = t; }
      var ms = f ? senkronTaksit(f) : null;
      musteriOzet(p.musteri);
      log(p.kod, 'Tahsilat kapatıldı', eski, 'Ödendi', 'ok', 'i-check-circle');
      if(f) log(f.kod, 'Bağlı tahsilat kapandığı için fatura da kapatıldı', '', p.kod, 'ok', 'i-link');
      return { ok:true, tahsilat:p, fatura:f || null, taksit:ms || null };
    },

    /* Müşterinin bekleyen tahsilatı — TÜRETİLİR, elle yazılmaz (L-08) */
    refreshCustomer:function(kod){ return musteriOzet(kod); }
  };

  /* Taksitin ödeme durumu bağlı faturanın aynasıdır (VB-25): tek yerde yazılır */
  function senkronTaksit(f){
    if(!f || !f.milestone || !DB.milestones) return null;
    var m = DB.milestones.filter(function(x){ return x.kod === f.milestone; })[0];
    if(!m) return null;
    var yeni = f.durum === 'Ödendi' ? 'Ödendi' : (f.durum === 'Gecikti' ? 'Gecikti' : 'Bekliyor');
    if(m.odemeDurum !== yeni){
      log(m.kod, 'Taksit ödeme durumu bağlı faturadan güncellendi', m.odemeDurum, yeni, 'ok', 'i-link');
      m.odemeDurum = yeni;
    }
    return m;
  }

  function musteriOzet(kod){
    if(!kod || !DB.customers) return null;
    var c = DB.customers.filter(function(x){ return x.kod === kod; })[0];
    if(!c) return null;
    c.bekleyenTahsilat = DB.payments
      .filter(function(p){ return p.musteri === kod && p.durum !== 'Ödendi'; })
      .reduce(function(s, p){ return s + p.tutar; }, 0);
    return c;
  }

  /* ===================================================================
     TESLİM — müşteri onayı (VB-23)
     Üç ekran (liste · detay · form) tek yordamı çağırır. `karar` sözlüğün
     tamamını kabul eder: 'Onaylandı' | 'Bekliyor' | 'Revizyon istendi'.
     Teslim durumu ile müşteri onayı AYNI EKSENDE tutulur — detay ekranının
     davranışı doğruydu, liste ekranı eksik yazıyordu.
     =================================================================== */
  var KARARLAR = ['Onaylandı', 'Bekliyor', 'Revizyon istendi'];
  var Delivery = {
    kararlar:KARARLAR,
    approve:function(kod, karar, tarih, not){
      if(!window.DB) return null;
      if(KARARLAR.indexOf(karar) === -1) return { ok:false, why:'geçersiz karar' };
      /* Tek yetki ekseni: onay. Liste `onay`, detay `duzenle` soruyordu. */
      if(!can('onay')) return { ok:false, why:'yetki' };
      var d = DB.deliveries.filter(function(x){ return x.kod === kod; })[0];
      if(!d) return { ok:false, why:'kayıt yok' };
      if(d.musteriOnay === karar) return { ok:false, why:'zaten bu durumda' };
      var eskiOnay = d.musteriOnay, eskiDurum = d.durum;
      d.musteriOnay = karar;
      if(karar === 'Onaylandı'){
        d.onayTarihi = tarih || DB.today;
        d.durum = 'Onaylandı';
      }else if(karar === 'Revizyon istendi'){
        d.onayTarihi = null;
        /* Teslim durumu sözlüğü üç değerlidir (Planlandı · Onaylandı · Gecikti);
           revizyon için yeni bir durum UYDURULMAZ — onaylı teslim planlıya döner. */
        if(d.durum === 'Onaylandı') d.durum = 'Planlandı';
        if(not) d.not = not;
      }else{
        d.onayTarihi = null;
      }
      log(d.kod, 'Müşteri onayı işlendi' +
          (eskiDurum !== d.durum ? ' · teslim durumu ' + eskiDurum + ' → ' + d.durum : ''),
          eskiOnay, karar, karar === 'Onaylandı' ? 'ok' : 'warn',
          karar === 'Onaylandı' ? 'i-check-circle' : 'i-refresh');
      return { ok:true, teslim:d, eskiDurum:eskiDurum };
    }
  };

  GV.fin = Fin;
  GV.delivery = Delivery;
})();
