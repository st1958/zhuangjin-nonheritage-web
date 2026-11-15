/* 姓名：周家豪　学号：20251091073
   本页交互：成员卡选中与分工详情、邮箱复制。 */

(function () {


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
