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
  /* Aktivite kaydı kişiyi KOD olarak tutar, ad olarak değil (VB-12).
     Ad `GV.activity` içinde `DB.empName` ile çözülür; oturum yoksa kayıt
     kişisiz kalır — uydurma bir "Sistem" adı yazmak, olmayan bir personeli
     varmış gibi gösterirdi (canon eksen 22b onu ihlal sayar). */
  function kim(){ return (GV.session && GV.session.emp) || null; }
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

  /* ===================================================================
     GÖREV — durum geçişleri (REVİZE 02)

     Geçiş tablosu (`DB.taskTransitions`) beş oturumdur veride duruyordu ama
     **uygulanmıyordu**: dokuz mutasyon yolunun yalnız ikisi ona bakıyordu.
     `app-gorev-detay.html` izin verilen rolleri ve zorunlu alanları modalda
     yalnız İPUCU METNİ olarak basıyor, sonra hedefi kontrolsüz yazıyordu;
     "Onayla" ve "Revize İste" düğmeleri tabloyu tamamen atlıyordu; hata
     detayı ve arşiv ekranı da kendi durumunu elle yazıyordu.

     VB-06 / VB-23'ün aynı sınıfı: bir olgu birden çok ekrandan yürütülünce
     sonuçlar ayrışır. Mutasyon buraya alındı; ekran yalnız çağırır.

     İKİ AYRIM ÖNEMLİ:
     · `yetki` listesi ROL anahtarı da İLİŞKİ anahtarı da taşır. `'pm'` bir
       roldür ("proje yöneticisi rolündeki herkes"), `'sorumlu'` bir ilişkidir
       ("BU görevin sorumlusu"). İkisi ayrı çözülür — karıştırmak, her
       geliştiriciyi her görevin sorumlusu yapardı.
     · Onay adımının gerekip gerekmediği SAKLANMAZ, türetilir (L-08):
       kontrol eden ile onaylayan **aynı kişiyse** kontrol zaten onaydır ve
       görev doğrudan `Tamamlandı`ya gider; **farklıysa** araya `Onay bekliyor`
       girer. Veride bugün 17 görevde aynı, 9 görevde farklı.
     =================================================================== */
  var Task = {
    /* Onay adımı gerekli mi — türetilir, alan açılmaz */
    onayGerekli:function(t){ return !!t && t.onaylayan !== t.kontrolEden; },

    /* Oturumdaki kişi bu geçişi yapabilir mi.
       `iliski` anahtarları görev kaydından, rol anahtarları oturumdan çözülür. */
    yetkili:function(t, kural){
      if(!t || !kural || !kural.yetki || !kural.yetki.length) return false;
      var me  = (GV.session && GV.session.emp) || null;
      var rol = (GV.perm && GV.perm.role) ? GV.perm.role() : null;
      return kural.yetki.some(function(k){
        if(k === 'sorumlu')     return me && t.sorumlu === me;
        if(k === 'kontrolEden') return me && t.kontrolEden === me;
        if(k === 'onaylayan')   return me && t.onaylayan === me;
        if(k === 'veren')       return me && t.veren === me;
        return rol === k;
      });
    },

    /* Hedefe geçmeden önce dolu olması gereken alanlar — EKSİK OLANLARI döndürür */
    eksikAlanlar:function(t, kural, ek){
      if(!kural || !kural.zorunlu || !kural.zorunlu.length) return [];
      ek = ek || {};
      return kural.zorunlu.filter(function(alan){
        var v = (alan in ek) ? ek[alan] : t[alan];
        return v == null || v === '' || (Array.isArray(v) && !v.length);
      });
    },

    /* Bu görev + bu oturum için YAPILABİLİR geçişler.
       Ekran bunu aksiyon butonuna çevirir; uzun statü dropdown'ı basmaz. */
    nextSteps:function(kod){
      if(!window.DB) return [];
      var t = DB.tasks.filter(function(x){ return x.kod === kod; })[0];
      if(!t) return [];
      var kural = DB.taskTransitions[t.durum];
      if(!kural || !kural.next.length) return [];
      var izin = Task.yetkili(t, kural);
      var onay = Task.onayGerekli(t);
      return kural.next.filter(function(hedef){
        /* Kontrolden çıkışta iki yol da tabloda yazılı; geçerli olan BİRİ basılır */
        if(t.durum === 'Kontrolde' && hedef === 'Onay bekliyor') return onay;
        if(t.durum === 'Kontrolde' && hedef === 'Tamamlandı')    return !onay;
        return true;
      }).map(function(hedef){
        return {
          hedef:hedef,
          etiket:(DB.taskActionLabels && DB.taskActionLabels[hedef]) || hedef,
          tone:hedef === 'Tamamlandı' ? 'btn-ok'
             : hedef === 'İptal edildi' || hedef === 'Engellendi' ? 'btn-danger-line'
             : hedef === 'Revizede' ? 'btn-line'
             : hedef === 'Arşivlendi' ? 'btn-line' : 'btn-acc',
          izin:izin,
          eksik:Task.eksikAlanlar(t, kural)
        };
      });
    },

    /* Tek mutasyon noktası. `ek` geçişle birlikte yazılacak alanları taşır
       (ör. `{ revizeNot:'…' }`) ve zorunlu alan denetiminde de sayılır. */
    transition:function(kod, hedef, ek, not){
      if(!window.DB) return null;
      var t = DB.tasks.filter(function(x){ return x.kod === kod; })[0];
      if(!t) return { ok:false, why:'kayıt yok' };
      var kural = DB.taskTransitions[t.durum];
      if(!kural) return { ok:false, why:'"' + t.durum + '" için geçiş kuralı tanımlı değil' };
      if(kural.next.indexOf(hedef) === -1)
        return { ok:false, why:'"' + t.durum + '" durumundan "' + hedef + '" durumuna geçilemez' };
      if(t.durum === 'Kontrolde'){
        var onay = Task.onayGerekli(t);
        if(hedef === 'Onay bekliyor' && !onay)
          return { ok:false, why:'Bu görevde kontrol eden ile onaylayan aynı kişi — ayrı onay adımı yok' };
        if(hedef === 'Tamamlandı' && onay)
          return { ok:false, why:'Bu görev onay adımından geçmeli — önce onaya gönderin' };
      }
      if(!Task.yetkili(t, kural))
        return { ok:false, why:'yetki', roller:kural.yetki };
      var eksik = Task.eksikAlanlar(t, kural, ek);
      if(eksik.length) return { ok:false, why:'zorunlu', eksik:eksik };

      var eski = t.durum;
      if(ek) Object.keys(ek).forEach(function(k){ t[k] = ek[k]; });
      t.durum = hedef;

      /* Durum geçişinin yan etkileri — hepsi TEK yerde, ekranda değil */
      if(hedef === 'Devam ediyor' && !t.baslangic) t.baslangic = DB.today;
      if(hedef === 'Revizede'){ t.revizyon = (t.revizyon || 0) + 1; }
      if(hedef === 'Tamamlandı'){ t.ilerleme = 100; t.tamamlanma = DB.today; }
      /* Arşiv bu veride İKİ alanla anlatılıyor (`durum:'Arşivlendi'` ve `arsiv:true`)
         ve `GV.list` ikisini de arşiv sayıyor — VB-20'nin açık bıraktığı eksen.
         Yalnız birini yazmak, kaydı bir ekranda arşivli bir ekranda değil
         gösterirdi; ikisi tek yerde birlikte yazılır. */
      if(hedef === 'Arşivlendi') t.arsiv = true;
      if(hedef !== 'Engellendi' && t.beklemeNedeni && hedef === 'Devam ediyor'){
        /* Engel kalkıp çalışmaya dönülüyorsa bekleme de biter */
        Task.bekleme(kod, null, null, true);
      }
      log(t.kod, 'Durum değiştirildi' + (not ? ' — ' + not : ''), eski, hedef,
          hedef === 'Tamamlandı' ? 'ok' : hedef === 'İptal edildi' || hedef === 'Engellendi' ? 'danger' : 'info',
          hedef === 'Tamamlandı' ? 'i-check-circle' : 'i-refresh');
      return { ok:true, gorev:t, eski:eski, bildirim:kural.bildirim || [] };
    },

    /* ARŞİVDEN GERİ AL — geçiş tablosunun TERSİ DEĞİL, ayrı bir işlem.
       `Arşivlendi` bilerek son duraktır (`next:[]`): arşive iki durumdan
       gelinir (`Tamamlandı` · `İptal edildi`), dolayısıyla tabloya çıkış
       kenarı eklemek iptal edilmiş bir görevi tamamlanmış diye diriltirdi.
       İleri geçiş yordamını ters yönde kullanmak da yanlış olurdu: o yordam
       `Tamamlandı` hedefinde `tamamlanma`yı BUGÜNE yazar ve kaydın gerçek
       bitiş tarihini ezerdi.

       Bu yüzden geri alma, gideceği yeri TAHMİN ETMEZ — aktivite kaydından
       okur: arşivleme işlemi zaten `eski` değerini yazmıştır. Kayıt yoksa
       işlem YAPILMAZ ve nedeni söylenir; yarım uygulamak (arsiv bayrağını
       temizleyip durumu bırakmak) kaydı arşiv listesinde bırakır ve üstüne
       başarı mesajı basardı — UID-27'nin tam olarak o hatası. */
    arsivGeriAl:function(kod){
      if(!window.DB) return null;
      var t = DB.tasks.filter(function(x){ return x.kod === kod; })[0];
      if(!t) return { ok:false, why:'kayıt yok' };
      if(t.durum !== 'Arşivlendi' && !t.arsiv) return { ok:false, why:'zaten arşivde değil' };
      if(!can('duzenle')) return { ok:false, why:'yetki' };
      var iz = (DB.activities || []).filter(function(a){
        return a.kayit === kod && a.yeni === 'Arşivlendi' && a.eski;
      })[0];
      if(!iz) return { ok:false, why:'kaynak durum bilinmiyor',
                       aciklama:'Bu kaydın arşivlenme hareketi yazılı değil; hangi duruma döneceği tahmin edilmez.' };
      var hedef = iz.eski;
      if(DB.taskStatuses.indexOf(hedef) === -1)
        return { ok:false, why:'kaynak durum sözlükte yok', aciklama:hedef };
      var eski = t.durum;
      t.durum = hedef;
      delete t.arsiv;
      log(t.kod, 'Arşivden geri alındı', eski, hedef, 'ok', 'i-refresh');
      return { ok:true, gorev:t, eski:eski, hedef:hedef };
    },

    /* SORUMLU ATAMA — iki yol, TEK giriş noktası (REVİZE 02 kuyruğu).

       `app-gorev.html`'in toplu "Sorumlu ata" işlemi `run` taşımıyordu, yani
       pasif basılıyordu. Yazarken çıkan gerçek soru şuydu: atama bazı
       görevlerde bir GEÇİŞ (`Havuzda → Atandı`), bazılarında düz bir alan
       yazımıdır. İkisini ekranda ayırmak, REVİZE 02'nin kapattığı ikinci
       mutasyon yolunu geri açardı — bu yüzden ayrım BURADA yapılır:

       · Görev `Havuzda` ise → `transition('Atandı')`. Geçiş tablosu, yetki
         ve zorunlu alan denetimi olduğu gibi çalışır.
       · Görev zaten atanmışsa → sorumlu DEĞİŞTİRME işlemidir, durum
         değişmez. Bu bir geçiş değildir ve tabloya sokulması yanlış olurdu:
         `Devam ediyor` durumundaki bir görevi `Atandı`ya geri çekerdi. */
    ata:function(kod, emp, not){
      if(!window.DB) return null;
      var t = DB.tasks.filter(function(x){ return x.kod === kod; })[0];
      if(!t) return { ok:false, why:'kayıt yok' };
      if(!emp || !DB.emp || !DB.emp(emp)) return { ok:false, why:'personel yok' };
      if(t.sorumlu === emp) return { ok:false, why:'zaten bu kişide' };
      if(t.durum === 'Havuzda')
        return Task.transition(kod, 'Atandı', { sorumlu:emp }, not || 'sorumlu atandı');
      if(!can('duzenle')) return { ok:false, why:'yetki' };
      var eski = t.sorumlu;
      t.sorumlu = emp;
      log(t.kod, 'Sorumlu değiştirildi' + (not ? ' — ' + not : ''),
          eski, emp, 'info', 'i-user-check');
      return { ok:true, gorev:t, eski:eski, gecis:false };
    },

    /* ÖNCELİK — durum ekseninden BAĞIMSIZ düz alan. Geçiş tablosuna hiç
       dokunmaz; buraya alınmasının sebebi mutasyonun ekranda yazılmaması. */
    oncelik:function(kod, deger){
      if(!window.DB) return null;
      var t = DB.tasks.filter(function(x){ return x.kod === kod; })[0];
      if(!t) return { ok:false, why:'kayıt yok' };
      if(!DB.priorities || DB.priorities.indexOf(deger) === -1)
        return { ok:false, why:'geçersiz öncelik' };
      if(t.oncelik === deger) return { ok:false, why:'zaten bu değerde' };
      if(!can('duzenle')) return { ok:false, why:'yetki' };
      var eski = t.oncelik;
      t.oncelik = deger;
      log(t.kod, 'Öncelik değiştirildi', eski, deger, 'info', 'i-flag');
      return { ok:true, gorev:t, eski:eski };
    },

    /* BEKLEME NEDENİ — durumdan bağımsız ikinci eksen (REVİZE 01).
       Görev "Devam ediyor" kalır, yalnız neyi beklediğini söyler. Eskiden
       bunun için üç ayrı DURUM vardı ve görev ilerlemeyi bırakmış görünüyordu. */
    bekleme:function(kod, neden, notu, sessiz){
      if(!window.DB) return null;
      var t = DB.tasks.filter(function(x){ return x.kod === kod; })[0];
      if(!t) return { ok:false, why:'kayıt yok' };
      if(neden != null && DB.taskWaitReasons.indexOf(neden) === -1)
        return { ok:false, why:'geçersiz bekleme nedeni' };
      var eski = t.beklemeNedeni || null;
      var eskiNot = t.beklemeNotu || null;
      var yeniNot = notu == null ? eskiNot : (notu || null);
      /* Neden AYNI kalıp yalnız not değişiyorsa bu bir işlemdir, "zaten bu
         durumda" değildir. İlk yazımda öyle sayılıyordu ve kullanıcı bekleme
         notunu güncelleyemiyordu — ekran dürüstçe "değişiklik yapılmadı"
         diyordu ama yapılmak istenen şey meşruydu. */
      if(eski === (neden || null) && eskiNot === yeniNot)
        return { ok:false, why:'zaten bu durumda' };
      if(neden){
        t.beklemeNedeni = neden;
        if(yeniNot) t.beklemeNotu = yeniNot; else delete t.beklemeNotu;
      }else{ delete t.beklemeNedeni; delete t.beklemeNotu; }
      if(!sessiz){
        var sadeceNot = eski === (neden || null);
        log(t.kod, sadeceNot ? 'Bekleme notu güncellendi'
                 : neden ? 'Bekleme nedeni işaretlendi' : 'Bekleme kaldırıldı',
            sadeceNot ? eskiNot : eski, sadeceNot ? yeniNot : (neden || null),
            neden ? 'warn' : 'ok', neden ? 'i-clock' : 'i-check');
      }
      return { ok:true, gorev:t, eski:eski, eskiNot:eskiNot };
    }
  };

  /* ===================================================================
     ZAMAN — tek onay ekseni (REVİZE 03)

     Ölçüldü: "onaylı zaman kaydı" bu depoda İKİ AYRI ŞEY demekti.
     · `DB.timelogs[].onay`      — satır onayı (`app-zaman.html`)
     · `DB.timesheets[].durum`   — haftalık onay (`app-zaman-onay.html`)
     İkisi birbirine bağlı değildi: haftalık timesheet onaylanınca altındaki
     satırların `onay` alanı DEĞİŞMİYORDU. Dört kayıt tam bu yüzden kendi
     haftalık defteriyle çelişiyordu (satır "Onaylandı", haftası "Onay
     bekliyor"). REVİZE 03 "gerçekleşen süre onaylanmış timesheet
     kayıtlarından gelsin" diyor — hangi eksende olduğu belirsizken o cümle
     iki farklı sayı üretir.

     KARAR — haftalık timesheet, kapsadığı satırların ONAY MERCİİDİR:
     · Bir satırı kapsayan onaylı timesheet varsa satır da onaylıdır.
     · Timesheet iade edilirse kapsadığı satırların onayı da geri alınır.
     · Kapsayan timesheet onay bekliyorsa satır TEK BAŞINA onaylanamaz —
       yordam reddeder ve nereden onaylanacağını söyler. (Yarım yol açık
       bırakmak iki eksenli hâle geri dönmek olurdu.)
     · Hiçbir timesheet kapsamıyorsa satır kendi başına onaylanabilir;
       bu depoda haftalık defter yalnız 2026-W31'i kapsıyor.
     =================================================================== */
  var Zaman = {
    /* Satırı kapsayan haftalık timesheet — yoksa null */
    timesheetOf:function(l){
      if(!window.DB || !DB.timesheets || !l) return null;
      return DB.timesheets.filter(function(t){
        return t.personel === l.personel && l.tarih >= t.baslangic && l.tarih <= t.bitis;
      })[0] || null;
    },

    /* Timesheet'in kapsadığı zaman kayıtları — kırılım da bu yordamdan okunur */
    kayitlar:function(ts){
      if(!window.DB || !DB.timelogs || !ts) return [];
      return DB.timelogs.filter(function(l){
        return l.personel === ts.personel && l.tarih >= ts.baslangic && l.tarih <= ts.bitis;
      }).sort(function(a, b){ return a.tarih < b.tarih ? -1 : a.tarih > b.tarih ? 1 : 0; });
    },

    /* HAFTALIK ONAY — timesheet + kapsadığı her satır aynı işlemde onaylanır */
    onayla:function(kod, tarih){
      if(!window.DB) return null;
      if(!can('onay')) return { ok:false, why:'yetki' };
      var ts = DB.timesheets.filter(function(x){ return x.kod === kod; })[0];
      if(!ts) return { ok:false, why:'kayıt yok' };
      if(ts.durum === 'Onaylandı') return { ok:false, why:'zaten onaylı' };
      var eski = ts.durum, t = tarih || DB.today;
      ts.durum = 'Onaylandı'; ts.onaylayan = kim() || ts.onaylayan; ts.onayTarihi = t;
      var satir = Zaman.kayitlar(ts), n = 0, saat = 0;
      satir.forEach(function(l){
        if(l.onay === 'Onaylandı') return;
        l.onay = 'Onaylandı'; n++; saat += l.sure;
      });
      log(ts.kod, 'Haftalık timesheet onaylandı' +
          (n ? ' — altındaki ' + n + ' zaman kaydı da onaylandı' : ''),
          eski, 'Onaylandı', 'ok', 'i-check-circle');
      return { ok:true, timesheet:ts, satir:satir.length, onaylanan:n, saat:saat };
    },

    /* İADE — haftalık onay geri alınırsa kapsadığı satırların onayı da geri alınır */
    iade:function(kod, gerekce){
      if(!window.DB) return null;
      if(!can('onay')) return { ok:false, why:'yetki' };
      if(!gerekce) return { ok:false, why:'gerekçe zorunlu' };
      var ts = DB.timesheets.filter(function(x){ return x.kod === kod; })[0];
      if(!ts) return { ok:false, why:'kayıt yok' };
      if(ts.durum === 'Revize bekliyor') return { ok:false, why:'zaten iade edilmiş' };
      var eski = ts.durum;
      ts.durum = 'Revize bekliyor'; ts.iadeGerekce = gerekce;
      ts.iadeTarihi = DB.today; ts.iadeEden = kim();
      var n = 0;
      Zaman.kayitlar(ts).forEach(function(l){
        if(l.onay !== 'Onaylandı') return;
        l.onay = 'Bekliyor'; n++;
      });
      log(ts.kod, 'Timesheet iade edildi — ' + gerekce +
          (n ? ' · altındaki ' + n + ' zaman kaydının onayı geri alındı' : ''),
          eski, 'Revize bekliyor', 'warn', 'i-refresh');
      return { ok:true, timesheet:ts, geriAlinan:n };
    },

    /* SATIR ONAYI — kapsayan haftalık defter varsa ONA bağlıdır */
    onaylaKayit:function(kod){
      if(!window.DB) return null;
      if(!can('onay')) return { ok:false, why:'yetki' };
      var l = DB.timelogs.filter(function(x){ return x.kod === kod; })[0];
      if(!l) return { ok:false, why:'kayıt yok' };
      if(l.onay === 'Onaylandı') return { ok:false, why:'zaten onaylı' };
      var ts = Zaman.timesheetOf(l);
      if(ts && ts.durum !== 'Onaylandı')
        return { ok:false, why:'haftalık onaya bağlı', timesheet:ts.kod, hafta:ts.hafta };
      l.onay = 'Onaylandı';
      log(l.kod, 'Zaman kaydı onaylandı' + (ts ? ' (' + ts.kod + ' haftası onaylı)' : ''),
          'Bekliyor', 'Onaylandı', 'ok', 'i-check-circle');
      return { ok:true, kayit:l, timesheet:ts };
    }
  };

  /* ===================================================================
     PROJE — süre zinciri (REVİZE 03)

     "Harcanan süre" beş oturum boyunca `DB.projects[].harcananSure`
     alanında ELLE YAZILI bir sayıydı; 9.125 saatin ~8.900'ünü hiçbir kayıt
     desteklemiyordu (V-44). Alan kaldırıldı; üç değer de burada türetilir.

     · `planlanan`      — projenin `tahminiSure`si, yoksa Σ görev tahmini
     · `gerceklesen`    — Σ ONAYLI zaman kaydı (dokümanın istediği eksen)
     · `faturalanabilir`— Σ onaylı **ve** faturalanabilir kayıt
     · `tum`            — onaysızlar dahil; ekran "onay bekleyen" farkını
                          bu ikisinden gösterir, ayrı bir alan tutmaz

     `kayit === 0` olan projede ekran **sıfır basmaz**: zaman defteri o
     projeyi kapsamıyorsa doğru cümle "0 saat çalışıldı" değil "defterde
     kayıt yok"tur (L-13). `kapsam` bayrağı bunu söyler.
     =================================================================== */
  var Proje = {
    sure:function(kod){
      var bos = { planlanan:0, gerceklesen:0, faturalanabilir:0, tum:0, kayit:0, kapsam:false };
      if(!window.DB || !DB.projects) return bos;
      var p = DB.projects.filter(function(x){ return x.kod === kod; })[0];
      if(!p) return bos;
      var ls = (DB.timelogs || []).filter(function(l){ return l.proje === kod; });
      var onayli = ls.filter(function(l){ return l.onay === 'Onaylandı'; });
      var planlanan = p.tahminiSure || (DB.tasks || [])
        .filter(function(t){ return t.proje === kod; })
        .reduce(function(s, t){ return s + (t.tahminiSure || 0); }, 0);
      var yuvarla = function(n){ return Math.round(n * 100) / 100; };
      return {
        planlanan:planlanan,
        gerceklesen:yuvarla(onayli.reduce(function(s, l){ return s + l.sure; }, 0)),
        faturalanabilir:yuvarla(onayli.filter(function(l){ return l.faturalanabilir; })
          .reduce(function(s, l){ return s + l.sure; }, 0)),
        tum:yuvarla(ls.reduce(function(s, l){ return s + l.sure; }, 0)),
        kayit:ls.length,
        kapsam:ls.length > 0
      };
    },

    /* ---- REVİZE 05 — proje DURUM ekseni, tek yerde -------------------
       "Bu proje devam ediyor mu?" sorusunun cevabı YEDİ ekranda ayrı ayrı
       yazılıydı ve yedisi de aynı cümleyi kuruyordu:
       `p.durum !== 'Teslim' && !p.arsiv`. Durum sözlüğü değişince yedisinin
       yedisi birden sessizce yanlışa düşerdi — sekmesi boşalan liste hata
       vermez, sadece hiçbir şey göstermez. Tanım artık burada.

       `kapali` = KAYIT kapandı (tamamlandı ya da iptal edildi).
       `bitti`  = İŞ teslim edildi — kapanış kaydı henüz yapılmamış olabilir.
                  Eski `durum !== 'Teslim'` cümlesinin birebir karşılığı budur;
                  `Teslim Sürecinde` iş bitmiş ama defter kapanmamış projedir
                  (R07 kapanış akışının hedefi tam olarak o aralıktır).
       `arsivli`= kaydın defterden çekilmiş olması — ayrı eksendir; arşivli
                  olmayan tamamlanmış proje de mümkündür.
       `acik`   = işi bitmemiş ve arşivlenmemiş. Liste sekmeleri, dashboard
                  sayaçları ve "aktif proje" KPI'ları bunu çağırır. */
    kapaliDurumlar:['Tamamlandı','İptal Edildi'],
    teslimDurumlari:['Teslim Sürecinde','Tamamlandı'],

    kapali:function(p){
      p = Proje.kayit(p);
      return !!p && Proje.kapaliDurumlar.indexOf(p.durum) !== -1;
    },

    bitti:function(p){
      p = Proje.kayit(p);
      return !!p && (Proje.teslimDurumlari.indexOf(p.durum) !== -1 ||
                     !!p.gercekBitis || p.ilerleme === 100);
    },

    /* `arsiv` TEK arşiv eksenidir (VB-20). `aktif:false` eski ikinci eksendi;
       `GV.list` hâlâ ikisini de arşiv sayıyor, o yüzden tanım onunla aynı
       kalıyor — ama proje kayıtlarında `aktif` alanı artık YOK. */
    arsivli:function(p){
      p = Proje.kayit(p);
      return !!p && (p.arsiv === true || p.aktif === false);
    },

    acik:function(p){
      p = Proje.kayit(p);
      return !!p && !Proje.bitti(p) && !Proje.arsivli(p);
    },

    /* Planlanan bitişi geçmiş ve hâlâ açık olan proje. Beş ekran bu cümleyi
       ayrı ayrı yazıyordu; `DB.today` sabit gün olduğu için hepsi aynı yanıtı
       vermek zorundaydı ama tanım kaydıkça ayrışırlardı. */
    geciken:function(p){
      p = Proje.kayit(p);
      return !!p && Proje.acik(p) && !!p.planlananBitis && p.planlananBitis < DB.today;
    },

    /* Kod da kayıt da kabul edilir — çağıran ekran elindekini verir. */
    kayit:function(p){
      if(!p) return null;
      if(typeof p !== 'string') return p;
      if(!window.DB || !DB.projects) return null;
      return DB.projects.filter(function(x){ return x.kod === p; })[0] || null;
    }
  };

  /* ===================================================================
     İK — saatlik iç maliyet (REVİZE 04)

     Ölçüldü: `DB.employees[].saatlikUcret` 16 personelin **1'inde** dolu
     (EMP-015, freelancer). Kalan 15'i `maas` ekseninde ve
     `app-personel-form.html:146` **`maas > 0` XOR `saatlikUcret > 0`**
     kuralını uyguluyor — yani 16/16 `saatlikUcret` doldurmak var olan bir
     sözleşmeyi kırardı.

     Ayrıca sözleşmeli saat ücreti ile şirkete iç maliyet **farklı şeylerdir**:
     birincisi dışarıya fatura edilen tutar, ikincisi işverene maliyet.

     KARAR: yeni alan AÇILMADI. İç maliyet iki var olan alandan **türetilir**
     (L-08 — az önce `harcananSure`yi tam bu gerekçeyle kaldırdık; bir sonraki
     commit'te yeni bir türetilebilir sayaç saklamak onunla çelişirdi).
     Hesabın iki girdisi `DB.company`'de yazılı sabittir.
     =================================================================== */
  var Hr = {
    /* Şirkete saatlik iç maliyet — { saat, kaynak, formul } · yoksa null */
    icMaliyet:function(kod){
      if(!window.DB || !DB.employees) return null;
      var e = DB.employees.filter(function(x){ return x.kod === kod; })[0];
      if(!e) return null;
      var c = DB.company || {};
      if(e.saatlikUcret > 0)
        return { saat:e.saatlikUcret, kaynak:'saatlikUcret',
                 formul:'Sözleşmeli saat ücreti · ' + e.saatlikUcret + ' ₺/saat' };
      if(e.maas > 0){
        var s = Math.round(e.maas * c.isverenMaliyetKatsayisi / c.aylikCalismaSaati);
        return { saat:s, kaynak:'maas',
                 formul:e.maas + ' ₺ brüt × ' + c.isverenMaliyetKatsayisi + ' ÷ ' +
                        c.aylikCalismaSaati + ' saat = ' + s + ' ₺/saat' };
      }
      /* İki eksenin ikisi de boşsa maliyet UYDURULMAZ — null döner ve
         çağıran bunu ekranda söyler. */
      return null;
    },

    /* İstihdam ilişkisi dış kaynak mı — `sozlesme` alanından türetilir.
       R16 bu ekseni `DB.employees[].calismaTipi` olarak resmîleştirecek;
       o zamana kadar tek yer burasıdır, ekranlar kendi kuralını yazmaz. */
    disKaynak:function(kod){
      var e = (window.DB && DB.employees || []).filter(function(x){ return x.kod === kod; })[0];
      return !!e && e.sozlesme === 'Hizmet sözleşmesi';
    }
  };

  GV.fin = Fin;
  GV.delivery = Delivery;
  GV.task = Task;
  GV.zaman = Zaman;
  GV.proje = Proje;
  GV.hr = Hr;

  /* ===================================================================
     PROJE — maliyet ve kârlılık (REVİZE 04)

     `DB.projects[].gerceklesenMaliyet` 14 kayıtta elle yazılı TEK bir
     rakamdı; hangi kalemden oluştuğu hiçbir yerde yazılı değildi ve
     `app-proje-detay.html` bunu iki ayrı sekmede "türetilmiş / örtüşmeyebilir"
     uyarısıyla itiraf ediyordu. Alan kaldırıldı; dört kalem ayrı ayrı
     türetilir ve toplamları gösterilir.

     KALEMLERİN KAYNAĞI — ve kaynağı olmayan kalem
     · personel   Σ(onaylı saat × iç maliyet), kadrolu personel
     · disKaynak  aynı hesap, hizmet sözleşmeli personel
     · satinAlma  Σ `DB.purchases[proje==kod && durum=='Teslim alındı']`
                  — talep aşamasındaki kayıt henüz maliyet değildir
     · diger      **KAYNAK YOK.** projeye bağlı ayrı bir gider koleksiyonu bilerek AÇILMADI
                  (talimat: "yeni finans modülü oluşturma"); projeye bağlı
                  başka gider koleksiyonu bu depoda yok. Sıfır döner ve
                  ekran bunun bir ölçüm değil KAYNAK boşluğu olduğunu söyler.

     `kapsam` bayrağı `GV.proje.sure`'dekiyle aynı işi yapar: zaman defteri
     projeyi kapsamıyorsa maliyet HESAPLANAMAZ; sıfır basmak, maliyeti
     olmayan bir proje göstermek olurdu.
     =================================================================== */
  Proje.maliyet = function(kod){
    var bos = { personel:0, disKaynak:0, satinAlma:0, diger:0, toplam:0,
                gelir:0, brutKar:0, karlilikYuzde:null, kapsam:false,
                maliyetsizPersonel:[] };
    if(!window.DB || !DB.projects) return bos;
    var p = DB.projects.filter(function(x){ return x.kod === kod; })[0];
    if(!p) return bos;
    var s = Proje.sure(kod);
    var onayli = (DB.timelogs || []).filter(function(l){
      return l.proje === kod && l.onay === 'Onaylandı'; });

    var personel = 0, disKaynak = 0, eksik = [];
    onayli.forEach(function(l){
      var m = Hr.icMaliyet(l.personel);
      if(!m){ if(eksik.indexOf(l.personel) === -1) eksik.push(l.personel); return; }
      var tutar = l.sure * m.saat;
      if(Hr.disKaynak(l.personel)) disKaynak += tutar; else personel += tutar;
    });

    var satinAlma = (DB.purchases || []).filter(function(x){
      return x.proje === kod && x.durum === 'Teslim alındı'; })
      .reduce(function(a, x){ return a + (x.tahminiMaliyet || 0); }, 0);

    personel = Math.round(personel); disKaynak = Math.round(disKaynak);
    var toplam = personel + disKaynak + satinAlma;
    var gelir  = p.sozlesmeTutari || 0;

    /* KAPSAM, `sure`dekinden bir adım DAHA DAR: maliyet için satır sayısı
       değil ÖLÇÜLEN maliyet gerekir. Onaylı saati de satın alması da olmayan
       projede kâr "%100" çıkardı — maliyeti sıfır sanmak, ölçülmemişi
       ölçülmüş göstermenin en pahalı hâli. O projede kârlılık HESAPLANMAZ. */
    var olculdu = s.gerceklesen > 0 || satinAlma > 0;
    return {
      personel:personel, disKaynak:disKaynak, satinAlma:satinAlma, diger:0,
      toplam:toplam, gelir:gelir,
      brutKar:olculdu ? gelir - toplam : null,
      karlilikYuzde:(olculdu && gelir) ? Math.round((gelir - toplam) / gelir * 100) : null,
      kapsam:olculdu, saat:s.gerceklesen, maliyetsizPersonel:eksik
    };
  };

  /* ===================================================================
     PROJE KAPANIŞ KONTROLÜ (REVİZE 07)

     Dokümanın istediği sekiz kontrol tek yordamda toplanır; ekran yalnız
     basar. Ekranda yazılsaydı kapanış modalı ile kapanışın KENDİSİ farklı
     cevap verebilirdi — REVİZE 02'de görev geçişinin başına gelen buydu.

     Her madde şunu döndürür:
       { anahtar, etiket, gecti, sayi, detay, href, olculdu }
     `olculdu:false` ⇒ **kontrol yapılamadı**, "geçti" DEĞİL. Ölçülemeyen
     bir maddeyi yeşile yazmak, kapanışı olmayan bir güvenceyle onaylatmak
     olurdu (L-13 · L-25). Ekran onu ayrı tonla basar.

     Kapanış ENGELLENMEZ: geçmeyen madde uyarır, kullanıcı gerekçe yazarak
     kapatır ve gerekçe aktiviteye girer. Doküman "kullanıcıya sade bir
     checklist göster" diyor, "kapanışı kilitle" demiyor.
     =================================================================== */
  var GOREV_ACIK = ['Tamamlandı', 'İptal edildi', 'Arşivlendi'];

  Proje.kapanisKontrol = function(kod){
    var p = Proje.kayit(kod);
    if(!p) return [];
    var K = p.kod;
    var t   = (DB.tasks || []).filter(function(x){ return x.proje === K; });
    var cr  = (DB.changeRequests || []).filter(function(x){ return x.proje === K; });
    var tsl = (DB.deliveries || []).filter(function(x){ return x.proje === K; });
    var dok = (DB.documents || []).filter(function(x){ return x.proje === K; });
    var fat = (DB.invoices || []).filter(function(x){ return x.proje === K; });
    var tak = (DB.milestones || []).filter(function(x){ return x.proje === K; });
    var pkt = (DB.supportPackages || []).filter(function(x){ return x.proje === K; });

    var acikGorev = t.filter(function(x){ return GOREV_ACIK.indexOf(x.durum) === -1; });
    var kontrolde = t.filter(function(x){ return x.durum === 'Kontrolde'; });
    var acikCr    = cr.filter(function(x){ return ['Onaylandı','Reddedildi'].indexOf(x.durum) === -1; });
    var acikTsl   = tsl.filter(function(x){ return x.durum !== 'Onaylandı'; });
    var onaysiz   = tsl.filter(function(x){ return x.musteriOnay !== 'Onaylandı'; });
    var zorunlu   = ((DB.company || {}).zorunluProjeDokuman || []);
    var eksikDok  = zorunlu.filter(function(tur){
                      return !dok.some(function(d){ return d.tur === tur && d.onay === 'Onaylandı'; }); });
    var acikFat   = fat.filter(function(x){ return ['Ödendi','İptal'].indexOf(x.durum) === -1; });
    var acikTak   = tak.filter(function(x){ return x.odemeDurum !== 'Ödendi'; });

    return [
      { anahtar:'gorev', etiket:'Açık görev', olculdu:t.length > 0,
        gecti:acikGorev.length === 0, sayi:acikGorev.length,
        detay:t.length ? (acikGorev.length + ' / ' + t.length + ' görev açık')
                       : 'Bu projede görev kaydı yok — kontrol yapılamadı',
        href:'app-gorev.html?t=tumu&q=' + K },
      { anahtar:'kontrolde', etiket:'Kontrolde bekleyen görev', olculdu:t.length > 0,
        gecti:kontrolde.length === 0, sayi:kontrolde.length,
        detay:t.length ? (kontrolde.length + ' görev kontrolde')
                       : 'Bu projede görev kaydı yok — kontrol yapılamadı',
        href:'app-gorev.html?t=kontrolde&q=' + K },
      { anahtar:'revizyon', etiket:'Açık revizyon talebi', olculdu:cr.length > 0,
        gecti:acikCr.length === 0, sayi:acikCr.length,
        detay:cr.length ? (acikCr.length + ' / ' + cr.length + ' talep karara bağlanmadı')
                        : 'Bu projede revizyon talebi yok',
        href:'app-proje-degisiklik.html?t=tumu&q=' + K },
      { anahtar:'teslim', etiket:'Teslimatlar tamamlandı', olculdu:tsl.length > 0,
        gecti:acikTsl.length === 0, sayi:acikTsl.length,
        detay:tsl.length ? (acikTsl.length + ' / ' + tsl.length + ' teslim onaylanmadı')
                         : 'Bu projede teslim kaydı yok — kontrol yapılamadı',
        href:'app-proje-teslim.html?t=tumu&q=' + K },
      { anahtar:'musteriOnay', etiket:'Müşteri onayı alındı', olculdu:tsl.length > 0,
        gecti:onaysiz.length === 0, sayi:onaysiz.length,
        detay:tsl.length ? (onaysiz.length + ' teslimde müşteri onayı yok')
                         : 'Onay ölçülecek teslim kaydı yok — kontrol yapılamadı',
        href:'app-proje-teslim.html?t=tumu&q=' + K },
      { anahtar:'dokuman', etiket:'Zorunlu dokümanlar tam', olculdu:zorunlu.length > 0,
        gecti:eksikDok.length === 0, sayi:eksikDok.length,
        detay:eksikDok.length ? ('eksik: ' + eksikDok.join(' · '))
                              : zorunlu.length + ' zorunlu tür de onaylı',
        href:'app-dokuman.html?t=tumu&q=' + K },
      { anahtar:'finans', etiket:'Açık finansal işlem', olculdu:(fat.length + tak.length) > 0,
        gecti:acikFat.length === 0 && acikTak.length === 0, sayi:acikFat.length + acikTak.length,
        detay:(fat.length + tak.length)
          ? (acikFat.length + ' fatura · ' + acikTak.length + ' taksit ödenmedi')
          : 'Bu projede fatura ve taksit kaydı yok — kontrol yapılamadı',
        href:'app-fatura.html?t=tumu&q=' + K },
      /* Sekizinci madde bir SORUDUR, bir kontrol değil — cevabı kapanış
         akışının son adımında kullanıcıdan alınır (REVİZE 08). Bugün proje
         ile bakım paketi arasında bağ yok, o yüzden `olculdu:false`. */
      { anahtar:'bakim', etiket:'Bakım / destek hizmeti başlayacak mı',
        olculdu:pkt.length > 0, gecti:pkt.length > 0, sayi:pkt.length,
        detay:pkt.length ? (pkt.length + ' bakım paketi bu projeye bağlı')
                         : 'Bu projeye bağlı bakım paketi yok — kapanışta sorulur',
        href:'app-destek-paket.html' }
    ];
  };

  /* Kapanışın KENDİSİ. Kontrolden geçmemiş madde varsa `gerekce` ZORUNLUDUR;
     gerekçe uydurulmaz, kullanıcıdan alınır ve aktiviteye yazılır. */
  Proje.kapat = function(kod, gerekce, tarih){
    var p = Proje.kayit(kod);
    if(!p) return { ok:false, why:'kayıt yok' };
    if(Proje.kapali(p)) return { ok:false, why:'zaten kapalı', durum:p.durum };
    if(!can('duzenle')) return { ok:false, why:'yetki', roller:['pm','gm','sahip'] };

    var kontrol = Proje.kapanisKontrol(p.kod);
    var gecmeyen = kontrol.filter(function(k){ return k.olculdu && !k.gecti; });
    if(gecmeyen.length && !String(gerekce || '').trim())
      return { ok:false, why:'gerekçe', eksik:gecmeyen.map(function(k){ return k.etiket; }) };

    var gun = tarih || DB.today;
    var eski = p.durum;
    p.durum = 'Tamamlandı';
    p.gercekBitis = gun;
    p.ilerleme = 100;
    p.faz = null;              /* faz yürüyen işin nerede olduğunu söyler (REVİZE 05) */
    p.sonGuncelleme = gun;

    /* Aktivite ortak `log()` ile yazılır: kişi KOD olarak durur (VB-12) ve
       eski → yeni ekseni timeline'da görünür. Ekran ikinci bir kayıt yazmaz. */
    log(p.kod, 'Proje kapatıldı — gerçekleşen bitiş ' + gun +
        (gecmeyen.length
          ? ' · kapanış kontrolünde geçmeyen ' + gecmeyen.length + ' madde gerekçeyle geçildi: ' + gerekce
          : ' · kapanış kontrolünün ölçülebilen maddelerinin tamamı geçti'),
        eski, 'Tamamlandı', gecmeyen.length ? 'warn' : 'ok', 'i-check-circle');
    return { ok:true, kod:p.kod, tarih:gun, gecmeyen:gecmeyen.length };
  };

  /* ===================================================================
     KAPANIŞTAN BAKIM / DESTEĞE GEÇİŞ (REVİZE 08)

     Kapanış kontrolünün sekizinci maddesi bir SORUDUR: "bakım veya destek
     hizmeti başlayacak mı?". Cevabı burada yazılır. Bağ **pakette** durur
     (`DB.supportPackages[].proje`), projede ayna alan doğmaz (§9d).

     Turun başında proje ile paket arasında **hiçbir yönde bağ yoktu** ve
     veriden türetilemiyordu: tek dolaylı zincir (`paket.sozlesme →
     contract.proje`) hiçe çıkıyor. Tarih yakınlığı ve müşteri eşleşmesi
     bağ sayılmadı (L-13) — bağı kullanıcı kurar, kapanış anında.
     =================================================================== */
  Proje.bakimPaketleri = function(kod){
    var p = Proje.kayit(kod);
    if(!p || !window.DB || !DB.supportPackages) return [];
    return DB.supportPackages.filter(function(x){ return x.musteri === p.musteri; });
  };

  Proje.bakimBagla = function(projeKod, paketKod){
    var p = Proje.kayit(projeKod);
    if(!p) return { ok:false, why:'kayıt yok' };
    if(!can('duzenle')) return { ok:false, why:'yetki' };
    var pkt = (DB.supportPackages || []).filter(function(x){ return x.kod === paketKod; })[0];
    if(!pkt) return { ok:false, why:'paket yok' };
    if(pkt.musteri !== p.musteri)
      return { ok:false, why:'başka müşterinin paketi', musteri:pkt.musteri };
    if(pkt.proje === p.kod) return { ok:false, why:'zaten bağlı' };
    if(pkt.proje) return { ok:false, why:'paket başka projeye bağlı', proje:pkt.proje };
    pkt.proje = p.kod;
    log(pkt.kod, 'Bakım paketi projeye bağlandı', '', p.kod, 'ok', 'i-link');
    log(p.kod, 'Kapanışta bakım paketine bağlandı', '', pkt.kod, 'ok', 'i-link');
    return { ok:true, paket:pkt.kod };
  };

  /* Yeni paket — YENİ EKRAN AÇILMAZ, kapanış modalının son adımıdır.
     Kota aritmetiği sözleşmesi korunur: `kullanilan + kalan = aylikSaat × ay`
     (components.md §9). Tutar ve aylık saat KULLANICIDAN alınır; paket
     fiyat katalogu bu depoda yok, uydurulmaz (L-13). */
  Proje.bakimAc = function(projeKod, cfg){
    var p = Proje.kayit(projeKod);
    if(!p) return { ok:false, why:'kayıt yok' };
    if(!can('duzenle')) return { ok:false, why:'yetki' };
    cfg = cfg || {};
    var ay = parseInt(cfg.ay, 10) || 0;
    var saat = parseInt(cfg.aylikSaat, 10) || 0;
    var tutar = parseInt(cfg.tutar, 10) || 0;
    var eksik = [];
    if(!cfg.baslangic) eksik.push('Başlangıç tarihi');
    if((DB.supportPackageTypes || []).indexOf(cfg.tip) === -1) eksik.push('Paket tipi');
    if(ay <= 0) eksik.push('Süre (ay)');
    if(saat <= 0) eksik.push('Aylık saat');
    if(tutar <= 0) eksik.push('Paket bedeli');
    if(eksik.length) return { ok:false, why:'zorunlu', eksik:eksik };

    /* Bitiş = başlangıç + ay − 1 gün. `toISOString()` KULLANILMAZ: yerel
       saat diliminde kurulan tarihi UTC'ye çevirip bir gün geriye kaydırır
       (ölçüldü: 2026-08-01 + 12 ay → 2027-07-30 çıkıyordu, doğrusu 07-31).
       Tarih parçaları elle biçimlenir. */
    var d = new Date(cfg.baslangic + 'T00:00:00');
    d.setMonth(d.getMonth() + ay); d.setDate(d.getDate() - 1);
    var iki = function(n){ return (n < 10 ? '0' : '') + n; };
    var bitis = d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate());

    var no = (DB.supportPackages || []).reduce(function(m, x){
      var n = parseInt(String(x.kod).replace(/\D/g, ''), 10) || 0;
      return n > m ? n : m; }, 0) + 1;
    /* Sözleşme projeden DEVRALINIR — ters yönden çözülür (`contracts.proje`). */
    var soz = (DB.contracts || []).filter(function(c){ return c.proje === p.kod; })[0];

    var pkt = {
      kod:'BKP-' + String(no).padStart(3, '0'),
      musteri:p.musteri, ad:cfg.tip,
      baslangic:cfg.baslangic, bitis:bitis,
      aylikSaat:saat, kullanilan:0, kalan:saat * ay,
      tutar:tutar, durum:'Aktif',
      sozlesme:soz ? soz.kod : null,
      yenileme:false, yenilemeTarihi:null, aktif:true,
      proje:p.kod
    };
    (DB.supportPackages || []).push(pkt);
    log(pkt.kod, 'Paket proje kapanışında oluşturuldu', '', p.kod, 'ok', 'i-plus');
    log(p.kod, 'Kapanışta bakım paketi açıldı', '', pkt.kod, 'ok', 'i-link');
    return { ok:true, paket:pkt.kod, bitis:bitis, sozlesme:pkt.sozlesme };
  };
})();
