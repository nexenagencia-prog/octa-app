import fs from 'node:fs';
import assert from 'node:assert/strict';

const nav=fs.readFileSync('src/components/nav.tsx','utf8');
const page=fs.readFileSync('src/app/page.tsx','utf8');
const css=fs.readFileSync('src/app/home-previous.module.css','utf8');

assert.match(nav,/style=\{\{background:'#000'\}\}/,'sidebar must be black');
for(const label of ['Filtros','Compartilhar Tela','Feed','Gravar']) assert.equal(nav.includes(`label:'${label}'`)||nav.includes(`tool('${label}'`),false,`${label} must not appear in sidebar`);
assert.match(page,/src="\/octa-hero-man\.webp"/,'hero must use uploaded man photo');
assert.match(css,/url\('\/octa-ai-circle\.webp'\)/,'OCTA AI must use uploaded digital circle image');
assert.match(css,/\.row>img\{[^}]*width:30px[^}]*height:30px[^}]*aspect-ratio:1\/1[^}]*border-radius:999px/,'recent meeting thumbnails must be circular');
console.log('home UI adjustments contract: PASS');
