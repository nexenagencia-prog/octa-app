// @vitest-environment node
import {describe,expect,it} from 'vitest';
import fs from 'node:fs';
import {isNearChatBottom} from '../src/lib/chat-auto-scroll';

describe('OCTA AI auto-scroll',()=>{
 it('pauses when the user is away from the end and resumes near the end',()=>{expect(isNearChatBottom({scrollTop:300,scrollHeight:1000,clientHeight:500})).toBe(false);expect(isNearChatBottom({scrollTop:430,scrollHeight:1000,clientHeight:500})).toBe(true)});
 it('keeps smooth scrolling scoped to OCTA AI messages',()=>{const source=fs.readFileSync('src/components/ai/octa-skill-coach.tsx','utf8');expect(source).toContain("scrollTo({top:el.scrollHeight,behavior})");expect(source).toContain("behavior:ScrollBehavior='smooth'");expect(source).toContain('onScroll={()=>{const el=messagesRef.current;if(el)autoScrollRef.current=isNearChatBottom(el)}');expect(source).toContain('[open,messages,loading]')});
 it('does not change the meeting live chat',()=>{const source=fs.readFileSync('src/features/chat/chat-overlay.tsx','utf8');expect(source).not.toContain('isNearChatBottom');expect(source).not.toContain('messagesRef')});
});
