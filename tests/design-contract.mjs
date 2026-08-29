import fs from 'node:fs';
import assert from 'node:assert/strict';

const css = fs.readFileSync('src/app/globals.css','utf8');
const home = fs.readFileSync('src/app/page.tsx','utf8');
const nav = fs.readFileSync('src/components/nav.tsx','utf8');
const data = fs.readFileSync('src/lib/demo/data.ts','utf8');
const meeting = fs.readFileSync('src/features/meeting/meeting-client.tsx','utf8');

assert.match(css, /--octa-navy:\s*#071f2d/, 'reference navy token is required');
assert.match(css, /--octa-cyan:\s*#0c879e/, 'reference cyan token is required');
assert.match(css, /\.octa-sidebar/, 'desktop sidebar utility is required');
assert.match(css, /\.octa-space-card/, 'space hero card utility is required');
assert.match(home, /Seu dia\s*<br\/>\s*começa aqui\./, 'home headline must match approved reference');
assert.match(home, /Para reunião instantânea/, 'instant meeting people strip is required');
assert.match(home, /Próxima reunião às 14:30/, 'next meeting block is required');
assert.match(home, /Resumo rápido/, 'quick summary cards are required');
assert.match(home, /Reuniões de hoje/, 'today meeting list is required');
assert.doesNotMatch(home, /octa-quick-actions/, 'space panel quick-action overlay must stay removed');
assert.match(home, /Conecte\./, 'lower connect panel is required');
assert.match(nav, /Calculadora/, 'sidebar must include calculator');
assert.match(nav, /Compartilhar Tela/, 'sidebar must include screen sharing');
assert.doesNotMatch(nav, /label:'Desativar Chat'/, 'sidebar must not include disable chat');
assert.doesNotMatch(nav, /Printar tela/, 'sidebar screenshot action must be removed');
const appShell = fs.readFileSync('src/components/app-shell.tsx','utf8');
assert.match(appShell, /GlobalScreenshotButton/, 'global screenshot control must be present');
assert.match(data, /Denner Biersack/, 'approved profile identity must be Denner Biersack');
assert.match(meeting, /Controles do anfitrião/, 'meeting host controls must remain intact in Portuguese');
console.log('design contract ok');
