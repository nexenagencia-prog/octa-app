// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(p,'utf8');
describe('menu superior único da Home',()=>{
 it('mantém as medidas da Home no menu global',()=>{const nav=read('src/components/global-hero-top-nav.tsx');expect(nav).toContain('height:76px');expect(nav).toContain('width:370px');expect(nav).toContain('height:46px');expect(nav).toContain('padding:0 28px');expect(nav).toContain('gap:36px');expect(nav).toContain('font-size:13px');expect(nav).toContain('width:38px;height:38px')});
 it('não renderiza cabeçalho local em Minhas Anotações',()=>{const page=read('src/app/minhas-anotacoes/page.tsx');expect(page).not.toContain('notes-ref-top');expect(page).not.toContain('<Bell');expect(page).not.toContain('notes-ref-search')});
});
