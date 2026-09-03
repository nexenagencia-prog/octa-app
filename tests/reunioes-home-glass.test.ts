// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

const read=(p:string)=>readFileSync(p,'utf8');

describe('reuniões com linguagem visual da home',()=>{
  it('usa superfícies escuras em vidro e remove o azul/ciano dominante',()=>{
    const page=read('src/app/reunioes/page.tsx');
    expect(page).toContain('reunioes-home-surface');
    expect(page).toContain('backdrop-blur-[28px]');
    expect(page).toContain('bg-[rgba(24,25,26,.68)]');
    expect(page).toContain('text-white/70');
    expect(page).not.toContain('bg-[#edf3f6]');
    expect(page).not.toContain('text-cyan-100');
  });
});
