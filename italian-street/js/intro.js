/* =========================================================
   Italian Street · animación de entrada
   1. Noche: la fachada a oscuras.
   2. Se encienden los farolillos y el rótulo.
   3. Se abre la puerta verde.
   4. La cámara entra por la puerta y aparece la web.
   ========================================================= */
(function () {
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  if (!intro) return;
  if (root.classList.contains('no-intro')) { intro.remove(); return; }

  var stage = document.getElementById('introStage');
  var cam = document.getElementById('introCam');
  var door = document.getElementById('introDoor');
  var skip = document.getElementById('introSkip');
  var timers = [];
  var finished = false;
  var zooming = false;

  // Encaja la foto de la fachada (1008 × 976) en la pantalla:
  // ocupa todo el alto y, si sobra ancho, se ve el fondo desenfocado a los lados.
  // En móvil se recorta por los lados manteniendo la puerta en el centro.
  var W = 1008, H = 976, DOOR_X = 628;
  function fit() {
    var w = window.innerWidth, h = window.innerHeight;
    var s = Math.max(h / H, w / (W * 1.9));
    var x = W * s > w ? Math.min(0, Math.max(w - W * s, w / 2 - DOOR_X * s)) : (w - W * s) / 2;
    var y = (h - H * s) / 2;
    stage.style.setProperty('--s', s);
    stage.style.setProperty('--x', x + 'px');
    stage.style.setProperty('--y', y + 'px');
  }
  fit();
  window.addEventListener('resize', fit);

  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

  function zoom() {
    if (zooming) return;
    zooming = true;
    // El zoom se centra en el hueco de la puerta
    var r = door.getBoundingClientRect();
    cam.style.transformOrigin = (r.left + r.width / 2) + 'px ' + (r.top + r.height * 0.4) + 'px';
    intro.classList.add('is-zoom');
    at(1050, finish);
  }

  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    intro.classList.add('is-done');
    root.classList.remove('intro-lock');
    try { sessionStorage.setItem('is-intro', '1'); } catch (e) {}
    window.removeEventListener('resize', fit);
    setTimeout(function () { intro.remove(); }, 700);
  }

  // Al pulsar «Entrar» o tocar la escena se adelanta la animación
  function hurry() {
    if (zooming) return finish();
    timers.forEach(clearTimeout);
    timers = [];
    intro.classList.add('is-on', 'is-open');
    at(650, zoom);
  }
  skip.addEventListener('click', function (e) { e.stopPropagation(); hurry(); });
  intro.addEventListener('click', hurry);
  document.addEventListener('keydown', function onKey(e) {
    if (finished) return document.removeEventListener('keydown', onKey);
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hurry(); }
  });

  // Línea de tiempo
  at(350, function () { intro.classList.add('is-on'); });
  at(1900, function () { intro.classList.add('is-open'); });
  at(2900, zoom);
})();
