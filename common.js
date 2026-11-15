/* 公共交互脚本（五个页面共用一份）
   姓名：任宏宇　学号：20251091065
   内容：汉堡菜单、阅读进度条、数字带滚动、卡片渐现、右下角返回顶部与返回首页。
   各页自己的交互写在本页文件夹的 page.js 里。 */

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
    home.href = '../01-home/index1.html';
    home.textContent = '⌂';
    box.appendChild(home);
  }
  document.body.appendChild(box);
})();

/* —— 无障碍补充：键盘与读屏友好（第九组追加，不改动上面原有逻辑） —— */
(function () {
  var burger = document.querySelector('.burger'), links = document.querySelector('.nav .links');
  if (burger && links) {
    links.id = links.id || 'siteLinks';
    burger.setAttribute('aria-controls', 'siteLinks');
    burger.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false');
    new MutationObserver(function () {
      burger.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false');
    }).observe(links, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        burger.focus();
      }
    });
  }

  function pressable(el) {
    if (!el || el.getAttribute('role') === 'button') return;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  }

  function tick() {
    var i;
    var chips = document.querySelectorAll('.chip');
    for (i = 0; i < chips.length; i++) {
      pressable(chips[i]);
      chips[i].setAttribute('aria-pressed', chips[i].classList.contains('on') ? 'true' : 'false');
    }
    var dots = document.querySelectorAll('.dots i');
    for (i = 0; i < dots.length; i++) {
      if (dots[i].getAttribute('role') === 'button') continue;
      pressable(dots[i]);
      dots[i].setAttribute('aria-label', '第 ' + (i + 1) + ' 张');
    }
    var prev = document.querySelector('.pager.prev'), next = document.querySelector('.pager.next');
    if (prev && !prev.getAttribute('aria-label')) prev.setAttribute('aria-label', '上一张');
    if (next && !next.getAttribute('aria-label')) next.setAttribute('aria-label', '下一张');
    var favs = document.querySelectorAll('.fav');
    for (i = 0; i < favs.length; i++) {
      var name = favs[i].getAttribute('data-name');
      if (!name) {
        var fig = favs[i].closest('figure');
        name = fig ? (fig.querySelector('b') || {}).textContent || '' : '';
      }
      favs[i].setAttribute('aria-label', (favs[i].classList.contains('on') ? '取消收藏' : '收藏') + '《' + String(name).trim() + '》');
      favs[i].setAttribute('aria-pressed', favs[i].classList.contains('on') ? 'true' : 'false');
    }
    var mag = document.querySelector('.mag');
    if (mag && !mag.getAttribute('aria-hidden')) mag.setAttribute('aria-hidden', 'true');
  }

  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(tick, 120);
  }
  document.addEventListener('DOMContentLoaded', tick);
  window.addEventListener('load', function () { tick(); setTimeout(tick, 400); });
  new MutationObserver(schedule).observe(document.body, {
    subtree: true, childList: true, attributes: true, attributeFilter: ['class']
  });
})();

/* —— 留言页体验补充：点下就有反馈，不等云端（第九组追加） —— */
(function () {
  var form = document.getElementById('msgForm');
  if (!form) return;
  var wall = document.getElementById('msgWall') || document.querySelector('.wall');
  if (!wall) return;
  var nameEl = form.elements.name, textEl = form.elements.text;
  var btn = form.querySelector('.btn');
  var btnText = btn ? btn.textContent : '';
  var pending = null, timer = null, baseCount = 0;

  function len(s) { return Array.from(s).length; }

  function done() {
    if (pending && pending.parentNode) pending.parentNode.removeChild(pending);
    pending = null;
    clearTimeout(timer);
    if (btn) { btn.disabled = false; btn.textContent = btnText; }
  }

  function showPending(name, text) {
    done();
    baseCount = wall.querySelectorAll('.note').length;
    var el = document.createElement('div');
    el.className = 'txnote';
    var ava = document.createElement('div');
    ava.className = 'ava';
    ava.textContent = (name || '访').charAt(0);
    var main = document.createElement('div');
    var b = document.createElement('b');
    b.textContent = name;
    var tag = document.createElement('i');
    tag.className = 'tx-tag';
    tag.textContent = '正在发送';
    b.appendChild(tag);
    var txt = document.createElement('div');
    txt.className = 'txt';
    txt.textContent = text;
    main.appendChild(b);
    main.appendChild(txt);
    el.appendChild(ava);
    el.appendChild(main);
    wall.insertBefore(el, wall.firstChild);
    pending = el;
    if (btn) { btn.disabled = true; btn.textContent = '正在发送…'; }
    timer = setTimeout(done, 20000);
  }

  form.addEventListener('submit', function (e) {
    var name = (nameEl.value || '').trim();
    var text = (textEl.value || '').trim();
    if (!name || len(name) > 16) return;
    if (!text || len(text) > 80) return;
    showPending(name, text);
  }, true);

  new MutationObserver(function () {
    if (!pending) return;
    if (wall.querySelectorAll('.note').length > baseCount) done();
  }).observe(wall, { childList: true });

  // 打开页面时先说明一句，别让留言墙空着不明所以
  var hint = document.createElement('div');
  hint.className = 'wall-loading';
  hint.textContent = '正在读取云端留言…';
  wall.insertBefore(hint, wall.firstChild);
  var clearHint = function () {
    if (hint.parentNode) hint.parentNode.removeChild(hint);
  };
  setTimeout(clearHint, 6000);
  new MutationObserver(function () {
    if (wall.querySelector('.note')) clearHint();
  }).observe(wall, { childList: true });
})();

/* —— 关于页：成员卡首字头像（第九组追加） —— */
(function () {
  var mems = document.querySelectorAll('.members .mem');
  Array.prototype.forEach.call(mems, function (m) {
    var ava = m.querySelector('.ava');
    var name = m.querySelector('b');
    if (!ava || !name) return;
    if (ava.textContent.trim()) return;
    ava.textContent = name.textContent.trim().charAt(0);
    ava.setAttribute('aria-hidden', 'true');
  });
})();
