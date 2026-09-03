// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('global OCTA AI liquid orb',()=>{
  it('renders OCTA AI on every route instead of hiding selected tabs',()=>{
    const globalAI=readFileSync('src/components/ai/global-octa-ai.tsx','utf8');
    expect(globalAI).toContain('return <OctaSkillCoach/>');
    expect(globalAI).not.toContain("pathname==='/skills'");
    expect(globalAI).not.toContain("pathname==='/gravacoes'");
    expect(globalAI).not.toContain("pathname==='/'");
  });

  it('uses a fixed animated liquid sphere and hides the closed text label',()=>{
    const mark=readFileSync('src/components/ai/octa-digital-mark.tsx','utf8');
    expect(mark).toContain('octa-ai-liquid-core');
    expect(mark).toContain('octa-ai-liquid-wave');
    expect(mark).toContain('@keyframes octa-ai-liquid-spin');
    expect(mark).toContain('@keyframes octa-ai-float');
    expect(mark).toContain('.octa-ai-orb>span,.octa-ai-orb>svg:last-child{display:none!important}');
    expect(mark).toContain('right:24px!important;bottom:22px!important');
  });
});
