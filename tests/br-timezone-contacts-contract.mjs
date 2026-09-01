import fs from 'node:fs';
import assert from 'node:assert/strict';

const agenda=fs.readFileSync('src/app/agenda/page.tsx','utf8');
const contacts=fs.readFileSync('src/app/contatos/page.tsx','utf8');
const css=fs.readFileSync('src/app/octa-dark-icon-fixes.css','utf8');

assert.match(agenda,/America\/Sao_Paulo/,'agenda must explicitly use Brazil/Sao Paulo timezone');
assert.match(agenda,/timeZone:\s*BR_TIME_ZONE/,'agenda date/time formatters must use Brazil timezone');
assert.match(contacts,/octa-contacts-page/,'contacts page must expose a scoped class for dark cards');
assert.match(css,/\[data-theme="dark"\] \.octa-contacts-page \.octa-contact-card/,'dark contact cards must be explicitly black');
assert.match(css,/background:\s*#000!important/,'dark contact cards must use black background');

console.log('Brazil timezone and dark contacts contract OK');
