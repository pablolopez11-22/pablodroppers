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
  var coalCanvas = document.getElementById('coals');
  var cctx = coalCanvas && coalCanvas.getContext('2d');
  var coals = [], CW = 0, CH = 0;
  function resizeCoals() {
    if (!cctx) return;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    CW = coalCanvas.clientWidth; CH = coalCanvas.clientHeight;
    coalCanvas.width = CW * d; coalCanvas.height = CH * d;
    cctx.setTransform(d, 0, 0, d, 0, 0);
    coals = [];
    var n = Math.round(CW / 7);
    for (var k = 0; k < n; k++) {
      var r = 10 + Math.random() * 20;
      // trozos de carbón irregulares: varios vértices alrededor del centro
      var pts = [], m = 6 + (Math.random() * 4 | 0);
      for (var j = 0; j < m; j++) { var a = j / m * Math.PI * 2; pts.push([Math.cos(a) * r * (.7 + Math.random() * .45), Math.sin(a) * r * .62 * (.7 + Math.random() * .45)]); }
      coals.push({ x: Math.random() * CW, y: CH - 8 - Math.random() * 42, r: r, pts: pts, ph: Math.random() * 6.28, sp: .6 + Math.random() * 1.6, heat: .15 + Math.random() * .7 });
    }
    coals.sort(function (p, q) { return p.y - q.y; });
  }
  function drawCoals(t) {
    cctx.clearRect(0, 0, CW, CH);
    // resplandor general de la parrilla
    var g = cctx.createLinearGradient(0, CH, 0, 0);
    g.addColorStop(0, 'rgba(255,80,20,.28)'); g.addColorStop(.5, 'rgba(255,60,20,.12)'); g.addColorStop(1, 'rgba(255,60,20,0)');
    cctx.fillStyle = g; cctx.fillRect(0, 0, CW, CH);
    for (var k = 0; k < coals.length; k++) {
      var c = coals[k];
      var f = calm ? c.heat : c.heat * (.62 + .38 * Math.sin(t / 1000 * c.sp + c.ph) * Math.sin(t / 1730 * c.sp + c.ph * 2));
      cctx.save(); cctx.translate(c.x, c.y);
      cctx.beginPath(); cctx.moveTo(c.pts[0][0], c.pts[0][1]);
      for (var j = 1; j < c.pts.length; j++) cctx.lineTo(c.pts[j][0], c.pts[j][1]);
      cctx.closePath();
      var rg = cctx.createRadialGradient(0, 0, 0, 0, 0, c.r);
      rg.addColorStop(0, 'rgba(' + (120 + 135 * f | 0) + ',' + (30 + 120 * f * f | 0) + ',' + (10 + 40 * f * f | 0) + ',1)');
      rg.addColorStop(.5, 'rgba(' + (60 + 150 * f | 0) + ',' + (18 + 30 * f | 0) + ',8,1)');
      rg.addColorStop(1, 'rgba(22,12,9,1)');
      cctx.fillStyle = rg; cctx.fill();
      cctx.lineWidth = 1.5; cctx.strokeStyle = 'rgba(20,8,5,.9)'; cctx.stroke();
      cctx.restore();
    }
    cctx.globalCompositeOperation = 'lighter';
    for (var k2 = 0; k2 < coals.length; k2 += 3) {
      var c2 = coals[k2], f2 = .5 + .5 * Math.sin(t / 900 * c2.sp + c2.ph);
      var hg = cctx.createRadialGradient(c2.x, c2.y, 0, c2.x, c2.y, c2.r * 3);
      hg.addColorStop(0, 'rgba(255,120,40,' + (.22 * f2 * c2.heat) + ')'); hg.addColorStop(1, 'rgba(255,80,20,0)');
      cctx.fillStyle = hg; cctx.beginPath(); cctx.arc(c2.x, c2.y, c2.r * 3, 0, 6.29); cctx.fill();
    }
    cctx.globalCompositeOperation = 'source-over';
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
      if (cctx) drawCoals(t);
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

  window.addEventListener('resize', function () { resize(); resizeCoals(); });
  resize(); resizeCoals();
  requestAnimationFrame(frame);
})();
