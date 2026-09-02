// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('home reference fidelity',()=>{
  it('keeps quick action icons and labels aligned on fixed rows',()=>{
    const css=readFileSync('src/app/home-quick-actions-alignment.css','utf8');
    const layout=readFileSync('src/app/layout.tsx','utf8');
    expect(layout).toContain("import './home-quick-actions-alignment.css'");
    expect(css).toContain('grid-template-rows:46px 32px!important');
    expect(css).toContain('justify-items:center!important');
    expect(css).toContain('align-items:flex-start!important');
  });
});
