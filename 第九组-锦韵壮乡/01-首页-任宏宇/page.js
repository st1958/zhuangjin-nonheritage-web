/* 公共交互：汉堡菜单 / 纹样筛选 / 留言提交 */
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

  // 3 留言：校验 + 写入本地 + 留言墙
  var form = document.getElementById('msgForm');
  if (form) {
    var wall = document.querySelector('.wall');
    var tip = form.querySelector('.tip');
    var KEY = 'jinyun_messages';

    function load() {
      try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
    }
    function save(list) {
      try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 40))); } catch (e) {}
    }
    function render(item, prepend) {
      var el = document.createElement('div');
      el.className = 'note';
      el.innerHTML = '<div class="ava"></div><div><b></b><div class="txt"></div></div>';
      el.querySelector('b').textContent = item.name;
      el.querySelector('.txt').textContent = item.text;
      if (prepend && wall.firstChild) wall.insertBefore(el, wall.firstChild);
      else wall.appendChild(el);
    }

    load().reverse().forEach(function (m) { render(m, false); });
    function refresh() {
      var c = document.getElementById('msgCount');
      if (c) c.textContent = document.querySelectorAll('.wall .note').length + ' 条';
    }
    refresh();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var text = form.elements.text.value.trim();
      if (!name) { tip.textContent = '请先填一个昵称'; return; }
      if (!text) { tip.textContent = '留言内容不能为空'; return; }
      if (text.length > 80) { tip.textContent = '留言请控制在 80 字以内'; return; }
      tip.textContent = '';
      var list = load(); list.push({ name: name, text: text });
      save(list); render({ name: name, text: text }, true); refresh();
      form.reset();
      tip.textContent = '已提交，谢谢你的留言。';
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

  // 9 成员卡：点击选中，其余淡出
  var mems = Array.prototype.slice.call(document.querySelectorAll('.mem'));
  mems.forEach(function (m) {
    m.addEventListener('click', function () {
      var on = m.classList.contains('on');
      mems.forEach(function (x) { x.classList.remove('on'); });
      if (!on) m.classList.add('on');
    });
  });

  // 10 联系邮箱：点击复制
  var mailLi = Array.prototype.slice.call(document.querySelectorAll('.contact li')).filter(function (li) {
    return /@/.test(li.textContent);
  })[0];
  if (mailLi) {
    var mail = mailLi.textContent.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/);
    if (mail) {
      mailLi.classList.add('mail');
      mailLi.title = '点击复制邮箱';
      mailLi.addEventListener('click', function () {
        var text = mail[0];
        var done = function () { toast('邮箱已复制：' + text); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { toast('邮箱：' + text); });
        } else {
          toast('邮箱：' + text);
        }
      });
    }
  }
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('in'); }, 10);
    setTimeout(function () {
      t.classList.remove('in');
      setTimeout(function () { t.parentNode && t.parentNode.removeChild(t); }, 300);
    }, 1800);
  }

})();


/* ---------- 11 首页轮播：三张幻灯片，自动 6 秒 + 手动切换 ---------- */
(function () {
  var hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('.slides')) return;

  var data = [
    { bg: './assets/hero.jpg' },
    { bg: './assets/p2.jpg', en: '万字纹　绵延不断', h1: '一纹一世界', p: '八款经典纹样，款款有名字，有来历。' },
    { bg: './assets/p4.jpg', en: '太阳纹　光与热', h1: '两千年，一匹布', p: '从宋代贡品到今天，织锦没有停下。' }
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

/* ---------- 14 成员卡：点开看各人分工 ---------- */
(function () {
  var mem = document.querySelector('.members');
  if (!mem || mem.parentNode.querySelector('.mem-detail')) return;
  var data = [
    ['任宏宇 · 组长', '首页与全站公共样式、公共脚本；配色、两档断点和导航高度由他统一，五页同步维护。'],
    ['黄俊杰 · 文化资料', '文化介绍页：五节点时间轴的年份与史实、三道工序的说明文字。'],
    ['白高领 · 纹样整编', '纹样展示页：八款纹样的名称与寓意、图片裁切，以及按类筛选的脚本。'],
    ['申涛 · 互动设计', '互动留言页：表单校验、云端存储与缓存兜底、留言墙的增删。'],
    ['周家豪 · 页面实现', '关于联系页：成员卡、印章与联系方式的版式，手机端单列排布。']
  ];
  var box = document.createElement('div');
  box.className = 'detail mem-detail';
  box.hidden = true;
  mem.parentNode.insertBefore(box, mem.nextSibling);
  var cards = mem.querySelectorAll('.mem');
  for (var i = 0; i < cards.length; i++) {
    (function (k) {
      cards[k].addEventListener('click', function () {
        if (!box.hidden && box.getAttribute('data-i') === String(k)) {
          box.hidden = true; box.innerHTML = ''; box.setAttribute('data-i', ''); return;
        }
        box.innerHTML = '<b>' + data[k][0] + '</b><p>' + data[k][1] + '</p>';
        box.hidden = false; box.setAttribute('data-i', String(k));
      });
    })(i);
  }
})();
