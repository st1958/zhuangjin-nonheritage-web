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
    ['任宏宇 · 组长', '首页：三张轮播主视觉、四张入口卡、底部数字带，以及导航下那条制作团队条，1440 与 390 两端都逐项调过。<br>全站公共部分：配色变量、导航与页脚、1199 与 767 两档断点，集中在根目录的 style.css 与 common.js，五页共用一份，改一处全站生效。<br>另外负责汇报 PPT 与本册的统稿排版，把组员交来的内容并进同一份文档，统一字号与间距。'],
    ['黄俊杰 · 文化资料', '文化介绍页：宋代贡品、明清织造、民国、2006 年入选国家级名录、今天五个阶段的年份与史实逐条核对，写成时间轴上的五段说明。<br>三道工序卡片（穿经、提花、打纬）的文字同样出自他整理的公开资料。<br>这一页的版式和时间轴展开动效也由他做，桌面与手机两端逐条校对过。'],
    ['白高领 · 纹样整编', '纹样展示页：整理卍字纹、万字纹、菱形纹、太阳纹、水波纹、蝴蝶纹、凤鸟纹、回纹八款的名字、出处与寓意，并逐张裁出方形实物图。<br>完成四个分类标签的筛选、卡片点开后的抽屉大图、鼠标悬停的圆形放大镜和右上角收藏。<br>手机端改成单列、抽屉撑满整屏，手指滑动直接翻下一款。'],
    ['申涛 · 互动设计', '互动留言页：昵称与内容的表单校验、80 字计数、提交瞬间的浅灰占位条，等待期间按钮显示“正在发送”。<br>留言接上云端数据库，同时在本机留一份缓存，弱网时先存这台设备、连上网再自动补传。<br>还处理了长留言折叠、按时间倒序、时间显示成“刚刚 / 几分钟前”，以及手机键盘弹起时把输入框自动挪到可见区。'],
    ['周家豪 · 页面实现', '关于联系页：把五个人的姓名与分工写成五张成员卡，点开共用同一块面板换内容，不会越点越长。<br>联系区四条信息、朱红印章、版权说明与页脚收尾；手机上卡片转两列、印章竖排。<br>全站最后的三端实测、错别字与失效链接检查也由他收口。']
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

/* ---------- 进页面先选中第一位成员，分工详情默认可见 ---------- */
(function () {
  var mem = document.querySelector('.members');
  var box = document.querySelector('.mem-detail');
  if (!mem || !box) return;
  if (mem.querySelector('.mem.on')) return;
  var first = mem.querySelector('.mem');
  if (first) setTimeout(function () { first.click(); }, 350);
})();

/* ---------- 从首页团队条带 #m1～#m5 进来时，直接选中对应成员 ---------- */
(function () {
  var mem = document.querySelector('.members');
  if (!mem) return;
  var m = /^#m([1-5])$/.exec(location.hash || '');
  if (!m) return;
  var idx = parseInt(m[1], 10) - 1;
  var cards = mem.querySelectorAll('.mem');
  if (!cards[idx]) return;
  setTimeout(function () { cards[idx].click(); }, 390);
})();
