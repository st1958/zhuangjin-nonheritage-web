/* 姓名：白高领　学号：20251091051 */
/* 纹样展示页交互脚本：汉堡菜单、阅读进度条、数字带滚动、渐现、纹样分类筛选、纹样详情抽屉。 */
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


  // 2 纹样筛选
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var figs = Array.prototype.slice.call(document.querySelectorAll('.gal figure'));
  if (chips.length && figs.length) {
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.classList.toggle('on', x === c); });
        var key = c.dataset.cat || '全部';
        figs.forEach(function (f) {
          var cats = (f.dataset.cat || '').split(',');
          f.hidden = !(key === '全部' || cats.indexOf(key) > -1);
        });
      });
    });
  }
})();

/* ---------- 13 纹样卡：右侧抽屉看大图和用法 ---------- */
(function () {
  var gal = document.querySelector('.gal');
  if (!gal || document.querySelector('.drawer')) return;
  var info = {
    '菱形纹': '以菱格为骨架，是壮锦最基础的纹样，很多别的图案都长在它身上。',
    '万字纹': '“卍”字连续回旋，取绵延不断、福寿绵长的意思。',
    '水波纹': '层层横向的水波，稻作民族对河流和田畴的记忆。',
    '太阳纹': '中心放射的圆，来自对光和热的崇拜，节庆织物上常见。',
    '蝴蝶纹': '翅膀左右对称，多用在婚嫁织物上，寄寓生命与繁衍。',
    '鸟纹': '羽翼舒展，常和水波、花卉同织，被看作丰收的信使。',
    '花卉纹': '折枝或团花，讲四季轮转，也讲日子富足。',
    '回纹': '方折回环、首尾相连，取往复循环、生生不息。'
  };
  var mask = document.createElement('div');
  mask.className = 'mask';
  var dr = document.createElement('div');
  dr.className = 'drawer';
  document.body.appendChild(mask);
  document.body.appendChild(dr);

  function close() { dr.className = 'drawer'; mask.className = 'mask'; }
  mask.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  var figs = gal.querySelectorAll('figure');
  for (var i = 0; i < figs.length; i++) {
    (function (f) {
      f.style.cursor = 'pointer';
      f.addEventListener('click', function () {
        var nb = f.querySelector('b'), sb = f.querySelector('i'), im = f.querySelector('img');
        var name = nb ? nb.textContent.trim() : '';
        var sub = sb ? sb.textContent.trim() : '';
        var cat = f.getAttribute('data-cat') || '';
        dr.innerHTML = '<button class="close" type="button" aria-label="关闭">×</button>' +
          '<img src="' + (im ? im.src : '') + '" alt="' + name + '">' +
          '<div class="hd"><b>' + name + '</b><i>' + sub + '</i></div>' +
          '<p class="cat">分类：' + cat.split(',').join(' · ') + '</p>' +
          '<p class="txt">' + (info[name] || '') + '</p>';
        dr.className = 'drawer on';
        mask.className = 'mask on';
        var cb = dr.querySelector('.close');
        if (cb) cb.addEventListener('click', close);
      });
    })(figs[i]);
  }
})();

/* ---------- 16 纹样放大镜：鼠标移到图上，浮出一块圆形放大区看丝线 ---------- */
(function () {
  var gal = document.querySelector('.gal');
  if (!gal) return;
  var mag = document.createElement('div');
  mag.className = 'mag';
  document.body.appendChild(mag);
  var ZOOM = 2.2, SIZE = 150;

  gal.addEventListener('mousemove', function (e) {
    var t = e.target;
    var img = t && t.closest ? t.closest('figure img') : null;
    if (!img) { mag.style.display = 'none'; return; }
    var r = img.getBoundingClientRect();
    var x = e.clientX - r.left, y = e.clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) { mag.style.display = 'none'; return; }
    mag.style.display = 'block';
    mag.style.left = (e.clientX - SIZE / 2) + 'px';
    mag.style.top = (e.clientY - SIZE / 2) + 'px';
    mag.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")';
    mag.style.backgroundSize = (r.width * ZOOM) + 'px ' + (r.height * ZOOM) + 'px';
    mag.style.backgroundPosition = (-(x * ZOOM - SIZE / 2)) + 'px ' + (-(y * ZOOM - SIZE / 2)) + 'px';
  });
  gal.addEventListener('mouseleave', function () { mag.style.display = 'none'; });
  window.addEventListener('scroll', function () { mag.style.display = 'none'; });
})();

/* ---------- 17 纹样收藏：卡片右上角心形，筛选栏多一个“我的收藏” ---------- */
(function () {
  var KEY = 'jinyun_favs';
  var gal = document.querySelector('.gal');
  var chips = document.querySelector('.chips');
  if (!gal || !chips) return;
  var figs = Array.prototype.slice.call(gal.querySelectorAll('figure'));

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }

  var favs = load();
  var cur = '全部';

  function nameOf(f) {
    var b = f.querySelector('figcaption b');
    return b ? b.textContent : '';
  }

  figs.forEach(function (f) {
    var name = nameOf(f);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fav';
    btn.title = '收藏这款纹样';
    btn.setAttribute('aria-label', '收藏「' + name + '」');
    if (favs.indexOf(name) >= 0) btn.className = 'fav on';
    btn.setAttribute('aria-pressed', favs.indexOf(name) >= 0 ? 'true' : 'false');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();                       // 不影响卡片本身的详情抽屉
      var i = favs.indexOf(name);
      if (i >= 0) favs.splice(i, 1); else favs.push(name);
      var on = favs.indexOf(name) >= 0;
      btn.className = on ? 'fav on' : 'fav';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', (on ? '取消收藏「' : '收藏「') + name + '」');
      save(favs);
      if (cur === '我的收藏') apply('我的收藏');
    });
    f.appendChild(btn);
  });

  // 追加“我的收藏”筛选标签
  var mine = document.createElement('span');
  mine.className = 'chip';
  mine.textContent = '我的收藏';
  mine.setAttribute('data-cat', '我的收藏');
  chips.appendChild(mine);

  // 收藏为空时的提示
  var hint = document.createElement('p');
  hint.className = 'empty-hint';
  hint.textContent = '还没有收藏，把喜欢的纹样右上角的心点亮一下。';
  gal.parentNode.insertBefore(hint, gal.nextSibling);

  function apply(cat) {
    cur = cat;
    var shown = 0;
    figs.forEach(function (f) {
      var ok;
      if (cat === '我的收藏') ok = favs.indexOf(nameOf(f)) >= 0;
      else ok = cat === '全部' || (f.getAttribute('data-cat') || '').split(',').indexOf(cat) >= 0;
      f.hidden = !ok;
      if (ok) shown++;
    });
    hint.hidden = !(cat === '我的收藏' && shown === 0);
  }

  mine.addEventListener('click', function () {
    Array.prototype.forEach.call(chips.querySelectorAll('.chip'), function (c) {
      c.classList.toggle('on', c === mine);
    });
    apply('我的收藏');
  });
  // 点回其他分类时，按常规分类筛选
  chips.addEventListener('click', function (e) {
    var c = e.target;
    while (c && c !== chips && !(c.classList && c.classList.contains('chip'))) c = c.parentNode;
    if (!c || c === chips || c === mine) return;
    apply(c.getAttribute('data-cat'));
  });
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
