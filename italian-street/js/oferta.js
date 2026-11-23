/* =========================================================
   Italian Street · Oferta «Pizzas a 10 € para llevar»
   - Para QUITAR la oferta de la web: OFERTA_ACTIVA = false.
   - Días y horas en FRANJAS (0 = domingo … 6 = sábado).
     Si cambian, cambia también el calendario del HTML
     (sección #oferta, clase «is-on» en los días válidos).
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
  if (!OFERTA_ACTIVA) { if (section) section.remove(); if (pill) pill.remove(); return; }
  var box = document.getElementById('offerStatus');
  if (!box) return;
  var m = function (h) { var p = h.split(':'); return +p[0] * 60 + +p[1]; };
  var t = madridNow();                         // hora de Madrid (js/main.js)

  var today = document.querySelector('.wday[data-day="' + t.day + '"]');
  if (today) today.classList.add('is-today');

  var ahora = FRANJAS.find(function (f) { return f.day === t.day && t.minutes >= m(f.from) && t.minutes < m(f.to); });
  if (ahora) {
    box.className = 'offer__status is-live';
    box.textContent = '¡Ahora! Oferta activa hasta las ' + (ahora.to === '24:00' ? '00:00' : ahora.to);
    if (pill) pill.classList.add('is-live');
    return;
  }
  var luego = FRANJAS.find(function (f) { return f.day === t.day && t.minutes < m(f.from); });
  if (luego) {
    box.className = 'offer__status is-today';
    box.textContent = '¡Hoy hay oferta! A partir de las ' + luego.from;
    return;
  }
  for (var i = 1; i <= 7; i++) {
    var d = (t.day + i) % 7;
    var f = FRANJAS.find(function (x) { return x.day === d; });
    if (f) {
      box.className = 'offer__status is-off';
      box.textContent = 'Hoy no hay oferta · Próxima: ' + (i === 1 ? 'mañana, ' + f.label.split(' ').slice(1).join(' ') : f.label);
      return;
    }
  }
})();
