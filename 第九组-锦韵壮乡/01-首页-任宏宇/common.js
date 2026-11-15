/* 姓名：任宏宇　学号：20251091065 */
/* 公共交互脚本：汉堡菜单、阅读进度条、数字带滚动、卡片渐现、右下角返回顶部与返回首页。
   五个页面都引用这一份；各页自己的交互写在本页文件夹的 page.js 里。 */
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
