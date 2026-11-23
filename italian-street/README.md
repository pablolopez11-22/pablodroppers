# Italian Street by Nacho García · web

Web de una sola página para Italian Street (Av. Jane Bowles, 17 · Málaga).
HTML + CSS + JS sin dependencias: abre `index.html` en el navegador.

## Estructura
- `index.html`: contenido y secciones
- `css/styles.css`: diseño (colores y tipografías en `:root`)
- `js/menu.js`: **la carta** (platos, precios, alérgenos) y las pastas de «Crea tu pasta». Para cambiar un precio, solo se toca este archivo.
- `js/main.js`: pestañas, buscador y filtros de la carta, «Crea tu pasta» y **horario** (`HORARIO`, al principio)
- `img/`: portada (sacada de la portada de la carta), logo, pastas

## Pendiente
- [x] Fachada en buena calidad (animación de entrada)
- [x] Fotos del local para el recorrido (baldas, luz, mesa)
- [ ] Fotos de platos (opcional: se pueden añadir a la carta y a la portada)
- [ ] Confirmar con cocina qué platos son vegetarianos (marcados según ingredientes)
- [x] Reseñas reales (js/resenas.js)
- [x] Logo en alta resolución

## Sugerencias (pizarra «Fuera de carta»)
Se cambian sin tocar el diseño, de dos formas (instrucciones en `js/sugerencias.js`):
- **Hoja de Google** (recomendado): importa `sugerencias-plantilla.csv` en una hoja, publícala como CSV y pega el enlace en `HOJA_CSV`. Desde entonces basta con editar la hoja.
- **A mano**: editar la lista `SUGERENCIAS` y volver a publicar.

## Publicación · lista de tareas
- [ ] Visto bueno del cliente (vegetarianos y picantes, WhatsApp 624 25 33 16, precios, horario, origen de las salsas del mapa).
- [ ] Netlify conectado al repositorio (rama `claude/stoic-hawking-lg259l`, configuración en `netlify.toml`).
- [ ] Comprar el dominio (propuesta: italianstreetmalaga.es) y conectarlo a Netlify.
- [ ] Con el dominio: añadir `canonical` y `og:url`, crear `sitemap.xml` y la línea `Sitemap:` en `robots.txt`.
- [ ] Dar de alta la web en Google Search Console y enviar el sitemap.
- [ ] **Activar el contador de visitas sin cookies** (Cloudflare Web Analytics o GoatCounter): pegar su código en el hueco marcado en `index.html` y medir también los clics en «Reservar».
- [ ] Poner el enlace de la web en la ficha de Google Maps y en la biografía de Instagram.
- [ ] (Opcional) Conectar la hoja de Google de sugerencias (`HOJA_CSV` en `js/sugerencias.js`).
