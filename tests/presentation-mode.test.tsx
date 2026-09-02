// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('../src/features/meeting/presentation-mode.tsx', import.meta.url), 'utf8');

describe('PresentationMode contract', () => {
  it('keeps preview private until explicit approval', () => {
    expect(source).toContain('Só você está vendo');
    expect(source).toContain('Apresentar este slide');
    expect(source).toContain("const [previewId, setPreviewId] = useState<string | null>(null)");
    expect(source).toContain("const [liveId, setLiveId] = useState<string | null>(null)");
    expect(source).toContain("broadcast({ action: 'show', slide })");
  });

  it('supports participant visibility and stopping presentation', () => {
    expect(source).toContain('Ocultar participantes');
    expect(source).toContain('Mostrar participantes');
    expect(source).toContain('Parar apresentação');
    expect(source).toContain("broadcast({ action: 'stop' })");
    expect(source).toContain('Slides da reunião');
  });
});
