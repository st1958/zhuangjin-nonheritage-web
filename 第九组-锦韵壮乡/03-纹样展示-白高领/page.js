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
