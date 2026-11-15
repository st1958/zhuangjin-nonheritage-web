/* 姓名：黄俊杰　学号：20251091058
   本页交互：时间轴点节点看这一段详情，织造工序卡点击展开。 */

(function () {


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
    ['宋代　贡品',
     '壮锦的形成大致在唐宋之间。南宋周去非《岭外代答》记广西织品“白质方纹，广幅大缕”，说的正是这类以方格、菱形为骨架的厚重织物；宋代织物上常见的方胜纹，两个菱形压角相叠，取“同心”之意。壮语里壮锦称 mbaw laiz fax，意为“天纹之页”。蜀锦工艺随人南传，与本地织法融合，慢慢长成后来的壮锦。',
     '资料来源：周去非《岭外代答》；广西壮族自治区人民政府《壮族织锦技艺》'],
    ['明清　鼎盛',
     '明代壮锦被列为贡品，桂西一带织坊成规模，龙凤、花鸟、几何并用，图案从纯几何走向多层复合，达官显贵“莫不争购之”。清代壮锦进入寻常人家，婚嫁的被面、背带、头巾都用它，织锦由贡品变成日用之物的同时，纹样也越发繁密。织锦成了许多壮族妇女养家的一门手艺。',
     '资料来源：广西地方志；广西非物质文化遗产网'],
    ['民国　民间',
     '时局动荡，加上机织洋布大量涌入，手工织锦的销路迅速萎缩，织坊陆续散伙，技艺退回家族内部，靠母女、姑嫂口传手授延续。样式趋于简省，配色偏沉稳，主要用于嫁娶背带、被面等少数场合。这一时期留下的织机和花本，成了后来恢复生产的重要依据。',
     '资料来源：靖西市壮锦厂厂史资料'],
    ['2006　入选国家级非遗',
     '2006 年 5 月 20 日，壮族织锦技艺经国务院批准列入第一批国家级非物质文化遗产名录。此后广西开展全面普查，靖西等地从 2005 年起就着手建档、办织锦技艺比赛、开设业余织锦学校；2007 年起陆续认定国家级、自治区级代表性传承人。这项技艺第一次有了制度性的记录与传习。',
     '资料来源：第一批国家级非物质文化遗产名录；广西非遗网'],
    ['今天　数字化传承',
     '2013 年起，广西织绣发展研究会联合高校走村入寨采集纹样，建立壮锦纹样“基因库”与数字化保护平台，过去设计师埋头数月才能画完的花本，如今可调取纹样重组创新。老织机也在变：国家级传承人谭湘光把织锦宽幅从 30 厘米扩到 3 米，并引入机械织造。壮锦出现在包袋、围巾、马面裙、数码保护套上，织造课也进了职业院校。',
     '资料来源：新华社《广西壮锦：五彩经纬创新传承织就千年之美》']
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
        box.innerHTML = '<b>' + data[k][0] + '</b><p>' + data[k][1] + '</p>' +
          (data[k][2] ? '<p class="src">' + data[k][2] + '</p>' : '');
        box.hidden = false; box.setAttribute('data-i', String(k));
      });
    })(i);
  }
})();

/* ---------- 13 时间轴的键盘操作：↑ ↓ 翻上下一段，详情自动滚到眼前 ---------- */
(function () {
  var tl = document.querySelector('.tl'), box = document.querySelector('.tl-detail');
  if (!tl || !box) return;
  var lis = tl.querySelectorAll('li');

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    var cur = parseInt(box.getAttribute('data-i'), 10);
    var n;
    if (isNaN(cur)) {
      n = e.key === 'ArrowDown' ? 0 : lis.length - 1;
    } else {
      n = (cur + (e.key === 'ArrowDown' ? 1 : -1) + lis.length) % lis.length;
      if (n === cur) return;
    }
    lis[n].click();
    if (!box.hidden) box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
})();
