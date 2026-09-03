// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('global floating whiteboard navigation',()=>{
  it('opens Lousa as a tool instead of navigating to /lousa',()=>{
    const nav=readFileSync('src/components/nav.tsx','utf8');
    expect(nav).toContain("tool('Lousa',Brush,'whiteboard')");
    expect(nav).not.toContain("href:'/lousa',label:'Lousa'");
  });

  it('keeps whiteboard in the global overlay tool model',()=>{
    const context=readFileSync('src/components/tool-overlay-context.tsx','utf8');
    const overlay=readFileSync('src/components/tool-overlay.tsx','utf8');
    expect(context).toContain("'whiteboard'");
    expect(overlay).toContain("tool==='whiteboard'");
    expect(overlay).toContain('FloatingWhiteboardCard');
  });
});
