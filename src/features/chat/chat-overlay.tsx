'use client';
import { FormEvent, useMemo, useState } from 'react';
import { Heart, Send, Smile, X } from 'lucide-react';
import type { ChatMessage } from '@/types/domain';

const EMOJIS=['👍','❤️','🔥','👏','😂','🎯'];

export function ChatOverlay({initialMessages,onClose,onActivity}:{initialMessages:ChatMessage[];onClose:()=>void;onActivity?:()=>void}){
 const [messages,setMessages]=useState(initialMessages);const[body,setBody]=useState('');const[emojiOpen,setEmojiOpen]=useState(false);const[likes,setLikes]=useState<Record<string,number>>({});
 const recent=useMemo(()=>messages.slice(-5),[messages]);
 function send(e:FormEvent){e.preventDefault();const text=body.trim();if(!text)return;setMessages(m=>[...m,{id:crypto.randomUUID(),roomId:'demo',userId:'u-host',userName:'Kelly',body:text,createdAt:new Date().toISOString()}]);setBody('');setEmojiOpen(false);onActivity?.();}
 const addEmoji=(emoji:string)=>{setBody(value=>`${value}${emoji}`);setEmojiOpen(false);onActivity?.()};
 const like=(id:string)=>{setLikes(current=>({...current,[id]:(current[id]??0)+1}));onActivity?.()};
 return <div className="meeting-chat-dock pointer-events-none absolute inset-x-0 bottom-0 z-30">
  <div className="meeting-chat-glass pointer-events-auto px-4 pb-3 pt-7">
   <div className="mb-1.5 flex items-center justify-between"><span className="text-[10px] uppercase tracking-[.16em] text-white/48">Chat ao vivo</span><button onClick={onClose} aria-label="Desativar chat" className="grid size-7 place-items-center rounded-full bg-white/[.06] text-white/45 transition hover:bg-white/[.12] hover:text-white"><X size={14}/></button></div>
   <div className="no-scrollbar max-h-28 space-y-1.5 overflow-y-auto pr-1">{recent.map(m=><div key={m.id} className="flex items-start gap-2 text-[11px]"><div className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/10 text-[8px] font-bold">{m.userName.slice(0,1)}</div><div className="min-w-0 flex-1"><span className="mr-2 font-semibold text-white/92">{m.userName}</span><span className="text-white/68">{m.body}</span></div><button type="button" onClick={()=>like(m.id)} aria-label={`Curtir mensagem de ${m.userName}`} className={`mt-0.5 flex shrink-0 items-center gap-1 rounded-full px-1.5 py-1 transition ${likes[m.id]?'bg-rose-500/15 text-rose-300':'text-white/28 hover:bg-white/[.06] hover:text-white/70'}`}><Heart size={11} fill={likes[m.id]?'currentColor':'none'}/>{Boolean(likes[m.id])&&<span className="text-[9px]">{likes[m.id]}</span>}</button></div>)}</div>
   <form onSubmit={send} className="relative mt-2 flex gap-2"><div className="meeting-chat-input-wrap relative min-w-0 flex-1"><input value={body} onChange={e=>setBody(e.target.value)} placeholder="Mensagem..." aria-label="Mensagem do chat" className="meeting-chat-input h-10 w-full rounded-full border border-white/10 bg-black/45 pl-3 pr-11 text-xs text-white outline-none placeholder:text-white/28"/><button type="button" aria-label="Adicionar emoji" onClick={()=>setEmojiOpen(value=>!value)} className="absolute right-1 top-1 grid size-8 place-items-center rounded-full text-white/55 transition hover:bg-white/[.08] hover:text-white"><Smile size={15}/></button>{emojiOpen&&<div className="meeting-emoji-picker absolute bottom-12 right-0 z-40 flex gap-1 rounded-2xl border border-white/10 bg-black/85 p-2 shadow-2xl backdrop-blur-2xl">{EMOJIS.map(emoji=><button type="button" key={emoji} onClick={()=>addEmoji(emoji)} className="grid size-8 place-items-center rounded-xl text-base hover:bg-white/10">{emoji}</button>)}</div>}</div><button aria-label="Enviar mensagem" className="grid size-10 place-items-center rounded-full bg-white text-black transition active:scale-95"><Send size={13}/></button></form>
  </div>
 </div>
}
