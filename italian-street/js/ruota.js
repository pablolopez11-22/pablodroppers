/* =========================================================
   Italian Street · La ruota della pasta
   Tragaperras con dos rodillos (pasta y salsa). La palanca los
   hace girar; también se mueven a mano (deslizar o flechas).
   Usa PASTAS, SALSA_STYLE y MENU (js/menu.js) y las utilidades
   de js/main.js ($, esc, euro, alText, reduceMotion).
   ========================================================= */
(function () {
  var machine = document.getElementById('machine');
  if (!machine) return;

  var SALSAS = MENU.find(function (c) { return c.id === 'pasta'; }).items.map(function (it) {
    return Object.assign({}, it, SALSA_STYLE[it.name]);
  });
  var isMatch = function (p, s) { return p.goes.some(function (g) { return s.kind.indexOf(g) !== -1; }); };
  var joinOr = function (a) { return a.length > 1 ? a.slice(0, -1).join(', ') + ' o ' + a[a.length - 1] : a[0] || ''; };
  var REPEAT = 14;   // copias de la lista en cada rodillo (para poder girar varias vueltas)

  function makeReel(el, items, render) {
    var strip = el.querySelector('.reel__strip');
    var win = el.querySelector('.reel__window');
    var html = '';
    for (var r = 0; r < REPEAT; r++) items.forEach(function (it) { html += '<div class="reel__item">' + render(it) + '</div>'; });
    strip.innerHTML = html;
    var reel = { el: el, items: items, strip: strip, pos: items.length * 2, busy: false };

    reel.itemH = function () { return strip.firstElementChild.offsetHeight; };
    reel.place = function (ms, ease) {
      strip.style.transition = ms ? 'transform ' + ms + 'ms ' + (ease || 'cubic-bezier(.2,.8,.3,1)') : 'none';
      strip.style.transform = 'translateY(' + (-(reel.pos - 1) * reel.itemH()) + 'px)';
    };
    // Vuelve a una copia central sin que se note (para no llegar nunca al final)
    reel.normalize = function () {
      var n = items.length;
      reel.pos = n * 2 + ((reel.pos % n) + n) % n;
      reel.place(0);
    };
    reel.index = function () { var n = items.length; return ((reel.pos % n) + n) % n; };
    reel.value = function () { return items[reel.index()]; };
    reel.step = function (d) {
      if (reel.busy) return;
      reel.busy = true;
      reel.pos += d; reel.place(reduceMotion ? 0 : 220);
      setTimeout(function () { reel.normalize(); reel.busy = false; update(); }, reduceMotion ? 0 : 230);
    };
    reel.spinTo = function (target, turns, ms, done) {
      var n = items.length;
      reel.busy = true; el.classList.add('is-blur');
      reel.pos = reel.pos - reel.index() + n * turns + target;
      reel.place(ms, 'cubic-bezier(.12,.6,.18,1.02)');
      setTimeout(function () { el.classList.remove('is-blur'); }, ms * 0.7);
      setTimeout(function () { reel.normalize(); reel.busy = false; done && done(); }, ms + 30);
    };

    el.querySelectorAll('.reel__arrow').forEach(function (b) {
      b.addEventListener('click', function () { reel.step(+b.dataset.step); });
    });
    // Deslizar con el dedo o el ratón
    // Deslizar arriba/abajo cambia de opción; tocar la fila de arriba o de abajo también
    var y0 = null, yStart = 0, moved = 0;
    win.addEventListener('pointerdown', function (e) {
      if (reel.busy) return;
      e.preventDefault();
      y0 = yStart = e.clientY; moved = 0;
      try { win.setPointerCapture(e.pointerId); } catch (err) {}
    });
    win.addEventListener('pointermove', function (e) {
      if (y0 === null || reel.busy) return;
      var dy = e.clientY - y0, h = reel.itemH() * 0.45 * (window.__Z || 1);
      if (Math.abs(dy) > h) { reel.step(dy > 0 ? -1 : 1); y0 = e.clientY; moved++; }
    });
    win.addEventListener('pointerup', function (e) {
      if (y0 !== null && !moved && Math.abs(e.clientY - yStart) < 8) {
        var r = win.getBoundingClientRect(), f = (e.clientY - r.top) / r.height;
        if (f < 0.34) reel.step(-1); else if (f > 0.66) reel.step(1);
      }
      y0 = null;
    });
    win.addEventListener('pointercancel', function () { y0 = null; });
    return reel;
  }

  var reelP = makeReel(document.getElementById('reelPasta'), PASTAS, function (p) {
    return '<img src="' + p.img + '" alt="" width="54" height="54"><b>' + esc(p.name) + '</b>';
  });
  var reelS = makeReel(document.getElementById('reelSalsa'), SALSAS, function (s) {
    return '<i style="background:' + s.color + '"></i><b>' + esc(s.name) + '</b><small>' + euro(s.price) + '</small>';
  });
  // Empieza en Gnocchi + Pesto Verde (recomendada)
  reelP.pos += PASTAS.findIndex(function (p) { return p.id === 'gnocchi'; });
  reelS.pos += SALSAS.findIndex(function (s) { return s.name === 'Pesto Verde'; });
  reelP.place(0); reelS.place(0);
  window.addEventListener('resize', function () { reelP.place(0); reelS.place(0); });

  var result = document.querySelector('.result');

  function update() {
    var p = reelP.value(), s = reelS.value(), rec = isMatch(p, s);
    $('#plateName').innerHTML = esc(p.name) + ' <em>' + esc(s.name) + '</em>';
    $('#platePrice').textContent = euro(s.price);
    $('#plateDesc').textContent = s.desc;
    $('#plateAl').textContent = 'Alérgenos: ' + alText(s.al);
    var m = $('#plateMatch');
    if (rec) m.textContent = 'Combinación recomendada por la casa.';
    else {
      var recs = PASTAS.filter(function (x) { return isMatch(x, s); }).map(function (x) { return x.name; });
      m.textContent = 'Combinación libre · la casa la recomienda con ' + joinOr(recs) + '.';
    }
    result.classList.remove('is-pending');
  }

  // ---------- Palanca ----------
  var lever = document.getElementById('lever');
  var hint = document.getElementById('ruotaHint');
  lever.addEventListener('click', function () {
    if (reelP.busy || reelS.busy) return;
    lever.classList.add('is-pulled');
    setTimeout(function () { lever.classList.remove('is-pulled'); }, 260);
    hint.textContent = '¡Gira, gira…!';
    machine.classList.add('is-spinning');
    result.classList.add('is-pending');
    var tp = Math.floor(Math.random() * PASTAS.length);
    var ts = Math.floor(Math.random() * SALSAS.length);
    var slow = reduceMotion ? 0 : 1;
    reelP.spinTo(tp, 3, 1500 * slow + 10);
    reelS.spinTo(ts, 4, 2300 * slow + 10, function () {
      machine.classList.remove('is-spinning');
      hint.textContent = 'Tira otra vez o desliza los rodillos';
      update();
    });
  });

  update();
})();
