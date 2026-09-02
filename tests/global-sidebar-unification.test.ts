// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('global sidebar unification',()=>{
  it('mounts the shared home sidebar globally for legacy app tabs',()=>{
    const layout=readFileSync('src/app/layout.tsx','utf8');
    const sidebar=readFileSync('src/components/global-legacy-sidebar.tsx','utf8');
    expect(layout).toContain("import { GlobalLegacySidebar } from '@/components/global-legacy-sidebar'");
    expect(layout).toContain('<GlobalLegacySidebar/>');
    expect(sidebar).toContain('DashboardSidebar');
    expect(sidebar).toContain("document.querySelector('.octa-page .octa-sidebar')");
  });

  it('keeps the sidebar fixed without duplicating shared shells or auth pages',()=>{
    const sidebar=readFileSync('src/components/global-legacy-sidebar.tsx','utf8');
    expect(sidebar).toContain('position:fixed!important');
    expect(sidebar).toContain('height:100dvh!important');
    expect(sidebar).toContain("path==='/'");
    expect(sidebar).toContain("path.startsWith('/login')");
    expect(sidebar).toContain("path.startsWith('/room/')");
    expect(sidebar).toContain('body>main:has(>.recordings-workspace)>aside:first-child');
  });
});
