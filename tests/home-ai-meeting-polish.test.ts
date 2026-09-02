// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
const read=(path:string)=>readFileSync(path,'utf8');
describe('home, OCTA AI launcher and participant light-mode polish',()=>{
 it('removes the next-meeting card from the hero and keeps the supplied hero photo',()=>{const home=read('src/app/page.tsx');expect(home).toContain("const HERO_PHOTO='/octa-hero-user.webp'");expect(home).not.toContain('styles.nextHead');expect(home).not.toContain('Planejamento de Marketing</h2><div className={styles.avatars}')});
 it('uses a clean Apple-like light launcher instead of a dark orb',()=>{const css=read('src/app/octa-ui-polish-batch.css');expect(css).toContain('background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(238,241,244,.94))');expect(css).toContain('color:#202226!important');expect(css).toContain('.octa-ai-orb .octa-ai-mark')});
 it('keeps participant names light over participant imagery in light mode',()=>{const css=read('src/app/octa-ui-polish-batch.css');expect(css).toContain('html[data-theme="light"] .participant-stage-tile > span b');expect(css).toContain('html[data-theme="light"] .participant-stage-person-copy b');expect(css).toContain('color:#fff!important')});
});
