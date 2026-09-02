// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(p,'utf8');
describe('reference home fidelity',()=>{
 it('uses the supplied lake hero and the requested dashboard sections',()=>{const home=read('src/app/page.tsx');expect(home).toContain('heroPhoto');expect(home).toContain('Performance geral');expect(home).toContain('GRAVAÇÕES RECENTES');expect(home).toContain('Digite sua mensagem...');expect(home).toContain('Bem-vindo <b>{name}!</b>')});
 it('keeps the reference dark glass hierarchy and four quick actions',()=>{const css=read('src/app/home-reference.module.css');const home=read('src/app/page.tsx');expect(css).toContain('backdrop-filter:blur(28px)');expect(css).toContain('grid-template-columns:repeat(4,1fr)');expect(css).toContain("background:url('/octa-hero-lake.webp')");expect(home).toContain("['Nova reunião'");expect(home).toContain("['Entrar em reunião'");expect(home).toContain("['Agendar'");expect(home).toContain("['Convidar pessoas'")});
 it('does not render the floating global AI orb on the redesigned home',()=>{const global=read('src/components/ai/global-octa-ai.tsx');expect(global).toContain("pathname==='/'")});
});
