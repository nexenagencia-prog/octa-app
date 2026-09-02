// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(p,'utf8');
describe('recordings reference dashboard',()=>{
 it('reuses the approved home sidebar and replaces the old featured replay layout',()=>{const page=read('src/app/gravacoes/page.tsx');expect(page).toContain("homeStyles from '../home-reference.module.css'");expect(page).toContain("label==='Gravações'?homeStyles.active");expect(page).not.toContain('recordings-feature');expect(page).toContain('recordings-grid')});
 it('matches the supplied three-column recordings dashboard with report and OCTA AI',()=>{const page=read('src/app/gravacoes/page.tsx');const css=read('src/app/gravacoes/recordings-netflix.css');expect(css).toContain('grid-template-columns:repeat(3,minmax(0,1fr))');expect(page).toContain('Relatório da reunião');expect(page).toContain('Performance geral');expect(page).toContain('Digite sua mensagem...');expect(page).toContain('Suas reuniões gravadas, organizadas como na Netflix.')});
 it('lets the user rename recordings and upload persistent custom covers',()=>{const page=read('src/app/gravacoes/page.tsx');expect(page).toContain("const STORAGE_KEY='octa-recording-customizations-v1'");expect(page).toContain("canvas.toDataURL('image/webp',.82)");expect(page).toContain('Subir foto de capa');expect(page).toContain('Nome da gravação');expect(page).toContain('Salvar alterações');expect(page).toContain('localStorage.setItem(STORAGE_KEY')});
 it('suppresses the duplicate floating global AI on recordings',()=>{const global=read('src/components/ai/global-octa-ai.tsx');expect(global).toContain("pathname==='/gravacoes'")});
});
