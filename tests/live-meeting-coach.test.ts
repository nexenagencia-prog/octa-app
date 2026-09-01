import { describe, expect, it } from 'vitest';
import { buildSkillsDraft, deriveLiveSignals } from '../src/lib/live-meeting-coach';

describe('live meeting coach', () => {
  it('detects long monologues and recommends recovering objectivity', () => {
    const transcript = Array.from({ length: 95 }, (_, i) => `palavra${i}`).join(' ');
    const signals = deriveLiveSignals(transcript);
    expect(signals.some(signal => signal.skill === 'objetividade' && signal.polarity === 'weakness')).toBe(true);
  });

  it('recognizes questions as positive evidence for the Perguntas skill', () => {
    const signals = deriveLiveSignals('Qual é a maior objeção para avançarmos hoje? O que faria sentido para você como próximo passo?');
    expect(signals.some(signal => signal.skill === 'perguntas' && signal.polarity === 'strength')).toBe(true);
  });

  it('recognizes practical next-step language as positive Condução evidence', () => {
    const signals = deriveLiveSignals('Então vamos combinar o seguinte próximo passo: eu envio a proposta hoje e amanhã validamos juntos.');
    expect(signals.some(signal => signal.skill === 'conducao' && signal.polarity === 'strength')).toBe(true);
  });

  it('does not invent scores when transcript evidence is insufficient', () => {
    const transcript = 'sim, certo';
    const skills = buildSkillsDraft(transcript, deriveLiveSignals(transcript));
    expect(skills.every(metric => metric.evidenceSufficient === false && metric.score === null)).toBe(true);
  });
});
