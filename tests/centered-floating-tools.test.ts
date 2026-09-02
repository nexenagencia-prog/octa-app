// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

// Regression contract: both floating tools must open centered; calculator must remain hero-toned glass.
describe('centered floating tools',()=>{
  it('opens the notes card centered in the viewport',()=>{
    const source=readFileSync('src/features/notes/floating-notes-card.tsx','utf8');
    expect(source).toContain('(window.innerWidth-width)/2');
    expect(source).toContain('(window.innerHeight-height)/2');
  });

  it('opens the calculator centered and uses hero-toned glass instead of black',()=>{
    const source=readFileSync('src/components/global-calculator-overlay.tsx','utf8');
    expect(source).toContain('centerCalculator');
    expect(source).toContain('(window.innerWidth-width)/2');
    expect(source).toContain('(window.innerHeight-height)/2');
    expect(source).toContain('heroGlassCalculator');
    expect(source).toContain('backdropFilter');
    expect(source).not.toContain("background:'linear-gradient(145deg,rgba(52,55,59,.66),rgba(14,17,21,.74))'");
  });
});
