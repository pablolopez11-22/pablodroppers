/* =========================================================
   Italian Street · CARTA
   Para cambiar un plato o un precio, edita solo este archivo.

   Campos de cada plato:
     name   nombre
     price  precio (número). Para varios precios usa `prices`.
     desc   descripción
     al     alérgenos (ver ALLERGENS)
     v      true si es vegetariano (deducido de los ingredientes:
            confirmar con cocina)
     hot    true si es picante
   ========================================================= */

const ALLERGENS = {
  gluten:     'Gluten',
  lacteos:    'Lácteos',
  huevo:      'Huevo',
  frutos:     'Frutos de cáscara',
  pescado:    'Pescado',
  crustaceos: 'Crustáceos',
  moluscos:   'Moluscos',
  apio:       'Apio',
  mostaza:    'Mostaza',
  sulfitos:   'Sulfitos',
  soja:       'Soja',
};

const MENU = [
  {
    id: 'pizzas',
    tab: 'Pizzas',
    title: 'Pizze Romane',
    sub: 'Masa artesanal · Fermentación lenta · Horno eléctrico de alta temperatura',
    featured: {
      label: 'La especialidad de la casa',
      name: 'Emiliana', price: 15.00,
      desc: 'Base blanca, mozzarella fundente, mortadela italiana, burrata cremosa, crema de pistacho, ricotta y pistacho molido.',
      al: ['gluten', 'lacteos', 'frutos'],
    },
    items: [
      { name: 'Margherita', price: 9.00, desc: 'Base de tomate italiano, mozzarella fior di latte y albahaca fresca.', al: ['gluten', 'lacteos'], v: true },
      { name: 'Prosciutto', price: 9.50, desc: 'Base de tomate italiano, mozzarella fior di latte y prosciutto.', al: ['gluten', 'lacteos'] },
      { name: 'Prosciutto e Funghi', price: 11.00, desc: 'Base de tomate italiano, mozzarella fior di latte, prosciutto y champiñones.', al: ['gluten', 'lacteos'] },
      { name: 'Diavola', price: 11.50, desc: 'Base de tomate italiano, mozzarella fior di latte, pepperoni picante y cebolla morada.', al: ['gluten', 'lacteos'], hot: true },
      { name: 'Quattro Stagioni', price: 12.90, desc: 'Base de tomate italiano, mozzarella fior di latte, aceitunas negras, pepperoni, prosciutto, champiñones y alcachofas.', al: ['gluten', 'lacteos'] },
      { name: 'Quattro Formaggi', price: 11.50, desc: 'Base de tomate italiano, mozzarella fior di latte, provolone, gorgonzola y pecorino romano.', al: ['gluten', 'lacteos'], v: true },
      { name: 'Vegetariana', price: 11.00, desc: 'Base de tomate italiano, cebolla morada, calabacín, berenjena y tomate cherry confitado.', al: ['gluten'], v: true },
      { name: 'Burrata', price: 15.00, desc: 'Base de tomate italiano, mozzarella fior di latte, burrata cremosa, tomate confitado y pesto verde.', al: ['gluten', 'lacteos', 'frutos'], v: true },
      { name: 'Calabria', price: 14.90, desc: 'Base de tomate italiano, mozzarella fior di latte, auténtica ’nduja picante, burrata cremosa y albahaca fresca.', al: ['gluten', 'lacteos'], hot: true },
      { name: 'Parmigiana', price: 13.90, desc: 'Base de tomate italiano, mozzarella fior di latte, jamón de Parma, rúcula, tomate cherry confitado, pecorino romano y aceite de trufa.', al: ['gluten', 'lacteos'] },
      { name: 'Puttanesca', price: 12.50, desc: 'Base de tomate italiano, mozzarella fior di latte, aceitunas negras, anchoas, alcaparras, ajo y perejil fresco.', al: ['gluten', 'lacteos', 'pescado'] },
      { name: 'Bosco Tartufo', price: 12.90, desc: 'Base blanca, mozzarella fior di latte, surtido de setas salteadas y salsa tartufata.', al: ['gluten', 'lacteos'], v: true },
      { name: 'Street Amalfi', price: 12.50, desc: 'Base blanca, mozzarella fior di latte, salmón ahumado, calabacín y rúcula fresca.', al: ['gluten', 'lacteos', 'pescado'] },
      { name: 'Mare e Bosco', price: 12.50, desc: 'Base blanca, mozzarella fior di latte, calabacín, champiñones frescos y gambas.', al: ['gluten', 'lacteos', 'crustaceos'] },
      { name: 'Volcano', price: 12.00, desc: 'Base de salsa boloñesa casera, mozzarella fior di latte, maíz dulce y jalapeños.', al: ['gluten', 'lacteos'], hot: true },
      { name: 'Tropical', price: 10.50, desc: 'Base de tomate italiano, mozzarella fior di latte, prosciutto y piña.', al: ['gluten', 'lacteos'] },
      { name: 'BBQ', price: 12.50, desc: 'Salsa de tomate y barbacoa, mozzarella fior di latte, pollo, bacon crujiente y cebolla caramelizada.', al: ['gluten', 'soja', 'lacteos'] },
      { name: 'Italian Street', price: 13.00, desc: 'Base de tomate italiano, mozzarella fior di latte, salchicha italiana, patatas fritas y cebolla caramelizada.', al: ['gluten', 'lacteos'] },
      { name: 'Carbonara', price: 12.50, desc: 'Base blanca con reducción de carne, mozzarella fior di latte, bacon, guanciale crujiente, champiñones, cebolla, yema de huevo y pimienta negra.', al: ['gluten', 'huevo', 'lacteos'] },
      { name: 'Inferno', price: 11.50, desc: 'Base de tomate italiano, mozzarella fior di latte, pepperoni, ’nduja picante y un toque picante de pimiento tricolor.', al: ['gluten', 'lacteos', 'sulfitos'], hot: true },
      { name: 'Tonno e Cipolle', price: 12.00, desc: 'Base de tomate italiano, mozzarella fior di latte, atún, cebolla roja y aceitunas negras.', al: ['gluten', 'lacteos', 'pescado'] },
      { name: 'Gaucha', price: 14.90, desc: 'Base gaucha, mozzarella fior di latte, auténtica salsiccia italiana, cebolla crujiente, guanciale crujiente y un toque de ricotta.', al: ['gluten', 'lacteos', 'frutos'] },
      { name: 'Basilico', price: 14.90, desc: 'Base de nata y pesto, mozzarella fior di latte, tomates cherry confitados, prosciutto, burrata cremosa y un toque de ricotta.', al: ['gluten', 'lacteos', 'frutos'] },
    ],
    fact: 'Según la tradición, la Margherita nació en Nápoles en 1889 en honor a la reina Margarita, con los colores de Italia: tomate, mozzarella y albahaca.',
  },
  {
    id: 'pasta',
    tab: 'Pasta',
    title: 'Pasta',
    sub: 'Siempre al dente · Elige spaghetti, fettuccine, rigatoni, penne o gnocchi',
    cta: { text: 'Combina tu pasta y tu salsa en «Crea tu pasta»', href: '#crea' },
    items: [
      { name: 'Carbonara', price: 12.50, desc: 'Salsa de nata, fumet de carne, guanciale crujiente, yema de huevo, pecorino romano, pimienta negra recién molida y cebollino.', al: ['gluten', 'huevo', 'lacteos'] },
      { name: 'Boloñesa', price: 12.50, desc: 'Boloñesa tradicional italiana de carne, cocinada lentamente con tomate, verduras y vino tinto.', al: ['gluten', 'huevo', 'sulfitos'] },
      { name: 'Bosco Nero', price: 12.90, desc: 'Crema suave, setas salteadas, un toque aromático de trufa y cebollino.', al: ['gluten', 'huevo', 'lacteos'], v: true },
      { name: 'Arrabbiata', price: 10.50, desc: 'Salsa de tomate italiano, ajo, perejil fresco y un toque de picante italiano.', al: ['gluten'], v: true, hot: true },
      { name: 'Puttanesca', price: 11.90, desc: 'Salsa de tomate, ajo, anchoas, aceitunas negras, alcaparras, guindilla suave, perejil fresco y aceite de oliva virgen extra.', al: ['gluten', 'pescado'], hot: true },
      { name: 'Amatriciana', price: 11.50, desc: 'Salsa de tomate italiano y albahaca, cebolla, guanciale italiano, pecorino romano y pimienta negra recién molida.', al: ['gluten', 'lacteos'] },
      { name: 'Vongole', price: 13.50, desc: 'Almejas salteadas con un toque de tomate italiano, ajo, vino blanco, aceite de oliva virgen extra y perejil fresco.', al: ['gluten', 'sulfitos', 'moluscos'] },
      { name: 'Pesto Verde', price: 11.50, desc: 'Pesto verde con un toque de nata, mini burratina cremosa y pecorino romano.', al: ['gluten', 'lacteos', 'frutos'], v: true },
      { name: 'Salmone Napoli', price: 14.00, desc: 'Salmón, calabacín y ajo, flambeado con vodka y fumet de pescado, en salsa cremosa de tomate, nata, pecorino romano y cebollino.', al: ['gluten', 'huevo', 'lacteos', 'pescado', 'sulfitos'] },
      { name: 'Frutti di Mare', price: 15.90, desc: 'Gambas, mejillones y calamares salteados con salsa de tomate, vino blanco, ajo y perejil fresco.', al: ['gluten', 'huevo', 'sulfitos', 'crustaceos', 'moluscos'] },
      { name: 'Gamberi al Coñac', price: 14.50, desc: 'Gambas, calabacín, ajo y cebollino flambeados con coñac, con fumet de pescado, nata, tomate italiano y pecorino romano.', al: ['gluten', 'huevo', 'lacteos', 'crustaceos'] },
    ],
  },
  {
    id: 'rellena',
    tab: 'Pasta rellena',
    title: 'Pasta Ripiena',
    sub: 'Pasta rellena',
    items: [
      { name: 'Porcini e Tartufo', price: 14.50, desc: 'Ravioli rellenos de boletus con crema de trufa, pecorino romano, un toque de nata y cebollino.', al: ['gluten', 'lacteos'], v: true },
      { name: 'Nero del Mare', price: 15.90, desc: 'Giganti negros rellenos de vieira con crema de tomate, nata y calabacín, un toque de fumet de pescado, flambeado de coñac y tomate cherry confitado.', al: ['gluten', 'huevo', 'lacteos', 'moluscos'] },
      { name: 'Tortellini della Nonna', price: 13.50, desc: 'Tortellini rellenos de carne con una auténtica salsa boloñesa elaborada a fuego lento y pecorino romano.', al: ['gluten', 'huevo', 'lacteos'] },
      { name: 'Dolce Autunno', price: 14.50, desc: 'Fagottini rellenos de gorgonzola y pera, con salsa cremosa de nata y nueces.', al: ['gluten', 'lacteos', 'frutos'], v: true },
      { name: 'Tortellini Ricotta e Tartufo', price: 14.50, desc: 'Tortellini rellenos de ricotta con crema suave de nata, pecorino romano y un toque de trufa.', al: ['gluten', 'huevo', 'lacteos'], v: true },
    ],
    fact: 'Cuenta una leyenda de Emilia-Romaña que la forma del tortellino se inspiró en el ombligo de Venus, espiado por un posadero a través del ojo de una cerradura.',
  },
  {
    id: 'forno',
    tab: 'Al forno',
    title: 'Al Forno',
    sub: 'Del horno',
    items: [
      { name: 'Lasagna', price: 13.50, desc: 'Láminas de pasta fresca con boloñesa de vacuno cocinada lentamente con tomate, zanahoria, apio y cebolla, cubiertas con bechamel cremosa y gratinadas con mozzarella fior di latte.', al: ['gluten', 'huevo', 'lacteos', 'apio'] },
      { name: 'Lasagna dell’Orto', price: 13.50, desc: 'Láminas de pasta fresca con tomate italiano y verduras seleccionadas (berenjena, calabacín y puerro), cubiertas con bechamel cremosa y gratinadas con mozzarella fior di latte.', al: ['gluten', 'huevo', 'lacteos'], v: true },
      { name: 'Musaka', price: 13.50, desc: 'Capas de berenjena asada con tomate italiano, bechamel cremosa y mozzarella fior di latte fundente, gratinada al horno.', al: ['gluten', 'lacteos'], v: true },
      { name: 'Cannelloni', price: 12.50, desc: 'Canelones rellenos de carne de vacuno con un suave toque de nata, cubiertos con bechamel cremosa y tomate italiano, gratinados con mozzarella fior di latte.', al: ['gluten', 'huevo', 'lacteos'] },
      { name: 'Gnocchi alla Sorrentina', price: 12.50, desc: 'Tomate italiano, albahaca y mozzarella fior di latte gratinada.', al: ['gluten', 'huevo', 'lacteos'], v: true },
      { name: 'Gnocchi a la Boloñesa', price: 13.50, desc: 'Con salsa boloñesa tradicional italiana.', al: ['gluten', 'huevo'] },
      { name: 'Gnocchi 4 Formaggi', price: 12.50, desc: 'Salteados con salsa cremosa de cuatro quesos italianos, pecorino romano y un toque de nata.', al: ['gluten', 'huevo', 'lacteos'], v: true },
    ],
  },
  {
    id: 'risotto',
    tab: 'Risotto',
    title: 'Risotto',
    sub: 'Arroces cremosos',
    items: [
      { name: 'Risotto Bosco e Tartufo', price: 14.90, desc: 'Risotto cremoso con setas y un delicado toque de trufa, terminado con nata, parmesano y cebollino.', al: ['lacteos'], v: true },
      { name: 'Risotto Carbonara di Roma', price: 13.90, desc: 'Risotto cremoso con guanciale crujiente y queso pecorino, terminado con un toque de nata, yema de huevo y cebollino.', al: ['lacteos'] },
    ],
  },
  {
    id: 'antipasti',
    tab: 'Antipasti',
    title: 'Antipasti',
    sub: 'Para empezar',
    items: [
      { name: 'Burrata Urbana', price: 11.00, desc: 'Tomate italiano, pesto, burrata y pan crujiente.', al: ['gluten', 'lacteos', 'frutos'], v: true },
      { name: 'Provolone', price: 11.00, desc: 'Queso provolone fundido con tomate italiano y orégano.', al: ['lacteos'], v: true },
      { name: 'Carpaccio di Manzo', price: 12.00, desc: 'Láminas de ternera, rúcula, parmesano, cebolla, alcaparras, pimienta, sal, aceite y un toque de limón.', al: ['lacteos'] },
      { name: 'Pan de Ajo', price: 7.90, desc: 'Pan artesano horneado con mantequilla de ajo y perejil fresco.', al: ['gluten'], v: true },
      { name: 'Pan de Ajo y Queso', price: 9.50, desc: 'Pan artesano horneado con mantequilla de ajo, perejil fresco y mozzarella fundente.', al: ['gluten', 'lacteos'], v: true },
      { name: 'Tabla Mixta de Quesos y Embutidos', prices: [['2 pers.', 12.50], ['4 pers.', 16.50]], desc: 'Selección de quesos y embutidos italianos.', al: ['gluten', 'lacteos', 'frutos'] },
    ],
    fact: 'La burrata nació en Apulia, en el sur de Italia: es una bolsita de mozzarella que guarda dentro un corazón cremoso de stracciatella y nata.',
  },
  {
    id: 'insalate',
    tab: 'Ensaladas',
    title: 'Insalate',
    sub: 'Ensaladas',
    items: [
      { name: 'Italian Street', price: 12.00, desc: 'Rodajas de tomate con brotes frescos, rúcula, queso de cabra con peras en almíbar, nueces y un toque balsámico.', al: ['lacteos', 'frutos'], v: true },
      { name: 'César Italian', price: 11.90, desc: 'Mezclum, pollo empanado, tomates cherry semisecos, lascas de parmigiano reggiano, croutons de focaccia al ajo y romero, panceta italiana crujiente y salsa césar con un toque de pesto genovés.', al: ['gluten', 'lacteos', 'frutos', 'mostaza'] },
      { name: 'Caprese', price: 12.00, desc: 'Rodajas de tomate fresco con burrata fresca y hojas de rúcula, aliñadas con aceite de oliva virgen extra, sal y pimienta.', al: ['lacteos'], v: true },
      { name: 'Ensalada Mixta', price: 10.00, desc: 'Mezclum con atún, cebolla, maíz dulce y zanahoria, aliñada con aceite de oliva virgen extra. Fresca, sencilla y con todo el sabor mediterráneo.', al: ['pescado'] },
    ],
  },
  {
    id: 'dolci',
    tab: 'Postres',
    title: 'Dolci',
    sub: 'Postres',
    featured: {
      label: 'Para compartir · Elige tu sabor',
      name: 'Pizza Dolce Street', price: 8.90,
      desc: 'Masa artesanal horneada al estilo italiano, cubierta con crema y nata, y decorada con trocitos del mismo sabor.',
      flavours: ['Nutella', 'Pistacho', 'Lotus'],
      al: ['gluten', 'huevo', 'lacteos', 'soja'],
      v: true,
    },
    items: [
      { name: 'Tiramisú al Pistacho', price: 6.50, desc: 'Bizcocho bañado en café, cremosa mezcla de mascarpone y crema de pistacho, coronado con virutas de pistacho.', al: ['gluten', 'huevo', 'lacteos'], v: true },
      { name: 'Tiramisú', price: 6.50, desc: 'Bizcocho bañado en café, cremosa mezcla de mascarpone y un delicado toque de cacao.', al: ['gluten', 'huevo', 'lacteos'], v: true },
      { name: 'Cannoli de Pistacho', price: 6.50, desc: 'Crujientes cannoli sicilianos rellenos de dulce crema de ricotta, con cobertura exterior de pistacho.', al: ['gluten', 'huevo', 'lacteos'], v: true },
      { name: 'Cannoli de Nutella', price: 6.50, desc: 'Crujientes cannoli sicilianos rellenos de dulce crema de ricotta, con cobertura exterior de Nutella.', al: ['gluten', 'huevo', 'lacteos'], v: true },
      { name: 'Babà Napoletano', price: 6.50, desc: 'Bizcocho tradicional napolitano, ligero y esponjoso, bañado en almíbar de ron y con nata montada.', al: ['gluten', 'huevo', 'lacteos', 'sulfitos'], v: true },
      { name: 'Profiteroles de Chocolate', price: 6.50, desc: 'Rellenos de nata y recubiertos de chocolate (3 unidades).', al: ['gluten', 'huevo', 'lacteos', 'soja'], v: true },
    ],
    fact: '«Tiramisù» significa literalmente «levántame» en italiano: un postre pensado para devolver la energía al final de la comida.',
  },
];

/* ---------- Crea tu pasta ---------- */
// Pastas de la carta («Elige tu pasta») y para qué salsas las recomienda la casa
const PASTAS = [
  { id: 'spaghetti',  name: 'Spaghetti',  img: 'img/pasta/spaghetti.png',  shape: 'long',    tip: 'Salsas ligeras y marisco',     goes: ['ligera', 'marisco'] },
  { id: 'fettuccine', name: 'Fettuccine', img: 'img/pasta/fettuccine.png', shape: 'ribbon',  tip: 'Cremas, quesos y marisco',     goes: ['crema', 'queso', 'marisco'] },
  { id: 'rigatoni',   name: 'Rigatoni',   img: 'img/pasta/rigatoni.png',   shape: 'bigtube', tip: 'Salsas espesas y cremosas',    goes: ['espesa', 'crema'] },
  { id: 'penne',      name: 'Penne',      img: 'img/pasta/penne.png',      shape: 'tube',    tip: 'Tomate, verduras y picantes',  goes: ['tomate', 'picante'] },
  { id: 'gnocchi',    name: 'Gnocchi',    img: 'img/pasta/gnocchi.png',    shape: 'gnocchi', tip: 'Salsas cremosas o de tomate',  goes: ['crema', 'tomate'] },
];

// Las salsas son los platos de la sección «Pasta»; aquí solo se añade cómo se dibujan
// y de qué tipo son (para la recomendación de pasta).
const SALSA_STYLE = {
  'Carbonara':        { color: '#f0d68c', kind: ['crema', 'queso'],          top: ['guanciale', 'pepper'] },
  'Boloñesa':         { color: '#8a3a1e', kind: ['espesa', 'tomate'],        top: [] },
  'Bosco Nero':       { color: '#cdb48a', kind: ['crema'],                   top: ['mushroom', 'chive'] },
  'Arrabbiata':       { color: '#b3301b', kind: ['tomate', 'picante'],       top: ['herb', 'chili'] },
  'Puttanesca':       { color: '#a8341f', kind: ['tomate', 'ligera'],        top: ['olive', 'herb'] },
  'Amatriciana':      { color: '#b9472a', kind: ['tomate', 'espesa'],        top: ['guanciale'] },
  'Vongole':          { color: '#eadbb2', kind: ['marisco', 'ligera'],       top: ['clam', 'herb'] },
  'Pesto Verde':      { color: '#5f9140', kind: ['crema', 'queso'],          top: ['burrata'] },
  'Salmone Napoli':   { color: '#e48b62', kind: ['crema', 'tomate'],         top: ['salmon', 'chive'] },
  'Frutti di Mare':   { color: '#c3482c', kind: ['marisco', 'tomate', 'ligera'], top: ['shrimp', 'clam', 'herb'] },
  'Gamberi al Coñac': { color: '#e59a66', kind: ['marisco', 'crema'],        top: ['shrimp', 'chive'] },
};
