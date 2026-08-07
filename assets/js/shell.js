/* =====================================================================
   GAVIAWORKS CRM — SHELL ENGINE
   Rol tabanlı uygulama iskeleti: ikon rail + bölüm menüsü + üst bar,
   oturum/rol yönetimi, yetki kapısı, bildirim merkezi, breadcrumb.

   Sözleşme:
     <body data-sec="satis" data-screen="lead">  →  aktif bölüm + aktif ekran
   Rol kaynağı: sessionStorage('gv.session'). URL ?role= yalnız İLK seçimde
   okunur ve hemen oturuma yazılır (tasks/assumptions.md V-04).
   ===================================================================== */
(function(){
  'use strict';

  var GV = window.GV = window.GV || {};
  var SS_KEY = 'gv.session';
  var LS_MENU = 'gv.menu.collapsed';

  /* ===================================================================
     1. BÖLÜM VE MENÜ MODELİ
     =================================================================== */
  var SECTIONS = {
    panel:{ ic:'i-gauge', eyebrow:'Genel Bakış', title:'Ana Panel', menu:[
      { ic:'i-gauge',        lbl:'Dashboard',        href:'app-panel.html',              screen:'panel' },
      { seclbl:'Gündem' },
      { ic:'i-sun',          lbl:'Günlük Özet',      href:'app-panel-ozet.html',         screen:'ozet' },
      { ic:'i-calendar',     lbl:'Ajanda',           href:'app-ajanda.html',             screen:'ajanda' },
      { ic:'i-tasks',        lbl:'Görevlerim',       href:'app-gorev.html?t=bana',       screen:'gorevlerim' },
      { ic:'i-stamp',        lbl:'Bekleyen Onaylar', href:'app-panel-onaylar.html',      screen:'onaylar', cnt:'onay' },
      { ic:'i-bell',         lbl:'Bildirimler',      href:'app-panel-bildirimler.html',  screen:'bildirimler', cnt:'bildirim' },
      { ic:'i-megaphone',    lbl:'Duyurular',        href:'app-panel-duyurular.html',    screen:'duyurular' },
      { seclbl:'Analiz' },
      { ic:'i-grid',         lbl:'Yönetici Paneli',  href:'app-panel-yonetici.html',     screen:'yonetici', roles:['sahip','genelmudur','sistem','operasyon'] }
    ]},

    satis:{ ic:'i-target', eyebrow:'Satış', title:'Satış ve CRM', menu:[
      { ic:'i-user-plus',    lbl:'Müşteri Adayları', href:'app-lead.html',               screen:'lead', cnt:'lead' },
      { ic:'i-funnel',       lbl:'Satış Pipeline',   href:'app-pipeline.html',           screen:'pipeline' },
      { seclbl:'Referans' },
      { ic:'i-users',        lbl:'Yönlendiren Kişiler', href:'app-referans.html',        screen:'referans' },
      { ic:'i-percent',      lbl:'Komisyon Kazançları', href:'app-komisyon.html',       screen:'komisyon' },
      { seclbl:'Süreç' },
      { ic:'i-clipboard',    lbl:'Ön Analizler',     href:'app-onanaliz.html',           screen:'onanaliz' },
      { ic:'i-quote',        lbl:'Teklifler',        href:'app-teklif.html',             screen:'teklif', cnt:'teklif' }
    ]},

    musteri:{ ic:'i-building', eyebrow:'Müşteri', title:'Müşteri Yönetimi', menu:[
      { ic:'i-building',     lbl:'Müşteriler',       href:'app-musteri.html',            screen:'musteri' },
      { ic:'i-user',         lbl:'Yetkili Kişiler',  href:'app-musteri-yetkili.html',    screen:'yetkili' },
      { ic:'i-phone',        lbl:'İletişim Geçmişi', href:'app-musteri-iletisim.html',   screen:'iletisim' }
    ]},

    proje:{ ic:'i-briefcase', eyebrow:'Teslimat', title:'Proje Yönetimi', menu:[
      { ic:'i-briefcase',    lbl:'Projeler',         href:'app-proje.html',              screen:'proje' },
      { ic:'i-milestone',    lbl:'Milestone',        href:'app-proje-milestone.html',    screen:'milestone' },
      { ic:'i-sprint',       lbl:'Sprintler',        href:'app-proje-sprint.html',       screen:'sprint' },
      { seclbl:'Kalite' },
      { ic:'i-flask',        lbl:'Testler',          href:'app-proje-test.html',         screen:'test' },
      { ic:'i-bug',          lbl:'Hatalar',          href:'app-proje-hata.html',         screen:'hata', cnt:'hata' },
      { ic:'i-refresh',      lbl:'Değişiklik Talepleri', href:'app-proje-degisiklik.html', screen:'degisiklik' },
      { ic:'i-package',      lbl:'Teslimler',        href:'app-proje-teslim.html',       screen:'teslim' }
    ]},

    gorev:{ ic:'i-tasks', eyebrow:'İş Takibi', title:'Görev ve İş Takibi', menu:[
      { ic:'i-layers',       lbl:'İş Havuzu',        href:'app-gorev.html?t=havuz',      screen:'havuz', cnt:'havuz' },
      { ic:'i-inbox',        lbl:'Bana Verilenler',  href:'app-gorev.html?t=bana',       screen:'bana', cnt:'bana' },
      { ic:'i-send',         lbl:'Verdiğim İşler',   href:'app-gorev.html?t=verdigim',   screen:'verdigim' },
      { ic:'i-users',        lbl:'Departman İşleri', href:'app-gorev.html?t=departman',  screen:'departman' },
      { seclbl:'Bekleyenler' },
      { ic:'i-stamp',        lbl:'Onay Bekleyenler', href:'app-gorev.html?t=onay',       screen:'onay' },
      { ic:'i-clipboard-check', lbl:'Kontroldekiler', href:'app-gorev.html?t=kontrol', screen:'kontrol' },
      { ic:'i-alert',        lbl:'Gecikenler',       href:'app-gorev.html?t=geciken',    screen:'geciken', cnt:'geciken', tone:'danger' },
      { ic:'i-lock',         lbl:'Engellenenler',    href:'app-gorev.html?t=engel',      screen:'engel' },
      { seclbl:'İş Birliği' },
      { ic:'i-arrow-right',  lbl:'Departman Talepleri', href:'app-istalebi.html',        screen:'istalebi', cnt:'istalebi' }
    ]},

    destek:{ ic:'i-support', eyebrow:'Servis', title:'Destek ve Bakım', menu:[
      { ic:'i-support',      lbl:'Destek Talepleri', href:'app-destek.html',             screen:'destek', cnt:'destek' },
      { ic:'i-hourglass',    lbl:'SLA Takibi',       href:'app-destek-sla.html',         screen:'sla' },
      { ic:'i-shield-check', lbl:'Bakım Paketleri',  href:'app-destek-paket.html',       screen:'paket' },
      { ic:'i-star',         lbl:'Memnuniyet',       href:'app-destek-memnuniyet.html',  screen:'memnuniyet' }
    ]},

    sohbet:{ ic:'i-chat', eyebrow:'İletişim', title:'Sohbet ve İş Birliği', menu:[
      { ic:'i-chat',         lbl:'Kanallar',         href:'app-sohbet.html',             screen:'sohbet', cnt:'mesaj' }
    ]},

    personel:{ ic:'i-users', eyebrow:'İnsan Kaynakları', title:'Personel ve İK', menu:[
      { ic:'i-users',        lbl:'Personel',         href:'app-personel.html',           screen:'personel' },
      { ic:'i-calendar-check', lbl:'İzinler',        href:'app-izin.html',               screen:'izin', cnt:'izin' },
      { seclbl:'Zaman' },
      { ic:'i-timer',        lbl:'Zaman Kayıtları',  href:'app-zaman.html',              screen:'zaman' },
      { ic:'i-clipboard-check', lbl:'Timesheet Onayı', href:'app-zaman-onay.html',       screen:'timesheet' },
      { ic:'i-chart-bar',    lbl:'Kapasite',         href:'app-kapasite.html',           screen:'kapasite' },
      { seclbl:'Gelişim' },
      { ic:'i-award',        lbl:'Performans',       href:'app-performans.html',         screen:'performans' },
      { ic:'i-graduation',   lbl:'Eğitim ve Yetkinlik', href:'app-egitim.html',          screen:'egitim' },
      { ic:'i-user-plus',    lbl:'İşe Giriş / Çıkış', href:'app-personel-giris.html',    screen:'isegiris' }
    ]},

    varlik:{ ic:'i-package', eyebrow:'Envanter', title:'Demirbaş ve Filo', menu:[
      { ic:'i-package',      lbl:'Demirbaşlar',      href:'app-demirbas.html',           screen:'demirbas' },
      { ic:'i-clipboard-check', lbl:'Zimmetler',     href:'app-zimmet.html',             screen:'zimmet' },
      { seclbl:'Araç ve Filo' },
      { ic:'i-car',          lbl:'Araçlar',          href:'app-arac.html',               screen:'arac' },
      { ic:'i-wrench',       lbl:'Bakım',            href:'app-arac-bakim.html',         screen:'bakim', cnt:'bakim' },
      { ic:'i-clipboard',    lbl:'Muayene',          href:'app-arac-muayene.html',       screen:'muayene' },
      { ic:'i-shield',       lbl:'Sigorta ve Kasko', href:'app-arac-sigorta.html',       screen:'sigorta', cnt:'police' },
      { ic:'i-fuel',         lbl:'Yakıt',            href:'app-arac-yakit.html',         screen:'yakit' },
      { ic:'i-receipt',      lbl:'Giderler',         href:'app-arac-gider.html',         screen:'gider' },
      { ic:'i-alert',        lbl:'Kaza ve Ceza',     href:'app-arac-kaza.html',          screen:'kaza' }
    ]},

    satinalma:{ ic:'i-cart', eyebrow:'Tedarik', title:'Satın Alma', menu:[
      { ic:'i-cart',         lbl:'Talepler',         href:'app-satinalma.html',          screen:'talep', cnt:'satinalma' },
      { ic:'i-stamp',        lbl:'Onay Bekleyenler', href:'app-satinalma.html?t=onay',   screen:'salmaonay' },
      { ic:'i-quote',        lbl:'Teklif Toplama',   href:'app-satinalma-teklif.html',   screen:'salmateklif' },
      { ic:'i-truck',        lbl:'Siparişler',       href:'app-siparis.html',            screen:'siparis' },
      { ic:'i-building',     lbl:'Tedarikçiler',     href:'app-tedarikci.html',          screen:'tedarikci' }
    ]},

    finans:{ ic:'i-wallet', eyebrow:'Finans', title:'Finans ve Sözleşme', menu:[
      { ic:'i-file-check',   lbl:'Sözleşmeler',      href:'app-sozlesme.html',           screen:'sozlesme' },
      { ic:'i-receipt',      lbl:'Faturalar',        href:'app-fatura.html',             screen:'fatura' },
      { ic:'i-wallet',       lbl:'Tahsilatlar',      href:'app-tahsilat.html',           screen:'tahsilat', cnt:'tahsilat', tone:'danger' },
      { ic:'i-calendar',     lbl:'Ödeme Planları',   href:'app-odemeplani.html',         screen:'odemeplani' },
      { ic:'i-chart-bar',    lbl:'Proje Bütçe ve Maliyet', href:'app-butce.html',        screen:'butce' }
    ]},

    dokuman:{ ic:'i-folder', eyebrow:'Arşiv', title:'Doküman Yönetimi', menu:[
      { ic:'i-folder',       lbl:'Doküman Merkezi',  href:'app-dokuman.html',            screen:'dokuman' },
      { ic:'i-hourglass',    lbl:'Süresi Dolanlar',  href:'app-dokuman-sure.html',       screen:'doksure', cnt:'dokuman' }
    ]},

    toplanti:{ ic:'i-calendar', eyebrow:'Ajanda', title:'Toplantı ve Ajanda', menu:[
      { ic:'i-users',        lbl:'Toplantılar',      href:'app-toplanti.html',           screen:'toplanti' },
      { ic:'i-calendar',     lbl:'Takvim',           href:'app-ajanda.html',             screen:'takvim' },
      { ic:'i-flag',         lbl:'Kararlar ve Aksiyonlar', href:'app-toplanti-karar.html', screen:'karar' }
    ]},

    rapor:{ ic:'i-chart-bar', eyebrow:'Analiz', title:'Raporlama Merkezi', menu:[
      { ic:'i-chart-bar',    lbl:'Rapor Merkezi',    href:'app-rapor.html',              screen:'rapor' },
      { seclbl:'Rapor Grupları' },
      { ic:'i-building',     lbl:'Müşteri Raporları', href:'app-rapor-musteri.html',     screen:'rapormusteri' },
      { ic:'i-users',        lbl:'Personel Raporları', href:'app-rapor-personel.html',   screen:'raporpersonel' },
      { ic:'i-tasks',        lbl:'Görev Raporları',  href:'app-rapor-gorev.html',        screen:'raporgorev' },
      { ic:'i-percent',      lbl:'Referans Raporları', href:'app-rapor-referans.html',   screen:'raporreferans' },
      { ic:'i-car',          lbl:'Filo Raporları',   href:'app-rapor-filo.html',         screen:'raporfilo' },
      { ic:'i-trend-up',     lbl:'Satış ve Finans',  href:'app-rapor-finans.html',       screen:'raporfinans' },
      { ic:'i-briefcase',    lbl:'Proje Raporları',  href:'app-rapor-proje.html',        screen:'raporproje' }
    ]},

    ayarlar:{ ic:'i-settings', eyebrow:'Sistem', title:'Ayarlar ve Yetkilendirme', menu:[
      { ic:'i-building',     lbl:'Şirket Bilgileri', href:'app-ayar-sirket.html',        screen:'sirket', roles:['sahip','genelmudur','sistem'] },
      { ic:'i-users',        lbl:'Departmanlar',     href:'app-ayar-departman.html',     screen:'departmanlar', roles:['sahip','genelmudur','sistem','operasyon','ik'] },
      { seclbl:'Erişim' },
      { ic:'i-user',         lbl:'Kullanıcılar',     href:'app-ayar-kullanici.html',     screen:'kullanicilar', roles:['sahip','genelmudur','sistem'] },
      { ic:'i-shield',       lbl:'Roller',           href:'app-ayar-rol.html',           screen:'roller', roles:['sahip','genelmudur','sistem'] },
      { ic:'i-key',          lbl:'Yetki Matrisi',    href:'app-ayar-yetki.html',         screen:'yetki', roles:['sahip','genelmudur','sistem'] },
      { ic:'i-stamp',        lbl:'Onay Akışları',    href:'app-ayar-onay.html',          screen:'onayakis', roles:['sahip','genelmudur','sistem','operasyon'] },
      { seclbl:'Sistem' },
      { ic:'i-bell',         lbl:'Bildirim Tercihleri', href:'app-ayar-bildirim.html',   screen:'bildirimtercih' },
      { ic:'i-activity',     lbl:'Otomasyonlar',     href:'app-ayar-otomasyon.html',     screen:'otomasyon', roles:['sahip','genelmudur','sistem','operasyon'] },
      { ic:'i-link',         lbl:'Entegrasyonlar',   href:'app-ayar-entegrasyon.html',   screen:'entegrasyon', roles:['sahip','genelmudur','sistem','devops'] },
      { ic:'i-list',         lbl:'Log Kayıtları',    href:'app-ayar-log.html',           screen:'log', roles:['sahip','genelmudur','sistem','operasyon','devops'] },
      { ic:'i-user',         lbl:'Profilim',         href:'app-ayar-profil.html',        screen:'profil' },
      { ic:'i-archive',      lbl:'Arşiv',            href:'app-ayar-arsiv.html',         screen:'arsiv', roles:['sahip','genelmudur','sistem','operasyon'] }
    ]}
  };

  var RAIL_ORDER = ['panel','satis','musteri','proje','gorev','destek','sohbet','personel',
                    'varlik','satinalma','finans','dokuman','toplanti','rapor','ayarlar'];

  /* Rol → görebileceği bölümler ---------------------------------------- */
  var ALL = RAIL_ORDER.slice();
  /* Ekran seviyesinde yetki — bölüm erişimi tek başına yetmez.
     Ayarlar bölümü herkese açıktır (herkes kendi profilini ve bildirim
     tercihlerini yönetir), ama yönetim ekranları bu haritayla kapatılır.
     Haritada olmayan ekran, bölüm erişimi olan herkese açıktır. */
  var SCREEN_PERM = {
    sirket:       ['sahip','genelmudur','sistem'],
    departmanlar: ['sahip','genelmudur','sistem','operasyon','ik'],
    kullanicilar: ['sahip','genelmudur','sistem'],
    roller:       ['sahip','genelmudur','sistem'],
    yetki:        ['sahip','genelmudur','sistem'],
    onayakis:     ['sahip','genelmudur','sistem','operasyon'],
    otomasyon:    ['sahip','genelmudur','sistem','operasyon'],
    entegrasyon:  ['sahip','genelmudur','sistem','devops'],
    log:          ['sahip','genelmudur','sistem','operasyon','devops'],
    arsiv:        ['sahip','genelmudur','sistem','operasyon'],
    yonetici:     ['sahip','genelmudur','sistem','operasyon']
  };

  /* REVİZE 13 — EKRAN YASAK LİSTESİ. `SCREEN_PERM` bir BEYAZ listedir; tek bir
     rolü dışarıda bırakmak için kalan 26 rolü tek tek yazmak gerekirdi ve o
     liste ilk yeni rolde sessizce eskirdi. Yasak listesi ters yönden çalışır:
     "bu ekran şu role kapalı". Menü maddesi de aynı listeden beslenir
     (`Perm.item`), yani gizleme ile doğrudan adres kapısı **tek kaynaktan**
     gelir — biri kapanıp diğeri açık kalamaz.
     Müşteriye kapalı 9 ekranın gerekçesi: kapsamı olmayan ya da tanımı gereği
     İÇ olan ekranlar. Ekran SİLİNMEZ, veri yerinde kalır (G-1). */
  var SCREEN_DENY = {
    gorevlerim:  ['musteri'],   /* iç görev listesi — müşterinin işi değil */
    ozet:        ['musteri'],   /* "bugün kaydettiğim saat" = personel timesheet'i */
    bildirimler: ['musteri'],   /* iç bildirim akışı */
    duyurular:   ['musteri'],   /* şirket içi duyurular */
    sla:         ['musteri'],   /* iç performans ölçütü */
    sprint:      ['musteri'],   /* iç planlama */
    test:        ['musteri'],   /* iç kalite kaydı */
    hata:        ['musteri'],   /* iç hata kaydı ve yorumları */
    degisiklik:  ['musteri']    /* iç kapsam/maliyet değerlendirmesi */
  };

  var SEC_BY_ROLE = {
    sahip:        ALL,
    genelmudur:   ALL,
    sistem:       ALL,
    operasyon:    ['panel','satis','musteri','proje','gorev','destek','sohbet','personel','varlik','satinalma','finans','dokuman','toplanti','rapor','ayarlar'],
    depmudur:     ['panel','proje','gorev','destek','sohbet','personel','dokuman','toplanti','rapor','ayarlar'],
    satismudur:   ['panel','satis','musteri','proje','gorev','sohbet','finans','dokuman','toplanti','rapor','ayarlar'],
    satistemsilci:['panel','satis','musteri','gorev','sohbet','dokuman','toplanti','ayarlar'],
    musteritems:  ['panel','musteri','destek','gorev','sohbet','dokuman','toplanti','ayarlar'],
    analist:      ['panel','satis','musteri','proje','gorev','sohbet','dokuman','toplanti','ayarlar'],
    pm:           ['panel','musteri','proje','gorev','destek','sohbet','personel','dokuman','toplanti','rapor','finans','ayarlar'],
    takimlideri:  ['panel','proje','gorev','destek','sohbet','personel','dokuman','toplanti','rapor','ayarlar'],
    tasarimci:    ['panel','proje','gorev','sohbet','dokuman','toplanti','ayarlar'],
    frontend:     ['panel','proje','gorev','sohbet','dokuman','toplanti','ayarlar'],
    backend:      ['panel','proje','gorev','sohbet','dokuman','toplanti','ayarlar'],
    mobil:        ['panel','proje','gorev','sohbet','dokuman','toplanti','ayarlar'],
    ai:           ['panel','proje','gorev','sohbet','dokuman','toplanti','ayarlar'],
    qa:           ['panel','proje','gorev','destek','sohbet','dokuman','toplanti','ayarlar'],
    devops:       ['panel','proje','gorev','destek','sohbet','varlik','dokuman','toplanti','ayarlar'],
    destek:       ['panel','musteri','destek','gorev','proje','sohbet','dokuman','toplanti','ayarlar'],
    ik:           ['panel','personel','gorev','sohbet','varlik','dokuman','toplanti','rapor','ayarlar'],
    muhasebe:     ['panel','musteri','finans','satinalma','varlik','gorev','sohbet','dokuman','toplanti','rapor','ayarlar'],
    satinalma:    ['panel','satinalma','varlik','finans','gorev','sohbet','dokuman','toplanti','rapor','ayarlar'],
    idari:        ['panel','varlik','satinalma','personel','gorev','sohbet','dokuman','toplanti','ayarlar'],
    freelancer:   ['panel','gorev','sohbet','dokuman','ayarlar'],
    diskaynak:    ['panel','gorev','sohbet','dokuman','ayarlar'],
    stajyer:      ['panel','gorev','sohbet','dokuman','ayarlar'],
    /* REVİZE 13 — müşteriye açılan TEK yeni bölüm `proje` ("Projelerim").
       Yeni ekran doğmuyor: var olan proje · milestone · teslim ekranları
       kapsamlanıyor, bölümün iç ekranları (sprint · test · hata · değişiklik)
       `SCREEN_DENY` ile kapalı. */
    musteri:      ['panel','proje','destek','dokuman','ayarlar'],
  };

  /* ===================================================================
     2. OTURUM VE ROL
     =================================================================== */
  function readSession(){
    try{ return JSON.parse(sessionStorage.getItem(SS_KEY) || 'null'); }catch(e){ return null; }
  }
  function writeSession(s){
    try{ sessionStorage.setItem(SS_KEY, JSON.stringify(s)); }catch(e){}
  }

  /* REVİZE 13 — OTURUMUN İKİ AİLESİ VAR.
     ─────────────────────────────────────────────────────────────────────
     `musteri` rolü bir PERSONEL değildir; kimliği `DB.contacts` (müşteri
     yetkilisi) kaydından kurulur ve `emp` **null** kalır. Eskiden bu rol de
     personelden kuruluyordu: `?role=musteri` ile giren kullanıcı EMP-001'e
     (şirket sahibine) düşüyor, "bugün kaydettiğim saat" bloğu şirket
     sahibinin saatlerini müşteriye gösteriyordu.
     Oturum sözleşmesi:
       personel → { emp:'EMP-*', musteri:null, kontak:null }
       müşteri  → { emp:null,   musteri:'MUS-*', kontak:'YTK-*' }
     `emp` null olduğunda "kişisel" bloklar BASILMAZ — `me.emp`'e bakan her
     yer bunu kontrol eder. `GV.list` satır kapsamı `me.musteri`yi zaten
     okuyordu (`ui.js` `afterScope`), oturumda karşılığı yoktu. */
  function buildSession(empKod, roleKey){
    var e = (window.DB && DB.emp) ? DB.emp(empKod) : null;
    if(!e) return null;
    return {
      emp:e.kod, ad:e.ad, ini:e.ini, dep:e.dep, depAd:e.depAd,
      musteri:null, kontak:null, musteriAd:null,
      rol:roleKey || e.rol, rolAd:(window.DB ? DB.roleName(roleKey || e.rol) : roleKey),
      eposta:e.eposta, girildi:new Date().toISOString()
    };
  }

  /* Müşteri oturumu — kimlik kaynağı `DB.contacts`, uydurma kişi yok. */
  function buildMusteriSession(kontakKod){
    if(!window.DB || !DB.contacts) return null;
    var k = kontakKod ? DB.contacts.filter(function(c){ return c.kod === kontakKod; })[0] : null;
    if(!k) k = DB.contacts.filter(function(c){ return c.aktif !== false; })[0] || DB.contacts[0];
    if(!k) return null;
    var m = (DB.customers || []).filter(function(c){ return c.kod === k.musteri; })[0];
    var parca = String(k.ad || '').trim().split(/\s+/);
    return {
      emp:null, kontak:k.kod, musteri:k.musteri, musteriAd:m ? m.unvan : k.musteri,
      ad:k.ad,
      ini:(parca[0] || '').slice(0,1) + (parca.length > 1 ? parca[parca.length - 1].slice(0,1) : ''),
      dep:null, depAd:m ? m.kisa : null,
      rol:'musteri', rolAd:(window.DB ? DB.roleName('musteri') : 'Müşteri'),
      eposta:k.eposta, girildi:new Date().toISOString()
    };
  }

  var session = null;

  function resolveSession(){
    var s = readSession();
    var q = new URLSearchParams(location.search);
    var qRole = q.get('role');
    var qEmp  = q.get('emp');

    /* URL yalnız İLK seçimde okunur; okunduğu anda oturuma yazılır ve
       adres çubuğundan temizlenir — böylece rol URL'e bağlı kalmaz. */
    if(qRole || qEmp){
      var ns;
      /* `musteri` rolü personel listesinde aranmaz — kimliği yetkili kaydından
         kurulur (REVİZE 13). `?emp=YTK-*` de bu yolu açar. */
      if(qRole === 'musteri' || /^YTK-/.test(qEmp || '')){
        ns = buildMusteriSession(/^YTK-/.test(qEmp || '') ? qEmp : null);
      }else{
        var emp = qEmp;
        if(!emp && qRole && window.DB){
          var m = DB.employees.filter(function(x){ return x.roller.indexOf(qRole) !== -1; })[0];
          emp = m ? m.kod : DB.employees[0].kod;
        }
        ns = buildSession(emp || 'EMP-001', qRole || null);
      }
      if(ns){ s = ns; writeSession(s); }
      q.delete('role'); q.delete('emp');
      var rest = q.toString();
      history.replaceState({}, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
    }
    return s;
  }

  /* ===================================================================
     3. YETKİ
     =================================================================== */
  var Perm = {
    role:function(){ return session ? session.rol : 'stajyer'; },
    matrix:function(){
      var m = (window.DB && DB.permMatrix) ? DB.permMatrix[this.role()] : null;
      return m || { gor:'kendi', ekle:'yok', duzenle:'yok', sil:'yok', onay:false,
                    rapor:'yok', finans:false, maas:false, personel:'yok', log:false, disaAktar:false };
    },
    /* Bölüme erişim */
    sec:function(key){
      var list = SEC_BY_ROLE[this.role()] || ['panel'];
      return list.indexOf(key) !== -1;
    },
    /* Menü kalemi kısıtı */
    item:function(it){
      /* Yasak listesi beyaz listeden ÖNCE gelir — ekran kapısı ile menü
         gizlemesi tek kaynaktan beslensin (REVİZE 13). */
      if(it.screen && SCREEN_DENY[it.screen] && SCREEN_DENY[it.screen].indexOf(this.role()) !== -1) return false;
      if(!it.roles) return true;
      return it.roles.indexOf(this.role()) !== -1;
    },
    /* Aksiyon yetkisi: 'ekle' | 'duzenle' | 'sil' | 'onay' | 'disaAktar' | 'finans' | 'maas' | 'log'
       Türetilmiş rapor yetkileri (PROMPT.md §5 — "personel raporu" / "müşteri raporu" ayrı eksenler):
       'musteriRapor'  → rapor yetkisi var mı
       'personelRapor' → rapor yetkisi + personel verisi görme yetkisi birlikte */
    can:function(action){
      var m = this.matrix();
      if(action === 'musteriRapor') return !!(m.rapor && m.rapor !== 'yok') && this.sec('musteri');
      if(action === 'personelRapor')
        return !!(m.rapor && m.rapor !== 'yok' && m.personel && m.personel !== 'yok') && this.sec('personel');
      var v = m[action];
      if(typeof v === 'boolean') return v;
      return v && v !== 'yok';
    },
    /* Kapsam: 'tum' | 'departman' | 'proje' | 'kendi' | 'yok' */
    scope:function(action){ return this.matrix()[action] || 'yok'; },
    /* Hassas alan maskeleme (KVKK — assumptions V-12) */
    mask:function(value, action){
      return this.can(action || 'maas') ? value : '••••••';
    }
  };
  GV.perm = Perm;

  /* ===================================================================
     4. SAYAÇLAR — mock veriden türetilir (statik sabit YOK)
     =================================================================== */
  function counters(){
    var D = window.DB || {};
    var me = session ? session.emp : null;
    var dep = session ? session.dep : null;
    var t = D.today || '2026-08-03';
    function len(a){ return (a || []).length; }
    var tasks = D.tasks || [];

    /* REVİZE 13 — MÜŞTERİ OTURUMUNDA SAYAÇ DA KAPSAMLIDIR.
       Menü rozeti bir sayıdır ama sayı da bilgidir: kapsamsız "12 açık talep"
       müşteriye başka firmaların talep hacmini söyler. Müşteri oturumunda
       sayaçların kaynağı kendi kayıtlarına indirgenir; kapsamı olmayan
       sayaçlar (mesaj · izin · satın alma · tahsilat …) menüsünde zaten
       görünmüyor, yine de sıfırlanır ki sızmasınlar. */
    var mus = session ? session.musteri : null;
    if(mus){
      var benimProje = (D.projects || []).filter(function(p){ return p.musteri === mus; })
                        .map(function(p){ return p.kod; });
      return {
        havuz:0, bana:0,
        geciken:  (D.deliveries || []).filter(function(x){
                    return benimProje.indexOf(x.proje) !== -1 && x.musteriOnay === 'Bekliyor'; }).length,
        onay:     (D.deliveries || []).filter(function(x){
                    return benimProje.indexOf(x.proje) !== -1 && x.musteriOnay === 'Bekliyor'; }).length,
        bildirim:0, lead:0, teklif:0, hata:0, istalebi:0,
        destek:   (D.tickets || []).filter(function(x){
                    return x.musteri === mus &&
                      (D.ticketClosedStatuses || []).indexOf(x.durum) === -1; }).length,
        mesaj:0, izin:0, bakim:0, police:0, satinalma:0, tahsilat:0,
        dokuman:  (D.documents || []).filter(function(x){ return x.musteri === mus; }).length
      };
    }
    return {
      havuz:     tasks.filter(function(x){ return x.durum === 'Havuzda'; }).length,
      /* REVİZE 01 — "üzerimdeki iş" sayacı altı durum sayıyordu, dördü artık
         sözlükte yok (`Planlandı` · `Başlanmadı` · `Kabul bekliyor` ·
         `Bilgi bekliyor`) ve zaten hiçbir kayıtta geçmiyorlardı. Kalan iki
         değer sayacın gerçekte ölçtüğü şeydi. `Engellendi` bilerek DIŞARIDA:
         engelli iş üzerimde ama bugün yapılabilir değil. */
      bana:      tasks.filter(function(x){ return x.sorumlu === me && ['Devam ediyor','Atandı'].indexOf(x.durum) !== -1; }).length,
      geciken:   tasks.filter(function(x){ return x.termin < t && ['Tamamlandı','İptal edildi','Arşivlendi'].indexOf(x.durum) === -1; }).length,
      onay:      (D.approvals || []).filter(function(x){ return x.durum === 'Bekliyor'; }).length,
      bildirim:  (D.notifications || []).filter(function(x){ return !x.okundu; }).length,
      lead:      (D.leads || []).filter(function(x){ return x.asama === 'Yeni talep'; }).length,
      teklif:    (D.quotes || []).filter(function(x){ return x.durum === 'İletildi' || x.durum === 'Müşteri değerlendirmesinde'; }).length,
      hata:      (D.bugs || []).filter(function(x){ return x.durum !== 'Kapandı'; }).length,
      istalebi:  (D.deptRequests || []).filter(function(x){ return x.durum === 'Bekliyor' || x.durum === 'Devam ediyor'; }).length,
      /* REVİZE 09 — kapalı durum listesi VERİ katmanında (`ops.js`).
         `shell.js` `domain.js`'ten önce yüklenir, yani `GV.destek`e bağlanamaz;
         ikisi de aynı sözlüğü okuyor, liste iki yerde yaşamıyor. */
      destek:    (D.tickets || []).filter(function(x){
                   return (D.ticketClosedStatuses || []).indexOf(x.durum) === -1; }).length,
      mesaj:     (D.channels || []).reduce(function(a,c){ return a + (c.okunmamis || 0); }, 0),
      izin:      (D.leaves || []).filter(function(x){ return x.durum === 'Onay bekliyor'; }).length,
      bakim:     (D.maintenance || []).filter(function(x){ return x.durum === 'Yaklaşıyor' || x.durum === 'Gecikti'; }).length,
      police:    (D.policies || []).filter(function(x){ return x.kalanGun <= 60; }).length,
      satinalma: (D.purchases || []).filter(function(x){ return x.durum === 'Onay bekliyor'; }).length,
      tahsilat:  (D.payments || []).filter(function(x){ return x.durum === 'Gecikti'; }).length,
      dokuman:   (D.documents || []).filter(function(x){ return x.kalanGun != null && x.kalanGun <= 30; }).length
    };
  }

  /* ===================================================================
     5. RENDER
     =================================================================== */
  function ico(name, cls){
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + name + '"></use></svg>';
  }
  GV.ico = ico;

  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  GV.esc = esc;

  function renderRail(activeSec, cnt){
    var rail = document.getElementById('gvRail');
    if(!rail) return;
    var html = '<a class="gv-logo" href="app-panel.html" aria-label="Gavia Works — Ana Panel">' + ico('i-gavia') + '</a>';
    html += '<ul class="gv-rail-list">';
    RAIL_ORDER.forEach(function(key){
      if(!Perm.sec(key)) return;
      var S = SECTIONS[key];
      if(!S) return;
      var badge = 0;
      S.menu.forEach(function(it){ if(it.cnt && cnt[it.cnt]) badge += cnt[it.cnt]; });
      html += '<li><button type="button" class="gv-rail-btn" data-sec="' + key + '"' +
              (key === activeSec ? ' aria-current="true"' : '') +
              ' data-tip="' + esc(S.title) + '" aria-label="' + esc(S.title) + '">' +
              ico(S.ic) +
              (badge ? '<span class="gv-rail-dot">' + (badge > 99 ? '99+' : badge) + '</span>' : '') +
              '</button></li>';
    });
    html += '</ul>';
    html += '<div class="gv-rail-foot"><span class="gv-rail-mark">GW</span></div>';
    rail.innerHTML = html;

    rail.addEventListener('click', function(e){
      var b = e.target.closest('.gv-rail-btn');
      if(!b) return;
      var key = b.dataset.sec;
      var S = SECTIONS[key];
      var visible = S.menu.filter(function(it){ return it.href && Perm.item(it); });
      /* Yayında olan ilk ekrana git; hiçbiri yayında değilse kullanıcıyı boşa gönderme */
      var target = visible.filter(function(it){ return isBuilt(it.href); })[0];
      if(target){ location.href = target.href; return; }
      if(window.GV && GV.toast) GV.toast(S.title + ' bölümü henüz yayında değil.', 'info');
    });

    /* rail ipucu */
    var tip = document.createElement('div');
    tip.className = 'gv-tip';
    document.body.appendChild(tip);
    rail.addEventListener('mouseover', function(e){
      var b = e.target.closest('.gv-rail-btn');
      if(!b) return;
      tip.textContent = b.dataset.tip;
      var r = b.getBoundingClientRect();
      tip.style.left = (r.right + 10) + 'px';
      tip.style.top = (r.top + r.height / 2 - 15) + 'px';
      tip.classList.add('is-on');
    });
    rail.addEventListener('mouseout', function(){ tip.classList.remove('is-on'); });
  }

  function renderMenu(activeSec, activeScreen, cnt){
    var menu = document.getElementById('gvMenu');
    if(!menu) return;
    var S = SECTIONS[activeSec] || SECTIONS.panel;

    var html = '<div class="gv-menu-head">' +
               '<div class="gv-menu-eyebrow">' + esc(S.eyebrow) + '</div>' +
               '<h2 class="gv-menu-title">' + esc(S.title) + '</h2></div>' +
               '<div class="gv-menu-scroll"><nav aria-label="' + esc(S.title) + ' menüsü">';

    S.menu.forEach(function(it){
      if(it.seclbl){ html += '<div class="gv-menu-group">' + esc(it.seclbl) + '</div>'; return; }
      if(!Perm.item(it)) return;
      var n = it.cnt ? (cnt[it.cnt] || 0) : 0;
      var isActive = it.screen === activeScreen;
      html += '<a class="gv-menu-item" href="' + it.href + '"' + (isActive ? ' aria-current="page"' : '') + '>' +
              ico(it.ic) +
              '<span class="gv-menu-lbl">' + esc(it.lbl) + '</span>' +
              (n ? '<span class="gv-menu-cnt' + (it.tone === 'danger' ? ' is-danger' : '') + '">' + n + '</span>' : '') +
              '</a>';
    });

    html += '</nav></div>';
    html += '<div class="gv-menu-foot">' +
            '<a class="gv-menu-item" href="index.html">' + ico('i-logout') +
            '<span class="gv-menu-lbl">Çıkış / Rol Değiştir</span></a></div>';
    menu.innerHTML = html;
  }

  function renderTop(){
    var top = document.getElementById('gvTop');
    if(!top || !session) return;
    top.innerHTML =
      '<button class="gv-burger" id="gvBurger" aria-label="Menüyü aç" aria-expanded="false">' + ico('i-menu') + '</button>' +
      '<div class="gv-globalsearch">' + ico('i-search') +
        '<input type="search" id="gvGlobalSearch" placeholder="Müşteri, proje, görev veya kişi ara" aria-label="Genel arama">' +
      '</div>' +
      '<div class="gv-top-tools">' +
        '<a class="gv-iconbtn" href="app-panel-onaylar.html" aria-label="Bekleyen onaylar" title="Bekleyen onaylar">' + ico('i-stamp') + '</a>' +
        '<a class="gv-iconbtn" id="gvBell" href="app-panel-bildirimler.html" aria-label="Bildirimler" title="Bildirimler">' + ico('i-bell') + '</a>' +
        '<button class="gv-me" id="gvMe" aria-haspopup="true" aria-expanded="false">' +
          '<span class="gv-ava">' + esc(session.ini) + '</span>' +
          '<span class="gv-me-id"><span class="gv-me-name">' + esc(session.ad) + '</span>' +
          '<span class="gv-me-role">' + esc(session.rolAd) + '</span></span>' + ico('i-chev-down') +
        '</button>' +
      '</div>';
  }

  function renderMeMenu(){
    var wrap = document.createElement('div');
    wrap.className = 'gv-me-menu';
    wrap.id = 'gvMeMenu';
    wrap.innerHTML =
      '<div class="gv-me-menu-head">' +
        '<div class="gv-me-menu-name">' + esc(session.ad) + '</div>' +
        '<div class="gv-me-menu-mail">' + esc(session.eposta) + ' · ' + esc(session.rolAd) + '</div>' +
      '</div>' +
      '<a href="app-ayar-profil.html">' + ico('i-user') + 'Profilim</a>' +
      '<a href="app-ayar-bildirim.html">' + ico('i-bell') + 'Bildirim Tercihleri</a>' +
      '<a href="app-zaman.html">' + ico('i-timer') + 'Zaman Kayıtlarım</a>' +
      '<hr>' +
      '<a href="index.html">' + ico('i-logout') + 'Çıkış / Rol Değiştir</a>';
    document.body.appendChild(wrap);

    var me = document.getElementById('gvMe');
    if(!me) return;
    function setOpen(o){
      wrap.classList.toggle('is-open', o);
      me.setAttribute('aria-expanded', o ? 'true' : 'false');
    }
    me.addEventListener('click', function(e){ e.stopPropagation(); setOpen(!wrap.classList.contains('is-open')); });
    document.addEventListener('click', function(e){ if(!wrap.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setOpen(false); });
  }

  /* ---- Breadcrumb ---- */
  function renderCrumb(activeSec, activeScreen){
    var el = document.getElementById('gvCrumb');
    if(!el) return;
    var S = SECTIONS[activeSec] || SECTIONS.panel;
    var item = S.menu.filter(function(it){ return it.screen === activeScreen; })[0];
    var extra = el.dataset.extra || '';
    var first = S.menu.filter(function(it){ return it.href; })[0];
    var html = '<a href="app-panel.html">Ana Panel</a>' + ico('i-chev-right');
    if(activeSec !== 'panel'){
      html += '<a href="' + (first ? first.href : '#') + '">' + esc(S.title) + '</a>' + ico('i-chev-right');
    }
    if(item){
      if(extra){
        html += '<a href="' + item.href + '">' + esc(item.lbl) + '</a>' + ico('i-chev-right') +
                '<span aria-current="page">' + esc(extra) + '</span>';
      }else{
        html += '<span aria-current="page">' + esc(item.lbl) + '</span>';
      }
    }else if(extra){
      html += '<span aria-current="page">' + esc(extra) + '</span>';
    }
    el.innerHTML = html;
  }

  /* ===================================================================
     6. MENÜ AÇ/KAPA
     =================================================================== */
  function wireNav(){
    var burger = document.getElementById('gvBurger');
    var overlay = document.getElementById('gvOverlay');
    var divider = document.getElementById('gvDivider');

    function setNav(o){
      document.body.classList.toggle('gv-nav-open', o);
      if(burger) burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    }
    if(burger) burger.addEventListener('click', function(){ setNav(!document.body.classList.contains('gv-nav-open')); });
    if(overlay) overlay.addEventListener('click', function(){ setNav(false); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setNav(false); });

    if(divider){
      var collapsed = false;
      try{ collapsed = localStorage.getItem(LS_MENU) === '1'; }catch(e){}
      if(collapsed) document.body.classList.add('gv-menu-off');

      /* Menünün o anki gerçek durumu — kırılıma göre farklı sınıf belirleyicidir.
         (981–1180px aralığında varsayılan kapalıdır, sınıfsız gövde = kapalı.) */
      function menuOpen(){
        if(window.matchMedia('(max-width:980px)').matches) return document.body.classList.contains('gv-nav-open');
        if(window.matchMedia('(min-width:981px) and (max-width:1180px)').matches) return document.body.classList.contains('gv-menu-on');
        return !document.body.classList.contains('gv-menu-off');
      }
      function syncDivider(){
        var open = menuOpen();
        divider.setAttribute('aria-expanded', open ? 'true' : 'false');
        divider.setAttribute('aria-label', open ? 'Bölüm menüsünü daralt' : 'Bölüm menüsünü genişlet');
      }
      divider.addEventListener('click', function(){
        var open = menuOpen();
        document.body.classList.toggle('gv-menu-off', open);
        document.body.classList.toggle('gv-menu-on', !open);
        try{ localStorage.setItem(LS_MENU, open ? '1' : '0'); }catch(e){}
        syncDivider();
      });
      window.addEventListener('resize', syncDivider);
      syncDivider();
    }
  }

  /* ===================================================================
     7. YETKİ KAPISI — 403
     =================================================================== */
  function guard(activeSec, activeScreen){
    var screenOk = !SCREEN_PERM[activeScreen] || SCREEN_PERM[activeScreen].indexOf(Perm.role()) !== -1;
    if(SCREEN_DENY[activeScreen] && SCREEN_DENY[activeScreen].indexOf(Perm.role()) !== -1) screenOk = false;
    if(Perm.sec(activeSec) && screenOk) return true;
    var main = document.querySelector('.gv-page');
    if(!main) return false;
    main.innerHTML =
      '<div class="gv-card"><div class="gv-state is-danger">' +
        '<div class="gv-state-ico">' + ico('i-lock', 'ic-xl') + '</div>' +
        '<h3>Bu ekranı görüntüleme yetkiniz yok</h3>' +
        '<p><b>' + esc(session ? session.rolAd : '—') + '</b> rolü bu modüle erişemez. ' +
        'Erişim gerekiyorsa sistem yöneticinizden yetki talep edin.</p>' +
        '<div class="gv-state-acts">' +
          '<a class="btn btn-acc" href="app-panel.html">' + ico('i-home') + ' Ana Panele Dön</a>' +
          '<a class="btn btn-line" href="index.html">' + ico('i-logout') + ' Rol Değiştir</a>' +
        '</div>' +
      '</div></div>';
    document.title = 'Yetkisiz erişim — GaviaWorks CRM';
    return false;
  }

  /* ===================================================================
     7b. YAYINDA OLAN EKRANLAR — "sahte buton bırakma" kuralı
     Henüz üretilmemiş hedeflere giden bağlantılar href yerine data-wip
     ile işaretlenir (CLAUDE.md). Sayfa doğunca buraya eklenir ve
     bağlantı kendiliğinden gerçek hâle gelir.
     =================================================================== */
  var BUILT = [
    'index.html',
    'app-panel.html',
    'app-lead.html',
    'app-gorev.html',
    'app-gorev-detay.html',
    'app-musteri.html',
    'app-proje.html',
    'app-proje-milestone.html',
    'app-proje-sprint.html',
    'app-proje-test.html',
    'app-proje-test-detay.html',
    'app-proje-hata.html',
    'app-proje-hata-detay.html',
    'app-proje-degisiklik.html',
    'app-proje-degisiklik-detay.html',
    'app-proje-teslim.html',
    'app-proje-teslim-detay.html',
    'app-proje-detay.html',
    'app-musteri-detay.html',
    'app-lead-detay.html',
    'app-teklif.html',
    'app-teklif-detay.html',
    'app-personel.html',
    'app-personel-detay.html',
    'app-pipeline.html',
    'app-referans.html',
    'app-referans-detay.html',
    'app-komisyon.html',
    'app-komisyon-detay.html',
    'app-onanaliz.html',
    'app-onanaliz-detay.html',
    'app-musteri-yetkili.html',
    'app-musteri-iletisim.html',
    'app-istalebi.html',
    'app-istalebi-detay.html',
    'app-destek.html',
    'app-destek-detay.html',
    'app-destek-sla.html',
    'app-destek-paket.html',
    'app-destek-memnuniyet.html',
    'app-dokuman-sure.html',
    'app-toplanti-karar.html',
    'app-izin.html',
    'app-izin-detay.html',
    'app-zaman.html',
    'app-zaman-onay.html',
    'app-egitim.html',
    'app-personel-giris.html',
    'app-satinalma-teklif.html',
    'app-odemeplani.html',
    'app-kapasite.html',
    'app-performans.html',
    'app-demirbas.html',
    'app-demirbas-detay.html',
    'app-zimmet.html',
    'app-arac.html',
    'app-arac-detay.html',
    'app-arac-bakim.html',
    'app-arac-muayene.html',
    'app-arac-sigorta.html',
    'app-arac-yakit.html',
    'app-arac-gider.html',
    'app-arac-kaza.html',
    'app-satinalma.html',
    'app-satinalma-detay.html',
    'app-tedarikci.html',
    'app-tedarikci-detay.html',
    'app-siparis.html',
    'app-siparis-detay.html',
    'app-sozlesme.html',
    'app-sozlesme-detay.html',
    'app-fatura.html',
    'app-fatura-detay.html',
    'app-tahsilat.html',
    'app-tahsilat-detay.html',
    'app-butce.html',
    'app-sohbet.html',
    'app-ajanda.html',
    'app-rapor.html',
    'app-rapor-musteri.html',
    'app-rapor-referans.html',
    'app-rapor-filo.html',
    'app-rapor-finans.html',
    'app-rapor-proje.html',
    'app-ayar-yetki.html',
    'app-ayar-otomasyon.html',
    'app-ayar-bildirim.html',
    'app-ayar-log.html',
    'app-ayar-kullanici.html',
    'app-ayar-entegrasyon.html',
    'app-ayar-rol.html',
    'app-ayar-departman.html',
    'app-ayar-profil.html',
    'app-ayar-arsiv.html',
    'app-ayar-sirket.html',
    'app-ayar-onay.html',
    'app-panel-duyurular.html',
    'app-panel-ozet.html',
    'app-panel-yonetici.html',
    'app-rapor-personel.html',
    'app-rapor-gorev.html',
    'app-dokuman.html',
    'app-dokuman-detay.html',
    'app-toplanti.html',
    'app-toplanti-detay.html',
    'app-panel-bildirimler.html',
    'app-panel-onaylar.html',
    /* Form ekranları (Wave 12b) */
    'app-lead-form.html',
    'app-musteri-form.html',
    'app-satinalma-form.html',
    'app-musteri-yetkili-form.html',
    'app-musteri-iletisim-form.html',
    'app-referans-form.html',
    'app-komisyon-form.html',
    'app-onanaliz-form.html',
    'app-teklif-form.html',
    'app-proje-form.html',
    'app-gorev-form.html',
    'app-destek-form.html',
    'app-proje-sprint-form.html',
    'app-proje-test-form.html',
    'app-proje-hata-form.html',
    'app-proje-teslim-form.html',
    'app-proje-degisiklik-form.html',
    'app-istalebi-form.html',
    'app-personel-form.html',
    'app-izin-form.html',
    'app-sozlesme-form.html',
    'app-fatura-form.html',
    'app-siparis-form.html',
    'app-tedarikci-form.html',
    'app-demirbas-form.html',
    'app-zimmet-form.html',
    'app-toplanti-form.html',
    'app-arac-form.html',
    'app-arac-bakim-form.html',
    'app-arac-muayene-form.html',
    'app-arac-sigorta-form.html',
    'app-arac-yakit-form.html',
    'app-arac-gider-form.html',
    'app-arac-kaza-form.html',
    'app-destek-paket-form.html',
    'app-performans-form.html'
  ];
  GV.built = BUILT;

  function isBuilt(href){
    if(!href) return false;
    if(/^(https?:|mailto:|tel:|#)/.test(href)) return true;
    var file = href.split('?')[0].split('#')[0];
    return BUILT.indexOf(file) !== -1;
  }
  GV.isBuilt = isBuilt;

  /* DOM'daki yayında olmayan bağlantıları işaretle */
  function markWip(root){
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll('a[href]'), function(a){
      var href = a.getAttribute('href');
      if(isBuilt(href) || a.hasAttribute('data-wip')) return;
      var label = (a.textContent || '').trim().replace(/\s+/g,' ').slice(0, 40) || 'Bu ekran';
      a.setAttribute('data-wip', label);
      a.dataset.wipHref = href;
      a.removeAttribute('href');
      a.setAttribute('role', 'link');
      a.setAttribute('aria-disabled', 'true');
      a.setAttribute('tabindex', '0');
      a.setAttribute('title', label + ' — bu ekran henüz yayında değil');
    });
  }
  GV.markWip = markWip;

  /* Liste/panel yeniden render ettikçe otomatik uygula */
  var wipObserver = null;
  function watchWip(){
    if(wipObserver) return;
    wipObserver = new MutationObserver(function(muts){
      var need = muts.some(function(m){ return m.addedNodes.length; });
      if(need) markWip(document.querySelector('.gv-main') || document);
    });
    var main = document.querySelector('.gv-main');
    if(main) wipObserver.observe(main, { childList:true, subtree:true });
  }

  /* ===================================================================
     7c. İSKELET KURULUMU
     Sayfa yalnız içeriğini yazar; rail/menü/üstbar/breadcrumb iskeleti
     burada kurulur. Böylece her ekranda 30 satırlık markup tekrarlanmaz
     (CLAUDE.md — "benzer ekranlar için tekrarlı kod yazılmaz").
     =================================================================== */
  function buildSkeleton(){
    if(document.querySelector('.gv-app')) return;   /* elle kurulmuş sayfalar dokunulmaz */

    /* Mevcut gövde içeriğini (script'ler hariç) sakla */
    var keep = document.createDocumentFragment();
    Array.prototype.slice.call(document.body.childNodes).forEach(function(n){
      if(n.nodeType === 1 && n.tagName === 'SCRIPT') return;
      keep.appendChild(n);
    });

    var app = document.createElement('div');
    app.className = 'gv-app';
    app.innerHTML =
      '<aside class="gv-rail" id="gvRail"></aside>' +
      '<nav class="gv-menu" id="gvMenu"></nav>' +
      '<button type="button" class="gv-divider" id="gvDivider" aria-controls="gvMenu" aria-expanded="true" ' +
        'aria-label="Bölüm menüsünü daralt">' +
        '<span>' + ico('i-chev-left','ic-sm') + '</span></button>' +
      '<div class="gv-overlay" id="gvOverlay"></div>' +
      '<header class="gv-top" id="gvTop"></header>' +
      '<main class="gv-main" id="gvMain"><div class="gv-page">' +
        '<nav class="gv-crumb" id="gvCrumb" aria-label="Konum"></nav>' +
        '<div id="gvPageHead"></div>' +
      '</div></main>';

    var skip = document.createElement('a');
    skip.className = 'gv-skip';
    skip.href = '#gvMain';
    skip.textContent = 'İçeriğe atla';

    document.body.insertBefore(app, document.body.firstChild);
    document.body.insertBefore(skip, app);
    app.querySelector('.gv-page').appendChild(keep);
  }

  /* Sayfa başlığı — .ph-eyebrow / h1 / .ph-sub / .ph-actions
     Yeniden çağrılabilir: ilk çağrıda iskeletin bıraktığı #gvPageHead yer tutucusunu,
     sonraki çağrılarda kendi bastığı .gv-page-head bloğunu değiştirir. Bu olmadan
     GV.refresh() sonrası başlık aksiyonları eski koşulla asılı kalıyordu. */
  GV.pageHead = function(cfg){
    var host = document.getElementById('gvPageHead') ||
               document.querySelector('.gv-page .gv-page-head');
    if(!host) return;
    host.outerHTML =
      '<div class="gv-page-head"><div>' +
        (cfg.eyebrow ? '<div class="ph-eyebrow">' + esc(cfg.eyebrow) + '</div>' : '') +
        '<h1>' + esc(cfg.title) + '</h1>' +
        '<div class="ph-sub" data-listcount>' + esc(cfg.sub || '—') + '</div>' +
      '</div>' +
      (cfg.actions && cfg.actions.length
        ? '<div class="ph-actions">' + cfg.actions.map(function(a, i){
            var inner = (a.icon ? ico(a.icon) + ' ' : '') + esc(a.label);
            return a.href
              ? '<a class="btn ' + (a.cls || 'btn-line') + '" href="' + a.href + '">' + inner + '</a>'
              : '<button type="button" class="btn ' + (a.cls || 'btn-line') + '"' +
                (a.id ? ' id="' + a.id + '"' : '') + ' data-ph-act="' + i + '">' + inner + '</button>';
          }).join('') + '</div>'
        : '') +
      '</div>';

    /* href'siz aksiyonlara run(ev) bağla — sahte buton bırakılmaz */
    (cfg.actions || []).forEach(function(a, i){
      if(a.href || typeof a.run !== 'function') return;
      var btn = document.querySelector('.ph-actions [data-ph-act="' + i + '"]');
      if(btn) btn.addEventListener('click', function(ev){ a.run(ev, btn); });
    });
  };

  /* Sayfayı yeniden çizer — mock veriyi DEĞİŞTİREN aksiyonlardan sonra kullanılır.
     `location.reload()` KULLANILMAZ: veri `assets/data/*.js` içinde bellekte durur,
     sayfa yeniden yüklenince script'ler baştan koşar ve yapılan değişiklik SİLİNİR
     (ölçüldü — altı detay ekranında onay/ödeme aksiyonu iz bırakmıyordu, ders L-15).
     `gv:ready` yeniden tetiklenir; ekran kendini güncel veriyle baştan kurar. */
  GV.refresh = function(){
    /* Mount düğümü TAZE bir kopyayla değiştirilir. Ekranlar `mount`a delege
       tıklama dinleyicisi bağlıyor; düğüm yerinde kalsaydı her tazelemede bir
       dinleyici daha birikir ve tek tıklama N modal açardı (ölçüldü: üç
       tazeleme → 3 modal). Düğümü değiştirmek o dinleyicileri de götürür. */
    var m = document.getElementById('rec');
    if(m && m.parentNode){
      var taze = document.createElement(m.tagName);
      taze.id = m.id;
      if(m.className) taze.className = m.className;
      m.parentNode.replaceChild(taze, m);
    }
    /* Açık modal / yan panel kapatılır. İkisi de `.page-main` DIŞINA basılır, yani
       mount değişince ölmezler. Kapatılmazsa iki şey birden bozulur:
       (a) panelde ESKİ veriyle çizilmiş içerik ekranda kalır — kullanıcı mutasyonun
           işlemediğini sanır (L-15'in görünen ikizi),
       (b) her panelin `document`'e bağladığı Escape/Tab dinleyicisi ölmez ve birikir
           (ölçüldü: bir tazeleme → +3 dinleyici, ders L-16).
       `close()` animasyonlu kaldırma yaptığı için doğrudan o çağrılır; API'si
       yoksa düğüm sökülür ve `body` kaydırma kilidi açılır. */
    var acik = document.querySelectorAll('.gv-scrim, .gv-drawer, .gv-modal-scrim');
    if(acik.length){
      Array.prototype.forEach.call(acik, function(el){
        if(el.__gvClose){ el.__gvClose(); return; }
        el.remove();
      });
      document.body.style.overflow = '';
    }
    document.dispatchEvent(new CustomEvent('gv:ready'));
  };

  /* Kalıcı düğüme (document, window, .gv-page) dinleyici bağlarken KULLANILIR.
     Aynı `key` ile ikinci kez çağrılırsa önceki dinleyiciyi söker — böylece
     GV.refresh() sonrası dinleyici birikmez. Mount içindeki düğümlere bağlanan
     dinleyiciler için gerekmez; onları GV.refresh zaten düşürür. */
  GV.on = function(el, type, fn, key){
    if(!el) return;
    var reg = el.__gvOn || (el.__gvOn = {});
    var k = key || type;
    if(reg[k]) el.removeEventListener(type, reg[k]);
    reg[k] = fn;
    el.addEventListener(type, fn);
  };

  /* ===================================================================
     8. İKON SPRITE ENJEKSİYONU
     =================================================================== */
  function injectSprite(){
    if(document.getElementById('gvSprite')) return Promise.resolve();
    return fetch('assets/img/icons.svg')
      .then(function(r){ return r.text(); })
      .then(function(txt){
        var d = document.createElement('div');
        d.id = 'gvSprite';
        d.style.display = 'none';
        d.setAttribute('aria-hidden','true');
        d.innerHTML = txt;
        document.body.insertBefore(d, document.body.firstChild);
      })
      .catch(function(){ /* sprite yoksa arayüz metinle çalışmaya devam eder */ });
  }

  /* ===================================================================
     9. BAŞLATMA
     =================================================================== */
  function boot(){
    session = resolveSession();

    /* Oturum yoksa giriş ekranına dön */
    if(!session){
      if(!/index\.html$/.test(location.pathname) && location.pathname !== '/' &&
         !/\/$/.test(location.pathname)){
        location.replace('index.html');
        return;
      }
      return;
    }
    GV.session = session;
    buildSkeleton();

    var body = document.body;
    var activeSec = body.dataset.sec || 'panel';
    var activeScreen = body.dataset.screen || '';
    var cnt = counters();
    GV.counters = cnt;

    renderRail(activeSec, cnt);
    renderMenu(activeSec, activeScreen, cnt);
    renderTop();
    renderMeMenu();
    renderCrumb(activeSec, activeScreen);
    wireNav();

    var bell = document.getElementById('gvBell');
    if(bell && cnt.bildirim){
      bell.insertAdjacentHTML('beforeend', '<span class="gv-dot">' + (cnt.bildirim > 9 ? '9+' : cnt.bildirim) + '</span>');
    }

    var allowed = guard(activeSec, activeScreen);
    markWip(document);
    watchWip();
    /* Yetki kapısı kapandıysa sayfa config'i ÇALIŞMAZ: 403 markup'ı mount
       düğümlerini sildiği için sayfa script'leri null üzerinde patlıyordu.
       Ekranını 403 durumunda da bir şey yapması gerekenler 'gv:denied' dinler. */
    document.dispatchEvent(new CustomEvent(allowed ? 'gv:ready' : 'gv:denied',
      { detail:{ session:session, counters:cnt, section:activeSec } }));
  }

  GV.shell = {
    sections:SECTIONS,
    railOrder:RAIL_ORDER,
    secByRole:SEC_BY_ROLE,
    session:function(){ return session; },
    setSession:function(empKod, roleKey){
      /* Müşteri personası personel listesinden kurulamaz — kimliği bir
         `DB.contacts` kaydıdır (REVİZE 13). Giriş ekranı `YTK-*` kodu verir. */
      var s = (roleKey === 'musteri' || /^YTK-/.test(empKod || ''))
        ? buildMusteriSession(/^YTK-/.test(empKod || '') ? empKod : null)
        : buildSession(empKod, roleKey);
      if(s){ writeSession(s); session = s; }
      return s;
    },
    clear:function(){ try{ sessionStorage.removeItem(SS_KEY); }catch(e){} },
    counters:counters,
    crumb:function(text){
      var el = document.getElementById('gvCrumb');
      if(el){ el.dataset.extra = text; renderCrumb(document.body.dataset.sec || 'panel', document.body.dataset.screen || ''); }
    }
  };

  /* Sprite önce, sonra shell */
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ injectSprite().then(boot); });
  }else{
    injectSprite().then(boot);
  }
})();
