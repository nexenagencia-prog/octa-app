'use client';
import { FormEvent, useState } from 'react';
import { Heart, Send, X } from 'lucide-react';
import type { ChatMessage } from '@/types/domain';

export function ChatOverlay({initialMessages,onClose}:{initialMessages:ChatMessage[];onClose:()=>void}){
 const [messages,setMessages]=useState(initialMessages); const [body,setBody]=useState('');
 function send(e:FormEvent){e.preventDefault(); const text=body.trim(); if(!text)return; setMessages(m=>[...m,{id:crypto.randomUUID(),roomId:'demo',userId:'u-host',userName:'Kelly',body:text,createdAt:new Date().toISOString()}]); setBody('');}
 return <div className="meeting-chat-dock pointer-events-none absolute inset-x-0 bottom-0 z-30">
  <div className="meeting-chat-glass pointer-events-auto px-4 pb-3 pt-7">
   <div className="mb-1.5 flex items-center justify-between"><span className="text-[10px] uppercase tracking-[.16em] text-white/48">Chat ao vivo</span><button onClick={onClose} aria-label="Fechar chat" className="grid size-7 place-items-center rounded-full bg-white/[.06] text-white/45 transition hover:bg-white/[.12] hover:text-white"><X size={14}/></button></div>
   <div className="no-scrollbar max-h-20 space-y-1.5 overflow-y-auto pr-1">{messages.slice(-3).map(m=><div key={m.id} className="flex gap-2 text-[11px]"><div className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/10 text-[8px] font-bold">{m.userName.slice(0,1)}</div><div className="min-w-0 flex-1"><span className="mr-2 font-semibold text-white/92">{m.userName}</span><span className="text-white/68">{m.body}</span></div><Heart size={11} className="mt-1 shrink-0 text-white/22"/></div>)}</div>
   <form onSubmit={send} className="mt-2 flex gap-2"><input value={body} onChange={e=>setBody(e.target.value)} placeholder="Mensagem..." aria-label="Mensagem do chat" className="meeting-chat-input min-w-0 flex-1 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-xs text-white outline-none placeholder:text-white/28"/><button aria-label="Enviar mensagem" className="grid size-9 place-items-center rounded-full bg-white text-black transition active:scale-95"><Send size={13}/></button></form>
  </div>
 </div>
}
