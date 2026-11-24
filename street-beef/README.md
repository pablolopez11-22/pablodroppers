# Street Beef by Nacho García · web

Web de una sola página para Street Beef (Av. Jane Bowles, 17, Local 1 · Málaga).
Misma estructura que la web de Italian Street (rama `claude/stoic-hawking-lg259l`).
HTML + CSS + JS sin dependencias: abre `index.html` en el navegador.

## Estructura
- `index.html`: contenido y secciones
- `css/styles.css`: diseño (colores y tipografías en `:root`)
- `js/menu.js`: **la carta** (platos y precios). Para cambiar un precio, solo se toca este archivo
  y después se ejecuta `node seo/generar.mjs` (actualiza la copia para buscadores).
- `js/main.js`: pestañas y buscador de la carta, y **horario** (`HORARIO`, al principio)
- `js/cortes.js`: «Elige tu corte» (calculadora de la brasa, usa los precios de `menu.js`)
- `js/sugerencias.js`: pizarra «Sugerencias del chef»
- `js/reservas.js`: ventana de reserva (WhatsApp o teléfono)
- `img/rotulo-3d.webp`: el logo como rótulo de bronce retroiluminado (portada)
- `img/logo-dibujo.svg`: el logo original en vector, sin los iconos de redes

## Pendiente
- [ ] Fotos del local (sala, rincón motero, brasa, terraza) para «El local»
- [ ] Foto de una moto de la casa para la portada (como la Vespa de Italian Street)
- [ ] Foto de la fachada para la animación de entrada
- [ ] Confirmar que el 744 70 42 32 tiene WhatsApp (`PHONE` en `js/reservas.js`)
- [ ] Instagram del local (pie de página)
- [ ] Reseñas reales para `js/resenas.js` (opcional)
