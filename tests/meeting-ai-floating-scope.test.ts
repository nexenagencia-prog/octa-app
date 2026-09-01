// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('OCTA AI floating assistant scope', () => {
  it('is not mounted globally and is mounted inside meetings', () => {
    const layout = readFileSync('src/app/layout.tsx', 'utf8');
    const meeting = readFileSync('src/features/meeting/meeting-client.tsx', 'utf8');

    expect(layout).not.toContain('<OctaSkillCoach');
    expect(meeting).toContain('<OctaSkillCoach');
  });

  it('keeps the assistant focused on meeting performance', () => {
    const coach = readFileSync('src/components/ai/octa-skill-coach.tsx', 'utf8');

    expect(coach).toContain('OCTA AI');
    expect(coach).toContain('performance');
    expect(coach).toContain('reunião');
  });
});
