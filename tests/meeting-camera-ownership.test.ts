// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root=process.cwd();
const meeting=readFileSync(join(root,'src/features/meeting/meeting-client.tsx'),'utf8');
const instant=readFileSync(join(root,'src/features/meeting/instant-meeting-client.tsx'),'utf8');
const local=readFileSync(join(root,'src/features/meeting/local-camera-stage.tsx'),'utf8');
const prejoin=readFileSync(join(root,'src/features/meeting/meeting-prejoin.tsx'),'utf8');
const livekit=readFileSync(join(root,'src/features/meeting/livekit-stage.tsx'),'utf8');

describe('meeting camera ownership and preview',()=>{
 it('keeps the host camera isolated from the participant stage',()=>{
  expect(instant).toContain('meeting-reference-host-card');
  expect(instant).toContain('<LocalCameraStage');
  expect(instant).toContain('<ParticipantStage');
  expect(instant).toContain('createStageState(currentUser.id');
  expect(meeting).toContain('<InstantMeetingClient');
 });
 it('removes visible 9:16 labels while preserving the vertical aspect ratio',()=>{
  expect(instant).not.toContain('Sala ao vivo · 9:16');
  expect(instant).not.toContain('>9:16<');
  expect(prejoin).not.toContain('PRÉVIA 9:16');
  expect(prejoin).toContain("aspectRatio:'9/16'");
 });
 it('mirrors the local selfie camera in preview, native stage and LiveKit camera stage',()=>{
  expect(prejoin).toContain("transform:'scaleX(-1)'");
  expect(local).toContain("transform:'scaleX(-1)'");
  expect(livekit).toContain("transform:'scaleX(-1)'");
 });
 it('preserves camera and microphone choices from prejoin in the approved room',()=>{
  expect(meeting).toContain('initialCameraEnabled={camera}');
  expect(meeting).toContain('initialMicEnabled={mic}');
  expect(instant).toContain('const[camera,setCamera]=useState(initialCameraEnabled)');
  expect(instant).toContain('const[mic,setMic]=useState(initialMicEnabled)');
 });
});