/* =========================================================
   Street Beef · CARTA
   Para cambiar un plato o un precio, edita solo este archivo
   (y luego ejecuta `node seo/generar.mjs` para actualizar la
   copia de la carta que leen los buscadores).

   Campos de cada plato:
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

const MENU = [
  {
    id: 'tapeo',
    tab: 'Tapeo',
    title: 'De tapeo',
    sub: 'Tapa o media · Para compartir',
    featured: {
      label: 'La tapa de la casa',
      name: 'Bollito Street', price: 5, unit: 'ud',
      desc: 'Bollito de carrillada en salsa.',
    },
    items: [
      { name: 'Bollito Borodin', price: 4, unit: 'ud', desc: 'Hamburguesitas o cresta.' },
      { name: 'Camperito Bruckner', price: 4, unit: 'ud', desc: 'Jamón cocido, queso, lechuga y mayonesa.' },
      { name: 'Ensaladilla Alejandro Pushkin', prices: [['Tapa', 3.5], ['Media', 6.5]], desc: 'Ensaladilla rusa.' },
      { name: 'Albóndigas Gounod', prices: [['Tapa', 4], ['Media', 6.5]], desc: 'Albóndigas con salsa de almendras.' },
      { name: 'Solomillo Benjamin Britten', prices: [['Tapa', 4], ['Media', 6.5]], desc: 'Magro con fritada de tomate casero.' },
      { name: 'Pollo tikka masala', prices: [['Tapa', 4], ['Media', 7]], desc: 'Pollo en salsa tikka masala.' },
      { name: 'Patatas bravas', prices: [['Tapa', 3.5], ['Media', 6.5]], desc: 'Patatas con salsa brava.' },
      { name: 'Torreznos de Soria', price: 6.5, desc: 'Torreznos crujientes.' },
      { name: 'Taco mexicano', price: 5, unit: 'ud', desc: 'Por unidades.' },
      { name: 'Flor de alcachofa gratinada', price: 4, unit: 'ud', desc: 'Con portobello y cecina.' },
      { name: 'Pincho de langostino', price: 4, unit: 'ud', desc: 'Solo en verano.' },
    ],
    fact: 'Nuestras tapas llevan nombre de artista: Borodin, Bruckner, Gounod y Britten son compositores, y Pushkin, el gran poeta ruso.',
  },
  {
    id: 'entrantes',
    tab: 'Entrantes',
    title: 'Entrantes',
    sub: 'Para empezar o para picar entre todos',
    featured: {
      label: 'De la casa',
      name: 'Filetitos Street', prices: [['4 uds', 7], ['6 uds', 8.5]],
      desc: 'Filetitos de lomo con huevo de codorniz y alioli.',
    },
    items: [
      { name: 'Lagrimitas de pollo', price: 15, desc: 'Con patatas y 5 salsas.' },
      { name: 'Flamenquín de pollo con patatas', price: 9.5, desc: 'Con pollo, cebolla caramelizada y queso de cabra.' },
      { name: 'Surtido de croquetas', prices: [['4 uds', 5.9], ['8 uds', 10]], desc: 'Croquetas variadas.' },
      { name: 'Tartar de salchichón de Málaga', price: 9.9, desc: 'Con pasas, sésamo, pipas, cebollino, cebolla roja, alcaparras, mostaza y alioli.' },
      { name: 'Nachos', price: 15, desc: 'Con carne, guacamole, salsa de queso, jalapeños y verduras.', hot: true },
      { name: 'Gambas al pil-pil a la crema', price: 10, desc: '10 unidades.' },
      { name: 'Patatas con bacon y queso', price: 10.5, desc: 'Patatas fritas con bacon y queso fundido.' },
      { name: 'Patatas fritas', price: 3.9, desc: 'Ración de patatas fritas.' },
      { name: 'Pata de pulpo a la brasa', price: 25, desc: 'Puede variar según el precio de mercado.' },
      { name: 'Colas de tigre a la gabardina', price: 9.5, desc: 'Rebozadas y crujientes.' },
      { name: 'Tequeños', price: 7, desc: 'Palitos de masa rellenos de queso.' },
      { name: 'Extra de salsas', price: 1, unit: 'ud', desc: 'Kétchup, mayonesa…' },
      { name: 'Pan o bolsa de picos', price: 0.8, unit: 'ud', desc: 'Para acompañar.' },
    ],
  },
  {
    id: 'brasa',
    tab: 'A la brasa',
    title: 'A la brasa',
    sub: 'Carnes por peso · Precio cada 100 g',
    featured: {
      label: 'Maduración mínima de 21 días',
      name: 'Entrecot de lomo alto', price: 9, unit: '100 g',
      desc: 'Lomo alto madurado un mínimo de 21 días, hecho a la brasa.',
    },
    items: [
      { name: 'Chuletón de vaca rubia gallega', price: 9, unit: '100 g', desc: 'Vaca rubia gallega a la brasa.' },
      { name: 'Chuletón de frisona', price: 9, unit: '100 g', desc: 'Chuletón de vaca frisona.' },
      { name: 'Chuletón de añojo sin hueso', price: 9, unit: '100 g', desc: 'Añojo deshuesado a la brasa.' },
      { name: 'Tomahawk', price: 9.5, unit: '100 g', desc: 'El chuletón con el hueso largo. Según precio de mercado.' },
      { name: 'T-Bone', price: 9, unit: '100 g', desc: 'Lomo y solomillo separados por el hueso en «T». Según precio de mercado.' },
      { name: 'Entrecot de lomo bajo', price: 9, unit: '100 g', desc: 'Lomo bajo a la brasa.' },
      { name: 'Lomo bajo premium', price: 9, unit: '100 g', desc: 'Lomo bajo de selección.' },
      { name: 'Cube roll argentino', price: 9, unit: '100 g', desc: 'Corte argentino del lomo alto.' },
      { name: 'Flap meat uruguayo', price: 9, unit: '100 g', desc: 'Vacío uruguayo a la brasa.' },
      { name: 'Solomillo de cerdo', price: 15, desc: 'A la brasa.' },
      { name: 'Secreto ibérico', price: 15, desc: 'A la brasa.' },
      { name: 'Presa ibérica', price: 15, desc: 'A la brasa.' },
      { name: 'Brocheta de solomillo', price: 15, desc: 'A la brasa.' },
      { name: 'Brocheta de pollo', price: 15, desc: 'A la brasa.' },
      { name: 'Mogote ibérico', priceText: 'Según mercado', desc: 'Pregunta por el precio del día.' },
    ],
    cta: { href: '#cortes', text: 'Calcula el precio de tu corte' },
    fact: 'El tomahawk es un chuletón al que se le deja el hueso de la costilla largo y limpio: de ahí su forma de hacha.',
  },
  {
    id: 'sartena',
    tab: 'Sartenás',
    title: 'Sartenás',
    sub: 'Patatas, huevo y lo que más te guste · En la sartén',
    items: [
      { name: 'Montañez', price: 15, desc: 'Patatas, chistorra, pimiento y huevo.' },
      { name: 'Secreta', price: 15, desc: 'Patatas, secreto ibérico, cebolla rehogada y huevo.' },
      { name: 'Marinera', price: 15, desc: 'Patatas, gulas, gambas y huevo.' },
      { name: 'Carrillada', price: 15, desc: 'Patatas, huevo y carrillada.' },
    ],
  },
  {
    id: 'orientales',
    tab: 'Orientales',
    title: 'Orientales',
    sub: 'Nuestros platos orientales',
    items: [
      { name: 'Pan bao de pato confitado', price: 5, unit: 'ud', desc: 'Con reducción de carne y rúcula.' },
      { name: 'Pan bao de calamares', price: 5, unit: 'ud', desc: 'Al pil-pil, con rúcula y alioli.' },
      { name: 'Pan mantou', price: 4.5, unit: 'ud', desc: 'Pan chino al vapor.' },
      { name: 'Gyozas de pollo o ternera', price: 1.9, unit: 'ud', desc: 'Empanadillas japonesas.' },
      { name: 'Tataki de ternera', price: 20, desc: 'Ternera marcada por fuera y jugosa por dentro.' },
    ],
    fact: 'El pan bao y el mantou son panes chinos cocidos al vapor: el mantou es el pan sencillo y el bao se abre para rellenarlo.',
  },
  {
    id: 'tostas',
    tab: 'Tostas',
    title: 'Nuestras tostas',
    sub: 'Pan tostado y mucho encima',
    featured: {
      label: 'La tosta de la casa',
      name: 'Street', price: 10,
      desc: 'Queso de cabra, cebolla caramelizada, nueces y salsa de frutos del bosque.',
    },
    items: [
      { name: 'Cabina', price: 10, desc: 'Sobrasada ibérica, filete de pata, mozzarella gratinada y cebolla crujiente.' },
      { name: 'Señal', price: 10, desc: 'Morcilla, queso de cabra y cebolla caramelizada.' },
      { name: 'Criss', price: 10, desc: 'Queso de cabra, bacon y huevo de codorniz.' },
      { name: 'Tosta del chef', price: 10, desc: 'Pesto, pastrami, tomate seco, mozzarella fresca y tartufata.' },
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
    },
    items: [
      { name: 'Ensalada César', price: 10, desc: 'Pollo crujiente, tomates cherry, picatostes, nueces y parmesano.' },
      { name: 'Ensalada frutos del bosque', price: 10, desc: 'Bolitas de queso de cabra con membrillo, frutos del bosque, cebolla caramelizada y balsámico de frutos del bosque.' },
      { name: 'Ensalada mixta', price: 9, desc: 'Cebolla, tomate, atún, maíz y zanahoria.' },
    ],
  },
  {
    id: 'peques',
    tab: 'Peques',
    title: 'Para los peques',
    sub: 'Todos con patatas fritas',
    items: [
      { name: 'Nuggets de pollo', price: 6.6, desc: '6 unidades, con patatas fritas.' },
      { name: 'San Jacobo casero', price: 6.6, desc: 'Con patatas fritas.' },
      { name: 'Filete de pollo empanado', price: 6.6, desc: 'Con patatas fritas.' },
      { name: 'Croquetas peque', price: 6.6, desc: 'Con patatas fritas.' },
    ],
  },
  {
    id: 'bebidas',
    tab: 'Bebidas',
    title: 'Bebidas',
    sub: 'Cervezas, vermut y refrescos',
    items: [
      { name: 'Cerveza Estrella 1906', price: 3.5, desc: '' },
      { name: 'Cerveza Alhambra', price: 3.5, desc: '' },
      { name: 'Cerveza Águila sin filtrar', price: 3.1, desc: '' },
      { name: 'Vermut', price: 5, desc: '' },
      { name: 'Refrescos', price: 2.1, desc: '' },
      { name: 'Zumos', price: 2.5, desc: '' },
      { name: 'Lipton, Aquarade o tónica', price: 2.3, desc: '' },
      { name: 'Lipton maracuyá y mango', price: 2.3, desc: 'Té frío.' },
      { name: 'Agua Fuente Liviana', price: 2, desc: '50 cl.' },
      { name: 'Agua con gas', price: 2.5, desc: '50 cl.' },
    ],
  },
];

/* ---------- Elige tu corte (calculadora de la brasa) ----------
   Se construye con los platos de «A la brasa» que tienen unit: '100 g'.
   Aquí solo se añade el origen y una frase para cada corte. */
const CORTES_INFO = {
  'Entrecot de lomo alto':          { origen: 'Madurado 21 días', nota: 'Lomo alto con maduración mínima de 21 días.' },
  'Chuletón de vaca rubia gallega': { origen: 'Galicia', nota: 'Raza gallega, de sabor intenso.' },
  'Chuletón de frisona':            { origen: 'Vaca frisona', nota: 'Chuletón con hueso, para compartir.' },
  'Chuletón de añojo sin hueso':    { origen: 'Añojo', nota: 'Más tierno y sin hueso: todo carne.' },
  'Tomahawk':                       { origen: 'Hueso largo', nota: 'El chuletón con el hueso de la costilla entero.' },
  'T-Bone':                         { origen: 'Hueso en T', nota: 'Lomo y solomillo en una misma pieza.' },
  'Entrecot de lomo bajo':          { origen: 'Lomo bajo', nota: 'Magro y sabroso.' },
  'Lomo bajo premium':              { origen: 'Selección', nota: 'Lomo bajo de selección.' },
  'Cube roll argentino':            { origen: 'Argentina', nota: 'El corazón del lomo alto, al estilo argentino.' },
  'Flap meat uruguayo':             { origen: 'Uruguay', nota: 'Vacío uruguayo: fibra marcada y mucho sabor.' },
};
