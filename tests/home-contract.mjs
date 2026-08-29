import fs from 'node:fs';
import assert from 'node:assert/strict';
const home = fs.readFileSync('src/app/page.tsx','utf8');
const css = fs.readFileSync('src/app/globals.css','utf8');
for (const route of ['/agenda','/reunioes','/contatos','/gravacoes']) assert.match(home,new RegExp(route.replaceAll('/','\\/')),`home missing ${route}`);
assert.match(home,/AppShell/,'home must use shared app shell');
assert.match(css,/height:\s*100dvh/,'desktop shell must use 100dvh');
assert.match(css,/overflow:\s*hidden/,'desktop shell must prevent page-level overflow');
console.log('home contract ok');
