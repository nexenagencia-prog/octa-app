import { describe, expect, it } from 'vitest';
import { aggregateSkillAnalyses, overallScore, type MeetingSkillAnalysis } from '../src/lib/skills-analysis';

describe('skills analysis', () => {
  it('ignores metrics without enough evidence', () => {
    const analyses: MeetingSkillAnalysis[] = [{
      meetingId: 'm1', meetingTitle: 'Teste', createdAt: '2026-09-01T00:00:00.000Z', source: 'ai', summary: 'ok',
      metrics: [
        { key: 'clareza', label: 'Clareza', score: 90, confidence: 0.9, evidenceSufficient: true, explanation: 'claro', recommendation: 'manter', evidence: ['trecho'] },
        { key: 'escuta', label: 'Escuta', score: 10, confidence: 0.2, evidenceSufficient: false, explanation: 'sem evidência', recommendation: 'coletar mais contexto', evidence: [] },
      ],
    }];
    const aggregated = aggregateSkillAnalyses(analyses);
    expect(aggregated.find(item => item.key === 'clareza')?.score).toBe(90);
    expect(aggregated.find(item => item.key === 'escuta')?.score).toBeNull();
    expect(overallScore(aggregated)).toBe(90);
  });
});
