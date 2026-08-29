'use client';
import { FormEvent, useState } from 'react';
import { Heart, Send, X } from 'lucide-react';
import type { ChatMessage } from '@/types/domain';

export function ChatOverlay({initialMessages,onClose}:{initialMessages:ChatMessage[];onClose:()=>void}){
 const [messages,setMessages]=useState(initialMessages); const [body,setBody]=useState('');
 function send(e:FormEvent){e.preventDefault(); const text=body.trim(); if(!text)return; setMessages(m=>[...m,{id:crypto.randomUUID(),roomId:'demo',userId:'u-host',userName:'Kelly',body:text,createdAt:new Date().toISOString()}]); setBody('');}
 return <div className="pointer-events-none absolute inset-x-3 bottom-24 z-30 md:left-4 md:right-auto md:w-[360px]">
  <div className="pointer-events-auto rounded-[24px] border border-white/10 bg-black/35 p-3 backdrop-blur-xl">
   <div className="mb-2 flex items-center justify-between"><span className="text-[11px] uppercase tracking-[.14em] text-white/45">Chat ao vivo</span><button onClick={onClose} className="text-white/40 hover:text-white"><X size={15}/></button></div>
   <div className="no-scrollbar max-h-48 space-y-2 overflow-y-auto pr-1">{messages.slice(-5).map(m=><div key={m.id} className="flex gap-2 text-sm"><div className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[9px] font-bold">{m.userName.slice(0,1)}</div><div><span className="mr-2 text-xs font-semibold">{m.userName}</span><span className="text-white/75">{m.body}</span></div><Heart size={12} className="ml-auto mt-1 shrink-0 text-white/25"/></div>)}</div>
   <form onSubmit={send} className="mt-3 flex gap-2"><input value={body} onChange={e=>setBody(e.target.value)} placeholder="Mensagem..." className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs outline-none placeholder:text-white/25"/><button className="grid size-8 place-items-center rounded-full bg-white text-black"><Send size={13}/></button></form>
  </div>
 </div>
}
