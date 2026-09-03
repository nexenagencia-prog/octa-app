import fs from 'node:fs';
import assert from 'node:assert/strict';

const page = fs.readFileSync(new URL('../src/app/login/page.tsx', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/app/login/login.module.css', import.meta.url), 'utf8');

assert.match(page, /Bem-vindo/);
assert.match(page, /Acesse sua conta para continuar/);
assert.match(page, /Continuar com Google/);
assert.match(page, /Criar conta/);
assert.match(page, /signInWithPassword/);
assert.match(page, /signInWithOAuth/);
assert.doesNotMatch(page, /GitHub/i);
assert.match(css, /backdrop-filter:\s*blur/);
assert.match(css, /max-width:\s*650px/);
