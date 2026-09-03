// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root=process.cwd();
const meeting=fs.readFileSync(path.join(root,'src/features/meeting/meeting-client.tsx'),'utf8');
const chat=fs.readFileSync(path.join(root,'src/features/chat/chat-overlay.tsx'),'utf8');
const livekit=fs.readFileSync(path.join(root,'src/features/meeting/livekit-stage.tsx'),'utf8');

describe('meeting live chat and skills contract',()=>{
 it('starts the public meeting chat empty and closed',()=>{
  expect(meeting).toContain('const[chat,setChat]=useState(false)');
  expect(meeting).toContain('initialMessages={[]}');
  expect(meeting).not.toContain('demoMessages');
  expect(meeting).not.toContain('<span>32</span>');
 });
 it('opens chat only on user action or a real incoming message',()=>{
  expect(meeting).toContain('hidden={!chat}');
  expect(meeting).toContain('onIncoming={()=>setChat(true)}');
  expect(chat).toContain("window.addEventListener('octa-chat-message'");
  expect(chat).toContain("window.dispatchEvent(new CustomEvent('octa-chat-send'");
 });
 it('bridges chat through the LiveKit room data channel',()=>{
  expect(livekit).toContain('RoomEvent.DataReceived');
  expect(livekit).toContain('publishData');
  expect(livekit).toContain("'octa-chat'");
 });
 it('keeps a visible entry point for live Skills and visual analysis',()=>{
  expect(meeting).toContain('SKILLS AO VIVO');
  expect(meeting).toContain('Sinais visuais');
  expect(meeting).toContain("document.querySelector<HTMLButtonElement>('.meeting-strategic-ai .meeting-ai-orb')");
 });
});
