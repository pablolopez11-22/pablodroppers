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

  // Encaja la fachada (escenario de 3000 × 1000) en la pantalla:
  // acerca la cámara a la puerta sin dejar huecos en los bordes.
  function fit() {
    var w = window.innerWidth, h = window.innerHeight;
    var s = Math.min(w / 1150, h / 820);              // la fachada ocupa la pantalla
    s = Math.max(s, h / 1000, w / 3000);             // sin bordes vacíos
    var x = w / 2 - 1500 * s;                        // puerta centrada
    var y = h / 2 - 560 * s;                         // centrada en altura…
    y = Math.min(0, Math.max(h - 1000 * s, y));       // …sin salirse por arriba ni por abajo
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
    cam.style.transformOrigin = (r.left + r.width / 2) + 'px ' + (r.top + r.height * 0.45) + 'px';
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
