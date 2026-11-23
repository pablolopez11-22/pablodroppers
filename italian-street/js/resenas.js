/* =========================================================
   Italian Street · testimonios
   Pega aquí reseñas REALES (de Google, Instagram…), copiadas tal
   cual y con permiso o firmadas solo con el nombre de pila.
   Si la lista está vacía, la sección de testimonios no se muestra.

   Formato de cada reseña:
     { texto: 'La mejor carbonara que he probado en Málaga…',
       nombre: 'Laura M.', estrellas: 5, fuente: 'Google' },
   ========================================================= */
const RESENAS = [
  { texto: '¡Nos encantó! El servicio fue increíblemente atento y el personal, muy amable. La comida, deliciosa, abundante y de calidad, y los precios razonables. ¡Volveremos seguro! Echábamos de menos un italiano en la zona.',
    nombre: 'Nieves L.', estrellas: 5, fuente: 'Google' },
  { texto: 'Desde que abrieron teníamos ganas de probar sus platos y la experiencia fue excelente. De entrante, carpaccio de ternera, muy sabroso y abundante; mi mujer pidió musaka, también muy buena, y yo pasta rellena de trufa, que estaba deliciosa. Dani, el dueño, nos trajo la cuenta y nos preguntó qué nos había parecido. Volveremos seguro.',
    nombre: 'José A. M.', estrellas: 5, fuente: 'Google' },
  { texto: 'Comimos genial, el servicio fue atento y los platos, deliciosos. La lasaña fue sin duda lo mejor: se nota que es casera y está buenísima. Ahora que abren a mediodía, volveremos seguro. ¡Seguid así!',
    nombre: 'Paula L.', estrellas: 4, fuente: 'Google' },
];

(function () {
  var box = document.getElementById('quotes');
  if (!box || !RESENAS.length) return;
  box.innerHTML = RESENAS.map(function (r) {
    var n = Math.max(1, Math.min(5, r.estrellas || 5));
    return '<figure class="quote">' +
      '<span class="quote__stars" aria-label="' + n + ' de 5 estrellas">' + '★★★★★'.slice(0, n) + '</span>' +
      '<blockquote>' + esc(r.texto) + '</blockquote>' +
      '<figcaption><strong>' + esc(r.nombre) + '</strong>' + (r.fuente ? ' · ' + esc(r.fuente) : '') + '</figcaption>' +
      '</figure>';
  }).join('');
  box.hidden = false;
})();
