/* 姓名：任宏宇　学号：20251091065 */
/* 首页交互脚本：汉堡菜单、阅读进度条、数字带滚动、卡片渐现、首屏轮播。 */
(function () {
  // 1 汉堡菜单
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.links');
  if (burger && links) {
    burger.addEventListener('click', function () { links.classList.toggle('open'); });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }


  // 4 阅读进度条
  var prog = document.createElement('div');
  prog.className = 'prog';
  document.body.appendChild(prog);
  function tick() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var top = h.scrollTop || document.body.scrollTop || 0;
    prog.style.width = (max > 0 ? Math.min(100, top / max * 100) : 0) + '%';
  }
  window.addEventListener('scroll', tick);
  window.addEventListener('resize', tick);
  tick();


  // 5 底部数字带：进入视口后从 0 滚到目标值
  var nums = Array.prototype.slice.call(document.querySelectorAll('.stats b'));
  if (nums.length && 'IntersectionObserver' in window) {
    var count = function (el, target, suffix) {
      var cur = 0;
      var step = Math.max(1, Math.ceil(target / 24));
      var t = setInterval(function () {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = cur + suffix;
      }, 26);
    };
    var io1 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        count(e.target, +e.target.dataset.num, e.target.dataset.suf);
        io1.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (b) {
      var m = b.textContent.match(/^(\d+)(.*)$/);
      if (!m || +m[1] > 100) return;
      b.dataset.num = m[1];
      b.dataset.suf = m[2];
      b.textContent = '0' + m[2];
      io1.observe(b);
    });
  }


  // 6 卡片与列表：滚动进入时渐现
  var reveal = Array.prototype.slice.call(document.querySelectorAll('.card, .tl li, .craft div, .mem, .note'));
  if (reveal.length && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io2.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    reveal.forEach(function (x) { x.classList.add('reveal'); io2.observe(x); });
  }
})();

/* ---------- 11 首页轮播：三张幻灯片，自动 6 秒 + 手动切换 ---------- */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.slides')) return;

  var data = [
    { bg: '../assets/hero.jpg' },
    { bg: '../assets/p2.jpg', en: '万字纹　绵延不断', h1: '一纹一世界', p: '八款经典纹样，款款有名字，有来历。' },
    { bg: '../assets/p4.jpg', en: '太阳纹　光与热', h1: '两千年，一匹布', p: '从宋代贡品到今天，织锦没有停下。' }
  ];

  var i, wrap = document.createElement('div');
  wrap.className = 'slides';
  var oldEn = hero.querySelector('.en'), oldH1 = hero.querySelector('.h1'), oldP = hero.querySelector('p');

  for (i = 0; i < data.length; i++) {
    var s = document.createElement('div');
    s.className = 'slide' + (i === 0 ? ' on' : '');
    s.style.backgroundImage = 'url(' + data[i].bg + ')';
    var bd = document.createElement('div');
    bd.className = 'slide-bd';
    if (i === 0 && oldEn && oldH1 && oldP) {
      bd.appendChild(oldEn); bd.appendChild(oldH1); bd.appendChild(oldP);
    } else {
      bd.innerHTML = '<div class="en">' + data[i].en + '</div><h1 class="h1">' + data[i].h1 +
        '</h1><p>' + data[i].p + '</p>';
    }
    s.appendChild(bd);
    wrap.appendChild(s);
  }
  hero.appendChild(wrap);

  var dots = document.createElement('div');
  dots.className = 'dots';
  for (i = 0; i < data.length; i++) {
    var dt = document.createElement('i');
    if (i === 0) dt.className = 'on';
    dots.appendChild(dt);
  }
  hero.appendChild(dots);

  var prev = document.createElement('button');
  prev.className = 'pager prev'; prev.type = 'button';
  prev.setAttribute('aria-label', '上一张'); prev.innerHTML = '‹';
  var next = document.createElement('button');
  next.className = 'pager next'; next.type = 'button';
  next.setAttribute('aria-label', '下一张'); next.innerHTML = '›';
  hero.appendChild(prev); hero.appendChild(next);

  var idx = 0, timer = null;
  var slides = wrap.querySelectorAll('.slide'), dotEls = dots.querySelectorAll('i');

  function go(n) {
    idx = (n + slides.length) % slides.length;
    for (var k = 0; k < slides.length; k++) {
      slides[k].className = 'slide' + (k === idx ? ' on' : '');
      dotEls[k].className = k === idx ? 'on' : '';
    }
  }
  function play() {
    if (timer) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(function () { go(idx + 1); }, 6000);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  next.addEventListener('click', function () { go(idx + 1); });
  prev.addEventListener('click', function () { go(idx - 1); });
  for (i = 0; i < dotEls.length; i++) {
    (function (k) { dotEls[k].addEventListener('click', function () { go(k); }); })(i);
  }
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', play);
  hero.addEventListener('focusin', stop);
  hero.addEventListener('focusout', play);
  play();
})();

/* ---------- 18 快捷按钮：右下角固定“返回顶部 / 返回首页” ---------- */
(function () {
  var box = document.createElement('div');
  box.className = 'quick';

  var up = document.createElement('button');
  up.type = 'button';
  up.className = 'qt';
  up.title = '返回顶部';
  up.textContent = '↑';
  up.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  box.appendChild(up);

  // 首页自己不放“返回首页”
  var isHome = /01-首页|index1\.html/.test(location.pathname);
  if (!isHome) {
    var home = document.createElement('a');
    home.className = 'qt';
    home.title = '返回首页';
    home.href = '../01-首页-任宏宇/index1.html';
    home.textContent = '⌂';
    box.appendChild(home);
  }
  document.body.appendChild(box);
})();
