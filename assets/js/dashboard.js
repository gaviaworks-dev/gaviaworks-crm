/* =====================================================================
   GAVIAWORKS CRM — ROL BAZLI DASHBOARD
   PROMPT.md §7 — her rol için ayrı panel. Kart setleri birebir §7'deki
   listelerden türetilmiştir; hiçbir kalem atlanmamıştır.
   Varyantlar: sahip · satis · pm · personel · ik · satinalma · musteri
   ===================================================================== */
(function(){
  'use strict';
  var GV = window.GV, F = GV.fmt, esc = GV.esc, ico = GV.ico;

  var T = function(){ return DB.today; };
  var days = function(d){ return F.days(d); };
  var openTask = function(t){ return ['Tamamlandı','İptal edildi','Arşivlendi'].indexOf(t.durum) === -1; };
  var lateTask = function(t){ return openTask(t) && t.termin && days(t.termin) < 0; };
  var openLead = function(l){ return ['Kazanıldı','Kaybedildi','Beklemeye alındı'].indexOf(l.asama) === -1; };
  /* REVİZE 05 — "devam eden proje" tanımı `GV.proje.acik`ta; dashboard da
     ekranlarla aynı cümleyi kullanır, kendi kopyasını taşımaz. */
  var activeProject = function(p){ return GV.proje.acik(p); };
  var lateProject = function(p){ return activeProject(p) && p.planlananBitis && days(p.planlananBitis) < 0; };

  /* ---------------------------------------------------------------
     Kart yardımcıları
     --------------------------------------------------------------- */
  function kpi(c){
    var inner =
      '<div class="kpi-ico">' + ico(c.icon || 'i-chart-bar','ic-lg') + '</div>' +
      '<div class="kpi-body"><div class="kpi-num">' + c.value + '</div>' +
      '<div class="kpi-lbl">' + esc(c.label) + '</div>' +
      (c.meta ? '<div class="kpi-meta' + (c.metaTone ? ' is-' + c.metaTone : '') + '">' +
        (c.metaIcon ? ico(c.metaIcon,'ic-sm') : '') + esc(c.meta) + '</div>' : '') + '</div>';
    return c.href
      ? '<a class="kpi' + (c.tone ? ' is-' + c.tone : '') + '" href="' + c.href + '">' + inner + '</a>'
      : '<div class="kpi' + (c.tone ? ' is-' + c.tone : '') + '">' + inner + '</div>';
  }

  function kpiGrid(cards){ return '<div class="kpi-grid">' + cards.map(kpi).join('') + '</div>'; }

  function card(c){
    return '<section class="gv-card">' +
      '<div class="gc-head"><div><h2 class="gc-title">' + ico(c.icon || 'i-list') + esc(c.title) + '</h2>' +
      (c.sub ? '<div class="gc-sub">' + esc(c.sub) + '</div>' : '') + '</div>' +
      (c.link ? '<div class="gc-head-acts"><a class="btn btn-ghost btn-sm" href="' + c.link + '">Tümü ' + ico('i-arrow-right','ic-sm') + '</a></div>' : '') +
      '</div>' +
      (c.flush ? '<div class="gc-body flush">' : '<div class="gc-body">') + c.body + '</div>' +
      '</section>';
  }

  /* Basit satır listesi */
  function rows(items, empty){
    if(!items.length) return GV.empty(empty || { icon:'i-check-circle', title:'Bekleyen kayıt yok', desc:'Bu başlıkta şu an ilginizi bekleyen bir şey yok.' });
    return '<div class="gv-tablewrap"><table class="gtable"><tbody>' + items.join('') + '</tbody></table></div>';
  }

  function row(cells, opt){
    opt = opt || {};
    return '<tr' + (opt.cls ? ' class="' + opt.cls + '"' : '') + '>' +
      cells.map(function(c){ return '<td' + (c.cls ? ' class="' + c.cls + '"' : '') + '>' + c.html + '</td>'; }).join('') + '</tr>';
  }

  function link(href, main, sub){
    return '<a class="cell-main" href="' + href + '">' + esc(main) + '</a>' + (sub ? '<span class="cell-sub">' + esc(sub) + '</span>' : '');
  }

  /* ---------------------------------------------------------------
     Ortak bloklar
     --------------------------------------------------------------- */
  function greeting(s){
    var h = new Date().getHours();
    var sel = h < 6 ? 'İyi geceler' : h < 12 ? 'Günaydın' : h < 18 ? 'İyi günler' : 'İyi akşamlar';
    var late = DB.tasks.filter(lateTask).length;
    var onay = DB.approvals.filter(function(a){ return a.durum === 'Bekliyor'; }).length;
    return '<div class="gv-page-head"><div>' +
      '<div class="ph-eyebrow">' + esc(DB.roleName(s.rol)) + '</div>' +
      '<h1>' + sel + ', ' + esc(s.ad.split(' ')[0]) + '</h1>' +
      '<div class="ph-sub">' + F.dateLong(T()) + ' — ' +
      (late ? late + ' geciken iş' : 'geciken iş yok') + ', ' + onay + ' onay sizi bekliyor.</div></div>' +
      '<div class="ph-actions">' +
        '<a class="btn btn-line" href="app-panel-ozet.html">' + ico('i-sun') + ' Günlük Özet</a>' +
        '<a class="btn btn-acc" href="app-gorev-form.html">' + ico('i-plus') + ' Görev Ver</a>' +
      '</div></div>';
  }

  function pendingApprovals(limit){
    var all = DB.approvals.filter(function(a){ return a.durum === 'Bekliyor'; });
    var list = all.slice(0, limit || 6);
    return card({
      title:'Bekleyen Onaylar', icon:'i-stamp',
      sub:all.length + ' işlem onayınızı bekliyor' + (all.length > list.length ? ' · ilk ' + list.length + ' gösteriliyor' : ''),
      link:'app-panel-onaylar.html', flush:true,
      body:rows(list.map(function(a){
        return row([
          { html:link(a.link, a.baslik, a.tur + ' · ' + a.kayit) },
          { html:a.tutar ? '<span class="cell-money">' + F.money(a.tutar) + '</span>' : '<span class="u-faint">—</span>', cls:'num' },
          { html:GV.pri(a.aciliyet) },
          { html:'<span class="cell-date">' + F.dateShort(a.tarih) + '</span>' },
          { html:'<a class="ia" href="' + a.link + '" aria-label="Onaya git">' + ico('i-external','ic-sm') + '</a>', cls:'col-acts' }
        ]);
      }), { icon:'i-check-circle', title:'Bekleyen onay yok', desc:'Onay kuyruğunuz temiz.' })
    });
  }

  function lateTasksCard(filterFn) {
    var list = DB.tasks.filter(function(t){ return lateTask(t) && (!filterFn || filterFn(t)); }).slice(0, 6);
    return card({
      title:'Geciken Görevler', icon:'i-alert', sub:list.length + ' görev termini geçti',
      link:'app-gorev.html?t=geciken', flush:true,
      body:rows(list.map(function(t){
        return row([
          { html:link('app-gorev-detay.html?id=' + t.kod, t.baslik, t.kod + (t.proje ? ' · ' + t.proje : '')) },
          { html:GV.user(t.sorumlu, { sm:true }) },
          { html:GV.pri(t.oncelik) },
          { html:'<span class="cell-date is-late">' + Math.abs(days(t.termin)) + ' gün</span>' },
          { html:GV.badge(t.durum) }
        ], { cls:'is-late' });
      }), { icon:'i-check-circle', title:'Geciken görev yok', desc:'Tüm işler zamanında ilerliyor.' })
    });
  }

  function activityCard(){
    return card({
      title:'Son Hareketler', icon:'i-activity', link:'app-ayar-log.html',
      body:GV.activity(DB.activities.slice(0, 6))
    });
  }

  function agendaCard(){
    var list = DB.meetings.filter(function(m){ return m.durum === 'Planlandı'; })
      .sort(function(a,b){ return a.tarih.localeCompare(b.tarih); }).slice(0, 5);
    return card({
      title:'Yaklaşan Toplantılar', icon:'i-calendar', link:'app-ajanda.html', flush:true,
      body:rows(list.map(function(m){
        return row([
          { html:link('app-toplanti-detay.html?id=' + m.kod, m.ad, m.tur + ' · ' + m.yer) },
          { html:'<span class="cell-date">' + F.dt(m.tarih) + '</span>' },
          { html:'<span class="u-sm u-muted">' + m.katilimci.length + ' katılımcı</span>' }
        ]);
      }), { icon:'i-calendar', title:'Planlı toplantı yok', desc:'Ajandanız boş görünüyor.' })
    });
  }

  /* ---------------------------------------------------------------
     1. ŞİRKET SAHİBİ DASHBOARD (PROMPT.md §7 — 17 kalem)
     --------------------------------------------------------------- */
  function dashSahip(){
    var leads = DB.leads, cust = DB.customers, proj = DB.projects, tasks = DB.tasks;
    var openLeads = leads.filter(openLead);
    var pipelineValue = openLeads.reduce(function(s,l){ return s + l.butce; }, 0);
    var weighted = openLeads.reduce(function(s,l){
      var st = DB.pipelineStages.filter(function(x){ return x.key === l.asama; })[0];
      return s + l.butce * ((st ? st.olasilik : 0) / 100);
    }, 0);
    /* Referansla gelen = yönlendiren kaydı olan her aday (kaynak etiketi
       "Referans", "İş ortağı", "Danışman", "Etkinlik" vb. olabilir) */
    var refLeads = leads.filter(function(l){ return !!l.referans; });
    var openQuotes = DB.quotes.filter(function(q){ return ['İletildi','Müşteri değerlendirmesinde','Teklif hazırlanıyor','Taslak'].indexOf(q.durum) !== -1; });
    var latePay = DB.payments.filter(function(p){ return p.durum === 'Gecikti'; });
    var riskCust = cust.filter(function(c){ return c.risk === 'Yüksek' || c.durum === 'Riskli'; });
    var policyWarn = DB.policies.filter(function(p){ return p.kalanGun <= 60; });
    var maintWarn = DB.maintenance.filter(function(m){ return m.durum === 'Yaklaşıyor' || m.durum === 'Serviste'; });
    var inspWarn = DB.inspections.filter(function(i){ return i.kalanGun <= 60; });
    var purchApproval = DB.approvals.filter(function(a){ return a.durum === 'Bekliyor' && a.tur === 'Satın alma talebi'; });
    var capacity = DB.capacity;
    var avgLoad = Math.round(capacity.reduce(function(s,c){ return s + c.doluluk; }, 0) / capacity.length);

    var html = kpiGrid([
      { label:'Toplam müşteri', value:cust.filter(function(c){ return c.aktif; }).length, icon:'i-building', href:'app-musteri.html',
        meta:cust.filter(function(c){ return c.durum === 'Aktif'; }).length + ' aktif', metaTone:'flat' },
      { label:'Yeni müşteri adayı', value:leads.filter(function(l){ return l.asama === 'Yeni talep'; }).length, icon:'i-user-plus',
        tone:'info', href:'app-lead.html?t=yeni', meta:openLeads.length + ' açık fırsat', metaTone:'flat' },
      { label:'Referansla gelen', value:refLeads.length, icon:'i-percent', tone:'purple', href:'app-referans.html',
        meta:'Dönüşüm %' + Math.round(refLeads.filter(function(l){ return l.asama === 'Kazanıldı'; }).length / Math.max(1, refLeads.length) * 100), metaTone:'up' },
      { label:'Satış pipeline', value:F.moneyK(pipelineValue), icon:'i-funnel', tone:'ok', href:'app-pipeline.html',
        meta:'Ağırlıklı ' + F.moneyK(weighted), metaTone:'flat' }
    ]) + kpiGrid([
      { label:'Bekleyen teklif', value:openQuotes.length, icon:'i-quote', tone:'warn', href:'app-teklif.html',
        meta:F.moneyK(openQuotes.reduce(function(s,q){ return s + q.toplam; }, 0)), metaTone:'flat' },
      { label:'Aylık satış tahmini', value:F.moneyK(weighted / 3), icon:'i-trend-up', tone:'ok',
        meta:'Ağırlıklı pipeline / 3 ay', metaTone:'flat' },
      { label:'Aktif proje', value:proj.filter(activeProject).length, icon:'i-briefcase', href:'app-proje.html',
        meta:proj.filter(function(p){ return p.saglik === 'Riskli'; }).length + ' riskli', metaTone:'down' },
      { label:'Geciken proje', value:proj.filter(lateProject).length, icon:'i-alert', tone:'danger', href:'app-proje.html',
        meta:'Teslim tarihi geçti', metaTone:'down' }
    ]) + kpiGrid([
      { label:'Geciken görev', value:tasks.filter(lateTask).length, icon:'i-tasks', tone:'danger', href:'app-gorev.html?t=geciken' },
      { label:'Riskli müşteri', value:riskCust.length, icon:'i-alert-circle', tone:'danger', href:'app-musteri.html?t=riskli',
        meta:'Memnuniyet veya ödeme riski', metaTone:'down' },
      { label:'Geciken tahsilat', value:F.moneyK(latePay.reduce(function(s,p){ return s + p.tutar; }, 0)), icon:'i-wallet',
        tone:'danger', href:'app-tahsilat.html', meta:latePay.length + ' fatura', metaTone:'down' },
      { label:'Personel kapasitesi', value:'%' + avgLoad, icon:'i-users', tone:avgLoad > 90 ? 'danger' : avgLoad > 80 ? 'warn' : 'ok',
        href:'app-kapasite.html', meta:capacity.filter(function(c){ return c.doluluk >= 95; }).length + ' kişi aşırı yüklü', metaTone:'down' }
    ]) + kpiGrid([
      { label:'Satın alma onayı', value:purchApproval.length, icon:'i-cart', tone:'warn', href:'app-satinalma.html?t=onay',
        meta:F.moneyK(purchApproval.reduce(function(s,a){ return s + (a.tutar || 0); }, 0)), metaTone:'flat' },
      { label:'Araç ve demirbaş uyarısı', value:maintWarn.length + inspWarn.length, icon:'i-car', tone:'warn', href:'app-arac-bakim.html',
        meta:maintWarn.length + ' bakım · ' + inspWarn.length + ' muayene', metaTone:'flat' },
      { label:'Sigorta / kasko yenilemesi', value:policyWarn.length, icon:'i-shield', tone:'warn', href:'app-arac-sigorta.html',
        meta:'60 gün içinde', metaTone:'flat' },
      { label:'Açık destek kaydı', value:DB.tickets.filter(GV.destek.acik).length,
        icon:'i-support', tone:'info', href:'app-destek.html',
        meta:DB.tickets.filter(function(t){ return t.slaDurum === 'Risk altında'; }).length + ' SLA riski', metaTone:'down' }
    ]);

    /* Departman iş yükleri */
    var depLoad = {};
    tasks.filter(openTask).forEach(function(t){ if(t.dep) depLoad[t.dep] = (depLoad[t.dep] || 0) + 1; });
    var depRows = Object.keys(depLoad).sort(function(a,b){ return depLoad[b] - depLoad[a]; }).slice(0, 8).map(function(d){
      var max = Math.max.apply(null, Object.keys(depLoad).map(function(k){ return depLoad[k]; }));
      return row([
        { html:'<span class="cell-main">' + esc(DB.depName(d)) + '</span>' },
        { html:GV.progress(Math.round(depLoad[d] / max * 100), { tone:'' }) },
        { html:'<b class="u-num">' + depLoad[d] + '</b> açık iş', cls:'num' }
      ]);
    });

    html += '<div class="gv-grid gv-grid-main u-mt-8">' +
      '<div class="u-col">' + pendingApprovals(6) + lateTasksCard() +
        card({ title:'Riskli Müşteriler', icon:'i-alert-circle', link:'app-musteri.html', flush:true,
          body:rows(riskCust.map(function(c){
            return row([
              { html:link('app-musteri-detay.html?id=' + c.kod, c.unvan, c.sektor + ' · ' + c.kod) },
              { html:c.memnuniyet != null ? '<span class="u-b">' + c.memnuniyet + ' / 5</span>' : '<span class="u-faint">—</span>' },
              { html:'<span class="cell-money">' + F.money(c.bekleyenTahsilat) + '</span>', cls:'num' },
              { html:GV.badge(c.durum === 'Riskli' ? 'Riskli' : 'Aktif') },
              { html:GV.user(c.sorumlu, { sm:true }) }
            ]);
          }), { icon:'i-check-circle', title:'Riskli müşteri yok', desc:'Tüm müşteri ilişkileri sağlıklı.' }) }) +
      '</div>' +
      '<div class="u-col">' +
        card({ title:'Departman İş Yükü', icon:'i-users', link:'app-kapasite.html', flush:true, body:rows(depRows) }) +
        agendaCard() + activityCard() +
      '</div></div>';

    return html;
  }

  /* ---------------------------------------------------------------
     2. SATIŞ DASHBOARD (§7 — 12 kalem)
     --------------------------------------------------------------- */
  function dashSatis(s){
    var mine = function(l){ return l.sorumlu === s.emp || s.rol === 'satismudur' || s.rol === 'sahip'; };
    var leads = DB.leads.filter(mine);
    var open = leads.filter(openLead);
    var today = DB.interactions.filter(function(i){ return String(i.tarih).slice(0,10) === T(); });
    var nextActions = open.filter(function(l){ return l.sonrakiTarih; })
      .sort(function(a,b){ return a.sonrakiTarih.localeCompare(b.sonrakiTarih); });
    var stale = open.filter(function(l){
      var st = DB.pipelineStages.filter(function(x){ return x.key === l.asama; })[0];
      return st && l.sonIletisim && Math.abs(days(l.sonIletisim)) > st.maxGun;
    });
    var won = leads.filter(function(l){ return l.asama === 'Kazanıldı'; });
    var lost = leads.filter(function(l){ return l.asama === 'Kaybedildi'; });
    var refLeads = leads.filter(function(l){ return l.kaynak === 'Referans'; });
    var quoteWait = open.filter(function(l){ return ['Fiyatlandırma','Teklif hazırlanıyor'].indexOf(l.asama) !== -1; });
    var target = 4000000;
    var wonValue = won.reduce(function(a,l){ return a + l.butce; }, 0);
    var weighted = open.reduce(function(a,l){
      var st = DB.pipelineStages.filter(function(x){ return x.key === l.asama; })[0];
      return a + l.butce * ((st ? st.olasilik : 0) / 100);
    }, 0);

    var html = kpiGrid([
      { label:'Yeni müşteri adayı', value:leads.filter(function(l){ return l.asama === 'Yeni talep'; }).length, icon:'i-user-plus', href:'app-lead.html?t=yeni' },
      { label:'Bugünkü görüşme', value:today.length, icon:'i-phone', tone:'info', href:'app-ajanda.html' },
      { label:'Sonraki aksiyon', value:nextActions.length, icon:'i-flag', tone:'warn', href:'app-lead.html',
        meta:nextActions.filter(function(l){ return days(l.sonrakiTarih) < 0; }).length + ' gecikti', metaTone:'down' },
      { label:'Referansla gelen talep', value:refLeads.length, icon:'i-percent', tone:'purple', href:'app-referans.html' }
    ]) + kpiGrid([
      { label:'Teklif bekleyen müşteri', value:quoteWait.length, icon:'i-quote', tone:'warn', href:'app-teklif.html' },
      { label:'İşlem yapılmayan fırsat', value:stale.length, icon:'i-hourglass', tone:'danger', href:'app-lead.html',
        meta:'Aşama süresi aşıldı', metaTone:'down' },
      { label:'Kazanılan satış', value:won.length, icon:'i-check-circle', tone:'ok',
        meta:F.moneyK(wonValue), metaTone:'up' },
      { label:'Kaybedilen satış', value:lost.length, icon:'i-x-circle', tone:'danger',
        meta:'Dönüşüm %' + Math.round(won.length / Math.max(1, won.length + lost.length) * 100), metaTone:'flat' }
    ]) + kpiGrid([
      { label:'Satış hedefi', value:F.moneyK(target), icon:'i-target',
        meta:'Yıllık hedef', metaTone:'flat' },
      { label:'Hedef gerçekleşme', value:'%' + Math.round(wonValue / target * 100), icon:'i-trend-up', tone:'ok',
        meta:F.moneyK(wonValue) + ' kazanıldı', metaTone:'up' },
      { label:'Tahmini ciro', value:F.moneyK(weighted), icon:'i-wallet', tone:'info',
        meta:'Ağırlıklı pipeline', metaTone:'flat' },
      { label:'Referans dönüşüm oranı', value:'%' + Math.round(refLeads.filter(function(l){ return l.asama === 'Kazanıldı'; }).length / Math.max(1, refLeads.length) * 100),
        icon:'i-percent', tone:'purple', href:'app-rapor-referans.html' }
    ]);

    /* Pipeline hunisi */
    var funnel = DB.pipelineStages.filter(function(st){ return st.sira <= 12; }).map(function(st){
      return { label:st.key.length > 14 ? st.key.slice(0,13) + '…' : st.key,
               value:open.filter(function(l){ return l.asama === st.key; }).length };
    }).filter(function(d){ return d.value > 0; });

    html += '<div class="gv-grid gv-grid-main u-mt-8">' +
      '<div class="u-col">' +
        card({ title:'Sonraki Aksiyonlar', icon:'i-flag', sub:'Tarihe göre sıralı', link:'app-lead.html', flush:true,
          body:rows(nextActions.slice(0, 8).map(function(l){
            return row([
              { html:link('app-lead-detay.html?id=' + l.kod, l.firma, l.sonrakiAksiyon) },
              { html:GV.badge(l.asama) },
              { html:'<span class="cell-money">' + F.money(l.butce) + '</span>', cls:'num' },
              { html:GV.dateCell(l.sonrakiTarih) }
            ], { cls:days(l.sonrakiTarih) < 0 ? 'is-late' : '' });
          })) }) +
        card({ title:'Uzun Süredir İşlem Yapılmayan Fırsatlar', icon:'i-hourglass', link:'app-lead.html', flush:true,
          body:rows(stale.slice(0, 6).map(function(l){
            return row([
              { html:link('app-lead-detay.html?id=' + l.kod, l.firma, l.kod) },
              { html:GV.badge(l.asama) },
              { html:'<span class="cell-date is-late">' + Math.abs(days(l.sonIletisim)) + ' gündür sessiz</span>' },
              { html:GV.user(l.sorumlu, { sm:true }) }
            ]);
          }), { icon:'i-check-circle', title:'Tıkanan fırsat yok', desc:'Tüm fırsatlar aşama süresi içinde ilerliyor.' }) }) +
      '</div>' +
      '<div class="u-col">' +
        card({ title:'Pipeline Dağılımı', icon:'i-funnel', link:'app-pipeline.html',
          body:funnel.length ? GV.chart.bar(funnel, { height:230, showValues:true }) : GV.empty({ icon:'i-funnel', title:'Açık fırsat yok' }) }) +
        card({ title:'Bugünkü Görüşmeler', icon:'i-phone', link:'app-musteri-iletisim.html', flush:true,
          body:rows(today.map(function(i){
            return row([
              { html:'<span class="cell-main">' + esc(i.konu) + '</span><span class="cell-sub">' + esc(DB.interactionContact(i)) + '</span>' },
              { html:'<span class="tag">' + esc(i.tur) + '</span>' },
              { html:'<span class="cell-date">' + String(i.tarih).slice(11,16) + '</span>' }
            ]);
          }), { icon:'i-phone', title:'Bugün görüşme yok', desc:'Ajandanızda bugüne planlı görüşme bulunmuyor.' }) }) +
        agendaCard() +
      '</div></div>';

    return html;
  }

  /* ---------------------------------------------------------------
     3. PROJE YÖNETİCİSİ DASHBOARD (§7 — 11 kalem)
     --------------------------------------------------------------- */
  function dashPm(s){
    var proj = DB.projects.filter(function(p){ return activeProject(p) && (p.pm === s.emp || s.rol === 'sahip' || s.rol === 'operasyon'); });
    var codes = proj.map(function(p){ return p.kod; });
    var tasks = DB.tasks.filter(function(t){ return !t.proje || codes.indexOf(t.proje) !== -1; });
    var blocked = tasks.filter(function(t){ return t.durum === 'Engellendi'; });
    var control = tasks.filter(function(t){ return t.durum === 'Kontrolde'; });
    /* REVİZE 01 — bekleme artık DURUM değil, ayrı eksen. Eskiden iki durum
       değerine bakılıyordu ve o değerler veride HİÇ kullanılmadığı için bu
       sayaç her zaman sıfırdı; şimdi gerçek bekleme kayıtlarını sayıyor. */
    var waitCust = tasks.filter(function(t){ return !!t.beklemeNedeni; });
    var deptReq = DB.deptRequests.filter(function(r){ return r.durum !== 'Tamamlandı'; });
    var upcoming = DB.milestones.filter(function(m){ return codes.indexOf(m.proje) !== -1 && m.durum !== 'Tamamlandı'; })
      .sort(function(a,b){ return a.tarih.localeCompare(b.tarih); });
    /* REVİZE 04 — bütçe aşımı türetilen maliyetten okunur; ölçülemeyen proje
       ne aşan ne aşmayan sayılır (bkz. süre sapmasındaki aynı kural). */
    var pMal = function(p){ return GV.proje.maliyet(p.kod); };
    var budgetDev = proj.filter(function(p){ var m = pMal(p); return m.kapsam && m.toplam > p.butce; });
    /* REVİZE 03 — süre sapması artık ZAMAN DEFTERİNDEN türetilir; `harcananSure`
       alanı kaldırıldı. Defteri olmayan proje sapma saymaz: ölçülmemiş bir
       projeyi "plan dahilinde" göstermek de "aşımda" göstermek de yanlış olurdu. */
    var pSure = function(p){ return GV.proje.sure(p.kod); };
    var timeDev = proj.filter(function(p){ var s = pSure(p); return s.kapsam && s.gerceklesen > p.tahminiSure; });
    var risks = proj.reduce(function(a,p){ return a.concat((p.riskler || []).map(function(r){ return { p:p, r:r }; })); }, []);

    var html = kpiGrid([
      { label:'Aktif proje', value:proj.length, icon:'i-briefcase', href:'app-proje.html',
        meta:proj.filter(function(p){ return p.saglik === 'İyi'; }).length + ' sağlıklı', metaTone:'up' },
      { label:'Yaklaşan teslim', value:upcoming.filter(function(m){ return days(m.tarih) >= 0 && days(m.tarih) <= 30; }).length,
        icon:'i-milestone', tone:'warn', href:'app-proje-milestone.html' },
      { label:'Geciken görev', value:tasks.filter(lateTask).length, icon:'i-alert', tone:'danger', href:'app-gorev.html?t=geciken' },
      { label:'Engellenen görev', value:blocked.length, icon:'i-lock', tone:'danger', href:'app-gorev.html?t=engel' }
    ]) + kpiGrid([
      { label:'Kontrol bekleyen', value:control.length, icon:'i-clipboard-check', tone:'purple', href:'app-gorev.html?t=kontrol' },
      { label:'Beklemedeki görev', value:waitCust.length, icon:'i-hourglass', tone:'warn', href:'app-gorev.html' },
      { label:'Departmanlar arası talep', value:deptReq.length, icon:'i-arrow-right', tone:'info', href:'app-istalebi.html' },
      { label:'Personel iş yükü', value:'%' + Math.round(DB.capacity.reduce(function(a,c){ return a + c.doluluk; }, 0) / DB.capacity.length),
        icon:'i-users', href:'app-kapasite.html',
        meta:DB.capacity.filter(function(c){ return c.doluluk >= 95; }).length + ' kişi kritik', metaTone:'down' }
    ]) + kpiGrid([
      { label:'Bütçe sapması', value:budgetDev.length, icon:'i-wallet', tone:budgetDev.length ? 'danger' : 'ok', href:'app-butce.html',
        meta:budgetDev.length ? F.moneyK(budgetDev.reduce(function(a,p){ return a + (pMal(p).toplam - p.butce); }, 0)) + ' aşım' : 'Bütçe içinde',
        metaTone:budgetDev.length ? 'down' : 'up' },
      { label:'Süre sapması', value:timeDev.length, icon:'i-timer', tone:timeDev.length ? 'warn' : 'ok',
        meta:timeDev.length ? Math.round(timeDev.reduce(function(a,p){ return a + (pSure(p).gerceklesen - p.tahminiSure); }, 0)) + ' saat aşım' : 'Plan dahilinde',
        metaTone:timeDev.length ? 'down' : 'up' },
      { label:'Proje riski', value:risks.length, icon:'i-alert-circle', tone:'warn' },
      { label:'Riskli proje', value:proj.filter(function(p){ return p.saglik === 'Riskli'; }).length, icon:'i-flag', tone:'danger', href:'app-proje.html' }
    ]);

    html += '<div class="gv-grid gv-grid-main u-mt-8">' +
      '<div class="u-col">' +
        card({ title:'Proje Sağlık Durumu', icon:'i-briefcase', link:'app-proje.html', flush:true,
          body:rows(proj.map(function(p){
            return row([
              { html:link('app-proje-detay.html?id=' + p.kod, p.ad, p.musteriAd + ' · ' + p.kod) },
              { html:GV.progress(p.ilerleme) },
              { html:GV.badge(p.saglik === 'İyi' ? 'Zamanında' : p.saglik === 'Riskli' ? 'Gecikti' : 'Yaklaşıyor') },
              { html:GV.dateCell(p.planlananBitis) }
            ], { cls:lateProject(p) ? 'is-late' : '' });
          })) }) +
        lateTasksCard(function(t){ return !t.proje || codes.indexOf(t.proje) !== -1; }) +
        card({ title:'Engellenen ve Kontrol Bekleyen İşler', icon:'i-lock', link:'app-gorev.html', flush:true,
          body:rows(blocked.concat(control).slice(0, 8).map(function(t){
            return row([
              { html:link('app-gorev-detay.html?id=' + t.kod, t.baslik, t.engelNedeni || t.kod) },
              { html:GV.user(t.sorumlu, { sm:true }) },
              { html:GV.badge(t.durum) },
              { html:GV.dateCell(t.termin) }
            ]);
          }), { icon:'i-check-circle', title:'Engellenen iş yok' }) }) +
      '</div>' +
      '<div class="u-col">' +
        card({ title:'Yaklaşan Milestone', icon:'i-milestone', link:'app-proje-milestone.html', flush:true,
          body:rows(upcoming.slice(0, 6).map(function(m){
            return row([
              { html:link('app-proje-detay.html?id=' + m.proje + '#milestone', m.ad, m.proje) },
              { html:GV.dateCell(m.tarih) },
              { html:GV.badge(m.durum) }
            ], { cls:m.durum === 'Gecikti' ? 'is-late' : '' });
          })) }) +
        card({ title:'Proje Riskleri', icon:'i-alert-circle', flush:true,
          body:rows(risks.slice(0, 8).map(function(x){
            return row([
              { html:'<span class="cell-main">' + esc(x.r) + '</span><span class="cell-sub">' + esc(x.p.ad) + '</span>' }
            ]);
          }), { icon:'i-check-circle', title:'Kayıtlı risk yok' }) }) +
        activityCard() +
      '</div></div>';

    return html;
  }

  /* ---------------------------------------------------------------
     4. PERSONEL DASHBOARD (§7 — 12 kalem)
     --------------------------------------------------------------- */
  function dashPersonel(s){
    var mine = DB.tasks.filter(function(t){ return t.sorumlu === s.emp || (t.yardimci || []).indexOf(s.emp) !== -1; });
    var open = mine.filter(openTask);
    var todayTasks = open.filter(function(t){ return t.termin === T(); });
    var soon = open.filter(function(t){ return t.termin && days(t.termin) > 0 && days(t.termin) <= 7; });
    var control = DB.tasks.filter(function(t){ return t.kontrolEden === s.emp && t.durum === 'Kontrolde'; });
    var unread = DB.channels.reduce(function(a,c){ return a + c.okunmamis; }, 0);
    var myLeave = DB.leaves.filter(function(l){ return l.personel === s.emp; });
    var emp = DB.emp(s.emp) || {};
    var myLogs = DB.timelogs.filter(function(l){ return l.personel === s.emp; });
    var weekHours = myLogs.reduce(function(a,l){ return a + l.sure; }, 0);
    var myAssets = DB.assets.filter(function(a){ return a.zimmetli === s.emp; });
    var cap = DB.capacity.filter(function(c){ return c.personel === s.emp; })[0] || { doluluk:0 };
    var perf = DB.performance.filter(function(p){ return p.personel === s.emp && p.durum === 'Tamamlandı'; })[0];
    var myMeetings = DB.meetings.filter(function(m){ return m.katilimci.indexOf(s.emp) !== -1 && m.durum === 'Planlandı'; });

    var html = kpiGrid([
      { label:'Bana verilen görev', value:open.length, icon:'i-inbox', href:'app-gorev.html?t=bana' },
      { label:'Bugünkü görev', value:todayTasks.length, icon:'i-sun', tone:'info', href:'app-gorev.html?t=bana' },
      { label:'Geciken görev', value:mine.filter(lateTask).length, icon:'i-alert', tone:'danger', href:'app-gorev.html?t=geciken' },
      { label:'Yaklaşan iş', value:soon.length, icon:'i-clock', tone:'warn', meta:'7 gün içinde', metaTone:'flat' }
    ]) + kpiGrid([
      { label:'Kontrol bekleyen teslim', value:control.length, icon:'i-clipboard-check', tone:'purple', href:'app-gorev.html?t=kontrol' },
      { label:'Okunmamış mesaj', value:unread, icon:'i-chat', tone:'info', href:'app-sohbet.html' },
      { label:'Departman duyurusu', value:DB.announcements.length, icon:'i-megaphone', href:'app-panel-duyurular.html' },
      { label:'Toplantı', value:myMeetings.length, icon:'i-calendar', href:'app-ajanda.html', meta:'Planlı', metaTone:'flat' }
    ]) + kpiGrid([
      { label:'Bu hafta zaman kaydı', value:F.hours(weekHours), icon:'i-timer', tone:weekHours >= 40 ? 'ok' : 'warn',
        href:'app-zaman.html', meta:weekHours < 40 ? (40 - weekHours) + ' saat eksik' : 'Tamamlandı', metaTone:weekHours < 40 ? 'down' : 'up' },
      { label:'İzin bakiyesi', value:(emp.izinBakiye || 0) + ' gün', icon:'i-calendar-check', tone:'ok', href:'app-izin.html',
        meta:myLeave.filter(function(l){ return l.durum === 'Onay bekliyor'; }).length + ' talep bekliyor', metaTone:'flat' },
      { label:'Zimmetim', value:myAssets.length, icon:'i-package', href:'app-zimmet.html',
        meta:F.moneyK(myAssets.reduce(function(a,x){ return a + x.alisFiyati; }, 0)), metaTone:'flat' },
      { label:'Doluluk oranım', value:'%' + cap.doluluk, icon:'i-chart-bar', tone:cap.doluluk >= 95 ? 'danger' : cap.doluluk >= 85 ? 'warn' : 'ok',
        meta:perf ? 'Performans ' + perf.yoneticiDegerlendirme + '/5' : 'Performans dönemi açık', metaTone:'flat' }
    ]);

    html += '<div class="gv-grid gv-grid-main u-mt-8">' +
      '<div class="u-col">' +
        card({ title:'Bana Verilen Görevler', icon:'i-inbox', sub:open.length + ' açık görev', link:'app-gorev.html?t=bana', flush:true,
          body:rows(open.slice(0, 8).map(function(t){
            return row([
              { html:link('app-gorev-detay.html?id=' + t.kod, t.baslik, t.kod + (t.proje ? ' · ' + t.proje : '')) },
              { html:GV.pri(t.oncelik) },
              { html:GV.dateCell(t.termin) },
              { html:GV.badge(t.durum) },
              { html:GV.progress(t.ilerleme) }
            ], { cls:lateTask(t) ? 'is-late' : '' });
          }), { icon:'i-check-circle', title:'Açık göreviniz yok', desc:'Şu an size atanmış bekleyen bir iş bulunmuyor.' }) }) +
        card({ title:'Bu Haftaki Zaman Kayıtlarım', icon:'i-timer', link:'app-zaman.html', flush:true,
          body:rows(myLogs.slice(0, 6).map(function(l){
            return row([
              { html:'<span class="cell-main">' + esc(l.aciklama) + '</span><span class="cell-sub">' + (l.proje || 'Proje dışı') + '</span>' },
              { html:'<span class="u-num u-b">' + F.hours(l.sure) + '</span>', cls:'num' },
              { html:l.faturalanabilir ? GV.badge('Aktif').replace('Aktif','Faturalanabilir') : '<span class="tag">İç iş</span>' },
              { html:GV.badge(l.onay === 'Onaylandı' ? 'Onaylandı' : 'Bekliyor') }
            ]);
          }), { icon:'i-timer', title:'Zaman kaydı yok', desc:'Bu hafta için henüz kayıt girmediniz.' }) }) +
      '</div>' +
      '<div class="u-col">' +
        card({ title:'Duyurular', icon:'i-megaphone', link:'app-panel-duyurular.html', flush:true,
          body:rows(DB.announcements.slice(0, 4).map(function(a){
            return row([
              { html:'<span class="cell-main">' + esc(a.baslik) + '</span><span class="cell-sub">' + esc(a.ozet) + '</span>' },
              { html:'<span class="cell-date">' + F.dateShort(a.tarih) + '</span>' }
            ]);
          })) }) +
        agendaCard() +
        card({ title:'Zimmetlerim', icon:'i-package', link:'app-zimmet.html', flush:true,
          body:rows(myAssets.map(function(a){
            return row([
              { html:'<span class="cell-main">' + esc(a.marka + ' ' + a.model) + '</span><span class="cell-sub">' + a.kod + '</span>' },
              { html:'<span class="tag">' + esc(a.kategori) + '</span>' },
              { html:'<span class="cell-date">' + F.date(a.zimmetTarihi) + '</span>' }
            ]);
          }), { icon:'i-package', title:'Zimmetli ekipman yok' }) }) +
      '</div></div>';

    return html;
  }

  /* ---------------------------------------------------------------
     5. İNSAN KAYNAKLARI DASHBOARD (§7 — 9 kalem)
     --------------------------------------------------------------- */
  function dashIk(){
    var emps = DB.employees.filter(function(e){ return e.aktif; });
    var leaveReq = DB.leaves.filter(function(l){ return l.durum === 'Onay bekliyor'; });
    var missingDocs = DB.documents.filter(function(d){ return d.kalanGun != null && d.kalanGun <= 30 && /Personel/.test(d.klasor); });
    var newHires = emps.filter(function(e){ return days(e.girisTarihi) > -90; });
    var perfOpen = DB.performance.filter(function(p){ return p.durum === 'Açık'; });
    var trainings = DB.trainings.filter(function(t){ return t.durum === 'Planlandı'; });
    var avgLoad = Math.round(DB.capacity.reduce(function(a,c){ return a + c.doluluk; }, 0) / DB.capacity.length);
    var returnCheck = DB.assignments.filter(function(a){ return a.durum === 'Aktif' && a.personelOnay === 'Bekliyor'; });

    var html = kpiGrid([
      { label:'Aktif personel', value:emps.length, icon:'i-users', href:'app-personel.html',
        meta:DB.departments.filter(function(d){ return d.aktif; }).length + ' departman', metaTone:'flat' },
      { label:'İzin talebi', value:leaveReq.length, icon:'i-calendar-check', tone:'warn', href:'app-izin.html' },
      { label:'Eksik / süresi dolan belge', value:missingDocs.length, icon:'i-file', tone:missingDocs.length ? 'danger' : 'ok', href:'app-dokuman-sure.html' },
      { label:'Yaklaşan işe giriş', value:newHires.length, icon:'i-user-plus', tone:'info', href:'app-personel.html',
        meta:'Son 90 gün', metaTone:'flat' }
    ]) + kpiGrid([
      { label:'İşten çıkış süreci', value:0, icon:'i-logout', tone:'neutral', meta:'Devam eden yok', metaTone:'flat' },
      { label:'Açık performans dönemi', value:perfOpen.length, icon:'i-award', tone:'purple', href:'app-performans.html' },
      { label:'Planlı eğitim', value:trainings.length, icon:'i-graduation', tone:'info', href:'app-egitim.html',
        meta:F.moneyK(trainings.reduce(function(a,t){ return a + t.maliyet; }, 0)) + ' bütçe', metaTone:'flat' },
      { label:'Personel kapasitesi', value:'%' + avgLoad, icon:'i-chart-bar', tone:avgLoad > 90 ? 'danger' : 'ok', href:'app-kapasite.html' }
    ]) + kpiGrid([
      { label:'Zimmet iade kontrolü', value:returnCheck.length, icon:'i-clipboard-check', tone:returnCheck.length ? 'warn' : 'ok', href:'app-zimmet.html',
        meta:'İmza bekleyen tutanak', metaTone:'flat' },
      { label:'Toplam zimmetli varlık', value:DB.assets.filter(function(a){ return a.durum === 'Zimmetli'; }).length, icon:'i-package', href:'app-zimmet.html' },
      { label:'Bu ay izinli gün', value:DB.leaves.filter(function(l){ return l.durum === 'Onaylandı' && String(l.baslangic).slice(0,7) === T().slice(0,7); })
          .reduce(function(a,l){ return a + l.gun; }, 0), icon:'i-calendar', tone:'info', href:'app-izin.html' },
      { label:'Ortalama performans', value:(function(){
          var done = DB.performance.filter(function(p){ return p.durum === 'Tamamlandı'; });
          return done.length ? (done.reduce(function(a,p){ return a + p.yoneticiDegerlendirme; }, 0) / done.length).toFixed(1) + ' / 5' : '—';
        })(), icon:'i-star', tone:'ok', href:'app-performans.html' }
    ]);

    html += '<div class="gv-grid gv-grid-main u-mt-8">' +
      '<div class="u-col">' +
        card({ title:'Onay Bekleyen İzin Talepleri', icon:'i-calendar-check', link:'app-izin.html', flush:true,
          body:rows(leaveReq.map(function(l){
            return row([
              { html:link('app-izin-detay.html?id=' + l.kod, DB.empName(l.personel), l.tur + ' · ' + l.gun + ' gün') },
              { html:'<span class="cell-date">' + F.dateShort(l.baslangic) + ' – ' + F.dateShort(l.bitis) + '</span>' },
              { html:l.vekil ? GV.user(l.vekil, { sm:true }) : '<span class="u-faint">Vekil yok</span>' },
              { html:l.cakisma ? GV.badge('Riskli') : GV.badge('Zamanında') }
            ]);
          }), { icon:'i-check-circle', title:'Bekleyen izin talebi yok' }) }) +
        card({ title:'Personel Doluluk Oranları', icon:'i-chart-bar', link:'app-kapasite.html', flush:true,
          body:rows(DB.capacity.slice().sort(function(a,b){ return b.doluluk - a.doluluk; }).map(function(c){
            return row([
              { html:GV.user(c.personel, { sm:true }) },
              { html:GV.progress(c.doluluk, { tone:c.doluluk >= 95 ? 'danger' : c.doluluk >= 85 ? 'warn' : '' }) },
              { html:'<span class="u-num u-sm u-muted">' + c.planlanan + ' / ' + c.kapasite + ' sa</span>', cls:'num' }
            ]);
          })) }) +
      '</div>' +
      '<div class="u-col">' +
        card({ title:'Süresi Dolan Belgeler', icon:'i-file', link:'app-dokuman-sure.html', flush:true,
          body:rows(DB.documents.filter(function(d){ return d.kalanGun != null && d.kalanGun <= 40; }).map(function(d){
            return row([
              { html:'<span class="cell-main">' + esc(d.ad) + '</span><span class="cell-sub">' + esc(d.tur) + '</span>' },
              { html:'<span class="cell-date ' + (d.kalanGun <= 15 ? 'is-late' : 'is-soon') + '">' + d.kalanGun + ' gün</span>' }
            ]);
          }), { icon:'i-check-circle', title:'Süresi dolan belge yok' }) }) +
        card({ title:'Planlı Eğitimler', icon:'i-graduation', link:'app-egitim.html', flush:true,
          body:rows(DB.trainings.map(function(t){
            return row([
              { html:'<span class="cell-main">' + esc(t.ad) + '</span><span class="cell-sub">' + esc(t.saglayici) + '</span>' },
              { html:'<span class="u-sm">' + t.katilimci.length + ' kişi</span>' },
              { html:GV.badge(t.durum === 'Tamamlandı' ? 'Tamamlandı' : 'Planlandı') }
            ]);
          })) }) +
        activityCard() +
      '</div></div>';

    return html;
  }

  /* ---------------------------------------------------------------
     6. SATIN ALMA VE İDARİ İŞLER DASHBOARD (§7 — 10 kalem)
     --------------------------------------------------------------- */
  function dashSatinalma(){
    var pr = DB.purchases;
    var newReq = pr.filter(function(p){ return p.durum === 'Taslak' || p.durum === 'Onay bekliyor'; });
    var waitApproval = pr.filter(function(p){ return p.durum === 'Onay bekliyor'; });
    var waitQuote = pr.filter(function(p){ return p.durum === 'Teklif bekleniyor' || (p.durum === 'Onay bekliyor' && !DB.supplierQuotes.some(function(q){ return q.talep === p.kod; })); });
    var lateOrders = DB.orders.filter(function(o){ return o.durum === 'Sipariş verildi' && days(o.teslimTarihi) < 0; });
    var waitAssign = DB.assets.filter(function(a){ return a.durum === 'Depoda'; });
    var maintSoon = DB.maintenance.filter(function(m){ return m.durum === 'Yaklaşıyor' || m.durum === 'Serviste'; });
    var inspSoon = DB.inspections.filter(function(i){ return i.kalanGun <= 60; });
    var policySoon = DB.policies.filter(function(p){ return p.kalanGun <= 60; });
    var warrantyEnd = DB.assets.filter(function(a){ return a.garantiBit && days(a.garantiBit) >= 0 && days(a.garantiBit) <= 90; });
    var licenseRenew = DB.assets.filter(function(a){ return (a.kategori === 'Yazılım lisansı' || a.kategori === 'Kurumsal abonelik') && a.garantiBit && days(a.garantiBit) <= 60; });

    var html = kpiGrid([
      { label:'Yeni satın alma talebi', value:newReq.length, icon:'i-cart', href:'app-satinalma.html',
        meta:F.moneyK(newReq.reduce(function(a,p){ return a + p.tahminiMaliyet; }, 0)), metaTone:'flat' },
      { label:'Onay bekleyen talep', value:waitApproval.length, icon:'i-stamp', tone:'warn', href:'app-satinalma.html?t=onay' },
      { label:'Teklif bekleyen', value:waitQuote.length, icon:'i-quote', tone:'info', href:'app-satinalma-teklif.html' },
      { label:'Geciken sipariş', value:lateOrders.length, icon:'i-truck', tone:lateOrders.length ? 'danger' : 'ok', href:'app-siparis.html' }
    ]) + kpiGrid([
      { label:'Zimmet bekleyen ekipman', value:waitAssign.length, icon:'i-package', tone:'info', href:'app-demirbas.html' },
      { label:'Bakımı yaklaşan araç', value:maintSoon.length, icon:'i-wrench', tone:'warn', href:'app-arac-bakim.html' },
      { label:'Muayenesi yaklaşan araç', value:inspSoon.length, icon:'i-clipboard', tone:'warn', href:'app-arac-muayene.html' },
      { label:'Sigorta / kasko yenilemesi', value:policySoon.length, icon:'i-shield', tone:'warn', href:'app-arac-sigorta.html' }
    ]) + kpiGrid([
      { label:'Garanti bitişi', value:warrantyEnd.length, icon:'i-shield-check', tone:'info', href:'app-demirbas.html',
        meta:'90 gün içinde', metaTone:'flat' },
      { label:'Lisans yenileme', value:licenseRenew.length, icon:'i-key', tone:'warn', href:'app-demirbas.html',
        meta:'60 gün içinde', metaTone:'flat' },
      { label:'Aktif tedarikçi', value:DB.suppliers.filter(function(s){ return s.durum === 'Aktif'; }).length, icon:'i-building', href:'app-tedarikci.html' },
      { label:'Bu yıl satın alma', value:F.moneyK(DB.orders.reduce(function(a,o){ return a + o.toplam; }, 0)), icon:'i-wallet', tone:'ok', href:'app-siparis.html' }
    ]);

    html += '<div class="gv-grid gv-grid-main u-mt-8">' +
      '<div class="u-col">' +
        card({ title:'Onay Bekleyen Satın Alma Talepleri', icon:'i-cart', link:'app-satinalma.html?t=onay', flush:true,
          body:rows(waitApproval.map(function(p){
            return row([
              { html:link('app-satinalma-detay.html?id=' + p.kod, p.urun, p.kod + ' · ' + DB.empName(p.talepEden)) },
              { html:'<span class="cell-money">' + F.money(p.tahminiMaliyet) + '</span>', cls:'num' },
              { html:GV.pri(p.oncelik) },
              { html:'<span class="u-sm u-muted">' + p.onayAdim + ' / ' + p.onayToplam + ' onay</span>' },
              { html:GV.dateCell(p.ihtiyacTarihi) }
            ]);
          }), { icon:'i-check-circle', title:'Onay bekleyen talep yok' }) }) +
        card({ title:'Araç Uyarıları', icon:'i-car', sub:'Bakım, muayene, sigorta ve kasko', link:'app-arac.html', flush:true,
          body:rows(
            maintSoon.map(function(m){
              var v = DB.vehicles.filter(function(x){ return x.kod === m.arac; })[0] || {};
              return row([
                { html:'<span class="cell-main">' + esc(v.plaka || m.arac) + '</span><span class="cell-sub">' + esc(m.tur) + '</span>' },
                { html:'<span class="tag">Bakım</span>' },
                { html:GV.dateCell(m.planTarihi) },
                { html:GV.badge(m.durum) }
              ], { cls:m.kalanGun < 0 ? 'is-late' : '' });
            }).concat(inspSoon.map(function(i){
              var v = DB.vehicles.filter(function(x){ return x.kod === i.arac; })[0] || {};
              return row([
                { html:'<span class="cell-main">' + esc(v.plaka || i.arac) + '</span><span class="cell-sub">Muayene geçerlilik</span>' },
                { html:'<span class="tag">Muayene</span>' },
                { html:GV.dateCell(i.sonrakiTarih) },
                { html:GV.badge(i.kalanGun <= 30 ? 'Yaklaşıyor' : 'Planlandı') }
              ]);
            })).concat(policySoon.map(function(p){
              var v = DB.vehicles.filter(function(x){ return x.kod === p.arac; })[0] || {};
              return row([
                { html:'<span class="cell-main">' + esc(v.plaka || p.arac) + '</span><span class="cell-sub">' + esc(p.sirket) + '</span>' },
                { html:'<span class="tag">' + esc(p.tur) + '</span>' },
                { html:GV.dateCell(p.bitis) },
                { html:GV.badge(p.kalanGun <= 30 ? 'Yaklaşıyor' : 'Planlandı') }
              ]);
            })),
            { icon:'i-check-circle', title:'Araç uyarısı yok' }) }) +
      '</div>' +
      '<div class="u-col">' +
        card({ title:'Zimmet Bekleyen Ekipman', icon:'i-package', link:'app-demirbas.html', flush:true,
          body:rows(waitAssign.map(function(a){
            return row([
              { html:'<span class="cell-main">' + esc(a.marka + ' ' + a.model) + '</span><span class="cell-sub">' + a.kod + '</span>' },
              { html:'<span class="tag">' + esc(a.kategori) + '</span>' },
              { html:'<span class="cell-money">' + F.money(a.alisFiyati) + '</span>', cls:'num' }
            ]);
          }), { icon:'i-check-circle', title:'Depoda bekleyen ekipman yok' }) }) +
        card({ title:'Lisans ve Garanti Takibi', icon:'i-key', link:'app-demirbas.html', flush:true,
          body:rows(licenseRenew.concat(warrantyEnd).map(function(a){
            return row([
              { html:'<span class="cell-main">' + esc(a.marka + ' ' + a.model) + '</span><span class="cell-sub">' + esc(a.kategori) + '</span>' },
              { html:GV.dateCell(a.garantiBit) },
              { html:'<span class="cell-money">' + F.money(a.alisFiyati) + '</span>', cls:'num' }
            ]);
          }), { icon:'i-check-circle', title:'Yaklaşan yenileme yok' }) }) +
        pendingApprovals(5) +
      '</div></div>';

    return html;
  }

  /* ---------------------------------------------------------------
     7. MÜŞTERİ KULLANICISI (kısıtlı)
     --------------------------------------------------------------- */
  function dashMusteri(){
    return kpiGrid([
      { label:'Açık destek kaydım', value:DB.tickets.filter(GV.destek.acik).length, icon:'i-support', href:'app-destek.html' },
      { label:'Aktif projem', value:1, icon:'i-briefcase' },
      { label:'Bekleyen onayım', value:1, icon:'i-stamp', tone:'warn' },
      { label:'Paylaşılan doküman', value:DB.documents.filter(function(d){ return d.gizlilik !== 'Gizli'; }).length, icon:'i-folder', href:'app-dokuman.html' }
    ]) + '<div class="u-mt-8">' + card({
      title:'Destek Kayıtlarım', icon:'i-support', link:'app-destek.html', flush:true,
      body:rows(DB.tickets.slice(0, 5).map(function(t){
        return row([
          { html:link('app-destek-detay.html?id=' + t.kod, t.baslik, t.kod + ' · ' + t.kategori) },
          { html:GV.pri(t.oncelik) },
          { html:GV.badge(t.durum) },
          { html:'<span class="cell-date">' + F.dt(t.acilis) + '</span>' }
        ]);
      })) }) + '</div>';
  }

  /* ---------------------------------------------------------------
     Yönlendirme
     --------------------------------------------------------------- */
  var VARIANTS = {
    sahip:dashSahip, satis:dashSatis, pm:dashPm,
    personel:dashPersonel, ik:dashIk, satinalma:dashSatinalma, musteri:dashMusteri
  };

  GV.dashboard = function(mountSel){
    var mount = document.querySelector(mountSel);
    if(!mount) return;
    var s = GV.session;
    if(!s) return;
    var role = DB.roles.filter(function(r){ return r.key === s.rol; })[0];
    var variant = (role && role.dash) || 'personel';

    /* yüklenme durumu */
    mount.innerHTML = '<div class="kpi-grid">' +
      '<div class="sk sk-card"></div><div class="sk sk-card"></div><div class="sk sk-card"></div><div class="sk sk-card"></div></div>' +
      '<div class="gv-card u-mt-8">' + GV.skeleton('row', 6) + '</div>';

    setTimeout(function(){
      try{
        var head = document.getElementById('gvGreeting');
        if(head) head.outerHTML = greeting(s);
        mount.innerHTML = (VARIANTS[variant] || dashPersonel)(s);
        document.title = DB.roleName(s.rol) + ' Paneli — GaviaWorks CRM';
      }catch(err){
        mount.innerHTML = GV.errorState({ title:'Panel yüklenemedi', desc:String(err.message || err) });
        var rt = mount.querySelector('[data-retry]');
        if(rt) rt.addEventListener('click', function(){ location.reload(); });
      }
    }, 240);
  };
})();
