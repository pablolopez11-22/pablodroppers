// Genera, a partir de js/menu.js:
//  1) los datos estructurados de la carta (schema.org Menu) dentro del JSON-LD
//  2) una copia de la carta en HTML dentro de #menuPanels (para buscadores;
//     al cargar la página, js/main.js la sustituye por la carta interactiva)
// Uso: node seo/generar.mjs   (volver a ejecutarlo si cambia la carta)
import fs from 'fs'; import vm from 'vm';
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/menu.js', 'utf8') + ';this.MENU=MENU;this.ALLERGENS=ALLERGENS;', ctx);
const { MENU } = ctx;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const euro = n => n.toFixed(2).replace('.', ',') + ' €';
const items = c => (c.featured ? [c.featured] : []).concat(c.items);

const menuLD = {
  '@type': 'Menu', name: 'Carta de Italian Street', inLanguage: 'es',
  hasMenuSection: MENU.map(c => ({
    '@type': 'MenuSection', name: c.title + (c.sub && !c.sub.includes('·') ? ' (' + c.sub + ')' : ''),
    hasMenuItem: items(c).map(i => ({
      '@type': 'MenuItem', name: i.name, description: i.desc,
      offers: { '@type': 'Offer', price: (i.price ?? i.prices[0][1]).toFixed(2), priceCurrency: 'EUR' },
      ...(i.v ? { suitableForDiet: 'https://schema.org/VegetarianDiet' } : {})
    }))
  }))
};

let html = fs.readFileSync('index.html', 'utf8');
// JSON-LD
const a = html.indexOf('<script type="application/ld+json">'), b = html.indexOf('</script>', a);
const ld = JSON.parse(html.slice(a + 35, b));
ld.hasMenu = menuLD;
html = html.slice(0, a + 35) + '\n  ' + JSON.stringify(ld, null, 2).replace(/\n/g, '\n  ') + '\n  ' + html.slice(b);
// Carta estática
const fallback = MENU.map(c => `<section class="menu-cat"><header class="menu-cat__head"><h3 class="menu-cat__title">${esc(c.title)}</h3>${c.sub ? `<p class="menu-cat__sub">${esc(c.sub)}</p>` : ''}</header><ul class="dishes">` +
  items(c).map(i => `<li class="dish"><div class="dish__row"><h4 class="dish__name">${esc(i.name)}</h4><span class="dish__dots"></span><span class="dish__price">${i.price != null ? euro(i.price) : i.prices.map(p => p[0] + ' ' + euro(p[1])).join(' · ')}</span></div><p class="dish__desc">${esc(i.desc)}</p></li>`).join('') +
  `</ul></section>`).join('\n');
html = html.replace(/<div id="menuPanels">[\s\S]*?<\/div><!-- \/menuPanels -->|<div id="menuPanels"><\/div>/, `<div id="menuPanels"><!-- Carta para buscadores (generada con seo/generar.mjs) -->\n${fallback}\n</div><!-- /menuPanels -->`);
fs.writeFileSync('index.html', html);
console.log('OK:', menuLD.hasMenuSection.length, 'secciones,', menuLD.hasMenuSection.reduce((n, s) => n + s.hasMenuItem.length, 0), 'platos');
