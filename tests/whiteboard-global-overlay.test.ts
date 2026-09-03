// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';

describe('floating whiteboard only',()=>{
  it('removes the lousa route and converts its nav link into an overlay trigger',()=>{
    expect(existsSync('src/app/lousa/page.tsx')).toBe(false);
    const context=readFileSync('src/components/tool-overlay-context.tsx','utf8');
    expect(context).toContain("link.removeAttribute('href')");
    expect(context).toContain("setTool('whiteboard')");
  });

  it('shares only the whiteboard canvas, never the personal desktop',()=>{
    const whiteboard=readFileSync('src/features/whiteboard/whiteboard-panel.tsx','utf8');
    const livekit=readFileSync('src/features/meeting/livekit-stage.tsx','utf8');
    expect(whiteboard).toContain('captureStream');
    expect(whiteboard).toContain("'octa-whiteboard-share'");
    expect(whiteboard).not.toContain('getDisplayMedia');
    expect(livekit).toContain('Track.Source.ScreenShare');
    expect(livekit).toContain("name:'OCTA Lousa'");
  });
});
