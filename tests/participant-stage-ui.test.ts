// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('layout da reunião instantânea', () => {
  it('mantém o host fixo e monta um segundo palco de participantes', () => {
    const meeting=readFileSync('src/features/meeting/instant-meeting-client.tsx','utf8');
    expect(meeting).toContain('instant-host-fixed');
    expect(meeting).toContain('<ParticipantStage');
  });

  it('expõe controles de mosaico, voz automática e bloqueio', () => {
    const stage=readFileSync('src/features/meeting/participant-stage.tsx','utf8');
    expect(stage).toContain('Mosaico');
    expect(stage).toContain('Destaque por voz');
    expect(stage).toContain('Bloquear destaque');
  });

  it('usa active speaker real quando LiveKit está disponível', () => {
    const livekit=readFileSync('src/features/meeting/livekit-stage.tsx','utf8');
    expect(livekit).toContain('ActiveSpeakersChanged');
    expect(livekit).toContain('onActiveSpeaker');
  });
});
