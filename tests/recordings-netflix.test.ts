// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

describe('recordings Netflix treatment', () => {
  it('renders a performance badge with five stars in the featured replay', () => {
    const page = readFileSync('src/app/gravacoes/page.tsx', 'utf8');
    expect(page).toContain('recordings-performance');
    expect(page).toContain('Maior performance');
    expect(page).toContain('Array.from({ length: 5 })');
  });

  it('uses a recordings-only black cinematic stylesheet without blue surfaces', () => {
    expect(existsSync('src/app/gravacoes/recordings-netflix.css')).toBe(true);
    if (!existsSync('src/app/gravacoes/recordings-netflix.css')) return;
    const css = readFileSync('src/app/gravacoes/recordings-netflix.css', 'utf8').toLowerCase();
    expect(css).toContain('#000');
    expect(css).not.toMatch(/#07121d|#102536|#062536|#0[0-9a-f]{5}/);
  });
});
