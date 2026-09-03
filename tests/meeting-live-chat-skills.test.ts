// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root=process.cwd();
const meeting=fs.readFileSync(path.join(root,'src/features/meeting/meeting-client.tsx'),'utf8');
const instant=fs.readFileSync(path.join(root,'src/features/meeting/instant-meeting-client.tsx'),'utf8');
const chat=fs.readFileSync(path.join(root,'src/features/chat/chat-overlay.tsx'),'utf8');
const livekit=fs.readFileSync(path.join(root,'src/features/meeting/livekit-stage.tsx'),'utf8');

describe('meeting live chat and skills contract',()=>{
 it('starts the public meeting chat empty and closed',()=>{
  expect(instant).toContain('const[chat,setChat]=useState(false)');
  expect(instant).toContain('initialMessages={[]}');
  expect(instant).not.toContain('demoMessages');
  expect(instant).not.toContain('<span>32</span>');
 });
 it('opens chat only on user action or a real incoming message',()=>{
  expect(instant).toContain('hidden={!chat}');
  expect(instant).toContain('onIncoming={()=>setChat(true)}');
  expect(chat).toContain("window.addEventListener('octa-chat-message'");
  expect(chat).toContain("window.dispatchEvent(new CustomEvent('octa-chat-send'");
 });
 it('bridges chat through the LiveKit room data channel',()=>{
  expect(livekit).toContain('RoomEvent.DataReceived');
  expect(livekit).toContain('publishData');
  expect(livekit).toContain("'octa-chat'");
 });
 it('keeps realtime Skills fixed beside the meeting and strategic AI available',()=>{
  expect(instant).toContain('SKILLS EM TEMPO REAL');
  expect(instant).toContain('meeting-reference-right');
  expect(instant).toContain('<RealtimeSkillsPanel');
  expect(meeting).toContain('<MeetingStrategicAI');
 });
});