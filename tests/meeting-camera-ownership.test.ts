// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root=process.cwd();
const meeting=readFileSync(join(root,'src/features/meeting/meeting-client.tsx'),'utf8');
const local=readFileSync(join(root,'src/features/meeting/local-camera-stage.tsx'),'utf8');
const prejoin=readFileSync(join(root,'src/features/meeting/meeting-prejoin.tsx'),'utf8');
const livekit=readFileSync(join(root,'src/features/meeting/livekit-stage.tsx'),'utf8');

describe('meeting camera ownership and preview',()=>{
 it('keeps the host on the left and routes participants only to the right stage',()=>{
  expect(meeting).toContain('Sua câmera permanece sempre nesta tela');
  expect(meeting).toContain('Mostrar à direita');
  expect(meeting).toContain('setGuestId(selected)');
  expect(meeting).not.toContain('setFocused(selected)');
 });
 it('removes visible 9:16 labels while preserving the vertical aspect ratio',()=>{
  expect(meeting).not.toContain('Sala ao vivo · 9:16');
  expect(meeting).not.toContain('>9:16<');
  expect(prejoin).not.toContain('PRÉVIA 9:16');
  expect(prejoin).toContain("aspectRatio:'9/16'");
 });
 it('mirrors the local selfie camera in preview, native stage and LiveKit camera stage',()=>{
  expect(prejoin).toContain("transform:'scaleX(-1)'");
  expect(local).toContain("transform:'scaleX(-1)'");
  expect(livekit).toContain("transform:'scaleX(-1)'");
 });
 it('allows the right participant stage to be cleared',()=>{
  expect(meeting).toContain('setGuestId(null)');
  expect(meeting).toContain('Retirar participante da tela');
 });
});
