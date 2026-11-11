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
})();
