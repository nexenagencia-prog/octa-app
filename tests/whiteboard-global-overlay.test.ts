// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('global floating whiteboard navigation',()=>{
  it('intercepts the legacy Lousa link and opens the overlay without navigation',()=>{
    const overlay=readFileSync('src/components/tool-overlay.tsx','utf8');
    expect(overlay).toContain('a[href="/lousa"]');
    expect(overlay).toContain('event.preventDefault()');
    expect(overlay).toContain("openTool('whiteboard')");
  });

  it('keeps whiteboard in the global overlay tool model',()=>{
    const context=readFileSync('src/components/tool-overlay-context.tsx','utf8');
    const overlay=readFileSync('src/components/tool-overlay.tsx','utf8');
    expect(context).toContain("'whiteboard'");
    expect(overlay).toContain("tool==='whiteboard'");
    expect(overlay).toContain('WhiteboardPanel');
  });
});
