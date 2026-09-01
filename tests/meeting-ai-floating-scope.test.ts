// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('OCTA AI strategic meeting scope', () => {
  it('is not mounted globally and is mounted only inside meetings', () => {
    const layout = readFileSync('src/app/layout.tsx', 'utf8');
    const meeting = readFileSync('src/features/meeting/meeting-client.tsx', 'utf8');

    expect(layout).not.toContain('<MeetingStrategicAI');
    expect(meeting).toContain('<MeetingStrategicAI');
  });

  it('keeps consent-gated visual analysis and automatic private insights', () => {
    const coach = readFileSync('src/features/meeting/meeting-strategic-ai.tsx', 'utf8');

    expect(coach).toContain('allConsented');
    expect(coach).toContain('Registre o aceite explícito de cada participante');
    expect(coach).toContain('setToast');
    expect(coach).toContain('Skills atualizado automaticamente');
    expect(coach).toContain('não diagnostica emoções');
  });

  it('keeps live AI language from diagnosing emotion or disinterest as fact', () => {
    const route = readFileSync('src/app/api/ai/live-meeting-coach/route.ts', 'utf8');
    expect(route).toContain('Nunca invente emoção');
    expect(route).toContain('queda provável de engajamento visual');
  });
});
