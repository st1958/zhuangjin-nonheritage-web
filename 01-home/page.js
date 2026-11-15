/* 姓名：任宏宇　学号：20251091065
   本页交互：首屏轮播，三张，6 秒自动切换，可箭头与圆点手动切换。 */

/* ---------- 11 首页轮播：三张幻灯片，自动 6 秒 + 手动切换 ---------- */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.slides')) return;

  var data = [
    { bg: '../assets/hero_a.jpg' },
    { bg: '../assets/hero_b.jpg', en: '竹笼机　一架木机', h1: '花本挂上去，纹就活了', p: '竹笼上的竹针就是花本，最简单的木机也能织出最复杂的纹。' },
    { bg: '../assets/hero_c.jpg', en: '经与纬　一双手', h1: '一匹锦，上万次穿引', p: '穿经、提花、打纬，手上的分寸是用年数换来的。' }
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

/* ---------- 19 轮播的键盘与手势：← → 切换，手机左右滑 ---------- */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero || !hero.querySelector('.slides')) return;
  var prev = hero.querySelector('.pager.prev'), next = hero.querySelector('.pager.next');

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft' && prev) prev.click();
    if (e.key === 'ArrowRight' && next) next.click();
  });

  var sx = 0, sy = 0;
  hero.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; sx = t.clientX; sy = t.clientY;
  }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx > 0 && prev) prev.click();
    if (dx < 0 && next) next.click();
  }, { passive: true });
})();
