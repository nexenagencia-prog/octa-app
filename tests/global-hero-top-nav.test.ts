// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('global hero top navigation',()=>{
  it('mounts one hero-style top navigation globally',()=>{
    const layout=readFileSync('src/app/layout.tsx','utf8');
    const nav=readFileSync('src/components/global-hero-top-nav.tsx','utf8');
    expect(layout).toContain("import { GlobalHeroTopNav } from '@/components/global-hero-top-nav'");
    expect(layout).toContain('<GlobalHeroTopNav/>');
    expect(nav).toContain('Buscar reunião, pessoa ou gravação');
    expect(nav).toContain("{href:'/',label:'Início'}");
    expect(nav).toContain("{href:'/reunioes',label:'Reuniões'}");
    expect(nav).toContain("{href:'/agenda',label:'Agenda'}");
    expect(nav).toContain("{href:'/planos',label:'Planos e preços'}");
  });

  it('keeps the hero layout order and hides legacy topbars without collapsing their space',()=>{
    const nav=readFileSync('src/components/global-hero-top-nav.tsx','utf8');
    expect(nav.indexOf('global-hero-search')).toBeLessThan(nav.indexOf('global-hero-links'));
    expect(nav.indexOf('global-hero-links')).toBeLessThan(nav.indexOf('global-hero-bell'));
    expect(nav).toContain('.octa-topbar{visibility:hidden!important;pointer-events:none!important}');
    expect(nav).toContain('left:250px');
    expect(nav).toContain("path===item.href?'is-active':''");
  });
});
