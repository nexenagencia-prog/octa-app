import fs from 'node:fs';
const read=(p)=>fs.readFileSync(p,'utf8');
const nav=read('src/components/nav.tsx');
const ctx=read('src/components/tool-overlay-context.tsx');
const overlay=read('src/components/tool-overlay.tsx');
const notes=read('src/lib/notes-store.ts');
const floatingNotes=read('src/features/notes/floating-notes-card.tsx');
const agenda=read('src/app/agenda/page.tsx');
const appShell=read('src/components/app-shell.tsx');
const meeting=read('src/features/meeting/meeting-client.tsx');
const home=read('src/app/page.tsx');

const checks=[
  ['notes overlay tool exists',ctx.includes("'notes'")],
  ['sidebar Anotar opens overlay',nav.includes("tool('Anotar'") && !nav.includes("href:'/anotacoes',label:'Anotar'" )],
  ['sidebar print route removed',!nav.includes("href:'/printar-tela'")],
  ['plans moved to top nav',nav.includes("href:'/planos',label:'Planos e preços'") && !nav.includes("label:'Planos e preços',icon:BadgeDollarSign")],
  ['recordings decorative glyph removed',!nav.includes('▷Gravações')],
  ['only footer sidebar toggle remains',!nav.includes('octa-collapse-button')],
  ['notes store keeps meeting-compatible subject field',notes.includes('subject:string')],
  ['floating notes simplified to title and text',floatingNotes.includes('Título e texto') && floatingNotes.includes('Texto') && !floatingNotes.includes('RichNoteEditor')],
  ['global screenshot control in app shell',appShell.includes('GlobalScreenshotButton')],
  ['global screenshot control in meeting',meeting.includes('GlobalScreenshotButton')],
  ['agenda has date input',agenda.includes('type="date"')],
  ['agenda has participant avatars',agenda.includes('selectedParticipants') && agenda.includes('avatarUrl')],
  ['lower home card no longer duplicates astronaut image',!home.includes('<Image src="/octa-space.png" alt="OCTA colaboração"')],
];
const failed=checks.filter(([,ok])=>!ok);
if(failed.length){console.error('FAIL');for(const [name] of failed)console.error('-',name);process.exit(1)}
console.log(`round2 refinement contract: PASS (${checks.length}/${checks.length})`);
