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
      { ic:'i-percent',      lbl:'Komisyon Hakedişleri', href:'app-komisyon.html',       screen:'komisyon' },
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
      { ic:'i-clipboard-check', lbl:'Kontrol Bekleyenler', href:'app-gorev.html?t=kontrol', screen:'kontrol' },
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
      { ic:'i-graduation',   lbl:'Eğitim ve Yetkinlik', href:'app-egitim.html',          screen:'egitim' }
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
      { ic:'i-building',     lbl:'Şirket Bilgileri', href:'app-ayar-sirket.html',        screen:'sirket' },
      { ic:'i-users',        lbl:'Departmanlar',     href:'app-ayar-departman.html',     screen:'departmanlar' },
      { seclbl:'Erişim' },
      { ic:'i-user',         lbl:'Kullanıcılar',     href:'app-ayar-kullanici.html',     screen:'kullanicilar' },
      { ic:'i-shield',       lbl:'Roller',           href:'app-ayar-rol.html',           screen:'roller' },
      { ic:'i-key',          lbl:'Yetki Matrisi',    href:'app-ayar-yetki.html',         screen:'yetki' },
      { ic:'i-stamp',        lbl:'Onay Akışları',    href:'app-ayar-onay.html',          screen:'onayakis' },
      { seclbl:'Sistem' },
      { ic:'i-bell',         lbl:'Bildirim Tercihleri', href:'app-ayar-bildirim.html',   screen:'bildirimtercih' },
      { ic:'i-activity',     lbl:'Otomasyonlar',     href:'app-ayar-otomasyon.html',     screen:'otomasyon' },
      { ic:'i-link',         lbl:'Entegrasyonlar',   href:'app-ayar-entegrasyon.html',   screen:'entegrasyon' },
      { ic:'i-list',         lbl:'Log Kayıtları',    href:'app-ayar-log.html',           screen:'log', roles:['sahip','genelmudur','sistem','operasyon','devops'] },
      { ic:'i-archive',      lbl:'Arşiv',            href:'app-ayar-arsiv.html',         screen:'arsiv' }
    ]}
  };

  var RAIL_ORDER = ['panel','satis','musteri','proje','gorev','destek','sohbet','personel',
                    'varlik','satinalma','finans','dokuman','toplanti','rapor','ayarlar'];

  /* Rol → görebileceği bölümler ---------------------------------------- */
  var ALL = RAIL_ORDER.slice();
  var SEC_BY_ROLE = {
    sahip:        ALL,
    genelmudur:   ALL,
    sistem:       ALL,
    operasyon:    ['panel','satis','musteri','proje','gorev','destek','sohbet','personel','varlik','satinalma','finans','dokuman','toplanti','rapor'],
    depmudur:     ['panel','proje','gorev','destek','sohbet','personel','dokuman','toplanti','rapor'],
    satismudur:   ['panel','satis','musteri','proje','gorev','sohbet','finans','dokuman','toplanti','rapor'],
    satistemsilci:['panel','satis','musteri','gorev','sohbet','dokuman','toplanti'],
    musteritems:  ['panel','musteri','destek','gorev','sohbet','dokuman','toplanti'],
    analist:      ['panel','satis','musteri','proje','gorev','sohbet','dokuman','toplanti'],
    pm:           ['panel','musteri','proje','gorev','destek','sohbet','personel','dokuman','toplanti','rapor','finans'],
    takimlideri:  ['panel','proje','gorev','destek','sohbet','personel','dokuman','toplanti','rapor'],
    tasarimci:    ['panel','proje','gorev','sohbet','dokuman','toplanti'],
    frontend:     ['panel','proje','gorev','sohbet','dokuman','toplanti'],
    backend:      ['panel','proje','gorev','sohbet','dokuman','toplanti'],
    mobil:        ['panel','proje','gorev','sohbet','dokuman','toplanti'],
    ai:           ['panel','proje','gorev','sohbet','dokuman','toplanti'],
    qa:           ['panel','proje','gorev','destek','sohbet','dokuman','toplanti'],
    devops:       ['panel','proje','gorev','destek','sohbet','varlik','dokuman','toplanti','ayarlar'],
    destek:       ['panel','musteri','destek','gorev','proje','sohbet','dokuman','toplanti'],
    ik:           ['panel','personel','gorev','sohbet','varlik','dokuman','toplanti','rapor'],
    muhasebe:     ['panel','musteri','finans','satinalma','varlik','gorev','sohbet','dokuman','toplanti','rapor'],
    satinalma:    ['panel','satinalma','varlik','finans','gorev','sohbet','dokuman','toplanti','rapor'],
    idari:        ['panel','varlik','satinalma','personel','gorev','sohbet','dokuman','toplanti'],
    freelancer:   ['panel','gorev','sohbet','dokuman'],
    diskaynak:    ['panel','gorev','sohbet','dokuman'],
    stajyer:      ['panel','gorev','sohbet','dokuman'],
    musteri:      ['panel','destek','dokuman']
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

  function buildSession(empKod, roleKey){
    var e = (window.DB && DB.emp) ? DB.emp(empKod) : null;
    if(!e) return null;
    return {
      emp:e.kod, ad:e.ad, ini:e.ini, dep:e.dep, depAd:e.depAd,
      rol:roleKey || e.rol, rolAd:(window.DB ? DB.roleName(roleKey || e.rol) : roleKey),
      eposta:e.eposta, girildi:new Date().toISOString()
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
      var emp = qEmp;
      if(!emp && qRole && window.DB){
        var m = DB.employees.filter(function(x){ return x.roller.indexOf(qRole) !== -1; })[0];
        emp = m ? m.kod : DB.employees[0].kod;
      }
      var ns = buildSession(emp || 'EMP-001', qRole || null);
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
    return {
      havuz:     tasks.filter(function(x){ return x.durum === 'Havuzda'; }).length,
      bana:      tasks.filter(function(x){ return x.sorumlu === me && ['Devam ediyor','Atandı','Planlandı','Başlanmadı','Kabul bekliyor','Bilgi bekliyor'].indexOf(x.durum) !== -1; }).length,
      geciken:   tasks.filter(function(x){ return x.termin < t && ['Tamamlandı','İptal edildi','Arşivlendi'].indexOf(x.durum) === -1; }).length,
      onay:      (D.approvals || []).filter(function(x){ return x.durum === 'Bekliyor'; }).length,
      bildirim:  (D.notifications || []).filter(function(x){ return !x.okundu; }).length,
      lead:      (D.leads || []).filter(function(x){ return x.asama === 'Yeni talep'; }).length,
      teklif:    (D.quotes || []).filter(function(x){ return x.durum === 'İletildi' || x.durum === 'Müşteri değerlendirmesinde'; }).length,
      hata:      (D.bugs || []).filter(function(x){ return x.durum !== 'Kapandı'; }).length,
      istalebi:  (D.deptRequests || []).filter(function(x){ return x.durum === 'Bekliyor' || x.durum === 'Devam ediyor'; }).length,
      destek:    (D.tickets || []).filter(function(x){ return ['Açık','Devam ediyor','Müşteri bekleniyor'].indexOf(x.durum) !== -1; }).length,
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
      divider.addEventListener('click', function(){
        var off = document.body.classList.toggle('gv-menu-off');
        document.body.classList.toggle('gv-menu-on', !off);
        try{ localStorage.setItem(LS_MENU, off ? '1' : '0'); }catch(e){}
      });
    }
  }

  /* ===================================================================
     7. YETKİ KAPISI — 403
     =================================================================== */
  function guard(activeSec){
    if(Perm.sec(activeSec)) return true;
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
    'app-teklif.html',
    'app-personel.html',
    'app-pipeline.html',
    'app-referans.html',
    'app-komisyon.html',
    'app-onanaliz.html',
    'app-musteri-yetkili.html',
    'app-musteri-iletisim.html',
    'app-istalebi.html',
    'app-destek.html',
    'app-izin.html',
    'app-zaman.html',
    'app-kapasite.html',
    'app-performans.html',
    'app-demirbas.html',
    'app-zimmet.html',
    'app-arac.html',
    'app-arac-bakim.html',
    'app-arac-muayene.html',
    'app-arac-sigorta.html',
    'app-arac-yakit.html',
    'app-arac-gider.html',
    'app-arac-kaza.html',
    'app-satinalma.html',
    'app-tedarikci.html',
    'app-siparis.html',
    'app-sozlesme.html',
    'app-fatura.html',
    'app-tahsilat.html',
    'app-butce.html',
    'app-sohbet.html',
    'app-ajanda.html',
    'app-rapor.html',
    'app-rapor-musteri.html',
    'app-rapor-referans.html',
    'app-rapor-filo.html',
    'app-rapor-finans.html',
    'app-rapor-proje.html',
    'app-rapor-personel.html',
    'app-rapor-gorev.html',
    'app-dokuman.html',
    'app-toplanti.html',
    'app-panel-bildirimler.html',
    'app-panel-onaylar.html'
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
      '<button type="button" class="gv-divider" id="gvDivider" aria-label="Menüyü daralt veya genişlet">' +
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

  /* Sayfa başlığı — .ph-eyebrow / h1 / .ph-sub / .ph-actions */
  GV.pageHead = function(cfg){
    var host = document.getElementById('gvPageHead');
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

    guard(activeSec);
    markWip(document);
    watchWip();
    document.dispatchEvent(new CustomEvent('gv:ready', { detail:{ session:session, counters:cnt } }));
  }

  GV.shell = {
    sections:SECTIONS,
    railOrder:RAIL_ORDER,
    secByRole:SEC_BY_ROLE,
    session:function(){ return session; },
    setSession:function(empKod, roleKey){
      var s = buildSession(empKod, roleKey);
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
