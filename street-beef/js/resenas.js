/* =========================================================
   Street Beef · testimonios
   Pega aquí reseñas REALES (de Google, Instagram…), copiadas tal
   cual y con permiso o firmadas solo con el nombre de pila.
   Si la lista está vacía, la sección de testimonios no se muestra.

   Formato de cada reseña:
     { texto: 'La mejor carbonara que he probado en Málaga…',
       nombre: 'Laura M.', estrellas: 5, fuente: 'Google' },
   ========================================================= */
const RESENAS = [
  // Pega aquí reseñas reales de Google con el formato de arriba.
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
