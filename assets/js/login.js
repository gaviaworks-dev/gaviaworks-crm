/* =====================================================================
   GAVIAWORKS CRM — GİRİŞ EKRANI
   Form doğrulaması + rol/persona seçici. Rol seçimi oturuma yazılır
   (URL'e bırakılmaz — tasks/assumptions.md V-04).
   ===================================================================== */
(function(){
  'use strict';

  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function(){
    /* Önceki oturum varsa temizle — bu ekran çıkış noktasıdır */
    if(window.GV && GV.shell) GV.shell.clear();

    /* ---- Sekmeler ---- */
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-lgtab]'));
    var panes = Array.prototype.slice.call(document.querySelectorAll('[data-lgpane]'));
    tabs.forEach(function(t){
      t.addEventListener('click', function(){
        tabs.forEach(function(x){ x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        panes.forEach(function(p){ p.hidden = p.dataset.lgpane !== t.dataset.lgtab; });
      });
    });

    /* ---- Parola göster/gizle ---- */
    var pass = document.getElementById('lgPass');
    var eye = document.getElementById('lgEye');
    if(eye) eye.addEventListener('click', function(){
      var show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      eye.setAttribute('aria-label', show ? 'Parolayı gizle' : 'Parolayı göster');
      eye.innerHTML = '<svg class="ic ic-sm" aria-hidden="true"><use href="#' + (show ? 'i-eye-off' : 'i-eye') + '"></use></svg>';
    });

    /* ---- Giriş formu doğrulaması ---- */
    var form = document.getElementById('lgForm');
    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var errs = [];
        var mail = document.getElementById('lgMail');
        var pw = document.getElementById('lgPass');

        [[mail, 'E-posta'], [pw, 'Parola']].forEach(function(p){
          p[0].closest('.field').classList.remove('is-invalid');
        });

        var mv = mail.value.trim();
        if(!mv) errs.push([mail, 'E-posta adresi zorunludur.']);
        else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mv)) errs.push([mail, 'Geçerli bir e-posta adresi girin.']);
        else if(!/@gaviaworks\.com$/i.test(mv)) errs.push([mail, 'Yalnızca @gaviaworks.com adresleri giriş yapabilir.']);

        if(!pw.value) errs.push([pw, 'Parola zorunludur.']);
        else if(pw.value.length < 6) errs.push([pw, 'Parola en az 6 karakter olmalıdır.']);

        var sum = form.querySelector('.form-err-summary');
        errs.forEach(function(p){
          var f = p[0].closest('.field');
          f.classList.add('is-invalid');
          f.querySelector('.f-err span').textContent = p[1];
        });
        sum.classList.toggle('is-on', errs.length > 0);
        sum.querySelector('ul').innerHTML = errs.map(function(p){ return '<li>' + p[1] + '</li>'; }).join('');

        if(errs.length){ errs[0][0].focus(); return; }

        /* Eşleşen personeli bul, yoksa şirket sahibiyle aç */
        var emp = (window.DB && DB.employees.filter(function(x){
          return x.eposta.toLowerCase() === mv.toLowerCase();
        })[0]) || (window.DB && DB.employees[0]);

        if(!emp){ GV.toast('Kullanıcı bulunamadı', 'danger'); return; }
        GV.shell.setSession(emp.kod, emp.rol);
        location.href = 'app-panel.html';
      });
    }

    /* ---- Rol / persona kartları ---- */
    var host = document.getElementById('lgRoles');
    if(host && window.DB){
      var GROUPS = [
        { lbl:'Yönetim', roles:['sahip','pm'] },
        { lbl:'Satış ve Müşteri', roles:['satismudur','satistemsilci','destek'] },
        { lbl:'Üretim Ekibi', roles:['tasarimci','backend','frontend','ai','mobil','qa','devops'] },
        { lbl:'Destek Birimleri', roles:['ik','muhasebe'] },
        { lbl:'Kısıtlı Erişim', roles:['freelancer','stajyer'] }
      ];

      var html = '';
      GROUPS.forEach(function(g){
        var found = g.roles.map(function(rk){
          return DB.employees.filter(function(e){ return e.rol === rk; })[0];
        }).filter(Boolean);
        if(!found.length) return;
        html += '<div class="lg-role-group">' + g.lbl + '</div>';
        found.forEach(function(e){
          html += '<button type="button" class="lg-role" data-emp="' + e.kod + '" data-role="' + e.rol + '">' +
            '<span class="lg-role-ava">' + e.ini + '</span>' +
            '<span class="lg-role-body">' +
              '<span class="lg-role-name">' + e.ad + '</span>' +
              '<span class="lg-role-title">' + DB.roleName(e.rol) + ' · ' + e.depAd + '</span>' +
            '</span>' +
            '<svg class="ic ic-sm" aria-hidden="true"><use href="#i-arrow-right"></use></svg>' +
          '</button>';
        });
      });
      host.innerHTML = html;

      host.addEventListener('click', function(e){
        var b = e.target.closest('[data-emp]');
        if(!b) return;
        GV.shell.setSession(b.dataset.emp, b.dataset.role);
        location.href = 'app-panel.html';
      });
    }
  });
})();
