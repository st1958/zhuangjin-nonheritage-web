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
