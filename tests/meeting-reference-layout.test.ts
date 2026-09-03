// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const meeting = readFileSync(new URL('../src/features/meeting/meeting-client.tsx', import.meta.url), 'utf8');
const instant = readFileSync(new URL('../src/features/meeting/instant-meeting-client.tsx', import.meta.url), 'utf8');

describe('approved meeting reference layout', () => {
  it('uses the reference meeting screen after prejoin', () => {
    expect(meeting).toContain("import { InstantMeetingClient } from './instant-meeting-client';");
    expect(meeting).toContain('<InstantMeetingClient');
  });

  it('keeps chat empty by default on the reference screen', () => {
    expect(instant).toContain('const[chat,setChat]=useState(false)');
    expect(instant).not.toContain('initialMessages={demoMessages}');
  });

  it('carries real prejoin camera state into the reference host card', () => {
    expect(instant).toContain('initialCameraEnabled?:boolean');
    expect(instant).toContain('initialMicEnabled?:boolean');
    expect(instant).toContain('fallbackPhotoUrl?:string|null');
    expect(instant).toContain('<LocalCameraStage');
    expect(instant).toContain('cameraEnabled={camera}');
    expect(instant).toContain('micEnabled={mic}');
  });

  it('keeps realtime Skills and slides in the fixed right column', () => {
    expect(instant).toContain('<RealtimeSkillsPanel');
    expect(instant).toContain('<SlideRail');
    expect(instant).toContain('meeting-reference-right');
  });
});
