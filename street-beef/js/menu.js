/* =========================================================
   Street Beef · CARTA
   Para cambiar un plato o un precio, edita solo este archivo
   (y luego ejecuta `node seo/generar.mjs` para actualizar la
   copia de la carta que leen los buscadores).

   Campos de cada plato:
     al         alérgenos (claves de ALERGENOS). ORIENTATIVOS: deducidos de
                los ingredientes, hay que confirmarlos con cocina.
     name       nombre
     price      precio (número)
     unit       opcional: 'ud' (por unidad) o '100 g' (por peso)
     prices     varios precios: [['Tapa', 3.5], ['Media', 6.5]]
     priceText  si no hay precio fijo: 'Según mercado'
     desc       descripción
     hot        true si es picante

   Carta copiada de la carta digital del restaurante
   (cartadigital.barmanagerapp.com/site/index/show/STREETTAPAS).
   La sección «Sugerencias del chef» está en js/sugerencias.js.
   ========================================================= */

const ALLERGENS = {
  gluten:     'Gluten',
  crustaceos: 'Crustáceos',
  huevo:      'Huevo',
  pescado:    'Pescado',
  soja:       'Soja',
  lacteos:    'Lácteos',
  frutos:     'Frutos de cáscara',
  mostaza:    'Mostaza',
  sesamo:     'Sésamo',
  sulfitos:   'Sulfitos',
  moluscos:   'Moluscos',
};

const MENU = [
  {
    id: 'tapeo',
    tab: 'Tapeo',
    title: 'De tapeo',
    sub: 'Tapa o media',
    featured: {
      label: 'La tapa de la casa',
      name: 'Bollito Street', price: 5, unit: 'ud',
      desc: 'Carrillada en salsa.',
      al: ['gluten'],
    },
    items: [
      { name: 'Bollito Borodin', price: 4, unit: 'ud', desc: 'Hamburguesitas o cresta.', al: ['gluten'] },
      { name: 'Camperito Bruckner', price: 4, unit: 'ud', desc: 'Jamón cocido, queso, lechuga y mayonesa.', al: ['gluten', 'lacteos', 'huevo'] },
      { name: 'Ensaladilla Alejandro Pushkin', prices: [['Tapa', 3.5], ['Media', 6.5]], desc: 'Ensaladilla rusa.', al: ['huevo', 'pescado'] },
      { name: 'Albóndigas Gounod', prices: [['Tapa', 4], ['Media', 6.5]], desc: 'Albóndigas con salsa de almendras.', al: ['gluten', 'huevo', 'frutos'] },
      { name: 'Solomillo Benjamin Britten', prices: [['Tapa', 4], ['Media', 6.5]], desc: 'Magro con fritada de tomate casero.', al: [] },
      { name: 'Pollo tikka masala', prices: [['Tapa', 4], ['Media', 7]], desc: '', al: ['lacteos'] },
      { name: 'Patatas bravas', prices: [['Tapa', 3.5], ['Media', 6.5]], desc: '', al: [] },
      { name: 'Torreznos de Soria', price: 6.5, desc: '', al: [] },
      { name: 'Taco mexicano', price: 5, unit: 'ud', desc: 'Por unidades.', al: ['gluten', 'lacteos'] },
      { name: 'Flor de alcachofa gratinada', price: 4, unit: 'ud', desc: 'Con portobello y cecina.', al: ['lacteos'] },
      { name: 'Pincho de langostino', price: 4, unit: 'ud', desc: 'Solo en verano.', al: ['crustaceos'] },
    ],
  },
  {
    id: 'entrantes',
    tab: 'Entrantes',
    title: 'Entrantes',
    sub: '',
    featured: {
      label: 'De la casa',
      name: 'Filetitos Street', prices: [['4 uds', 7], ['6 uds', 8.5]],
      desc: 'Lomo, huevo de codorniz y alioli.',
      al: ['huevo'],
    },
    items: [
      { name: 'Lagrimitas de pollo', price: 15, desc: 'Con patatas a las 5 salsas.', al: ['gluten', 'huevo', 'mostaza'] },
      { name: 'Flamenquín de pollo con patatas', price: 9.5, desc: 'Con pollo, cebolla caramelizada y queso de cabra.', al: ['gluten', 'huevo', 'lacteos'] },
      { name: 'Surtido de croquetas', prices: [['4 uds', 5.9], ['8 uds', 10]], desc: '', al: ['gluten', 'lacteos', 'huevo', 'crustaceos', 'moluscos'] },
      { name: 'Tartar de salchichón de Málaga', price: 9.9, desc: 'Con pasas, sésamo, pipas, cebollino, cebolla roja, alcaparras, mostaza y alioli.', al: ['sesamo', 'mostaza', 'huevo'] },
      { name: 'Nachos', price: 15, desc: 'Con carne, guacamole, salsa de queso, jalapeños y verduras.', al: ['lacteos'] },
      { name: 'Gambas al pil-pil a la crema', price: 10, desc: '10 unidades.', al: ['crustaceos', 'lacteos'] },
      { name: 'Patatas con bacon y queso', price: 10.5, desc: '', al: ['lacteos'] },
      { name: 'Patatas fritas', price: 3.9, desc: '', al: [] },
      { name: 'Pata de pulpo a la brasa', price: 25, desc: 'Puede variar según el precio de mercado.', al: ['moluscos'] },
      { name: 'Colas de tigre a la gabardina', price: 9.5, desc: '', al: ['crustaceos', 'gluten', 'huevo'] },
      { name: 'Tequeños', price: 7, desc: '', al: ['gluten', 'lacteos'] },
      { name: 'Extra de salsas', price: 1, unit: 'ud', desc: 'Kétchup, mayonesa…', al: ['huevo', 'mostaza'] },
      { name: 'Pan o bolsa de picos', price: 0.8, unit: 'ud', desc: '', al: ['gluten'] },
    ],
  },
  {
    id: 'brasa',
    tab: 'A la brasa',
    title: 'A la brasa',
    sub: 'Carnes al peso · precio cada 100 g',
    featured: {
      label: 'Maduración mínima de 21 días',
      name: 'Entrecot de lomo alto', price: 9, unit: '100 g',
      desc: 'Maduración mínima de 21 días.',
      al: [],
    },
    items: [
      { name: 'Chuletón de vaca rubia gallega', price: 9, unit: '100 g', desc: '', al: [] },
      { name: 'Chuletón de frisona', price: 9, unit: '100 g', desc: '', al: [] },
      { name: 'Chuletón de añojo sin hueso', price: 9, unit: '100 g', desc: '', al: [] },
      { name: 'Tomahawk', price: 9.5, unit: '100 g', desc: 'Según precio de mercado.', al: [] },
      { name: 'T-Bone', price: 9, unit: '100 g', desc: 'Según precio de mercado.', al: [] },
      { name: 'Entrecot de lomo bajo', price: 9, unit: '100 g', desc: '', al: [] },
      { name: 'Lomo bajo premium', price: 9, unit: '100 g', desc: '', al: [] },
      { name: 'Cube roll argentino', price: 9, unit: '100 g', desc: '', al: [] },
      { name: 'Flap meat uruguayo', price: 9, unit: '100 g', desc: '', al: [] },
      { name: 'Solomillo de cerdo', price: 15, desc: '', al: [] },
      { name: 'Secreto ibérico', price: 15, desc: '', al: [] },
      { name: 'Presa ibérica', price: 15, desc: '', al: [] },
      { name: 'Brocheta de solomillo', price: 15, desc: '', al: [] },
      { name: 'Brocheta de pollo', price: 15, desc: '', al: [] },
      { name: 'Mogote ibérico', priceText: 'Según mercado', desc: 'Según precio de mercado.', al: [] },
    ],
    cta: { href: '#cortes', text: 'Calcula el precio de tu corte' },
  },
  {
    id: 'sartena',
    tab: 'Sartenás',
    title: 'Sartenás',
    sub: '',
    items: [
      { name: 'Montañez', price: 15, desc: 'Patatas, chistorra, pimiento y huevo.', al: ['huevo'] },
      { name: 'Secreta', price: 15, desc: 'Patatas, secreto ibérico, cebolla rehogada y huevo.', al: ['huevo'] },
      { name: 'Marinera', price: 15, desc: 'Patatas, gulas, gambas y huevo.', al: ['huevo', 'crustaceos', 'pescado'] },
      { name: 'Carrillada', price: 15, desc: 'Patatas, huevo y carrillada.', al: ['huevo'] },
    ],
  },
  {
    id: 'orientales',
    tab: 'Orientales',
    title: 'Orientales',
    sub: 'Nuestros platos orientales',
    items: [
      { name: 'Pan bao de pato confitado', price: 5, unit: 'ud', desc: 'Con reducción de carne y rúcula.', al: ['gluten'] },
      { name: 'Pan bao de calamares', price: 5, unit: 'ud', desc: 'Al pil-pil, con rúcula y alioli.', al: ['gluten', 'moluscos', 'huevo'] },
      { name: 'Pan mantou', price: 4.5, unit: 'ud', desc: '', al: ['gluten'] },
      { name: 'Gyozas de pollo o ternera', price: 1.9, unit: 'ud', desc: '', al: ['gluten', 'soja'] },
      { name: 'Tataki de ternera', price: 20, desc: '', al: ['soja', 'sesamo'] },
    ],
  },
  {
    id: 'tostas',
    tab: 'Tostas',
    title: 'Nuestras tostas',
    sub: '',
    featured: {
      label: 'La tosta de la casa',
      name: 'Street', price: 10,
      desc: 'Queso de cabra, cebolla caramelizada, nueces y salsa de frutos del bosque.',
      al: ['gluten', 'lacteos', 'frutos'],
    },
    items: [
      { name: 'Cabina', price: 10, desc: 'Sobrasada ibérica, filete de pata, mozzarella gratinada y cebolla crujiente.', al: ['gluten', 'lacteos'] },
      { name: 'Señal', price: 10, desc: 'Morcilla, queso de cabra y cebolla caramelizada.', al: ['gluten', 'lacteos'] },
      { name: 'Criss', price: 10, desc: 'Queso de cabra, bacon y huevo de codorniz.', al: ['gluten', 'lacteos', 'huevo'] },
      { name: 'Tosta del chef', price: 10, desc: 'Pesto, pastrami, tomate seco, mozzarella fresca y tartufata.', al: ['gluten', 'lacteos', 'frutos'] },
    ],
  },
  {
    id: 'huerto',
    tab: 'Ensaladas',
    title: 'Del huerto a la mesa',
    sub: 'Ensaladas',
    featured: {
      label: 'La ensalada de la casa',
      name: 'Ensalada Street', price: 10,
      desc: 'Quinoa, queso feta, aceitunas negras, tomate cherry, nueces y brotes frescos.',
      al: ['lacteos', 'frutos'],
    },
    items: [
      { name: 'Ensalada César', price: 10, desc: 'Pollo crujiente, tomates cherry, picatostes, nueces y parmesano.', al: ['gluten', 'lacteos', 'frutos', 'huevo'] },
      { name: 'Ensalada frutos del bosque', price: 10, desc: 'Bolitas de queso de cabra con membrillo, frutos del bosque, cebolla caramelizada y balsámico de frutos del bosque.', al: ['lacteos', 'sulfitos'] },
      { name: 'Ensalada mixta', price: 9, desc: 'Cebolla, tomate, atún, maíz y zanahoria.', al: ['pescado'] },
    ],
  },
  {
    id: 'peques',
    tab: 'Peques',
    title: 'Para los peques',
    sub: 'Todos con patatas fritas',
    items: [
      { name: 'Nuggets de pollo', price: 6.6, desc: '6 unidades, con patatas fritas.', al: ['gluten', 'huevo'] },
      { name: 'San Jacobo casero', price: 6.6, desc: 'Con patatas fritas.', al: ['gluten', 'huevo', 'lacteos'] },
      { name: 'Filete de pollo empanado', price: 6.6, desc: 'Con patatas fritas.', al: ['gluten', 'huevo'] },
      { name: 'Croquetas peque', price: 6.6, desc: 'Con patatas fritas.', al: ['gluten', 'lacteos', 'huevo'] },
    ],
  },
  {
    id: 'bebidas',
    tab: 'Bebidas',
    title: 'Bebidas',
    sub: 'Cervezas, vermut y refrescos',
    items: [
      { name: 'Cerveza Estrella 1906', price: 3.5, desc: '', al: ['gluten'] },
      { name: 'Cerveza Alhambra', price: 3.5, desc: '', al: ['gluten'] },
      { name: 'Cerveza Águila sin filtrar', price: 3.1, desc: '', al: ['gluten'] },
      { name: 'Vermut', price: 5, desc: '', al: ['sulfitos'] },
      { name: 'Refrescos', price: 2.1, desc: '', al: [] },
      { name: 'Zumos', price: 2.5, desc: '', al: [] },
      { name: 'Lipton, Aquarade o tónica', price: 2.3, desc: '', al: [] },
      { name: 'Lipton maracuyá y mango', price: 2.3, desc: 'Té frío.', al: [] },
      { name: 'Agua Fuente Liviana', price: 2, desc: '50 cl.', al: [] },
      { name: 'Agua con gas', price: 2.5, desc: '50 cl.', al: [] },
    ],
  },
];

/* ---------- Elige tu corte: la cámara de maduración ----------
   Los cortes y precios salen de los platos de «A la brasa» con unit: '100 g'.
   Aquí: etiqueta corta, nota y la FOTO de cada corte.
   real: true = foto de la pieza en la cámara del bar; spot: [x %, y %] = dónde
   está esa pieza en img/camara.webp (punto que se puede pulsar).
   Las fotos son de referencia (Flickr, licencias Creative Commons: hay que
   mantener el crédito, se muestra bajo la cámara). Cuando haya fotos de las
   piezas reales del local, basta con cambiar «foto» y borrar «credito». */
const CORTES_INFO = {
  "Entrecot de lomo alto": { corto: "Lomo alto", origen: "Maduración mín. 21 días", nota: '', foto: "img/cortes/real-lomo-alto.webp", real: true, spot: [31, 63] },
  "Chuletón de vaca rubia gallega": { corto: "Rubia gallega", origen: "Maduración +40 días", nota: '', foto: "img/cortes/real-rubia-gallega.webp", real: true, spot: [30, 49] },
  "Chuletón de frisona": { corto: "Frisona", origen: "Frisona", nota: '', foto: "img/cortes/chuleton-frisona.webp",
    credito: {"autor": "ccnull.de Bilddatenbank", "url": "https://www.flickr.com/photos/115225894@N07/53504386559", "licencia": "CC BY 2.0", "lic": "https://creativecommons.org/licenses/by/2.0/"} },
  "Chuletón de añojo sin hueso": { corto: "Añojo s/h", origen: "Añojo", nota: '', foto: "img/cortes/chuleton-anojo-sin-hueso.webp",
    credito: {"autor": "ccnull.de Bilddatenbank", "url": "https://www.flickr.com/photos/115225894@N07/53504077211", "licencia": "CC BY 2.0", "lic": "https://creativecommons.org/licenses/by/2.0/"} },
  "Tomahawk": { corto: "Tomahawk", origen: "Según mercado", nota: '', foto: "img/cortes/tomahawk.webp",
    credito: {"autor": "ccnull.de Bilddatenbank", "url": "https://www.flickr.com/photos/115225894@N07/53704701018", "licencia": "CC BY 2.0", "lic": "https://creativecommons.org/licenses/by/2.0/"} },
  "T-Bone": { corto: "T-Bone", origen: "Según mercado", nota: '', foto: "img/cortes/real-t-bone.webp", real: true, spot: [52, 50] },
  "Entrecot de lomo bajo": { corto: "Lomo bajo", origen: "", nota: '', foto: "img/cortes/real-lomo-bajo.webp", real: true, spot: [33, 78] },
  "Lomo bajo premium": { corto: "Lomo premium", origen: "Premium", nota: '', foto: "img/cortes/lomo-bajo-premium.webp",
    credito: {"autor": "ccnull.de Bilddatenbank", "url": "https://www.flickr.com/photos/115225894@N07/53504503200", "licencia": "CC BY 2.0", "lic": "https://creativecommons.org/licenses/by/2.0/"} },
  "Cube roll argentino": { corto: "Cube roll", origen: "Argentina", nota: '', foto: "img/cortes/cube-roll-argentino.webp",
    credito: {"autor": "ccnull.de Bilddatenbank", "url": "https://www.flickr.com/photos/115225894@N07/53655649994", "licencia": "CC BY 2.0", "lic": "https://creativecommons.org/licenses/by/2.0/"} },
  "Flap meat uruguayo": { corto: "Flap meat", origen: "Uruguay", nota: '', foto: "img/cortes/flap-meat-uruguayo.webp",
    credito: {"autor": "avlxyz", "url": "https://www.flickr.com/photos/10559879@N00/4105534030", "licencia": "CC BY-SA 2.0", "lic": "https://creativecommons.org/licenses/by-sa/2.0/"} },
};
