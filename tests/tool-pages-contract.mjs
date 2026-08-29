import fs from 'node:fs';
import assert from 'node:assert/strict';
for (const route of ['filtros','compartilhar-tela','gravar','mutar','chat','printar-tela','anotacoes','configuracoes']) {
  assert.equal(fs.existsSync(`src/app/${route}/page.tsx`),true,`missing /${route}`);
}
assert.equal(fs.existsSync('src/components/browser-tools.tsx'),true,'browser tools component missing');
console.log('tool pages contract ok');
