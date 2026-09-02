// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('ASK OCTA site integration', () => {
  it('mounts the full OCTA AI coach inside Skills', () => {
    const skills = readFileSync('src/app/skills/page.tsx', 'utf8');

    expect(skills).toMatch(/import\s*\{\s*OctaSkillCoach\s*\}\s*from\s*['\"]@\/components\/ai\/octa-skill-coach['\"]/);
    expect(skills).toContain('<OctaSkillCoach');
  });

  it('lets Skills training open the coach instead of leaving a dead CTA', () => {
    const skills = readFileSync('src/app/skills/page.tsx', 'utf8');
    const coach = readFileSync('src/components/ai/octa-skill-coach.tsx', 'utf8');

    expect(skills).toContain("window.dispatchEvent(new CustomEvent('octa-ai:open'");
    expect(coach).toContain("window.addEventListener('octa-ai:open'");
  });

  it('keeps the coach grounded in meeting history and performance evidence', () => {
    const coach = readFileSync('src/components/ai/octa-skill-coach.tsx', 'utf8');

    expect(coach).toContain('compare minhas últimas reuniões');
    expect(coach).toContain('me dê um treino');
    expect(coach).toContain('Respostas baseadas nas análises e evidências disponíveis nas suas reuniões.');
  });
});
