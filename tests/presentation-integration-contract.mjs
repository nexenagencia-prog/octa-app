import fs from 'node:fs';
import assert from 'node:assert/strict';

for (const file of ['src/features/meeting/meeting-client.tsx','src/features/meeting/instant-meeting-client.tsx']) {
  const source = fs.readFileSync(file, 'utf8');
  assert.match(source, /PresentationMode/, `${file} must render PresentationMode`);
  assert.match(source, /presentationOpen/, `${file} must keep in-room presentation state`);
  assert.match(source, /Tela ou janela/, `${file} must offer traditional screen sharing`);
  assert.match(source, /Apresentação/, `${file} must offer presentation sharing`);
}

console.log('presentation integration contract passed');
