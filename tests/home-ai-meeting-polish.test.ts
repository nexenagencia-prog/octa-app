// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
const read=(path:string)=>readFileSync(path,'utf8');
describe('home, OCTA AI launcher and participant light-mode polish',()=>{
 it('uses the supplied lake hero in the redesigned reference home',()=>{const home=read('src/app/page.tsx');const css=read('src/app/home-reference.module.css');expect(home).toContain('styles.heroPhoto');expect(css).toContain("background:url('/octa-hero-lake.webp')");expect(home).not.toContain('/octa-hero-man.webp')});
 it('uses a clean Apple-like light launcher instead of a dark orb outside the reference home',()=>{const css=read('src/app/octa-ui-polish-batch.css');expect(css).toContain('background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(238,241,244,.94))');expect(css).toContain('color:#202226!important');expect(css).toContain('.octa-ai-orb .octa-ai-mark')});
 it('keeps participant names light over participant imagery in light mode',()=>{const css=read('src/app/octa-ui-polish-batch.css');expect(css).toContain('html[data-theme="light"] .participant-stage-tile > span b');expect(css).toContain('html[data-theme="light"] .participant-stage-person-copy b');expect(css).toContain('color:#fff!important')});
});
