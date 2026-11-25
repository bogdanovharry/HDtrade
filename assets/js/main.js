(function () {
  // Sticky header shadow
  var header = document.querySelector('.header');
  var onScroll = function () { header && header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile navigation
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mobile-nav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { mnav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    });
  }

  // Reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('is-in'); }); }

  // Project slider
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var slides = root.querySelectorAll('.slide');
    var dots = root.querySelector('.dots');
    var i = 0, timer;
    slides.forEach(function (_, n) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Проект ' + (n + 1));
      b.addEventListener('click', function () { go(n); restart(); });
      dots.appendChild(b);
    });
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k !== i); });
      dots.querySelectorAll('button').forEach(function (d, k) { d.setAttribute('aria-current', k === i); });
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6000); }
    root.querySelector('[data-prev]').addEventListener('click', function () { go(i - 1); restart(); });
    root.querySelector('[data-next]').addEventListener('click', function () { go(i + 1); restart(); });
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);
    go(0); restart();
  });

  // Project filters
  var filters = document.querySelector('.filters');
  if (filters) {
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      filters.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var f = b.dataset.filter;
      document.querySelectorAll('.project-card').forEach(function (c) {
        c.parentElement.hidden = !(f === 'all' || c.dataset.cat === f);
      });
    });
  }

  // Offer form — no backend yet: compose an e-mail to the company
  var form = document.getElementById('offer-form');
  if (form) {
    var params = new URLSearchParams(location.search);
    var pre = params.get('s');
    if (pre) { var r = form.querySelector('input[name="system"][value="' + pre + '"]'); if (r) r.checked = true; }
    var preMsg = params.get('msg');
    if (preMsg) { var ta = form.querySelector('textarea[name="message"]'); if (ta && !ta.value) ta.value = preMsg; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (form.dataset.demo) { var ds = form.querySelector('.form__status'); if (ds) ds.textContent = 'Демо версия: запитването не се изпраща. Обадете се на 087 948 7678.'; return; }
      var d = new FormData(form);
      var systems = d.getAll('system').join(', ');
      var body = [
        'Име: ' + d.get('name'),
        'E-mail: ' + d.get('email'),
        'Телефон: ' + d.get('phone'),
        'Тип обект: ' + (d.get('object') || '-'),
        'Интересувам се от: ' + (systems || '-'),
        '',
        d.get('message') || ''
      ].join('\n');
      var subject = d.get('subject') || 'Запитване за оферта от уебсайта';
      location.href = 'mailto:' + form.dataset.to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var st = form.querySelector('.form__status');
      if (st) st.textContent = 'Отваряме вашия имейл клиент. Ако не се отвори, обадете ни се на 087 948 7678.';
    });
  }

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();

/* Lay the hero airflow SVG over the photo exactly like object-fit: cover,
   so the streams start inside the fan grilles. Runs on load and resize only. */
(function () {
  var hero = document.querySelector('.hero');
  var svg = hero && hero.querySelector('.ac-air__svg');
  var img = hero && hero.querySelector('.hero__media img');
  if (!svg || !img) return;
  var vb = svg.viewBox.baseVal;
  function place() {
    var hr = hero.getBoundingClientRect(), mr = img.getBoundingClientRect();
    var W = mr.width, H = mr.height;
    var s = Math.max(W / vb.width, H / vb.height);
    var dw = vb.width * s, dh = vb.height * s;
    var pos = getComputedStyle(img).objectPosition.split(' ');
    var px = parseFloat(pos[0]) / 100, py = parseFloat(pos[1] || '50%') / 100;
    if (isNaN(px)) px = .5; if (isNaN(py)) py = .5;
    svg.style.left = (mr.left - hr.left + (W - dw) * px) + 'px';
    svg.style.top = (mr.top - hr.top + (H - dh) * py) + 'px';
    svg.style.width = dw + 'px';
    svg.style.height = dh + 'px';
    svg.style.right = 'auto';
  }
  place();
  if (!img.complete) img.addEventListener('load', place);
  var to; window.addEventListener('resize', function () { clearTimeout(to); to = setTimeout(place, 100); });
})();
