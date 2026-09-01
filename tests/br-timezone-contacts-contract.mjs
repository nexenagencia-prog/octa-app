import fs from 'node:fs';
import assert from 'node:assert/strict';

const agenda=fs.readFileSync('src/app/agenda/page.tsx','utf8');
const contacts=fs.readFileSync('src/app/contatos/page.tsx','utf8');
const css=fs.readFileSync('src/app/octa-dark-icon-fixes.css','utf8');

assert.match(agenda,/America\/Sao_Paulo/,'agenda must explicitly use Brazil/Sao Paulo timezone');
assert.match(agenda,/timeZone:\s*BR_TIME_ZONE/,'agenda date/time formatters must use Brazil timezone');
assert.match(contacts,/octa-contacts-page/,'contacts page must expose a scoped class for themed cards');
assert.match(css,/\.octa-contacts-page \.octa-contact-card\{[^}]*background:#000!important/s,'light contact cards must use black background');
assert.match(css,/\[data-theme="dark"\] \.octa-contacts-page \.octa-contact-card\{[^}]*linear-gradient\([^}]*#e8eaec[^}]*#8f9499/s,'dark contact cards must use a silver gradient');
assert.match(css,/\[data-theme="dark"\] \.octa-contacts-page \.octa-contact-card h2\{color:#090a0b!important\}/,'dark silver cards need dark titles for contrast');

console.log('Brazil timezone and themed contacts contract OK');
