/* 姓名：白高领　学号：20251091051
   本页交互：分类筛选、纹样详情抽屉、放大镜、收藏与我的收藏。 */

(function () {


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
    '菱形纹': '菱格作骨架，菱形内再填别的花纹，是壮锦最常见的“地纹”。它常以二方、四方连续铺开，被看作蛙神图腾的几何化抽象——蛙多子，寄寓繁衍与丰产。单独看是装饰，放到整幅里就是托住其他纹样的底。',
    '万字纹': '“卍”字四端延伸、首尾相接，织成满地连续纹，民间叫“万字不断头”，取绵延不绝、万事如意。常与如意纹、回纹合织，多用在被面、门帘中段，寓意福寿没有尽头。',
    '水波纹': '一道道横向起伏的波浪线，层叠如江河。壮族稻作依水而居，水波纹既是对水的敬畏，也是“田有水、谷满仓”的祈求；构图上多作边饰，像给整幅锦围上一条河。',
    '太阳纹': '以八角星或放射线为中心向四周扩散。壮族先民崇日，太阳纹常居图案正中，象征光、热与生命之源；节庆、婚嫁织物上出现最多，也常充当其他纹样的圆心。',
    '蝴蝶纹': '双翅左右对称，常与花枝同织，称“蝶恋花”“四福捧花”。“蝴”与“福”谐音，取其吉意；壮族民间又把蝶看作自由的化身，婚嫁织物上用它，盼日子和美、儿女双全。',
    '鸟纹': '多为凤、燕、鸡的抽象形，羽翼舒展、尾羽翻卷。壮族有“十件壮锦九件凤”的说法，凤纹最盛，“凤穿牡丹”寓意吉祥富贵；鸟又是迁徙与节令的信使，与农事丰歉相连。',
    '花卉纹': '桂花、菊花、梅花、荷花、八角花等本地花木，被提炼成几何朵花。既是对岭南山水的描摹，也隐喻生命繁荣；多与动物纹相伴出现，起“穿”“捧”“绕”的连接作用。',
    '回纹': '方折回环、首尾相连的连续纹。广西罗泊湾汉墓七号残葬坑曾出土橘红色回纹锦残片，把壮锦的历史推到两千多年前；回纹因此既象征福寿绵长，也是壮锦最古老的实证纹样之一。'
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
          '<p class="txt">' + (info[name] || '') + '</p>' +
          '<p class="src">资料来源：广西非物质文化遗产网、靖西市壮锦厂、新华社报道</p>';
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

/* ---------- 19 抽屉里翻页：上一款 / 下一款，键盘 ← → 也行 ---------- */
(function () {
  var gal = document.querySelector('.gal'), dr = document.querySelector('.drawer');
  if (!gal || !dr) return;
  var figs = gal.querySelectorAll('figure');

  function names() {
    return Array.prototype.map.call(figs, function (f) {
      var b = f.querySelector('b'); return b ? b.textContent.trim() : '';
    });
  }
  function curName() {
    var b = dr.querySelector('.hd b'); return b ? b.textContent.trim() : '';
  }
  function step(d) {
    var all = names(), idx = all.indexOf(curName());
    if (idx < 0) return;
    figs[(idx + d + all.length) % all.length].click();
  }

  // 抽屉每次打开都会重建内容，用观察器把翻页条补回去
  function addBar() {
    if (dr.querySelector('.dnav') || dr.querySelector('.hd') === null) return;
    var bar = document.createElement('div');
    bar.className = 'dnav';
    var p = document.createElement('button');
    p.type = 'button'; p.className = 'dprev'; p.setAttribute('aria-label', '上一款');
    p.textContent = '‹ 上一款';
    var n = document.createElement('button');
    n.type = 'button'; n.className = 'dnext'; n.setAttribute('aria-label', '下一款');
    n.textContent = '下一款 ›';
    p.addEventListener('click', function () { step(-1); });
    n.addEventListener('click', function () { step(1); });
    bar.appendChild(p); bar.appendChild(n);
    dr.appendChild(bar);
  }
  new MutationObserver(addBar).observe(dr, { childList: true });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (!dr.className || dr.className.indexOf('on') < 0) return;
    step(e.key === 'ArrowLeft' ? -1 : 1);
  });
})();

/* ---------- 20 收藏提示的初始状态：默认分类下不显示空收藏提示 ---------- */
(function () {
  var hint = document.querySelector('.empty-hint');
  if (hint) hint.hidden = true;
})();
