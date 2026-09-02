// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('layout da reunião instantânea',()=>{
 it('keeps the host, participant stage and fixed global-sidebar-compatible workspace',()=>{const meeting=readFileSync('src/features/meeting/instant-meeting-client.tsx','utf8');expect(meeting).toContain('meeting-reference-host-card');expect(meeting).toContain('<ParticipantStage');expect(meeting).not.toContain('function Sidebar(');});
 it('exposes mosaic, automatic speaker and focus controls',()=>{const stage=readFileSync('src/features/meeting/participant-stage.tsx','utf8');expect(stage).toContain('Mosaico');expect(stage).toContain('Destaque por voz');expect(stage).toContain('Bloquear destaque');});
 it('uses real active speaker when LiveKit is available',()=>{const livekit=readFileSync('src/features/meeting/livekit-stage.tsx','utf8');expect(livekit).toContain('ActiveSpeakersChanged');expect(livekit).toContain('onActiveSpeaker');});
});
