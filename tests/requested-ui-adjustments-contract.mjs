import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (p) => fs.readFileSync(p, 'utf8');
const home = read('src/app/page.tsx');
const agenda = read('src/app/agenda/page.tsx');
const settings = read('src/app/configuracoes/page.tsx');
const recordings = read('src/app/gravacoes/page.tsx');
const room = read('src/features/meeting/meeting-client.tsx');
const overlay = read('src/components/tool-overlay.tsx');
const nav = read('src/components/nav.tsx');

assert.ok(home.includes('HomeHeroOverlays'), 'home hero must keep the real overlay cards above the cleaned image');
assert.ok(home.includes('/octa-space-clean.png') && home.includes('octa-space-image'), 'hero must use the cleaned high-resolution astronaut asset');
assert.ok(home.includes('octa-connect-media'), 'connect card must render a dedicated image layer for framing control');

assert.ok(room.includes('MeetingDraggableFilter'), 'meeting filters must use a draggable meeting-only component');
assert.ok(!overlay.includes('VideoFilterPanel'), 'global tool overlay must not render video filters outside meetings');
assert.ok(nav.includes("kind==='filters'?router.push('/reunioes')"), 'global filter entry must route to meetings instead of opening a global filter overlay');

for (const label of ['Modo compacto','Barra lateral recolhida','Chat ao entrar','Mostrar ferramentas na reunião']) {
  assert.ok(settings.includes(label), `settings must include ${label}`);
}

assert.ok(agenda.includes('agenda-avatar-stack'), 'agenda meeting rows must include participant photo thumbnails');
assert.ok(recordings.includes('recordings-cinema'), 'recordings page must use cinema-style layout while remaining inside PageShell');
assert.ok(recordings.includes('<PageShell'), 'recordings page must retain the standard app shell/navigation');

console.log('requested UI adjustments contract passed');
