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

  function waLink(extra) {
    var msg = '¡Hola! Me gustaría reservar una mesa en Italian Street.' +
      (extra ? ' ' + extra : '') +
      '\n\nDía: \nHora: \nPersonas: ';
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
  }

  function open(trigger) {
    lastTrigger = trigger;
    var extra = '';
    if (trigger.dataset.reserve === 'pasta') {
      var plate = document.getElementById('plateName');
      if (plate && plate.textContent) extra = 'Me gustaría pedir unos ' + plate.textContent + '.';
    }
    wa.href = waLink(extra);
    text.textContent = extra ? 'Reserva y pide tu ' + document.getElementById('plateName').textContent + '. ¿Cómo prefieres reservar?' : '¿Cómo prefieres reservar?';
    dialog.showModal();
    document.documentElement.classList.add('reserve-open');
  }

  function close() { dialog.close(); }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-reserve]');
    if (!t) return;
    e.preventDefault();
    open(t);
  });

  dialog.addEventListener('click', function (e) {
    // Cerrar al pulsar la X, una opción o fuera de la caja
    if (e.target === dialog || e.target.closest('[data-close]')) close();
    else if (e.target.closest('.reserve__opt')) setTimeout(close, 300);
  });

  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('reserve-open');
    if (lastTrigger) lastTrigger.focus();
  });
})();
