// @vitest-environment node
import {describe,expect,it} from 'vitest';
import fs from 'node:fs';

describe('meeting chat visibility',()=>{
 it('supports chat reactions and emoji input',()=>{const chat=fs.readFileSync('src/features/chat/chat-overlay.tsx','utf8');expect(chat).toContain('Mensagem do chat');expect(chat).toContain('Adicionar emoji');expect(chat).toContain('Curtir mensagem');});
 it('uses the meeting reference grid',()=>{const css=fs.readFileSync('src/app/meeting-chat-visibility.css','utf8');expect(css).toContain('.meeting-reference-grid');expect(css).toContain('.meeting-reference-right');expect(css).toContain('.meeting-reference-controls');});
});
