import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => fs.readFileSync(p,'utf8');
const nav = read('src/components/nav.tsx');
const home = read('src/app/page.tsx');
const meeting = read('src/features/meeting/meeting-client.tsx');
const css = read('src/app/globals.css');
const overlay = read('src/components/tool-overlay.tsx');

assert.doesNotMatch(nav,/label:'Mutar'/,'sidebar must not include Mutar');
assert.doesNotMatch(nav,/label:'Desativar Chat'/,'sidebar must not include Desativar Chat');
assert.doesNotMatch(nav,/\{href:'\/contatos',label:'Contatos'\}/,'top nav must not include Contatos');
assert.doesNotMatch(nav,/\{href:'\/gravacoes',label:'Gravações'\}/,'top nav must not include Gravações');
assert.match(nav,/OCTA SKILLS/,'sidebar must expose OCTA SKILLS');
assert.ok(fs.existsSync('src/app/skills/page.tsx'),'missing /skills');
assert.match(overlay,/onPointerDown/,'floating calculator must be draggable');
assert.match(overlay,/setPosition/,'floating calculator must track position');
assert.doesNotMatch(home,/href="\/agenda\?new=1"/,'home must remove duplicated schedule quick action');
assert.match(css,/\.octa-connect-card[^}]*border-radius:/s,'lower card must remain rounded');
assert.match(css,/\.octa-connect-card[^}]*overflow:hidden/s,'lower card must clip image inside rounded corners');
assert.match(meeting,/OCTA SKILLS|skills/i,'meeting should expose OCTA SKILLS entry point');
console.log('refinement + skills contract: PASS');

const skills = read('src/app/skills/page.tsx');
assert.match(skills,/skills-reference-overview/,'skills overview must use the approved reference layout');
assert.match(skills,/Visão geral/,'skills must preserve Visão geral');
assert.match(skills,/Transcrição/,'skills must preserve Transcrição');
assert.match(skills,/Treino/,'skills must preserve Treino');
assert.match(skills,/Evolução/,'skills must preserve Evolução');
assert.match(skills,/Análise privada/,'skills must preserve Análise privada');
assert.match(skills,/Ver reuniões/,'skills must preserve Ver reuniões');
assert.match(css,/\.skills-reference-overview/,'skills reference styling must exist');
