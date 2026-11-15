/* 姓名：黄俊杰　学号：20251091058 */
/* 文化介绍页交互脚本：汉堡菜单、阅读进度条、数字带滚动、渐现、时间轴选中与详情、工序卡展开。 */
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


  // 7 时间轴：点击节点切换选中，其余收起
  var tls = Array.prototype.slice.call(document.querySelectorAll('.tl li'));
  tls.forEach(function (li) {
    li.addEventListener('click', function () {
      var on = li.classList.contains('on');
      tls.forEach(function (x) { x.classList.remove('on'); });
      if (!on) li.classList.add('on');
    });
  });


  // 8 工序卡：点击展开完整说明
  var crafts = Array.prototype.slice.call(document.querySelectorAll('.craft div'));
  crafts.forEach(function (c) {
    c.addEventListener('click', function () { c.classList.toggle('on'); });
  });
})();

/* ---------- 12 时间轴：点节点看这一段在讲什么 ---------- */
(function () {
  var tl = document.querySelector('.tl');
  if (!tl || tl.parentNode.querySelector('.tl-detail')) return;
  var data = [
    ['宋代　贡品', '文献里能查到壮锦作为贡品的记录。蜀锦技艺随人南传，和本地织法混在一起，慢慢长成后来的壮锦。'],
    ['明清　鼎盛', '桂西一带织坊成规模，婚嫁、节庆都以壮锦为礼。图案也从纯几何扩展出花鸟，用色更放开。'],
    ['民国　民间', '时局动荡加上洋布冲击，织造退回家族内部，母女相授，样式趋于简省。'],
    ['2006　入选国家级非遗', '列入第一批国家级非物质文化遗产名录，开始有系统的记录、普查与传习。'],
    ['今天　数字化传承', '纹样建档、线上展示、文创转化，先让图案被更多人看见，再谈怎么活下去。']
  ];
  var box = document.createElement('div');
  box.className = 'detail tl-detail';
  box.hidden = true;
  tl.parentNode.insertBefore(box, tl.nextSibling);
  var lis = tl.querySelectorAll('li');
  for (var i = 0; i < lis.length; i++) {
    (function (k) {
      lis[k].addEventListener('click', function () {
        if (!box.hidden && box.getAttribute('data-i') === String(k)) {
          box.hidden = true; box.innerHTML = ''; box.setAttribute('data-i', ''); return;
        }
        box.innerHTML = '<b>' + data[k][0] + '</b><p>' + data[k][1] + '</p>';
        box.hidden = false; box.setAttribute('data-i', String(k));
      });
    })(i);
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
