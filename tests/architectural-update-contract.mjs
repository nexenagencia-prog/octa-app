import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const exists = p => fs.existsSync(path.join(root,p));

for (const p of [
  'src/components/tool-overlay-context.tsx',
  'src/components/tool-overlay.tsx',
  'src/components/video-filter-panel.tsx',
  'src/components/profile-editor.tsx',
  'src/lib/profile-store.ts',
  'src/lib/notes-store.ts',
  'src/lib/plans.ts',
  'src/lib/video-filters.ts',
  'src/app/planos/page.tsx',
  'src/app/minhas-anotacoes/page.tsx',
]) assert.equal(exists(p), true, `missing ${p}`);

const nav = read('src/components/nav.tsx');
assert.match(nav,/Planos e preços/);
assert.match(nav,/Minhas Anotações/);
assert.match(nav,/openTool\(kind\)/);
assert.match(nav,/tool\('Calculadora',Calculator,'calculator'\)/);
assert.match(nav,/tool\('Filtros',Filter,'filters'\)/);
assert.match(nav,/ProfileEditor/);

const plans = read('src/lib/plans.ts');
for (const price of ['0','69.90','109.90']) assert.match(plans,new RegExp(`price:\\s*${price.replace('.','\\.')}`));
assert.match(plans,/currency:\s*['"]BRL['"]/);

const filters = read('src/lib/video-filters.ts');
for (const name of ['Natural','Pele Suave','Luz de Estúdio','Quente','Frio','P&B','Cinema']) assert.match(filters,new RegExp(name.replace('&','\\&')));

const meeting = read('src/features/meeting/meeting-client.tsx');
assert.doesNotMatch(meeting,/Host control/);
assert.match(meeting,/Controles do anfitrião/);
assert.match(meeting,/VideoFilterPanel/);
assert.match(meeting,/MeetingDraggableCalculator/);

const notes = read('src/features/notes/floating-notes-card.tsx');
assert.match(notes,/Salvar anotação/);
assert.match(notes,/saveNote/);

const contacts = read('src/app/contatos/page.tsx');
assert.match(contacts,/octa-contact-card/);

const stat = fs.statSync(path.join(root,'public/octa-space.png'));
assert.ok(stat.size > 600_000, `astronaut asset too small: ${stat.size}`);

console.log('architectural update contract: PASS');
