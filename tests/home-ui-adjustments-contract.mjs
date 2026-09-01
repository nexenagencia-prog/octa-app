import fs from 'node:fs';
import assert from 'node:assert/strict';

const nav=fs.readFileSync('src/components/nav.tsx','utf8');
const page=fs.readFileSync('src/app/page.tsx','utf8');
const greeting=fs.readFileSync('src/components/profile-greeting.tsx','utf8');
const css=fs.readFileSync('src/app/home-previous.module.css','utf8');

assert.match(nav,/style=\{\{background:'#000'\}\}/,'sidebar must be black');
for(const label of ['Filtros','Compartilhar Tela','Feed','Gravar']) assert.equal(nav.includes(`label:'${label}'`)||nav.includes(`tool('${label}'`),false,`${label} must not appear in sidebar`);
assert.match(nav,/label:'Criar reunião'/,'instant meeting label must be renamed to Criar reunião');
assert.equal(nav.includes("label:'Reunião instantânea'"),false,'old instant meeting label must not remain in sidebar');
assert.match(page,/src="\/octa-hero-man\.webp"/,'hero must use uploaded man photo');
assert.match(page,/<ProfileGreeting/,'home greeting must use the dynamic profile greeting component');
assert.equal(page.includes('Denner 👋'),false,'home greeting must not hardcode Denner or include the emoji');
assert.match(greeting,/Bem-vindo de volta,/,'greeting must use Bem-vindo de volta');
assert.match(greeting,/<strong>\{firstName\}<\/strong>/,'profile name must be bold');
assert.equal(greeting.includes('👋'),false,'greeting must not include an emoji');
assert.match(css,/url\('\/octa-ai-circle\.webp'\)/,'OCTA AI must use uploaded digital circle image');
assert.match(css,/\.row>img\{[^}]*width:30px[^}]*height:30px[^}]*aspect-ratio:1\/1[^}]*border-radius:999px/,'recent meeting thumbnails must be circular');
console.log('home UI adjustments contract: PASS');
