/* =========================================================
   Italian Street · reservas
   Todos los botones con [data-reserve] abren una ventana con
   dos opciones: WhatsApp o llamar. Sin JavaScript, el botón
   sigue llamando por teléfono.
   ========================================================= */
(function () {
  var PHONE = '34624253316';
  var dialog = document.getElementById('reserve');
  if (!dialog || typeof dialog.showModal !== 'function') return; // navegador antiguo: el enlace llama
  var wa = document.getElementById('reserveWa');
  var text = document.getElementById('reserveText');
  var lastTrigger = null;

  function waLink() {
    var msg = '¡Hola! Me gustaría reservar una mesa en Italian Street.' +
      '\n\nDía: \nHora: \nPersonas: ';
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
  }

  function open(trigger) {
    lastTrigger = trigger;
    if (isDesktop) telSmall.textContent = '624 25 33 16 · pulsa para copiar el número';
    wa.href = waLink();
    text.textContent = '¿Cómo prefieres reservar?';
    dialog.showModal();
    document.documentElement.classList.add('reserve-open');
  }

  function close() { dialog.close(); }

  // ¿Ordenador (ratón) o móvil (táctil)?
  var isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var tel = dialog.querySelector('.reserve__opt--tel');
  var telSmall = tel.querySelector('small');

  // En el móvil WhatsApp se abre en la misma pestaña: así pasa directo a la app
  // y ningún navegador lo bloquea como ventana emergente.
  if (!isDesktop) { wa.removeAttribute('target'); wa.removeAttribute('rel'); }

  // En el ordenador no se puede llamar: al pulsar «Llamar» se copia el número
  // (y si hay una app de llamadas instalada, se abre igualmente).
  if (isDesktop) {
    telSmall.textContent = '624 25 33 16 · pulsa para copiar el número';
    tel.addEventListener('click', function () {
      var done = function () { telSmall.textContent = '✓ Número copiado · 624 25 33 16'; };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText('624 25 33 16').then(done, done);
        else done();
      } catch (e) { done(); }
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-reserve]');
    if (!t) return;
    e.preventDefault();
    open(t);
  });

  dialog.addEventListener('click', function (e) {
    // Cerrar al pulsar la X, una opción o fuera de la caja
    if (e.target === dialog || e.target.closest('[data-close]')) close();
    else if (e.target.closest('.reserve__opt--wa')) setTimeout(close, 300);
  });

  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('reserve-open');
    if (lastTrigger) lastTrigger.focus();
  });
})();
