import fs from 'node:fs';
import assert from 'node:assert/strict';
for (const route of ['agenda','reunioes','contatos','gravacoes']) {
  assert.equal(fs.existsSync(`src/app/${route}/page.tsx`),true,`missing /${route}`);
}
console.log('route contract ok');
