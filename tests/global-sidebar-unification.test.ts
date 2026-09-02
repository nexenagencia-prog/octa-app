// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('global sidebar unification',()=>{
  it('mounts the exact Home sidebar styling globally',()=>{
    const layout=readFileSync('src/app/layout.tsx','utf8');
    const sidebar=readFileSync('src/components/global-legacy-sidebar.tsx','utf8');
    expect(layout).toContain("import { GlobalLegacySidebar } from '@/components/global-legacy-sidebar'");
    expect(layout).toContain('<GlobalLegacySidebar/>');
    expect(sidebar).toContain("homeStyles from '@/app/home-reference.module.css'");
    expect(sidebar).toContain('octa-home-sidebar-global');
    expect(sidebar).toContain('homeStyles.sidebar');
    expect(sidebar).toContain('homeStyles.active');
  });

  it('locks one fixed 250px sidebar and hides every older app sidebar',()=>{
    const sidebar=readFileSync('src/components/global-legacy-sidebar.tsx','utf8');
    expect(sidebar).toContain('position:fixed!important');
    expect(sidebar).toContain('width:250px!important');
    expect(sidebar).toContain('height:100dvh!important');
    expect(sidebar).toContain('.octa-page>.octa-sidebar{display:none!important}');
    expect(sidebar).toContain('.octa-page .octa-main,.octa-page.sidebar-collapsed .octa-main{margin-left:250px!important}');
    expect(sidebar).toContain('body>main:has(>.recordings-workspace)>aside:first-child');
    expect(sidebar).toContain("path.startsWith('/login')");
    expect(sidebar).not.toContain("path.startsWith('/room/')");
  });
});
