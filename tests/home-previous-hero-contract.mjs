import fs from 'node:fs';

const page = fs.readFileSync('src/app/page.tsx', 'utf8');

if (!page.includes('Suas reuniões.')) throw new Error('A hero anterior não foi restaurada.');
if (!page.includes('octa-previous-hero')) throw new Error('A estrutura visual da hero anterior está ausente.');
if (!page.includes('<AppShell>')) throw new Error('A Home deve manter o AppShell com menus e ferramentas do ZIP.');
if (page.includes('octa-third-sidebar')) throw new Error('A Home não deve recriar um segundo menu lateral.');

console.log('home previous hero contract: ok');
