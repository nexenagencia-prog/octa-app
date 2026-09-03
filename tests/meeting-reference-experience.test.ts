// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

const meeting=()=>readFileSync('src/features/meeting/instant-meeting-client.tsx','utf8');

describe('approved meeting reference experience',()=>{
 it('renders the right realtime skills rail without facial emotion claims',()=>{const source=meeting();expect(source).toContain('SKILLS EM TEMPO REAL');expect(source).toContain('Análise baseada em fala, participação e interação');expect(source).toContain('BAIXA INTERAÇÃO ESTIMADA');expect(source).toContain('Nenhuma queda relevante detectada');expect(source).toContain('não inferência emocional pelo rosto');});
 it('includes horizontal meeting slides that launch the synchronized presentation',()=>{const source=meeting();expect(source).toContain('meeting-slide-rail');expect(source).toContain("scrollBy({left:dir*330,behavior:'smooth'})");expect(source).toContain('launchSlideId={presentationLaunchId}');expect(source).toContain('Clique em um slide para abrir em tela cheia.');});
 it('keeps chat, hearts and the fixed global sidebar architecture',()=>{const source=meeting();expect(source).toContain('Ativar ou desativar chat');expect(source).toContain('setHeartCount');expect(source).not.toContain('leftLinks');expect(source).not.toContain('function Sidebar(');});
});
