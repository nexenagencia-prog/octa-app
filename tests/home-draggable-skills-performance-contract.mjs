import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => fs.readFileSync(p,'utf8');
const home = read('src/app/page.tsx');
const draggable = fs.existsSync('src/components/home-hero-overlays.tsx') ? read('src/components/home-hero-overlays.tsx') : '';
const skills = read('src/app/skills/page.tsx');
const css = read('src/app/globals.css');

assert.match(home,/HomeHeroOverlays/,'home must render real overlay cards above the astronaut image');
assert.match(draggable,/Próxima reunião em/,'next meeting card must remain above the image');
assert.match(draggable,/Ações rápidas/,'quick actions card must remain above the image');
assert.match(draggable,/onPointerDown/,'home cards must support dragging');
assert.match(draggable,/setPointerCapture/,'dragging must stay captured inside the hero interaction');
assert.match(draggable,/getBoundingClientRect/,'dragging must be constrained relative to the hero container');
assert.match(css,/\.home-hero-overlay/,'home hero overlay styling must exist');
assert.match(skills,/Desempenho semanal/,'skills overview must expose a stronger performance summary');
assert.match(skills,/Meta de evolução/,'skills overview must expose progress toward a performance goal');
assert.match(skills,/Últimas reuniões/,'skills overview must expose recent-meeting performance context');
assert.match(css,/\.skills-performance-dashboard/,'skills performance dashboard styling must exist');

console.log('home draggable + skills performance contract: PASS');
