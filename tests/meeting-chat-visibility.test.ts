// @vitest-environment node
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
describe('meeting chat visibility',()=>{
 it('keeps the message composer in the live chat',()=>{const chat=fs.readFileSync('src/features/chat/chat-overlay.tsx','utf8');expect(chat).toContain('aria-label="Mensagem do chat"');expect(chat).toContain('max-h-20')});
 it('fits both meeting stages inside the real AppShell space',()=>{const css=fs.readFileSync('src/app/meeting-chat-visibility.css','utf8');expect(css).toContain('flex:1 1 0!important');expect(css).toContain('height:100%!important');expect(css).toContain('aspect-ratio:9/16!important');expect(css).toContain('gap:12px!important')});
 it('keeps live chat readable in light mode',()=>{const css=fs.readFileSync('src/app/meeting-chat-visibility.css','utf8');expect(css).toContain('html[data-theme="light"] .meeting-chat-glass');expect(css).toContain('html[data-theme="light"] .meeting-chat-input');expect(css).toContain('html[data-theme="light"] .meeting-chat-glass form button svg')});
});
