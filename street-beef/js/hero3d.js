/* =========================================================
   Street Beef · portada en 3D
   El rótulo es un medallón con grosor que flota y gira despacio.
   Se inclina con el ratón (ordenador) o arrastrando el dedo
   (móvil). Por delante suben chispas de la brasa.
   ========================================================= */
(function () {
  var hero = document.querySelector('.hero');
  var sign = document.getElementById('sign3d');
  var scene = document.getElementById('scene') || sign;
  var moto = document.getElementById('moto');
  var layers = [].slice.call(document.querySelectorAll('.scene__layer'));
  var disc = document.getElementById('disc');
  if (!hero || !sign || !disc) return;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Canto del medallón: capas apiladas que dan grosor al girar
  var LAYERS = 18;
  var back = disc.querySelector('.sign3d__back');
  for (var i = 0; i < LAYERS; i++) {
    var e = document.createElement('div');
    e.className = 'sign3d__edge';
    var f = i / (LAYERS - 1) - 0.5;                       // -0.5 … 0.5
    e.style.setProperty('--z', 'calc(var(--t) * ' + f.toFixed(3) + ')');
    disc.insertBefore(e, back);
  }

  // Inclinación del usuario (ratón o dedo), suavizada
  var target = { x: 0, y: 0 }, user = { x: 0, y: 0 }, dragging = false;
  function aim(clientX, clientY) {
    var r = scene.getBoundingClientRect();
    target.x = Math.max(-1, Math.min(1, (clientX - (r.left + r.width / 2)) / (r.width / 2)));
    target.y = Math.max(-1, Math.min(1, (clientY - (r.top + r.height / 2)) / (r.height / 2)));
  }
  if (window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', function (e) { aim(e.clientX, e.clientY); });
    hero.addEventListener('mouseleave', function () { target.x = target.y = 0; });
  }
  scene.addEventListener('pointerdown', function (e) { dragging = true; aim(e.clientX, e.clientY); });
  window.addEventListener('pointermove', function (e) { if (dragging) aim(e.clientX, e.clientY); });
  window.addEventListener('pointerup', function () { dragging = false; target.x = target.y = 0; });
  window.addEventListener('pointercancel', function () { dragging = false; target.x = target.y = 0; });

  // ---------- Chispas de la brasa ----------
  var canvas = document.getElementById('embers');
  var ctx = canvas && canvas.getContext('2d');
  var sparks = [], W = 0, H = 0, dpr = 1;
  function resize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(70, Math.max(28, W / 22)));
    sparks = [];
    for (var k = 0; k < n; k++) sparks.push(spawn(true));
  }
  function spawn(anywhere) {
    return {
      x: W * Math.random(),
      y: anywhere ? Math.random() * H : H + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.25 + Math.random() * 0.8,
      drift: Math.random() * Math.PI * 2,
      life: 0.5 + Math.random() * 0.5
    };
  }
  function drawSparks(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (var k = 0; k < sparks.length; k++) {
      var p = sparks[k];
      p.y -= p.vy;
      p.x += Math.sin(t / 900 + p.drift) * 0.35;
      var a = Math.max(0, Math.min(1, p.y / H)) * p.life * (0.6 + 0.4 * Math.sin(t / 120 + p.drift * 3));
      if (p.y < -10) { sparks[k] = spawn(false); continue; }
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, 'rgba(255,214,140,' + a + ')');
      g.addColorStop(0.4, 'rgba(255,140,40,' + a * 0.5 + ')');
      g.addColorStop(1, 'rgba(255,100,20,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }


  // ---------- Brasas de la parrilla (al pie de la portada) ----------
  // Lecho de carbón: trozos oscuros con ceniza; las grietas entre trozos y
  // algunas zonas de cada trozo arden en rojo/naranja y laten despacio.
  // Se calcula a baja resolución (1 píxel cada 3) y se amplía con suavizado.
  var coalCanvas = document.getElementById('coals');
  var cctx = coalCanvas && coalCanvas.getContext('2d');
  var buf = document.createElement('canvas'), bctx = buf.getContext('2d');
  var CW = 0, CH = 0, BW = 0, BH = 0, img = null, owner = null, edge = null, tex = null, seeds = [];
  var RAMP = [[0, 16, 13, 12], [.18, 38, 22, 18], [.34, 95, 22, 10], [.5, 175, 38, 10], [.66, 232, 82, 18], [.82, 255, 150, 45], [1, 255, 228, 150]];
  function ramp(h, out) {
    for (var i = 1; i < RAMP.length; i++) if (h <= RAMP[i][0]) {
      var a = RAMP[i - 1], b = RAMP[i], k = (h - a[0]) / (b[0] - a[0]);
      out[0] = a[1] + (b[1] - a[1]) * k; out[1] = a[2] + (b[2] - a[2]) * k; out[2] = a[3] + (b[3] - a[3]) * k; return;
    }
    out[0] = 255; out[1] = 228; out[2] = 150;
  }
  function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function resizeCoals() {
    if (!cctx) return;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    CW = coalCanvas.clientWidth; CH = coalCanvas.clientHeight;
    coalCanvas.width = CW * d; coalCanvas.height = CH * d;
    cctx.setTransform(d, 0, 0, d, 0, 0);
    BW = Math.ceil(CW / 3); BH = Math.ceil(CH / 3);
    buf.width = BW; buf.height = BH; img = bctx.createImageData(BW, BH);
    // semillas de los trozos de carbón (rejilla con desorden), aplastadas en vertical por la perspectiva
    seeds = []; var cell = 13;
    for (var gy = -1; gy * cell * .6 < BH + cell; gy++) for (var gx = -1; gx * cell < BW + cell; gx++) {
      seeds.push({ x: (gx + Math.random()) * cell, y: (gy + Math.random()) * cell * .6,
        h: .25 + Math.random() * .75, ph: Math.random() * 6.28, sp: .4 + Math.random() * 1.1 });
    }
    owner = new Int32Array(BW * BH); edge = new Float32Array(BW * BH); tex = new Float32Array(BW * BH);
    for (var y = 0; y < BH; y++) for (var x = 0; x < BW; x++) {
      var f1 = 1e9, f2 = 1e9, id = 0;
      for (var k = 0; k < seeds.length; k++) {
        var dx = x - seeds[k].x; if (dx > 2 * cell || dx < -2 * cell) continue;
        var dy = (y - seeds[k].y) / .6, dd = dx * dx + dy * dy;
        if (dd < f1) { f2 = f1; f1 = dd; id = k; } else if (dd < f2) f2 = dd;
      }
      var i = y * BW + x;
      owner[i] = id; edge[i] = Math.sqrt(f2) - Math.sqrt(f1);
      tex[i] = vnoise(x * .35, y * .55) * .65 + vnoise(x * 1.1, y * 1.6) * .35;
    }
  }
  var col = [0, 0, 0], lastCoals = -1e9, coalsDrawn = false;
  function drawCoals(t) {
    if (!img) return;
    var s = t / 1000, data = img.data;
    for (var k = 0; k < seeds.length; k++) {
      var sd = seeds[k];
      sd.f = calm ? sd.h : sd.h * (.55 + .45 * Math.sin(s * sd.sp + sd.ph) * Math.sin(s * sd.sp * .37 + sd.ph * 1.7));
    }
    for (var y = 0; y < BH; y++) {
      var depth = y / BH;                                  // abajo, más calor
      var fadeTop = Math.min(1, depth / .35);              // arriba se funde con la pared
      for (var x = 0; x < BW; x++) {
        var i = y * BW + x, sd2 = seeds[owner[i]], e = edge[i], n = tex[i];
        var crack = Math.exp(-e * .8);                     // grieta entre trozos: lo que más brilla
        var spot = Math.max(0, n - .52) * 2.2;              // vetas encendidas dentro del trozo
        var heat = crack * (.45 + .55 * sd2.f) + spot * sd2.f * .9;
        heat *= .55 + .6 * depth;
        heat += (vnoise(x * .2 + s * .6, y * .3 - s * .9) - .5) * .12;   // titileo del aire caliente
        if (heat < 0) heat = 0; if (heat > 1) heat = 1;
        ramp(heat, col);
        if (heat < .3) { var ash = (n - .35) * 70 * (1 - heat / .3); if (ash > 0) { col[0] += ash; col[1] += ash * .95; col[2] += ash * .9; } }  // ceniza gris
        var p = i * 4;
        data[p] = col[0]; data[p + 1] = col[1]; data[p + 2] = col[2]; data[p + 3] = 255 * fadeTop;
      }
    }
    bctx.putImageData(img, 0, 0);
    cctx.clearRect(0, 0, CW, CH);
    cctx.imageSmoothingEnabled = true; cctx.imageSmoothingQuality = 'high';
    cctx.drawImage(buf, 0, 0, CW, CH);
    // resplandor suave: la misma imagen, más pequeña y ampliada (sale difuminada), sumada
    cctx.globalCompositeOperation = 'lighter'; cctx.globalAlpha = .35;
    cctx.drawImage(buf, 0, 0, BW, BH, -6, -4, CW + 12, CH + 8);
    cctx.globalAlpha = 1; cctx.globalCompositeOperation = 'source-over';
  }

  // ---------- Animación ----------
  var visible = true, start = performance.now();
  function frame(now) {
    if (visible) {
      var t = now - start;
      user.x += (target.x - user.x) * 0.08;
      user.y += (target.y - user.y) * 0.08;
      var swayY = calm ? 0 : Math.sin(t / 2600) * 9;        // giro automático lento
      var swayX = calm ? 0 : Math.sin(t / 3700) * 4;
      var ry = swayY + user.x * 16;
      var rx = 3 + swayX - user.y * 12;
      var fy = calm ? 0 : Math.sin(t / 1900) * (sign.clientWidth * 0.012);  // flota
      disc.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      disc.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      disc.style.setProperty('--fy', fy.toFixed(1) + 'px');
      disc.style.setProperty('--shine', (50 - ry * 2.6).toFixed(1) + '%');
      // Profundidad: cada capa se desplaza según su distancia (parallax)
      var w = scene.clientWidth || 400;
      var autoX = calm ? 0 : Math.sin(t / 3100) * 0.25, autoY = calm ? 0 : Math.cos(t / 3900) * 0.2;
      layers.forEach(function (l) {
        var dpt = +l.dataset.depth || 0;
        l.style.setProperty('--px', ((user.x + autoX) * dpt * w * 0.03).toFixed(1) + 'px');
        l.style.setProperty('--py', ((user.y + autoY) * dpt * w * 0.015).toFixed(1) + 'px');
      });
      if (ctx && !calm) drawSparks(t);
      if (cctx && (calm ? !coalsDrawn : t - lastCoals > 45)) { drawCoals(t); lastCoals = t; coalsDrawn = true; }
    }
    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);
  }
  // ---------- Entrada de la moto ----------
  function arrive() {
    if (!moto) return;
    if (calm) { moto.classList.add('is-on'); return; }
    moto.classList.add('is-arriving');
    setTimeout(function () { moto.classList.add('is-on'); }, 1500);
  }
  var root = document.documentElement;
  if (root.classList.contains('intro-lock')) {
    var mo = new MutationObserver(function () {
      if (!root.classList.contains('intro-lock')) { mo.disconnect(); setTimeout(arrive, 350); }
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  } else arrive();

  window.addEventListener('resize', function () { resize(); resizeCoals(); coalsDrawn = false; });
  resize(); resizeCoals();
  requestAnimationFrame(frame);
})();
