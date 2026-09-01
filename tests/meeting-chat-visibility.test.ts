// @vitest-environment node
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('meeting chat visibility',()=>{
 it('keeps the message composer in the live chat',()=>{
  const chat=fs.readFileSync('src/features/chat/chat-overlay.tsx','utf8');
  expect(chat).toContain('aria-label="Mensagem do chat"');
  expect(chat).toContain('max-h-20');
 });
 it('lifts the dual meeting stage above the bottom controls',()=>{
  const css=fs.readFileSync('src/app/meeting-chat-visibility.css','utf8');
  expect(css).toContain('.instant-dual-stage');
  expect(css).toContain('translateY(-12px)');
  expect(css).toContain('max-height:calc(100dvh - 190px)');
 });
});
