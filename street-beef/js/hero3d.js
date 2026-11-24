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


  // ---------- Llamas de la parrilla (al pie de la portada) ----------
  // Fuego de partículas: cada llamita nace en la parrilla, sube balanceándose,
  // se encoge y pasa de blanco-amarillo a naranja, rojo y humo. Nacen más en
  // unos «focos» que se mueven, así se forman lenguas de fuego que bailan.
  var fireCanvas = document.getElementById('coals');
  var fctx = fireCanvas && fireCanvas.getContext('2d');
  var FW = 0, FH = 0, flames = [], SPR = [], focos = [], fprev = 0;
  function sprite(r, g, b) {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)');
    gr.addColorStop(.35, 'rgba(' + r + ',' + g + ',' + b + ',.55)');
    gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return c;
  }
  if (fctx) SPR = [sprite(255, 246, 200), sprite(255, 196, 70), sprite(255, 120, 25), sprite(220, 45, 12), sprite(120, 18, 8)];
  function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function resizeCoals() {
    if (!fctx) return;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    FW = fireCanvas.clientWidth; FH = fireCanvas.clientHeight;
    fireCanvas.width = FW * d; fireCanvas.height = FH * d;
    fctx.setTransform(d, 0, 0, d, 0, 0);
    flames = []; focos = [];
    var nf = Math.max(4, Math.round(FW / 120));
    for (var i = 0; i < nf; i++) focos.push({ x: (i + Math.random()) / nf, ph: Math.random() * 6.28, sp: .3 + Math.random() * .5 });
    for (var k = 0; k < 90; k++) tickFire(k * 33, 33);
  }
  function spawnFlame(t) {
    if (!focos.length) return;
    var s = t / 1000, f = focos[(Math.random() * focos.length) | 0];
    var fx = (f.x + Math.sin(s * f.sp + f.ph) * .04) * FW;
    var power = .55 + .45 * Math.sin(s * f.sp * 2.3 + f.ph * 3);          // cada foco crece y mengua
    var scale = Math.min(1.4, Math.max(.6, FH / 260));
    flames.push({
      x: fx + (Math.random() - .5) * 90 * scale, y: FH + 4,
      vx: (Math.random() - .5) * 18, vy: -(70 + Math.random() * 120) * (.6 + power * .7) * scale,
      r: (14 + Math.random() * 20) * scale, age: 0, life: .55 + Math.random() * .7 * power,
      sway: Math.random() * 6.28, cx: fx
    });
  }
  function tickFire(t, dt) {
    var step = Math.min(.05, dt / 1000);
    var want = FW * .9 * step * 1.5;                                        // nacimientos por fotograma
    for (var n = 0; n < want; n++) spawnFlame(t);
    for (var i = flames.length - 1; i >= 0; i--) {
      var p = flames[i];
      p.age += step;
      if (p.age > p.life) { flames.splice(i, 1); continue; }
      var k = p.age / p.life;
      p.vx += (p.cx - p.x) * .9 * step;                                    // se junta hacia el centro de la lengua
      p.x += (p.vx + Math.sin(t / 220 + p.sway) * 26 * k) * step;
      p.y += p.vy * step; p.vy *= 1 - .6 * step;
    }
  }
  function drawCoals(t) {
    if (!FW) return;
    var dt = fprev ? t - fprev : 33; fprev = t;
    tickFire(t, dt);
    fctx.clearRect(0, 0, FW, FH);
    // base al rojo vivo sobre la parrilla
    var g = fctx.createLinearGradient(0, FH, 0, FH - 60);
    g.addColorStop(0, 'rgba(255,110,30,.75)'); g.addColorStop(.4, 'rgba(220,50,12,.35)'); g.addColorStop(1, 'rgba(200,40,10,0)');
    fctx.fillStyle = g; fctx.fillRect(0, FH - 60, FW, 60);
    fctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < flames.length; i++) {
      var p = flames[i], k = p.age / p.life;
      var si = k < .07 ? 0 : k < .25 ? 1 : k < .5 ? 2 : k < .78 ? 3 : 4;
      var r = p.r * (1 - k * .75);
      fctx.globalAlpha = (k < .1 ? k / .1 : 1) * (1 - k) * (si < 2 ? .32 : .5);
      fctx.drawImage(SPR[si], p.x - r, p.y - r * 1.5, r * 2, r * 3);       // estirada en vertical: forma de llama
    }
    fctx.globalAlpha = 1; fctx.globalCompositeOperation = 'source-over';
  }
  var lastCoals = -1e9, coalsDrawn = false;

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
      if (fctx && (calm ? !coalsDrawn : t - lastCoals > 33)) { drawCoals(t); lastCoals = t; coalsDrawn = true; }
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
