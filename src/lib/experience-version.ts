export type ExperienceVersion = 'v1' | 'v2';

export const DEFAULT_EXPERIENCE_VERSION: ExperienceVersion = 'v1';

export function normalizeExperienceVersion(value: unknown): ExperienceVersion {
  return value === 'v2' ? 'v2' : 'v1';
}

export async function getExperienceVersion(): Promise<ExperienceVersion> {
  const response = await fetch('/api/experience-version', { cache: 'no-store' });
  if (!response.ok) return DEFAULT_EXPERIENCE_VERSION;
  const payload = await response.json();
  return normalizeExperienceVersion(payload.version);
}

export async function setExperienceVersion(version: ExperienceVersion): Promise<ExperienceVersion> {
  const response = await fetch('/api/experience-version', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Não foi possível alterar a versão.');
  return normalizeExperienceVersion(payload.version);
}
