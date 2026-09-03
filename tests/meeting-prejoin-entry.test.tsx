// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source=readFileSync('src/features/meeting/meeting-prejoin.tsx','utf8');

describe('meeting prejoin entry contract',()=>{
 it('offers explicit camera and no-camera entry choices',()=>{
  expect(source).toContain('Entrar com câmera');
  expect(source).toContain('Entrar sem câmera');
  expect(source).toContain('const enterWithCamera=async');
  expect(source).toContain('const enterWithoutCamera=()=>{onCameraChange(false);onJoin()}');
 });

 it('lets the user explicitly test the real camera before entering',()=>{
  expect(source).toContain('Testar câmera');
  expect(source).toContain('const testCamera=async()=>{onCameraChange(true);await start(true)}');
  expect(source).toContain('getUserMedia(createMeetingMediaConstraints())');
 });

 it('keeps the meeting photo editable and uses proportional 9:16 cropping',()=>{
  expect(source).toContain("currentPhoto?'Alterar foto':'Adicionar foto'");
  expect(source).toContain('onClick={openPhotoPicker}');
  expect(source).toContain("style={{aspectRatio:'9/16'}}");
  expect(source).toContain('object-cover');
 });
});
