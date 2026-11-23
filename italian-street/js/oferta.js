/* =========================================================
   Italian Street · Oferta «Pizzas a 10 € para llevar»
   - Para QUITAR la oferta de la web: OFERTA_ACTIVA = false.
   - Los días y horas de la oferta están en FRANJAS
     (0 = domingo … 6 = sábado).
   ========================================================= */
const OFERTA_ACTIVA = true;
const FRANJAS = [
  { day: 1, from: '13:00', to: '16:00', label: 'lunes al mediodía' },
  { day: 3, from: '13:00', to: '16:00', label: 'miércoles al mediodía' },
  { day: 0, from: '20:00', to: '24:00', label: 'domingo por la noche' },
];

(function () {
  var section = document.getElementById('oferta');
  var pill = document.querySelector('.promo-pill');
  if (!OFERTA_ACTIVA) {
    if (section) section.remove();
    if (pill) pill.remove();
    return;
  }
  var box = document.getElementById('offerStatus');
  if (!box) return;
  var m = function (h) { var p = h.split(':'); return +p[0] * 60 + +p[1]; };
  var t = madridNow();                       // de js/main.js (hora de Madrid)
  var ahora = FRANJAS.find(function (f) { return f.day === t.day && t.minutes >= m(f.from) && t.minutes < m(f.to); });
  if (ahora) {
    box.classList.add('is-live');
    box.textContent = '¡Ahora! Oferta activa hasta las ' + (ahora.to === '24:00' ? '00:00' : ahora.to);
    if (pill) pill.classList.add('is-live');
    return;
  }
  // Próxima franja
  for (var i = 0; i <= 7; i++) {
    var d = (t.day + i) % 7;
    var f = FRANJAS.filter(function (x) { return x.day === d && (i > 0 || t.minutes < m(x.from)); })[0];
    if (f) {
      box.textContent = 'Próxima: ' + (i === 0 ? 'hoy a las ' + f.from : i === 1 ? 'mañana, ' + f.label.split(' ').slice(1).join(' ') : 'el ' + f.label);
      return;
    }
  }
})();
