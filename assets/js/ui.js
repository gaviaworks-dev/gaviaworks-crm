/* =====================================================================
   GAVIAWORKS CRM — ORTAK BİLEŞEN MOTORU
   Sözlük: tasks/components.md
   Liste bileşeni PROMPT.md §6'nın tamamını tek yerden karşılar.
   ===================================================================== */
(function(){
  'use strict';

  var GV = window.GV = window.GV || {};
  var esc = GV.esc || function(s){ return String(s == null ? '' : s); };
  var ico = GV.ico || function(n){ return '<svg class="ic"><use href="#' + n + '"></use></svg>'; };

  /* ===================================================================
     0. BİÇİMLENDİRME
     =================================================================== */
  var AY = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  var AY_UZUN = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  var GUN = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];

  var Fmt = {
    date:function(iso){
      if(!iso) return '—';
      var p = String(iso).slice(0,10).split('-');
      if(p.length !== 3) return iso;
      return p[2] + '.' + p[1] + '.' + p[0];
    },
    dateShort:function(iso){
      if(!iso) return '—';
      var p = String(iso).slice(0,10).split('-');
      if(p.length !== 3) return iso;
      return parseInt(p[2],10) + ' ' + AY[parseInt(p[1],10) - 1];
    },
    dateLong:function(iso){
      if(!iso) return '—';
      var d = new Date(iso + 'T00:00:00');
      return d.getDate() + ' ' + AY_UZUN[d.getMonth()] + ' ' + d.getFullYear() + ', ' + GUN[d.getDay()];
    },
    dt:function(iso){
      if(!iso) return '—';
      var s = String(iso);
      var d = s.slice(0,10), t = s.slice(11,16);
      return Fmt.date(d) + (t ? ' · ' + t : '');
    },
    num:function(n, dec){
      if(n == null || n === '') return '—';
      return Number(n).toLocaleString('tr-TR', { minimumFractionDigits:dec || 0, maximumFractionDigits:dec == null ? 0 : dec });
    },
    money:function(n, cur){
      if(n == null || n === '') return '—';
      var s = Number(n).toLocaleString('tr-TR', { maximumFractionDigits:0 });
      var c = cur || '₺';
      return c === '₺' ? '₺' + s : s + ' ' + c;
    },
    moneyK:function(n){
      if(n == null) return '—';
      var a = Math.abs(n);
      if(a >= 1000000) return '₺' + (n / 1000000).toLocaleString('tr-TR', { maximumFractionDigits:1 }) + 'M';
      if(a >= 1000) return '₺' + (n / 1000).toLocaleString('tr-TR', { maximumFractionDigits:0 }) + 'B';
      return '₺' + Fmt.num(n);
    },
    pct:function(n){ return (n == null ? '—' : Fmt.num(n) + '%'); },
    hours:function(h){
      if(h == null) return '—';
      var t = Math.round(h * 10) / 10;
      return Fmt.num(t, t % 1 ? 1 : 0) + ' sa';
    },
    /* Bugüne göre gün farkı — mock veri sabit tarih ekseni kullanır */
    days:function(iso, today){
      if(!iso) return null;
      var t = today || (window.DB && DB.today) || '2026-08-03';
      var a = new Date(String(iso).slice(0,10) + 'T00:00:00');
      var b = new Date(t + 'T00:00:00');
      return Math.round((a - b) / 86400000);
    },
    rel:function(iso){
      var d = Fmt.days(iso);
      if(d == null) return '—';
      if(d === 0) return 'bugün';
      if(d === 1) return 'yarın';
      if(d === -1) return 'dün';
      if(d < 0) return (-d) + ' gün gecikti';
      return d + ' gün kaldı';
    },
    initials:function(ad){
      if(!ad) return '—';
      var p = String(ad).trim().split(/\s+/);
      return ((p[0] || '')[0] || '') + ((p[p.length - 1] || '')[0] || '');
    }
  };
  GV.fmt = Fmt;

  /* ===================================================================
     1. DURUM SÖZLÜKLERİ (semantik ton eşlemesi)
     =================================================================== */
  var TONE = {
    /* görev durumları — PROMPT.md §12 (19 durum) */
    'Taslak':'neutral', 'Havuzda':'info', 'Atama bekliyor':'warn', 'Atandı':'info',
    'Kabul bekliyor':'warn', 'Planlandı':'info', 'Başlanmadı':'neutral', 'Devam ediyor':'accent',
    'Bilgi bekliyor':'warn', 'Müşteri bekleniyor':'warn', 'Departman bekleniyor':'warn',
    'Engellendi':'danger', 'Kontrol bekliyor':'purple', 'Revize bekliyor':'warn', 'Revizede':'warn',
    'Onay bekliyor':'purple', 'Tamamlandı':'ok', 'İptal edildi':'neutral', 'Arşivlendi':'neutral',
    /* satış aşamaları — §8.2 (15 aşama) */
    'Yeni talep':'info', 'İlk iletişim':'info', 'Ön görüşme':'info', 'İhtiyaç analizi':'accent',
    'Teknik değerlendirme':'accent', 'Ön analiz hazırlanıyor':'accent', 'Fiyatlandırma':'purple',
    'Teklif hazırlanıyor':'purple', 'Teklif iletildi':'purple', 'Müşteri değerlendirmesinde':'warn',
    'Revize teklif':'warn', 'Sözleşme aşaması':'ok', 'Kazanıldı':'ok', 'Kaybedildi':'danger',
    'Beklemeye alındı':'neutral',
    /* genel */
    'Aktif':'ok', 'Pasif':'neutral', 'Riskli':'danger', 'Potansiyel':'info', 'Arşiv':'neutral',
    'Onaylandı':'ok', 'Reddedildi':'danger', 'Bekliyor':'warn', 'Kısmi onay':'warn',
    'Açık':'info', 'Kapandı':'ok', 'Çözüldü':'ok', 'Yeni':'info',
    'Planlama':'info', 'Geliştirme':'accent', 'Test':'purple', 'Teslim':'ok', 'Askıda':'warn',
    'Gecikti':'danger', 'Yaklaşıyor':'warn', 'Zamanında':'ok', 'Tamam':'ok',
    'Ödendi':'ok', 'Kısmi':'warn', 'Ödenmedi':'danger', 'İletildi':'purple',
    'Serviste':'warn', 'Tahsisli':'info', 'Ortak kullanım':'accent', 'Kiralık':'info',
    'Zimmetli':'info', 'Depoda':'neutral', 'Hurda':'neutral', 'Onarımda':'warn',
    'Onay bekliyor ':'warn', 'Sipariş verildi':'info', 'Teslim alındı':'ok', 'İptal':'neutral'
  };

  function tone(v){ return TONE[v] || 'neutral'; }
  GV.tone = tone;

  GV.badge = function(v, extra){
    if(v == null || v === '') return '<span class="u-faint">—</span>';
    return '<span class="badge is-' + tone(v) + (extra ? ' ' + extra : '') + '">' + esc(v) + '</span>';
  };

  GV.pri = function(v){
    if(!v) return '<span class="u-faint">—</span>';
    var k = String(v).toLowerCase().replace('ı','i').replace('ü','u').replace('ö','o').replace('ş','s').replace('ç','c').replace('ğ','g');
    return '<span class="pri is-' + k + '">' + esc(v) + '</span>';
  };

  GV.user = function(kod, opt){
    opt = opt || {};
    var e = (window.DB && DB.emp) ? DB.emp(kod) : null;
    var ad = e ? e.ad : (opt.ad || kod || '—');
    var ini = e ? e.ini : Fmt.initials(ad);
    if(!kod && !opt.ad) return '<span class="u-faint">Atanmamış</span>';
    return '<span class="gv-user">' +
      '<span class="gv-user-ava' + (opt.sm ? ' is-sm' : '') + '">' + esc(ini) + '</span>' +
      (opt.nameOnly === false ? '' : '<span class="gv-user-name">' + esc(ad) + '</span>') +
      '</span>';
  };

  GV.dateCell = function(iso, opt){
    opt = opt || {};
    if(!iso) return '<span class="u-faint">—</span>';
    var d = Fmt.days(iso);
    var cls = '';
    if(opt.done) cls = 'is-done';
    else if(d < 0) cls = 'is-late';
    else if(d <= 3) cls = 'is-soon';
    return '<span class="cell-date ' + cls + '">' + Fmt.dateShort(iso) + '</span>';
  };

  GV.progress = function(v, opt){
    opt = opt || {};
    var t = opt.tone || (v >= 100 ? 'ok' : v < 35 ? 'danger' : v < 70 ? 'warn' : '');
    return '<span class="gv-progress-row">' +
      '<span class="gv-progress' + (t ? ' is-' + t : '') + '"><span style="width:' + Math.max(0, Math.min(100, v || 0)) + '%"></span></span>' +
      '<span class="gv-progress-val">' + (v == null ? '—' : v + '%') + '</span></span>';
  };

  /* ===================================================================
     2. TOAST / MODAL / CONFIRM / DRAWER
     =================================================================== */
  function toastHost(){
    var h = document.getElementById('gvToasts');
    if(!h){
      h = document.createElement('div');
      h.id = 'gvToasts'; h.className = 'gv-toasts';
      h.setAttribute('role','status'); h.setAttribute('aria-live','polite');
      document.body.appendChild(h);
    }
    return h;
  }

  GV.toast = function(text, kind, ms){
    var t = kind || 'ok';
    var icons = { ok:'i-check-circle', danger:'i-x-circle', warn:'i-alert', info:'i-info' };
    var el = document.createElement('div');
    el.className = 'gv-toast is-' + t;
    el.innerHTML = ico(icons[t] || 'i-info') + '<span>' + esc(text) + '</span>' +
                   '<button type="button" aria-label="Kapat">' + ico('i-x','ic-sm') + '</button>';
    toastHost().appendChild(el);
    var kill = function(){ el.style.opacity = '0'; setTimeout(function(){ el.remove(); }, 220); };
    el.querySelector('button').addEventListener('click', kill);
    setTimeout(kill, ms || 3600);
  };

  var lastFocus = null;

  function trapTab(e, container){
    if(e.key !== 'Tab') return;
    var f = container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])');
    if(!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }

  /* Modal — .gv-page İÇİNE basılmaz (stacking context kuralı) */
  GV.modal = function(cfg){
    cfg = cfg || {};
    lastFocus = document.activeElement;
    var scrim = document.createElement('div');
    scrim.className = 'gv-scrim';
    var acts = (cfg.actions || []).map(function(a, i){
      return '<button type="button" class="btn ' + (a.cls || 'btn-line') + '" data-act="' + i + '">' +
             (a.icon ? ico(a.icon) + ' ' : '') + esc(a.label) + '</button>';
    }).join('');

    scrim.innerHTML =
      '<div class="gv-modal' + (cfg.tone ? ' is-' + cfg.tone : '') + (cfg.size ? ' is-' + cfg.size : '') +
      '" role="dialog" aria-modal="true" aria-labelledby="gvModalTitle">' +
        '<div class="gv-modal-head">' +
          (cfg.icon ? '<div class="gv-modal-ico">' + ico(cfg.icon, 'ic-lg') + '</div>' : '') +
          '<div><h2 id="gvModalTitle">' + esc(cfg.title || '') + '</h2>' +
          (cfg.text ? '<p>' + esc(cfg.text) + '</p>' : '') + '</div>' +
          '<button type="button" class="ia gv-modal-close" data-close aria-label="Kapat">' + ico('i-x','ic-sm') + '</button>' +
        '</div>' +
        (cfg.body ? '<div class="gv-modal-body">' + cfg.body + '</div>' : '') +
        (acts ? '<div class="gv-modal-foot">' + acts + '</div>' : '') +
      '</div>';

    document.body.appendChild(scrim);
    requestAnimationFrame(function(){ scrim.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';

    function close(){
      scrim.classList.remove('is-open');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      setTimeout(function(){ scrim.remove(); if(lastFocus) lastFocus.focus(); }, 220);
    }
    function onKey(e){
      if(e.key === 'Escape') close();
      trapTab(e, scrim);
    }
    document.addEventListener('keydown', onKey);
    scrim.addEventListener('click', function(e){
      if(e.target === scrim || e.target.closest('[data-close]')) return close();
      var b = e.target.closest('[data-act]');
      if(b){
        var a = cfg.actions[+b.dataset.act];
        if(a.onClick && a.onClick(close, scrim) === false) return;
        if(a.close !== false) close();
      }
    });
    var focusEl = scrim.querySelector('.btn-acc, .btn-danger, input, select, textarea, button');
    if(focusEl) focusEl.focus();
    return { close:close, el:scrim };
  };

  GV.confirm = function(cfg){
    return new Promise(function(resolve){
      GV.modal({
        title:cfg.title || 'Emin misiniz?',
        text:cfg.text || '',
        tone:cfg.tone || 'warn',
        size:'sm',
        icon:cfg.tone === 'danger' ? 'i-alert' : 'i-alert-circle',
        body:cfg.body,
        actions:[
          { label:cfg.cancelLabel || 'Vazgeç', cls:'btn-line', onClick:function(){ resolve(false); } },
          { label:cfg.okLabel || 'Onayla', cls:cfg.tone === 'danger' ? 'btn-danger' : 'btn-acc',
            onClick:function(){ resolve(true); } }
        ]
      });
    });
  };

  GV.result = function(cfg){
    return GV.modal({
      title:cfg.title, text:cfg.text, tone:cfg.tone || 'ok', size:'sm',
      icon:cfg.tone === 'danger' ? 'i-x-circle' : cfg.tone === 'warn' ? 'i-alert' : 'i-check-circle',
      body:cfg.body,
      actions:cfg.actions || [{ label:'Tamam', cls:'btn-acc' }]
    });
  };

  GV.drawer = function(cfg){
    cfg = cfg || {};
    lastFocus = document.activeElement;
    var scrim = document.createElement('div');
    scrim.className = 'gv-overlay';
    scrim.style.opacity = '1'; scrim.style.visibility = 'visible';

    var d = document.createElement('aside');
    d.className = 'gv-drawer' + (cfg.side === 'left' ? ' is-left' : '');
    d.setAttribute('role','dialog'); d.setAttribute('aria-modal','true');
    d.innerHTML =
      '<div class="gv-drawer-head">' +
        '<h2>' + esc(cfg.title || '') + '</h2>' +
        '<button type="button" class="ia" data-close aria-label="Kapat">' + ico('i-x','ic-sm') + '</button>' +
      '</div>' +
      '<div class="gv-drawer-body">' + (cfg.body || '') + '</div>' +
      (cfg.actions ? '<div class="gv-drawer-foot">' + cfg.actions.map(function(a,i){
        return '<button type="button" class="btn ' + (a.cls || 'btn-line') + '" data-act="' + i + '">' + esc(a.label) + '</button>';
      }).join('') + '</div>' : '');

    document.body.appendChild(scrim);
    document.body.appendChild(d);
    requestAnimationFrame(function(){ d.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';

    function close(){
      d.classList.remove('is-open');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      setTimeout(function(){ d.remove(); scrim.remove(); if(lastFocus) lastFocus.focus(); }, 320);
    }
    function onKey(e){ if(e.key === 'Escape') close(); trapTab(e, d); }
    document.addEventListener('keydown', onKey);
    scrim.addEventListener('click', close);
    d.addEventListener('click', function(e){
      if(e.target.closest('[data-close]')) return close();
      var b = e.target.closest('[data-act]');
      if(b){
        var a = cfg.actions[+b.dataset.act];
        if(a.onClick && a.onClick(close, d) === false) return;
        if(a.close !== false) close();
      }
    });
    if(cfg.onOpen) cfg.onOpen(d, close);
    return { close:close, el:d };
  };

  /* ===================================================================
     3. DURUM BLOKLARI
     =================================================================== */
  GV.empty = function(c){
    c = c || {};
    return '<div class="gv-state">' +
      '<div class="gv-state-ico">' + ico(c.icon || 'i-inbox','ic-xl') + '</div>' +
      '<h3>' + esc(c.title || 'Kayıt bulunamadı') + '</h3>' +
      '<p>' + esc(c.desc || 'Bu görünümde gösterilecek kayıt yok. Filtreleri değiştirebilir veya yeni kayıt ekleyebilirsiniz.') + '</p>' +
      (c.action ? '<div class="gv-state-acts">' + c.action + '</div>' : '') +
      '</div>';
  };

  GV.errorState = function(c){
    c = c || {};
    return '<div class="gv-state is-danger">' +
      '<div class="gv-state-ico">' + ico('i-alert','ic-xl') + '</div>' +
      '<h3>' + esc(c.title || 'Veri yüklenemedi') + '</h3>' +
      '<p>' + esc(c.desc || 'Kayıtlar getirilirken bir sorun oluştu. Bağlantınızı kontrol edip tekrar deneyin.') + '</p>' +
      '<div class="gv-state-acts"><button type="button" class="btn btn-line" data-retry>' +
      ico('i-refresh') + ' Tekrar dene</button></div></div>';
  };

  GV.skeleton = function(type, n){
    var rows = '';
    var count = n || 6;
    if(type === 'card'){
      for(var i = 0; i < count; i++) rows += '<div class="sk sk-card"></div>';
      return '<div class="gv-cards">' + rows + '</div>';
    }
    for(var j = 0; j < count; j++){
      rows += '<div class="sk-row"><div class="sk"></div><div class="sk"></div><div class="sk"></div><div class="sk"></div><div class="sk"></div></div>';
    }
    return '<div aria-busy="true" aria-label="Yükleniyor">' + rows + '</div>';
  };

  /* ===================================================================
     4. LİSTE BİLEŞENİ — PROMPT.md §6
     =================================================================== */
  function uniq(a){ return a.filter(function(v,i,s){ return v != null && v !== '' && s.indexOf(v) === i; }); }

  GV.list = function(cfg){
    var mount = typeof cfg.mount === 'string' ? document.querySelector(cfg.mount) : cfg.mount;
    if(!mount) return null;

    var LS_COLS = 'gv.cols.' + (cfg.id || location.pathname);
    var LS_VIEWS = 'gv.views.' + (cfg.id || location.pathname);

    var state = {
      tab:cfg.tabs && cfg.tabs.length ? cfg.tabs[0].key : null,
      q:'', page:1, size:cfg.pageSize || 10,
      sort:cfg.defaultSort || null, dir:cfg.defaultDir || 'asc',
      filters:{}, archive:false, view:(cfg.views && cfg.views[0]) || 'table',
      selected:[], cols:null, loading:true, error:false
    };

    /* ---- kolon durumu ---- */
    function loadCols(){
      var saved = null;
      try{ saved = JSON.parse(localStorage.getItem(LS_COLS) || 'null'); }catch(e){}
      var base = cfg.columns.map(function(c){ return { key:c.key, visible:c.visible !== false }; });
      if(saved && saved.length){
        var order = saved.map(function(s){ return s.key; });
        base.sort(function(a,b){ return order.indexOf(a.key) - order.indexOf(b.key); });
        base.forEach(function(c){
          var s = saved.filter(function(x){ return x.key === c.key; })[0];
          if(s) c.visible = s.visible;
        });
      }
      return base;
    }
    function saveCols(){ try{ localStorage.setItem(LS_COLS, JSON.stringify(state.cols)); }catch(e){} }
    state.cols = loadCols();

    function colDef(key){ return cfg.columns.filter(function(c){ return c.key === key; })[0]; }
    function visibleCols(){
      return state.cols.filter(function(c){ return c.visible; })
                       .map(function(c){ return colDef(c.key); })
                       .filter(Boolean);
    }

    /* ---- URL senkronu ---- */
    function readURL(){
      var q = new URLSearchParams(location.search);
      if(q.get('t')) state.tab = q.get('t');
      if(q.get('q')) state.q = q.get('q');
      if(q.get('p')) state.page = Math.max(1, parseInt(q.get('p'),10) || 1);
      if(q.get('s')){ state.sort = q.get('s'); state.dir = q.get('d') === 'desc' ? 'desc' : 'asc'; }
      if(q.get('v')) state.view = q.get('v');
      if(q.get('arsiv') === '1') state.archive = true;
      (cfg.filters || []).forEach(function(f){
        var v = q.get('f_' + f.key);
        if(v) state.filters[f.key] = f.type === 'multi' ? v.split('|') : v;
      });
    }
    function writeURL(){
      if(cfg.urlSync === false) return;
      var q = new URLSearchParams(location.search);
      ['t','q','p','s','d','v','arsiv'].forEach(function(k){ q.delete(k); });
      Array.from(q.keys()).forEach(function(k){ if(k.indexOf('f_') === 0) q.delete(k); });
      if(state.tab && cfg.tabs && state.tab !== cfg.tabs[0].key) q.set('t', state.tab);
      else if(state.tab && cfg.tabs) q.set('t', state.tab);
      if(state.q) q.set('q', state.q);
      if(state.page > 1) q.set('p', state.page);
      if(state.sort){ q.set('s', state.sort); q.set('d', state.dir); }
      if(state.view !== ((cfg.views && cfg.views[0]) || 'table')) q.set('v', state.view);
      if(state.archive) q.set('arsiv','1');
      Object.keys(state.filters).forEach(function(k){
        var v = state.filters[k];
        if(v == null || v === '' || (Array.isArray(v) && !v.length)) return;
        q.set('f_' + k, Array.isArray(v) ? v.join('|') : v);
      });
      var s = q.toString();
      history.replaceState({}, '', location.pathname + (s ? '?' + s : ''));
    }

    /* ---- veri hattı ---- */
    function source(){ return (typeof cfg.source === 'function' ? cfg.source() : cfg.source) || []; }

    function afterTab(rows){
      if(!state.tab || !cfg.tabs) return rows;
      var t = cfg.tabs.filter(function(x){ return x.key === state.tab; })[0];
      return t && t.filter ? rows.filter(t.filter) : rows;
    }
    function afterArchive(rows){
      if(cfg.archive === false) return rows;
      return rows.filter(function(r){
        var arch = r.arsiv === true || r.aktif === false || r.durum === 'Arşivlendi';
        return state.archive ? true : !arch;
      });
    }
    function afterSearch(rows){
      if(!state.q) return rows;
      var q = state.q.toLocaleLowerCase('tr');
      var fields = (cfg.search && cfg.search.fields) || Object.keys(rows[0] || {});
      return rows.filter(function(r){
        return fields.some(function(f){
          var v = r[f];
          if(v == null) return false;
          if(Array.isArray(v)) v = v.join(' ');
          return String(v).toLocaleLowerCase('tr').indexOf(q) !== -1;
        });
      });
    }
    function afterFilters(rows){
      var keys = Object.keys(state.filters);
      if(!keys.length) return rows;
      return rows.filter(function(r){
        return keys.every(function(k){
          var v = state.filters[k];
          if(v == null || v === '' || (Array.isArray(v) && !v.length)) return true;
          var f = (cfg.filters || []).filter(function(x){ return x.key === k; })[0];
          if(f && f.test) return f.test(r, v);
          var rv = r[k];
          if(Array.isArray(v)) return v.indexOf(String(rv)) !== -1;
          if(f && f.type === 'daterange'){
            var parts = String(v).split('~');
            var d = String(rv || '').slice(0,10);
            if(parts[0] && d < parts[0]) return false;
            if(parts[1] && d > parts[1]) return false;
            return true;
          }
          return String(rv) === String(v);
        });
      });
    }
    function afterSort(rows){
      if(!state.sort) return rows;
      var c = colDef(state.sort);
      var mul = state.dir === 'desc' ? -1 : 1;
      return rows.slice().sort(function(a,b){
        var av = c && c.sortValue ? c.sortValue(a) : a[state.sort];
        var bv = c && c.sortValue ? c.sortValue(b) : b[state.sort];
        if(av == null) return 1; if(bv == null) return -1;
        if(typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul;
        return String(av).localeCompare(String(bv), 'tr') * mul;
      });
    }

    function pipeline(){ return afterSort(afterFilters(afterSearch(afterArchive(afterTab(source()))))); }
    function tabRows(t){ return afterFilters(afterSearch(afterArchive(t.filter ? source().filter(t.filter) : source()))); }

    /* ---- render parçaları ---- */
    function renderKpis(all){
      if(!cfg.kpis || !cfg.kpis.length) return '';
      var base = afterArchive(source());
      return '<div class="kpi-grid">' + cfg.kpis.map(function(k){
        var val = k.calc ? k.calc(base, all) : 0;
        var inner =
          '<div class="kpi-ico">' + ico(k.icon || 'i-chart-bar','ic-lg') + '</div>' +
          '<div class="kpi-body"><div class="kpi-num">' + (k.format ? k.format(val) : Fmt.num(val)) + '</div>' +
          '<div class="kpi-lbl">' + esc(k.label) + '</div>' +
          (k.meta ? '<div class="kpi-meta ' + (k.metaTone ? 'is-' + k.metaTone : '') + '">' + k.meta(base) + '</div>' : '') + '</div>';
        return k.href
          ? '<a class="kpi' + (k.tone ? ' is-' + k.tone : '') + '" href="' + k.href + '">' + inner + '</a>'
          : '<div class="kpi' + (k.tone ? ' is-' + k.tone : '') + '">' + inner + '</div>';
      }).join('') + '</div>';
    }

    function renderTabs(){
      if(!cfg.tabs || !cfg.tabs.length) return '';
      return '<div class="lh-tabs"><div class="chipbar-wrap">' +
        '<button type="button" class="cb-arrow cb-prev" aria-label="Sola kaydır" hidden>' + ico('i-chev-left','ic-sm') + '</button>' +
        '<div class="chipbar" role="tablist">' +
        cfg.tabs.map(function(t){
          var n = tabRows(t).length;
          return '<button type="button" class="chip" role="tab" data-tab="' + t.key + '"' +
                 ' aria-selected="' + (state.tab === t.key ? 'true' : 'false') + '">' +
                 (t.icon ? ico(t.icon,'ic-sm') : '') + esc(t.label) +
                 '<span class="chip-cnt">' + n + '</span></button>';
        }).join('') +
        '</div><button type="button" class="cb-arrow cb-next" aria-label="Sağa kaydır" hidden>' + ico('i-chev-right','ic-sm') + '</button>' +
        '</div></div>';
    }

    function renderAchips(){
      var keys = Object.keys(state.filters).filter(function(k){
        var v = state.filters[k];
        return v != null && v !== '' && !(Array.isArray(v) && !v.length);
      });
      if(!keys.length) return '<div class="lh-achips" hidden></div>';
      return '<div class="lh-achips">' + keys.map(function(k){
        var f = (cfg.filters || []).filter(function(x){ return x.key === k; })[0];
        var v = state.filters[k];
        var txt = Array.isArray(v) ? v.join(', ') : (f && f.type === 'daterange' ? String(v).split('~').map(Fmt.date).join(' – ') : v);
        return '<span class="achip"><b>' + esc(f ? f.label : k) + ':</b> ' + esc(txt) +
               '<button type="button" data-rmfilter="' + k + '" aria-label="Filtreyi kaldır">' + ico('i-x','ic-sm') + '</button></span>';
      }).join('') +
      '<button type="button" class="btn btn-ghost btn-sm" data-clearfilters>' + ico('i-filter-x','ic-sm') + ' Filtreleri Temizle</button>' +
      '</div>';
    }

    function renderHead(){
      var acts = '';
      acts += '<button type="button" class="btn btn-line btn-sm" data-openfilters aria-label="Gelişmiş filtre">' +
              ico('i-sliders','ic-sm') + '<span class="u-desktop">Gelişmiş Filtre</span></button>';
      acts += '<button type="button" class="btn btn-line btn-sm" data-opencols aria-label="Kolonlar">' +
              ico('i-columns','ic-sm') + '<span class="u-desktop">Kolonlar</span></button>';
      if(cfg.archive !== false){
        acts += '<label class="lh-toggle"><input type="checkbox" data-archive' + (state.archive ? ' checked' : '') + '>' +
                ico('i-archive','ic-sm') + '<span class="u-desktop">Arşivlenenleri Göster</span></label>';
      }
      if(cfg.export !== false){
        acts += '<button type="button" class="btn btn-line btn-sm" data-export aria-label="Çıktı al">' +
                ico('i-download','ic-sm') + '<span class="u-desktop">Çıktı Al</span></button>';
      }
      if(cfg.views && cfg.views.length > 1){
        var vi = { table:'i-table', card:'i-grid', kanban:'i-kanban' };
        acts += '<span class="viewswitch">' + cfg.views.map(function(v){
          return '<button type="button" data-view="' + v + '" aria-pressed="' + (state.view === v ? 'true' : 'false') +
                 '" aria-label="' + (v === 'table' ? 'Tablo' : v === 'card' ? 'Kart' : 'Kanban') + ' görünümü">' +
                 ico(vi[v] || 'i-table','ic-sm') + '</button>';
        }).join('') + '</span>';
      }

      return '<div class="gv-listhead">' +
        '<div class="lh-row">' +
          '<div class="lh-search">' + ico('i-search','ic-sm') +
          '<input type="search" data-search value="' + esc(state.q) + '" placeholder="' +
          esc((cfg.search && cfg.search.placeholder) || 'Ara') + '" aria-label="Listede ara"></div>' +
          '<div class="lh-acts">' + acts + '</div>' +
        '</div>' +
        renderAchips() +
        renderTabs() +
      '</div>';
    }

    function renderTable(rows){
      var cols = visibleCols();
      var head = '<tr>';
      if(cfg.bulk) head += '<th class="col-check"><input type="checkbox" data-selectall aria-label="Tümünü seç"></th>';
      cols.forEach(function(c){
        var sortable = c.sortable !== false;
        var aria = state.sort === c.key ? ' aria-sort="' + (state.dir === 'asc' ? 'ascending' : 'descending') + '"' : '';
        head += '<th data-col="' + c.key + '"' + (sortable ? ' class="is-sortable" data-sort="' + c.key + '"' : '') + aria +
                (c.width ? ' style="width:' + c.width + '"' : '') + '>' + esc(c.label) +
                (state.sort === c.key ? ico(state.dir === 'asc' ? 'i-chev-up' : 'i-chev-down') : '') + '</th>';
      });
      if(cfg.rowActions) head += '<th class="col-acts"><span class="gv-sr">İşlemler</span></th>';
      head += '</tr>';

      var body = rows.map(function(r, i){
        var cls = [];
        if(cfg.rowClass) cls.push(cfg.rowClass(r) || '');
        if(state.selected.indexOf(r[cfg.key]) !== -1) cls.push('is-selected');
        var tr = '<tr' + (cls.length ? ' class="' + cls.join(' ').trim() + '"' : '') + ' data-id="' + esc(r[cfg.key]) + '">';
        if(cfg.bulk) tr += '<td><input type="checkbox" data-rowcheck="' + esc(r[cfg.key]) + '"' +
                           (state.selected.indexOf(r[cfg.key]) !== -1 ? ' checked' : '') + ' aria-label="Satırı seç"></td>';
        cols.forEach(function(c){
          tr += '<td data-col="' + c.key + '"' + (c.cellClass ? ' class="' + c.cellClass + '"' : '') + '>' +
                (c.render ? c.render(r, i) : esc(r[c.key] == null ? '—' : r[c.key])) + '</td>';
        });
        if(cfg.rowActions){
          tr += '<td class="col-acts"><span class="cell-acts">' + cfg.rowActions.map(function(a){
            var href = typeof a.href === 'function' ? a.href(r) : a.href;
            return href
              ? '<a class="ia' + (a.cls ? ' ' + a.cls : '') + '" href="' + href + '" title="' + esc(a.label) + '" aria-label="' + esc(a.label) + '">' + ico(a.icon,'ic-sm') + '</a>'
              : '<button type="button" class="ia' + (a.cls ? ' ' + a.cls : '') + '" data-rowact="' + esc(a.key) + '" title="' + esc(a.label) + '" aria-label="' + esc(a.label) + '">' + ico(a.icon,'ic-sm') + '</button>';
          }).join('') + '</span></td>';
        }
        return tr + '</tr>';
      }).join('');

      return '<div class="gv-tablewrap"><table class="gtable"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
             renderCardList(rows);
    }

    /* Mobil kart listesi — AYNI veri kaynağından üretilir (ikinci markup yazılmaz) */
    function renderCardList(rows){
      if(!cfg.mobile) {
        return '<div class="gv-cardlist">' + rows.map(function(r){
          var cols = visibleCols();
          var main = cols[0];
          return '<div class="gv-mrow"><div class="gv-mrow-top">' +
            '<div>' + (main.render ? main.render(r,0) : esc(r[main.key])) + '</div></div>' +
            '<div class="gv-mrow-meta">' + cols.slice(1,4).map(function(c){
              return '<span>' + esc(c.label) + ': ' + (c.render ? c.render(r,0) : esc(r[c.key])) + '</span>';
            }).join('') + '</div></div>';
        }).join('') + '</div>';
      }
      return '<div class="gv-cardlist">' + rows.map(function(r,i){
        return '<div class="gv-mrow' + (cfg.rowClass && /is-late/.test(cfg.rowClass(r) || '') ? ' is-late' : '') + '">' + cfg.mobile(r,i) + '</div>';
      }).join('') + '</div>';
    }

    function renderCards(rows){
      if(!cfg.card) return renderTable(rows);
      return '<div class="gv-cards">' + rows.map(function(r,i){
        return '<div class="gv-rcard">' + cfg.card(r,i) + '</div>';
      }).join('') + '</div>';
    }

    function renderKanban(rows){
      if(!cfg.kanban) return renderTable(rows);
      var groups = cfg.kanban.columns || uniq(rows.map(function(r){ return r[cfg.kanban.groupBy]; }));
      return '<div class="gv-kanban">' + groups.map(function(g){
        var key = typeof g === 'string' ? g : g.key;
        var label = typeof g === 'string' ? g : g.label;
        var items = rows.filter(function(r){ return String(r[cfg.kanban.groupBy]) === String(key); });
        return '<section class="gv-kcol" data-kcol="' + esc(key) + '">' +
          '<div class="gv-kcol-head"><span class="gv-kcol-bar" style="width:var(--sp-8);background:var(--' +
          (tone(key) === 'accent' ? 'acc' : tone(key)) + ')"></span>' +
          '<span class="gv-kcol-title">' + esc(label) + '</span>' +
          '<span class="gv-kcol-cnt">' + items.length + '</span></div>' +
          '<div class="gv-kcol-body">' + (items.length ? items.map(function(r){
            return '<article class="gv-kcard" data-id="' + esc(r[cfg.key]) + '">' + cfg.kanban.card(r) + '</article>';
          }).join('') : '<p class="u-xs u-faint u-center" style="padding:var(--sp-8)">Kayıt yok</p>') + '</div>' +
        '</section>';
      }).join('') + '</div>';
    }

    function renderPager(total){
      var pages = Math.max(1, Math.ceil(total / state.size));
      if(state.page > pages) state.page = pages;
      var from = total ? (state.page - 1) * state.size + 1 : 0;
      var to = Math.min(total, state.page * state.size);

      var btns = '';
      btns += '<button type="button" data-page="prev"' + (state.page === 1 ? ' disabled' : '') + ' aria-label="Önceki sayfa">' + ico('i-chev-left','ic-sm') + '</button>';
      var list = [];
      for(var i = 1; i <= pages; i++){
        if(i === 1 || i === pages || Math.abs(i - state.page) <= 1) list.push(i);
        else if(list[list.length - 1] !== '…') list.push('…');
      }
      list.forEach(function(p){
        btns += p === '…' ? '<span class="gap">…</span>' :
          '<button type="button" data-page="' + p + '"' + (p === state.page ? ' aria-current="page"' : '') + '>' + p + '</button>';
      });
      btns += '<button type="button" data-page="next"' + (state.page === pages ? ' disabled' : '') + ' aria-label="Sonraki sayfa">' + ico('i-chev-right','ic-sm') + '</button>';

      return '<div class="gv-pager">' +
        '<div class="gv-pager-info">Toplam <b>' + Fmt.num(total) + '</b> kayıt · <b>' + from + '–' + to + '</b> arası gösteriliyor</div>' +
        '<div class="gv-pager-nav">' + btns + '</div>' +
        '<label class="gv-pager-size">Sayfa başına <select data-size>' +
        [10,25,50,100].map(function(n){ return '<option value="' + n + '"' + (n === state.size ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
        '</select></label></div>';
    }

    function renderBulk(){
      if(!cfg.bulk) return '';
      return '<div class="gv-bulk"' + (state.selected.length ? '' : ' hidden') + '>' +
        '<span class="gv-bulk-count"><b>' + state.selected.length + '</b> kayıt seçildi</span>' +
        '<span class="gv-bulk-acts">' + cfg.bulk.map(function(b){
          return '<button type="button" class="btn btn-sm' + (b.tone === 'danger' ? ' is-danger' : '') + '" data-bulk="' + esc(b.key) + '">' +
                 ico(b.icon || 'i-check','ic-sm') + ' ' + esc(b.label) + '</button>';
        }).join('') + '<button type="button" class="btn btn-sm" data-bulkclear>' + ico('i-x','ic-sm') + ' Seçimi bırak</button></span>' +
      '</div>';
    }

    /* ---- ana render ---- */
    function render(){
      if(state.loading){
        mount.innerHTML = (cfg.kpis ? '<div class="kpi-grid">' +
          cfg.kpis.map(function(){ return '<div class="sk sk-card" style="height:var(--sp-17)"></div>'; }).join('') + '</div>' : '') +
          '<div class="gv-card">' + GV.skeleton('row', 8) + '</div>';
        return;
      }
      if(state.error){
        mount.innerHTML = '<div class="gv-card">' + GV.errorState({}) + '</div>';
        return;
      }

      var all = pipeline();
      var total = all.length;
      var pages = Math.max(1, Math.ceil(total / state.size));
      if(state.page > pages) state.page = pages;
      var pageRows = all.slice((state.page - 1) * state.size, state.page * state.size);

      var bodyHtml;
      if(!total){
        bodyHtml = GV.empty(cfg.emptyState || {});
      }else if(state.view === 'kanban'){
        bodyHtml = renderKanban(all);
      }else if(state.view === 'card'){
        bodyHtml = renderCards(pageRows);
      }else{
        bodyHtml = renderTable(pageRows);
      }

      mount.innerHTML =
        renderKpis(all) +
        '<div class="gv-card">' +
          renderHead() +
          '<div class="gc-body flush">' + bodyHtml + '</div>' +
          renderBulk() +
          (total && state.view !== 'kanban' ? renderPager(total) : '') +
        '</div>';

      wire();
      if(cfg.onRender) cfg.onRender(all, state);
      writeURL();

      /* toplam kayıt bilgisini sayfa başlığına yansıt */
      var sub = document.querySelector('[data-listcount]');
      if(sub){
        var tabLbl = cfg.tabs ? (cfg.tabs.filter(function(t){ return t.key === state.tab; })[0] || {}).label : '';
        sub.textContent = Fmt.num(total) + ' kayıt' + (tabLbl ? ' · ' + tabLbl : '');
      }
    }

    /* ---- olay bağlama ---- */
    function reset(){ state.page = 1; state.selected = []; }

    function wire(){
      var q = function(s){ return mount.querySelector(s); };
      var qa = function(s){ return Array.prototype.slice.call(mount.querySelectorAll(s)); };

      var si = q('[data-search]');
      if(si){
        var timer;
        si.addEventListener('input', function(){
          clearTimeout(timer);
          timer = setTimeout(function(){ state.q = si.value.trim(); reset(); render(); q('[data-search]').focus(); }, 220);
        });
      }

      qa('[data-tab]').forEach(function(b){
        b.addEventListener('click', function(){ state.tab = b.dataset.tab; reset(); render(); });
      });

      qa('[data-sort]').forEach(function(th){
        th.addEventListener('click', function(){
          var k = th.dataset.sort;
          if(state.sort === k) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
          else { state.sort = k; state.dir = 'asc'; }
          render();
        });
      });

      qa('[data-page]').forEach(function(b){
        b.addEventListener('click', function(){
          var v = b.dataset.page;
          var pages = Math.max(1, Math.ceil(pipeline().length / state.size));
          if(v === 'prev') state.page = Math.max(1, state.page - 1);
          else if(v === 'next') state.page = Math.min(pages, state.page + 1);
          else state.page = parseInt(v,10);
          render();
          window.scrollTo({ top:mount.offsetTop - 80, behavior:'smooth' });
        });
      });

      var sz = q('[data-size]');
      if(sz) sz.addEventListener('change', function(){ state.size = parseInt(sz.value,10); state.page = 1; render(); });

      var arc = q('[data-archive]');
      if(arc) arc.addEventListener('change', function(){ state.archive = arc.checked; reset(); render(); });

      qa('[data-view]').forEach(function(b){
        b.addEventListener('click', function(){ state.view = b.dataset.view; state.page = 1; render(); });
      });

      qa('[data-rmfilter]').forEach(function(b){
        b.addEventListener('click', function(){ delete state.filters[b.dataset.rmfilter]; reset(); render(); });
      });
      var cf = q('[data-clearfilters]');
      if(cf) cf.addEventListener('click', function(){ state.filters = {}; reset(); render(); });

      var of = q('[data-openfilters]');
      if(of) of.addEventListener('click', openFilters);

      var oc = q('[data-opencols]');
      if(oc) oc.addEventListener('click', function(e){ openCols(e.currentTarget); });

      var ex = q('[data-export]');
      if(ex) ex.addEventListener('click', function(){ openExport(pipeline()); });

      /* toplu seçim */
      var sa = q('[data-selectall]');
      if(sa){
        sa.addEventListener('change', function(){
          var rows = pipeline().slice((state.page - 1) * state.size, state.page * state.size);
          if(sa.checked) rows.forEach(function(r){ if(state.selected.indexOf(r[cfg.key]) === -1) state.selected.push(r[cfg.key]); });
          else rows.forEach(function(r){ state.selected = state.selected.filter(function(x){ return x !== r[cfg.key]; }); });
          render();
        });
      }
      qa('[data-rowcheck]').forEach(function(c){
        c.addEventListener('change', function(){
          var id = c.dataset.rowcheck;
          if(c.checked){ if(state.selected.indexOf(id) === -1) state.selected.push(id); }
          else state.selected = state.selected.filter(function(x){ return x !== id; });
          render();
        });
      });
      var bc = q('[data-bulkclear]');
      if(bc) bc.addEventListener('click', function(){ state.selected = []; render(); });
      qa('[data-bulk]').forEach(function(b){
        b.addEventListener('click', function(){
          var act = cfg.bulk.filter(function(x){ return x.key === b.dataset.bulk; })[0];
          if(!act) return;
          var run = function(){
            if(act.run) act.run(state.selected.slice());
            else GV.toast(act.label + ' — ' + state.selected.length + ' kayıt işlendi', 'ok');
            state.selected = []; render();
          };
          if(act.confirm){
            GV.confirm({ title:act.label, text:act.confirm.replace('{n}', state.selected.length),
                         tone:act.tone === 'danger' ? 'danger' : 'warn' })
              .then(function(ok){ if(ok) run(); });
          }else run();
        });
      });

      qa('[data-rowact]').forEach(function(b){
        b.addEventListener('click', function(){
          var id = b.closest('tr').dataset.id;
          var a = cfg.rowActions.filter(function(x){ return x.key === b.dataset.rowact; })[0];
          var rec = source().filter(function(r){ return String(r[cfg.key]) === String(id); })[0];
          if(a && a.run) a.run(rec, render);
        });
      });

      var rt = q('[data-retry]');
      if(rt) rt.addEventListener('click', function(){ state.error = false; state.loading = true; render(); load(); });

      wireChipbar(mount);
      wireScrollHint(mount);
    }

    /* ---- gelişmiş filtre drawer ---- */
    function openFilters(){
      var fields = cfg.filters || [];
      if(!fields.length){ GV.toast('Bu listede tanımlı gelişmiş filtre yok', 'info'); return; }
      var body = fields.map(function(f){
        var cur = state.filters[f.key];
        if(f.type === 'multi'){
          var vals = Array.isArray(cur) ? cur : [];
          return '<div class="field fd-field"><span class="f-lbl">' + esc(f.label) + '</span>' +
            f.options.map(function(o){
              var v = typeof o === 'string' ? o : o.value;
              var l = typeof o === 'string' ? o : o.label;
              return '<label class="f-check"><input type="checkbox" data-f="' + f.key + '" value="' + esc(v) + '"' +
                     (vals.indexOf(String(v)) !== -1 ? ' checked' : '') + '><span>' + esc(l) + '</span></label>';
            }).join('') + '</div>';
        }
        if(f.type === 'daterange'){
          var p = String(cur || '').split('~');
          return '<div class="field fd-field"><label>' + esc(f.label) + '</label><div class="fd-range">' +
            '<input type="date" data-f="' + f.key + '" data-part="0" value="' + esc(p[0] || '') + '" aria-label="Başlangıç">' +
            '<span>–</span>' +
            '<input type="date" data-f="' + f.key + '" data-part="1" value="' + esc(p[1] || '') + '" aria-label="Bitiş">' +
            '</div></div>';
        }
        if(f.type === 'text'){
          return '<div class="field fd-field"><label>' + esc(f.label) + '</label>' +
            '<input type="text" class="inp" data-f="' + f.key + '" value="' + esc(cur || '') + '"></div>';
        }
        return '<div class="field fd-field"><label>' + esc(f.label) + '</label><select data-f="' + f.key + '">' +
          '<option value="">Tümü</option>' +
          f.options.map(function(o){
            var v = typeof o === 'string' ? o : o.value;
            var l = typeof o === 'string' ? o : o.label;
            return '<option value="' + esc(v) + '"' + (String(cur) === String(v) ? ' selected' : '') + '>' + esc(l) + '</option>';
          }).join('') + '</select></div>';
      }).join('');

      GV.drawer({
        title:'Gelişmiş Filtre',
        body:body,
        actions:[
          { label:'Temizle', cls:'btn-line', onClick:function(){ state.filters = {}; reset(); render(); } },
          { label:'Uygula', cls:'btn-acc', onClick:function(close, el){
              var next = {};
              fields.forEach(function(f){
                if(f.type === 'multi'){
                  var vs = Array.prototype.slice.call(el.querySelectorAll('[data-f="' + f.key + '"]:checked')).map(function(i){ return i.value; });
                  if(vs.length) next[f.key] = vs;
                }else if(f.type === 'daterange'){
                  var a = el.querySelector('[data-f="' + f.key + '"][data-part="0"]').value;
                  var b = el.querySelector('[data-f="' + f.key + '"][data-part="1"]').value;
                  if(a || b) next[f.key] = a + '~' + b;
                }else{
                  var v = el.querySelector('[data-f="' + f.key + '"]').value;
                  if(v) next[f.key] = v;
                }
              });
              state.filters = next; reset(); render();
            } }
        ]
      });
    }

    /* ---- kolon yöneticisi ---- */
    function openCols(anchor){
      var views = [];
      try{ views = JSON.parse(localStorage.getItem(LS_VIEWS) || '[]'); }catch(e){}

      var body = '<div class="gv-pop-list">' + state.cols.map(function(c, i){
        var d = colDef(c.key);
        if(!d) return '';
        return '<label class="gv-pop-item"><input type="checkbox" data-col="' + c.key + '"' +
               (c.visible ? ' checked' : '') + (d.locked ? ' disabled' : '') + '>' +
               '<span>' + esc(d.label) + '</span>' +
               '<button type="button" class="ia btn-xs" data-move="' + i + '" data-dir="up" aria-label="Yukarı taşı">' + ico('i-chev-up','ic-sm') + '</button>' +
               '<button type="button" class="ia btn-xs" data-move="' + i + '" data-dir="down" aria-label="Aşağı taşı">' + ico('i-chev-down','ic-sm') + '</button>' +
               '</label>';
      }).join('') + '</div>' +
      (views.length ? '<div class="gv-pop-head" style="margin-top:var(--sp-6)"><span class="gv-pop-title">Kayıtlı görünümler</span></div>' +
        views.map(function(v,i){
          return '<button type="button" class="gv-pop-item" data-loadview="' + i + '">' + ico('i-eye','ic-sm') + esc(v.ad) + '</button>';
        }).join('') : '');

      GV.modal({
        title:'Kolon Yönetimi',
        text:'Görünecek kolonları seçin, sırayı değiştirin veya bu görünümü kaydedin.',
        icon:'i-columns', size:'sm',
        body:body,
        actions:[
          { label:'Görünümü Kaydet', cls:'btn-line', close:false, onClick:function(close, el){
              var ad = prompt('Görünüm adı:');
              if(!ad) return false;
              views.push({ ad:ad, cols:state.cols.slice() });
              try{ localStorage.setItem(LS_VIEWS, JSON.stringify(views)); }catch(e){}
              GV.toast('Görünüm kaydedildi: ' + ad, 'ok');
              return false;
            } },
          { label:'Varsayılana Dön', cls:'btn-line', onClick:function(){
              try{ localStorage.removeItem(LS_COLS); }catch(e){}
              state.cols = cfg.columns.map(function(c){ return { key:c.key, visible:c.visible !== false }; });
              render();
            } },
          { label:'Uygula', cls:'btn-acc', onClick:function(close, el){
              Array.prototype.slice.call(el.querySelectorAll('[data-col]')).forEach(function(i){
                var c = state.cols.filter(function(x){ return x.key === i.dataset.col; })[0];
                if(c) c.visible = i.checked;
              });
              if(!state.cols.some(function(c){ return c.visible; })) state.cols[0].visible = true;
              saveCols(); render();
            } }
        ]
      });

      /* sıra değiştirme — modal içinde canlı */
      setTimeout(function(){
        var mb = document.querySelector('.gv-modal-body');
        if(!mb) return;
        mb.addEventListener('click', function(e){
          var b = e.target.closest('[data-move]');
          if(!b) return;
          e.preventDefault();
          var i = +b.dataset.move;
          var j = b.dataset.dir === 'up' ? i - 1 : i + 1;
          if(j < 0 || j >= state.cols.length) return;
          var tmp = state.cols[i]; state.cols[i] = state.cols[j]; state.cols[j] = tmp;
          saveCols();
          var scrim = b.closest('.gv-scrim');
          if(scrim) scrim.remove();
          document.body.style.overflow = '';
          render();
          openCols(anchor);
        });
      }, 40);
    }

    /* ---- çıktı ---- */
    function openExport(rows){
      var scopes = [
        { key:'filtreli', label:'Filtrelenmiş kayıtlar (' + rows.length + ')' },
        { key:'tumu', label:'Tüm kayıtlar (' + source().length + ')' }
      ];
      if(state.selected.length) scopes.unshift({ key:'secili', label:'Seçili kayıtlar (' + state.selected.length + ')' });

      GV.modal({
        title:'Çıktı Al', text:'Kapsam ve biçim seçin.', icon:'i-download', size:'sm',
        body:'<div class="field"><span class="f-lbl">Kapsam</span><div class="f-radios">' +
          scopes.map(function(s,i){
            return '<label class="f-radio"><input type="radio" name="expscope" value="' + s.key + '"' +
                   (i === 0 ? ' checked' : '') + '>' + esc(s.label) + '</label>';
          }).join('') + '</div></div>' +
          '<div class="field u-mt-4"><span class="f-lbl">Biçim</span><div class="f-radios">' +
          [['xlsx','Excel'],['csv','CSV'],['pdf','PDF'],['print','Yazdır']].map(function(f,i){
            return '<label class="f-radio"><input type="radio" name="expfmt" value="' + f[0] + '"' +
                   (i === 0 ? ' checked' : '') + '>' + f[1] + '</label>';
          }).join('') + '</div></div>',
        actions:[
          { label:'Vazgeç', cls:'btn-line' },
          { label:'Çıktı Al', cls:'btn-acc', onClick:function(close, el){
              var scope = el.querySelector('[name=expscope]:checked').value;
              var fmt = el.querySelector('[name=expfmt]:checked').value;
              var data = scope === 'tumu' ? source()
                       : scope === 'secili' ? source().filter(function(r){ return state.selected.indexOf(r[cfg.key]) !== -1; })
                       : rows;
              doExport(data, fmt);
            } }
        ]
      });
    }

    function doExport(rows, fmt){
      var cols = visibleCols().filter(function(c){ return c.exportable !== false; });
      var head = cols.map(function(c){ return c.label; });
      var body = rows.map(function(r){
        return cols.map(function(c){
          var v = c.exportValue ? c.exportValue(r) : r[c.key];
          if(v == null) return '';
          return String(v).replace(/<[^>]*>/g,'').trim();
        });
      });
      var name = (cfg.exportName || 'liste') + '-' + (window.DB ? DB.today : '');

      if(fmt === 'print' || fmt === 'pdf'){
        var w = window.open('', '_blank');
        if(!w){ GV.toast('Açılır pencere engellendi', 'danger'); return; }
        w.document.write('<html><head><title>' + name + '</title><meta charset="utf-8">' +
          '<style>body{font-family:system-ui,sans-serif;padding:24px;color:#101426}' +
          'h1{font-size:18px;margin:0 0 4px}p{color:#6A7189;font-size:12px;margin:0 0 18px}' +
          'table{width:100%;border-collapse:collapse;font-size:11px}' +
          'th{background:#EDF0F5;text-align:left;padding:7px;border:1px solid #E3E7EE;font-size:10px;text-transform:uppercase}' +
          'td{padding:7px;border:1px solid #E3E7EE}</style></head><body>' +
          '<h1>' + esc(cfg.exportTitle || 'Liste çıktısı') + '</h1>' +
          '<p>Gavia Works · ' + Fmt.date(window.DB ? DB.today : '') + ' · ' + rows.length + ' kayıt</p>' +
          '<table><thead><tr>' + head.map(function(h){ return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          body.map(function(r){ return '<tr>' + r.map(function(c){ return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
          '</tbody></table></body></html>');
        w.document.close();
        setTimeout(function(){ w.print(); }, 300);
        GV.toast(fmt === 'pdf' ? 'Yazdırma penceresinden PDF olarak kaydedebilirsiniz' : 'Yazdırma penceresi açıldı', 'info', 5000);
        return;
      }

      var sep = fmt === 'csv' ? ',' : '\t';
      var text = [head].concat(body).map(function(r){
        return r.map(function(c){ return /["\n,;\t]/.test(c) ? '"' + c.replace(/"/g,'""') + '"' : c; }).join(sep);
      }).join('\n');
      var mime = fmt === 'csv' ? 'text/csv;charset=utf-8' : 'application/vnd.ms-excel;charset=utf-8';
      var blob = new Blob(['﻿' + text], { type:mime });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name + (fmt === 'csv' ? '.csv' : '.xls');
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
      GV.toast(rows.length + ' kayıt dışa aktarıldı', 'ok');
    }

    /* ---- yükleme simülasyonu (skeleton → veri) ---- */
    function load(){
      setTimeout(function(){
        state.loading = false;
        render();
      }, cfg.delay == null ? 260 : cfg.delay);
    }

    readURL();
    render();
    load();

    return {
      state:state,
      refresh:render,
      setTab:function(k){ state.tab = k; reset(); render(); },
      setFilter:function(k, v){ state.filters[k] = v; reset(); render(); }
    };
  };

  /* ===================================================================
     5. CHIPBAR / SCROLL İPUCU
     =================================================================== */
  function wireChipbar(root){
    var wraps = (root || document).querySelectorAll('.chipbar-wrap');
    Array.prototype.forEach.call(wraps, function(w){
      var bar = w.querySelector('.chipbar');
      var prev = w.querySelector('.cb-prev');
      var next = w.querySelector('.cb-next');
      if(!bar || !prev || !next) return;
      function upd(){
        var over = bar.scrollWidth > bar.clientWidth + 2;
        prev.hidden = !over || bar.scrollLeft <= 2;
        next.hidden = !over || bar.scrollLeft >= bar.scrollWidth - bar.clientWidth - 2;
      }
      prev.addEventListener('click', function(){ bar.scrollBy({ left:-220, behavior:'smooth' }); });
      next.addEventListener('click', function(){ bar.scrollBy({ left:220, behavior:'smooth' }); });
      bar.addEventListener('scroll', upd);
      window.addEventListener('resize', upd);
      setTimeout(upd, 60);
      var active = bar.querySelector('[aria-selected="true"]');
      if(active) active.scrollIntoView({ inline:'nearest', block:'nearest' });
    });
  }
  GV.chipbar = wireChipbar;

  function wireScrollHint(root){
    var wraps = (root || document).querySelectorAll('.gv-tablewrap');
    Array.prototype.forEach.call(wraps, function(w){
      function upd(){
        w.classList.toggle('has-shadow-r', w.scrollWidth > w.clientWidth + 2 && w.scrollLeft < w.scrollWidth - w.clientWidth - 2);
        w.classList.toggle('has-shadow-l', w.scrollLeft > 2);
      }
      w.addEventListener('scroll', upd);
      window.addEventListener('resize', upd);
      setTimeout(upd, 60);
    });
  }

  /* ===================================================================
     6. SEKME BİLEŞENİ (detay sayfaları)
     =================================================================== */
  GV.tabs = function(root){
    var el = typeof root === 'string' ? document.querySelector(root) : root;
    if(!el) return;
    var btns = Array.prototype.slice.call(el.querySelectorAll('[role=tab]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('[role=tabpanel]'));

    function activate(key, push){
      btns.forEach(function(b){ b.setAttribute('aria-selected', b.dataset.tab === key ? 'true' : 'false'); });
      panels.forEach(function(p){ p.hidden = p.dataset.panel !== key; });
      if(push) history.replaceState({}, '', location.pathname + location.search + '#' + key);
      var b = btns.filter(function(x){ return x.dataset.tab === key; })[0];
      if(b) b.scrollIntoView({ inline:'nearest', block:'nearest' });
      document.dispatchEvent(new CustomEvent('gv:tab', { detail:{ key:key } }));
    }

    el.addEventListener('click', function(e){
      var b = e.target.closest('[role=tab]');
      if(b) activate(b.dataset.tab, true);
    });
    el.addEventListener('keydown', function(e){
      if(['ArrowLeft','ArrowRight'].indexOf(e.key) === -1) return;
      var i = btns.indexOf(document.activeElement);
      if(i === -1) return;
      var n = e.key === 'ArrowRight' ? (i + 1) % btns.length : (i - 1 + btns.length) % btns.length;
      btns[n].focus(); activate(btns[n].dataset.tab, true);
    });

    var hash = location.hash.replace('#','');
    activate(hash && btns.some(function(b){ return b.dataset.tab === hash; }) ? hash : btns[0].dataset.tab, false);
    return { activate:activate };
  };

  /* ===================================================================
     7. FORM BİLEŞENİ
     =================================================================== */
  GV.form = function(cfg){
    var mount = typeof cfg.mount === 'string' ? document.querySelector(cfg.mount) : cfg.mount;
    if(!mount) return null;
    var rec = cfg.record || {};
    var dirty = false;

    function fieldHtml(f){
      var v = rec[f.key] != null ? rec[f.key] : (f.value != null ? f.value : '');
      var id = 'f_' + f.key;
      var req = f.required ? '<span class="req" aria-hidden="true">*</span>' : '';
      var inner = '';

      if(f.type === 'textarea'){
        inner = '<textarea id="' + id + '" name="' + f.key + '" rows="' + (f.rows || 4) + '"' +
                (f.required ? ' required' : '') + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') +
                '>' + esc(v) + '</textarea>';
      }else if(f.type === 'select'){
        inner = '<select id="' + id + '" name="' + f.key + '"' + (f.required ? ' required' : '') + '>' +
          '<option value="">' + esc(f.placeholder || 'Seçiniz') + '</option>' +
          (f.options || []).map(function(o){
            var ov = typeof o === 'string' ? o : o.value;
            var ol = typeof o === 'string' ? o : o.label;
            return '<option value="' + esc(ov) + '"' + (String(v) === String(ov) ? ' selected' : '') + '>' + esc(ol) + '</option>';
          }).join('') + '</select>';
      }else if(f.type === 'switch'){
        inner = '<label class="f-switch"><input type="checkbox" id="' + id + '" name="' + f.key + '"' +
                (v ? ' checked' : '') + '><span class="sw"></span><span>' + esc(f.onLabel || 'Aktif') + '</span></label>';
      }else if(f.type === 'checkbox'){
        inner = '<label class="f-check"><input type="checkbox" id="' + id + '" name="' + f.key + '"' +
                (v ? ' checked' : '') + '><span>' + esc(f.checkLabel || f.label) + '</span></label>';
      }else if(f.type === 'radio'){
        inner = '<div class="f-radios">' + (f.options || []).map(function(o){
          var ov = typeof o === 'string' ? o : o.value;
          var ol = typeof o === 'string' ? o : o.label;
          return '<label class="f-radio"><input type="radio" name="' + f.key + '" value="' + esc(ov) + '"' +
                 (String(v) === String(ov) ? ' checked' : '') + '>' + esc(ol) + '</label>';
        }).join('') + '</div>';
      }else if(f.type === 'file'){
        inner = '<div class="gv-upload" data-upload tabindex="0" role="button">' + ico('i-upload','ic-lg') +
                '<div class="gv-upload-title">Dosya seçin veya sürükleyip bırakın</div>' +
                '<div class="gv-upload-hint">' + esc(f.hint || 'PDF, DOCX, XLSX, PNG, JPG · en fazla 20 MB') + '</div>' +
                '<input type="file" id="' + id + '" name="' + f.key + '" hidden' + (f.multiple ? ' multiple' : '') + '></div>' +
                '<div class="gv-filelist" data-filelist></div>';
      }else if(f.type === 'money'){
        inner = '<div class="f-affix"><input type="number" class="inp" id="' + id + '" name="' + f.key + '" value="' + esc(v) + '"' +
                (f.required ? ' required' : '') + ' min="0" step="1"><span class="f-suffix">' + esc(f.currency || '₺') + '</span></div>';
      }else if(f.type === 'percent'){
        inner = '<div class="f-affix"><input type="number" class="inp" id="' + id + '" name="' + f.key + '" value="' + esc(v) + '" min="0" max="100"><span class="f-suffix">%</span></div>';
      }else{
        var t = f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : f.type === 'email' ? 'email' :
                f.type === 'tel' ? 'tel' : f.type === 'url' ? 'url' : 'text';
        inner = '<input type="' + t + '" class="inp" id="' + id + '" name="' + f.key + '" value="' + esc(v) + '"' +
                (f.required ? ' required' : '') + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') +
                (f.min != null ? ' min="' + f.min + '"' : '') + (f.max != null ? ' max="' + f.max + '"' : '') + '>';
      }

      return '<div class="field f-col-' + (f.cols || 6) + '" data-field="' + f.key + '">' +
        (f.type === 'switch' || f.type === 'checkbox' ? '' : '<label for="' + id + '">' + esc(f.label) + req + '</label>') +
        inner +
        (f.hint && f.type !== 'file' ? '<div class="f-hint">' + esc(f.hint) + '</div>' : '') +
        '<div class="f-err">' + ico('i-alert-circle','ic-sm') + '<span></span></div>' +
      '</div>';
    }

    var html = '<form novalidate>' +
      '<div class="form-err-summary" role="alert"><span>' + ico('i-alert') + '</span>' +
      '<div><b>Form gönderilemedi.</b><ul></ul></div></div>';

    (cfg.sections || []).forEach(function(s){
      html += '<div class="gv-form-sec">' +
        (s.title ? '<div class="gv-form-sec-head"><h3>' + esc(s.title) + '</h3>' +
          (s.desc ? '<p>' + esc(s.desc) + '</p>' : '') + '</div>' : '') +
        '<div class="gv-fields">' + (s.fields || []).map(fieldHtml).join('') + '</div></div>';
    });

    html += '</form>';
    mount.innerHTML = html;

    var form = mount.querySelector('form');
    form.addEventListener('input', function(){ dirty = true; });
    form.addEventListener('change', function(){ dirty = true; });

    /* dosya alanı */
    Array.prototype.forEach.call(mount.querySelectorAll('[data-upload]'), function(u){
      var input = u.querySelector('input[type=file]');
      var list = u.parentElement.querySelector('[data-filelist]');
      function show(files){
        list.innerHTML = Array.prototype.map.call(files, function(f){
          return '<div class="gv-file"><span class="gv-file-ico">' + ico('i-file','ic-sm') + '</span>' +
            '<span><span class="gv-file-name">' + esc(f.name) + '</span>' +
            '<span class="gv-file-meta">' + (f.size / 1024 > 1024 ? (f.size / 1048576).toFixed(1) + ' MB' : Math.round(f.size / 1024) + ' KB') + '</span></span>' +
            '<button type="button" class="ia is-danger" data-rmfile aria-label="Kaldır">' + ico('i-x','ic-sm') + '</button></div>';
        }).join('');
      }
      u.addEventListener('click', function(){ input.click(); });
      u.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); input.click(); } });
      u.addEventListener('dragover', function(e){ e.preventDefault(); u.classList.add('is-over'); });
      u.addEventListener('dragleave', function(){ u.classList.remove('is-over'); });
      u.addEventListener('drop', function(e){
        e.preventDefault(); u.classList.remove('is-over');
        input.files = e.dataTransfer.files; show(input.files);
      });
      input.addEventListener('change', function(){ show(input.files); });
      list.addEventListener('click', function(e){
        if(e.target.closest('[data-rmfile]')){ e.target.closest('.gv-file').remove(); input.value = ''; }
      });
    });

    function allFields(){
      return (cfg.sections || []).reduce(function(a, s){ return a.concat(s.fields || []); }, []);
    }

    function validate(){
      var errs = [];
      allFields().forEach(function(f){
        var wrap = mount.querySelector('[data-field="' + f.key + '"]');
        if(!wrap) return;
        var el = wrap.querySelector('input,select,textarea');
        if(!el) return;
        wrap.classList.remove('is-invalid');
        var val = el.type === 'checkbox' ? el.checked : el.value;
        var msg = '';

        if(f.required && (val === '' || val == null || val === false)) msg = f.label + ' zorunlu alandır.';
        else if(val && f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) msg = 'Geçerli bir e-posta adresi girin.';
        else if(val && f.type === 'tel' && String(val).replace(/\D/g,'').length < 10) msg = 'Telefon numarası en az 10 haneli olmalıdır.';
        else if(val && f.type === 'url' && !/^https?:\/\//.test(val)) msg = 'Bağlantı http:// veya https:// ile başlamalıdır.';
        else if(val && f.min != null && Number(val) < f.min) msg = 'En küçük değer ' + f.min + '.';
        else if(val && f.max != null && Number(val) > f.max) msg = 'En büyük değer ' + f.max + '.';
        else if(f.validate){
          var data = read();
          msg = f.validate(val, data) || '';
        }

        if(msg){
          wrap.classList.add('is-invalid');
          wrap.querySelector('.f-err span').textContent = msg;
          errs.push({ key:f.key, msg:msg });
        }
      });

      var sum = mount.querySelector('.form-err-summary');
      sum.classList.toggle('is-on', errs.length > 0);
      sum.querySelector('ul').innerHTML = errs.map(function(e){ return '<li>' + esc(e.msg) + '</li>'; }).join('');
      if(errs.length){
        var first = mount.querySelector('[data-field="' + errs[0].key + '"] input, [data-field="' + errs[0].key + '"] select, [data-field="' + errs[0].key + '"] textarea');
        if(first){ first.focus(); sum.scrollIntoView({ behavior:'smooth', block:'center' }); }
      }
      return errs;
    }

    function read(){
      var out = {};
      allFields().forEach(function(f){
        var el = mount.querySelector('[name="' + f.key + '"]');
        if(!el) return;
        if(el.type === 'checkbox') out[f.key] = el.checked;
        else if(el.type === 'radio') { var c = mount.querySelector('[name="' + f.key + '"]:checked'); out[f.key] = c ? c.value : ''; }
        else out[f.key] = el.value;
      });
      return out;
    }

    /* kaydetmeden çıkış uyarısı */
    window.addEventListener('beforeunload', function(e){
      if(dirty){ e.preventDefault(); e.returnValue = ''; }
    });

    return {
      validate:validate,
      read:read,
      submit:function(){
        var errs = validate();
        if(errs.length){ GV.toast(errs.length + ' alan hatalı — kontrol edin', 'danger'); return null; }
        dirty = false;
        return read();
      },
      setDirty:function(v){ dirty = v; }
    };
  };

  /* ===================================================================
     8. AKTİVİTE TIMELINE / ONAY ZİNCİRİ
     =================================================================== */
  GV.activity = function(items){
    if(!items || !items.length){
      return GV.empty({ icon:'i-activity', title:'Henüz hareket yok', desc:'Bu kayıt üzerinde yapılan tüm değişiklikler burada listelenir.' });
    }
    return '<div class="gv-timeline">' + items.map(function(a){
      return '<div class="gv-tl-item">' +
        '<span class="gv-tl-dot is-' + (a.tone || 'neutral') + '">' + ico(a.icon || 'i-dot','ic-sm') + '</span>' +
        '<div class="gv-tl-head"><span class="gv-tl-who">' + esc(a.kisi || '—') + '</span>' +
        '<span class="gv-tl-when">' + Fmt.dt(a.tarih) + '</span></div>' +
        '<div class="gv-tl-text">' + esc(a.metin) + '</div>' +
        (a.eski != null || a.yeni != null
          ? '<div class="gv-tl-diff"><span class="old">' + esc(a.eski || '—') + '</span>' + ico('i-arrow-right','ic-sm') +
            '<span class="new">' + esc(a.yeni || '—') + '</span></div>' : '') +
      '</div>';
    }).join('') + '</div>';
  };

  GV.chain = function(steps){
    return '<div class="gv-chain">' + (steps || []).map(function(s){
      var st = s.durum === 'Onaylandı' ? 'ok' : s.durum === 'Reddedildi' ? 'danger' :
               s.durum === 'Bekliyor' ? 'wait' : 'idle';
      var icn = st === 'ok' ? 'i-check-circle' : st === 'danger' ? 'i-x-circle' : st === 'wait' ? 'i-clock' : 'i-dot';
      return '<div class="gv-chain-step is-' + st + '">' +
        '<div class="gv-chain-top"><span class="gv-chain-ico">' + ico(icn,'ic-sm') + '</span>' +
        '<span class="gv-chain-role">' + esc(s.rol) + '</span></div>' +
        '<div class="gv-chain-who">' + esc(s.kisi || 'Atanmadı') + '</div>' +
        '<div class="gv-chain-when">' + (s.tarih ? Fmt.dt(s.tarih) : esc(s.durum)) + '</div>' +
        (s.not ? '<div class="gv-chain-note">' + esc(s.not) + '</div>' : '') +
      '</div>';
    }).join('') + '</div>';
  };

  /* ===================================================================
     9. BASİT SVG GRAFİKLER
     =================================================================== */
  var Chart = {
    bar:function(data, opt){
      opt = opt || {};
      var w = opt.width || 640, h = opt.height || 220, pad = 32, padL = opt.padL || 48;
      var max = Math.max.apply(null, data.map(function(d){ return d.value; }).concat([1]));
      var bw = (w - padL - pad) / data.length;
      var svg = '<svg class="gv-chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opt.label || 'Sütun grafik') + '">';
      for(var g = 0; g <= 4; g++){
        var y = pad + (h - pad * 2) * (g / 4);
        svg += '<line class="gridline" x1="' + padL + '" y1="' + y + '" x2="' + (w - pad) + '" y2="' + y + '"/>';
        svg += '<text class="lbl" x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end">' +
               Fmt.num(Math.round(max * (1 - g / 4))) + '</text>';
      }
      data.forEach(function(d, i){
        var bh = (h - pad * 2) * (d.value / max);
        var x = padL + i * bw + bw * 0.18;
        var bwid = bw * 0.64;
        svg += '<rect class="bar' + (d.tone ? ' is-' + d.tone : '') + '" x="' + x + '" y="' + (h - pad - bh) +
               '" width="' + bwid + '" height="' + Math.max(2, bh) + '" rx="4"><title>' + esc(d.label) + ': ' + Fmt.num(d.value) + '</title></rect>';
        svg += '<text class="lbl" x="' + (x + bwid / 2) + '" y="' + (h - pad + 16) + '" text-anchor="middle">' + esc(d.label) + '</text>';
        if(opt.showValues !== false)
          svg += '<text class="val" x="' + (x + bwid / 2) + '" y="' + (h - pad - bh - 6) + '" text-anchor="middle">' + Fmt.num(d.value) + '</text>';
      });
      return svg + '</svg>';
    },

    line:function(series, labels, opt){
      opt = opt || {};
      var w = opt.width || 640, h = opt.height || 220, pad = 32, padL = 52;
      var all = series.reduce(function(a, s){ return a.concat(s.values); }, []);
      var max = Math.max.apply(null, all.concat([1]));
      var stepX = (w - padL - pad) / Math.max(1, labels.length - 1);
      var svg = '<svg class="gv-chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opt.label || 'Çizgi grafik') + '">';
      for(var g = 0; g <= 4; g++){
        var y = pad + (h - pad * 2) * (g / 4);
        svg += '<line class="gridline" x1="' + padL + '" y1="' + y + '" x2="' + (w - pad) + '" y2="' + y + '"/>';
        svg += '<text class="lbl" x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end">' +
               (opt.money ? Fmt.moneyK(Math.round(max * (1 - g / 4))) : Fmt.num(Math.round(max * (1 - g / 4)))) + '</text>';
      }
      series.forEach(function(s, si){
        var pts = s.values.map(function(v, i){
          return [padL + i * stepX, h - pad - (h - pad * 2) * (v / max)];
        });
        var d = pts.map(function(p, i){ return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
        if(si === 0 && opt.area !== false){
          svg += '<path class="area" d="' + d + ' L' + pts[pts.length-1][0].toFixed(1) + ' ' + (h - pad) + ' L' + pts[0][0].toFixed(1) + ' ' + (h - pad) + ' Z"/>';
        }
        svg += '<path class="line' + (si ? ' is-2' : '') + '" d="' + d + '"/>';
        pts.forEach(function(p, i){
          svg += '<circle class="pt" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.4"><title>' +
                 esc(labels[i]) + ': ' + (opt.money ? Fmt.money(s.values[i]) : Fmt.num(s.values[i])) + '</title></circle>';
        });
      });
      labels.forEach(function(l, i){
        svg += '<text class="lbl" x="' + (padL + i * stepX) + '" y="' + (h - pad + 16) + '" text-anchor="middle">' + esc(l) + '</text>';
      });
      return svg + '</svg>';
    },

    donut:function(data, opt){
      opt = opt || {};
      var size = opt.size || 200, r = size / 2 - 12, cx = size / 2, cy = size / 2, sw = opt.thickness || 26;
      var total = data.reduce(function(a, d){ return a + d.value; }, 0) || 1;
      var colors = ['var(--acc-ink)','var(--info)','var(--purple)','var(--warn)','var(--danger)','var(--ok)','var(--neutral)'];
      var off = 0;
      var circ = 2 * Math.PI * r;
      var svg = '<svg class="gv-chart" viewBox="0 0 ' + size + ' ' + size + '" style="max-width:' + size + 'px" role="img" aria-label="' + esc(opt.label || 'Halka grafik') + '">';
      data.forEach(function(d, i){
        var len = circ * (d.value / total);
        svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + (d.color || colors[i % colors.length]) +
               '" stroke-width="' + sw + '" stroke-dasharray="' + len.toFixed(2) + ' ' + (circ - len).toFixed(2) +
               '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"><title>' +
               esc(d.label) + ': ' + Fmt.num(d.value) + '</title></circle>';
        off += len;
      });
      if(opt.center){
        svg += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" class="val" style="font-size:22px">' + esc(opt.center) + '</text>';
        if(opt.centerSub) svg += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" class="lbl">' + esc(opt.centerSub) + '</text>';
      }
      return svg + '</svg>';
    },

    legend:function(data){
      var colors = ['var(--acc-ink)','var(--info)','var(--purple)','var(--warn)','var(--danger)','var(--ok)','var(--neutral)'];
      return '<div class="gv-legend">' + data.map(function(d, i){
        return '<span class="gv-legend-item"><span class="gv-legend-swatch" style="background:' +
               (d.color || colors[i % colors.length]) + '"></span>' + esc(d.label) + ' · <b>' + Fmt.num(d.value) + '</b></span>';
      }).join('') + '</div>';
    },

    spark:function(values, opt){
      opt = opt || {};
      var w = opt.width || 120, h = opt.height || 32;
      var max = Math.max.apply(null, values.concat([1])), min = Math.min.apply(null, values);
      var span = (max - min) || 1;
      var d = values.map(function(v, i){
        var x = i * (w / Math.max(1, values.length - 1));
        var y = h - 2 - (h - 4) * ((v - min) / span);
        return (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }).join(' ');
      return '<svg class="gv-chart" viewBox="0 0 ' + w + ' ' + h + '" style="width:' + w + 'px;height:' + h + 'px">' +
             '<path class="line" style="stroke-width:1.8" d="' + d + '"/></svg>';
    }
  };
  GV.chart = Chart;

  /* ===================================================================
     10. WIP BAĞLANTI KORUMASI — sahte buton bırakılmaz
     =================================================================== */
  function wipNotice(w){
    GV.toast('“' + (w.dataset.wip || 'Bu ekran') + '” henüz yayında değil — sonraki wave\'de eklenecek.', 'info');
  }
  document.addEventListener('click', function(e){
    var w = e.target.closest('[data-wip]');
    if(!w) return;
    e.preventDefault();
    wipNotice(w);
  });
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Enter' && e.key !== ' ') return;
    var w = e.target.closest && e.target.closest('[data-wip]');
    if(!w) return;
    e.preventDefault();
    wipNotice(w);
  });

  /* Yardım tetikleyicisi */
  document.addEventListener('click', function(e){
    var h = e.target.closest('[data-help]');
    if(!h) return;
    e.preventDefault();
    GV.modal({ title:h.dataset.helpTitle || 'Açıklama', text:h.dataset.help, icon:'i-info', size:'sm',
               actions:[{ label:'Anladım', cls:'btn-acc' }] });
  });

})();
