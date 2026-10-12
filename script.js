// LIFELINK legal pages — theme toggle, reading progress, TOC highlight, back-to-top
(function () {
  var root = document.documentElement;

  // Theme toggle (initial theme is applied inline in <head> to avoid a flash)
  var themeBtn = document.querySelector('.theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') === 'dark';
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      themeBtn.setAttribute('aria-pressed', String(!dark));
      try { localStorage.setItem('lifelink-theme', next); } catch (e) {}
    });
    themeBtn.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
  }

  // Collapse the TOC by default on small screens
  var toc = document.querySelector('.toc');
  var mq = window.matchMedia('(max-width: 980px)');
  function syncToc() { if (toc) toc.open = !mq.matches; }
  syncToc();
  if (mq.addEventListener) mq.addEventListener('change', syncToc);
  if (toc) {
    toc.addEventListener('click', function (e) {
      if (e.target.tagName === 'SUMMARY' && !mq.matches) e.preventDefault();
      if (e.target.tagName === 'A' && mq.matches) toc.open = false;
    });
  }

  // Reading progress + back-to-top
  var bar = document.querySelector('.progress');
  var topBtn = document.querySelector('.to-top');
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY || window.pageYOffset;
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (topBtn) topBtn.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0 }); });

  // Highlight the current section in the TOC
  var links = document.querySelectorAll('.toc a[href^="#"]');
  if (!('IntersectionObserver' in window) || !links.length) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove('active'); });
      var link = map[en.target.id];
      if (link) link.classList.add('active');
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) io.observe(el);
  });
})();
