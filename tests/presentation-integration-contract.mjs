import fs from 'node:fs';
import assert from 'node:assert/strict';

for (const file of ['src/features/meeting/meeting-client.tsx','src/features/meeting/instant-meeting-client.tsx']) {
  const source = fs.readFileSync(file, 'utf8');
  assert.match(source, /PresentationMode/, `${file} must render PresentationMode`);
  assert.match(source, /presentationOpen/, `${file} must keep in-room presentation state`);
  assert.doesNotMatch(source, /href=["']\/compartilhar-tela["'].*Compartilhar Tela/, `${file} must not navigate away from an active meeting to share`);
}

const presentation = fs.readFileSync('src/features/meeting/presentation-mode.tsx', 'utf8');
assert.match(presentation, /Tela ou janela/, 'presentation chooser must offer traditional screen sharing');
assert.match(presentation, /Apresentação/, 'presentation chooser must offer PDF and image presentation sharing');
assert.match(presentation, /Só você está vendo/, 'preview must clearly stay private');
assert.match(presentation, /Apresentar este slide/, 'publishing must require explicit approval');

console.log('presentation integration contract passed');
