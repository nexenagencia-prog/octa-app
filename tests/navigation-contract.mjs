import fs from 'node:fs';
import assert from 'node:assert/strict';
const nav = fs.readFileSync('src/components/nav.tsx','utf8');
const shell = fs.existsSync('src/components/app-shell.tsx') ? fs.readFileSync('src/components/app-shell.tsx','utf8') : '';
for (const route of ['/agenda','/reunioes','/contatos','/gravacoes','/compartilhar-tela','/gravar','/minhas-anotacoes','/skills','/planos','/configuracoes']) {
  assert.match(nav, new RegExp(route.replaceAll('/','\\/')), `missing navigation route ${route}`);
}
for (const legacy of ['calculadora','filtros']) assert.equal(fs.existsSync(`src/app/${legacy}/page.tsx`),true,`legacy /${legacy} route must remain`);
assert.match(nav,/tool\('Calculadora',Calculator,'calculator'\)/,'calculator must open overlay');
assert.match(nav,/tool\('Filtros',Filter,'filters'\)/,'filters must open overlay');
assert.match(nav,/tool\('Anotar',NotebookPen,'notes'\)/,'notes must open overlay');
assert.doesNotMatch(nav,/\/printar-tela/,'print must not be in navigation');
assert.match(shell, /octa-sidebar-collapsed/, 'sidebar preference must persist');
assert.match(shell, /setCollapsed/, 'shell must own collapse state');
console.log('navigation contract ok');

assert.doesNotMatch(nav,/label:'Mutar'/,'sidebar must not include Mutar');
assert.doesNotMatch(nav,/label:'Desativar Chat'/,'sidebar must not include Desativar Chat');
