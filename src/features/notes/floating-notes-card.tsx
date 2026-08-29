'use client';
import { Check, GripHorizontal, Save, StickyNote, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { saveNote } from '@/lib/notes-store';

export function FloatingNotesCard({roomSlug,meetingTitle,onClose}:{roomSlug?:string;meetingTitle?:string;onClose:()=>void}){
  const panelRef=useRef<HTMLDivElement|null>(null);
  const drag=useRef<{offsetX:number;offsetY:number}|null>(null);
  const [position,setPosition]=useState({x:Math.max(16,typeof window==='undefined'?720:window.innerWidth-410),y:96});
  const [title,setTitle]=useState('');const [subject,setSubject]=useState(meetingTitle??'');const [message,setMessage]=useState('');const [saved,setSaved]=useState(false);
  const draftKey=`octa-note-draft:${roomSlug??'global'}`;
  useEffect(()=>{try{const raw=localStorage.getItem(draftKey);if(raw){const draft=JSON.parse(raw);setTitle(draft.title??'');setSubject(draft.subject??meetingTitle??'');setMessage(draft.message??'')}}catch{}},[draftKey,meetingTitle]);
  useEffect(()=>{try{localStorage.setItem(draftKey,JSON.stringify({title,subject,message}))}catch{}},[draftKey,title,subject,message]);
  useEffect(()=>{
    const move=(e:PointerEvent)=>{if(!drag.current||!panelRef.current)return;const rect=panelRef.current.getBoundingClientRect();const maxX=Math.max(8,window.innerWidth-rect.width-8);const maxY=Math.max(8,window.innerHeight-rect.height-8);setPosition({x:Math.max(8,Math.min(maxX,e.clientX-drag.current.offsetX)),y:Math.max(8,Math.min(maxY,e.clientY-drag.current.offsetY))})};
    const up=()=>{drag.current=null};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};
  },[]);
  const persist=()=>{if(!message.trim()&&!title.trim())return;saveNote({title,subject,content:message,roomSlug,meetingTitle});setSaved(true);try{localStorage.removeItem(draftKey)}catch{}setTimeout(()=>setSaved(false),1800)};
  return <div ref={panelRef} className="octa-floating-note-card" style={{left:position.x,top:position.y}}>
    <div className="octa-note-drag-handle" onPointerDown={e=>{const rect=panelRef.current?.getBoundingClientRect();if(!rect)return;drag.current={offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top}}}><GripHorizontal size={18}/><span>Arraste para mover</span></div>
    <button onClick={onClose} aria-label="Fechar anotações" className="octa-note-close"><X size={16}/></button>
    <div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><StickyNote size={17}/></span><div><strong className="text-sm">Anotar</strong><p className="text-[10px] text-white/40">Sua anotação fica salva neste navegador</p></div></div>
    <label className="mt-4 block text-[10px] font-medium uppercase tracking-[.12em] text-white/38">Título<input value={title} onChange={e=>setTitle(e.target.value)} className="octa-note-input" placeholder="Ex.: Próximos passos"/></label>
    <label className="mt-3 block text-[10px] font-medium uppercase tracking-[.12em] text-white/38">Assunto<input value={subject} onChange={e=>setSubject(e.target.value)} className="octa-note-input" placeholder="Ex.: Branding / proposta comercial"/></label>
    <label className="mt-3 block text-[10px] font-medium uppercase tracking-[.12em] text-white/38">Mensagem<textarea value={message} onChange={e=>setMessage(e.target.value)} className="octa-note-message" placeholder="Escreva sua anotação..."/></label>
    <button onClick={persist} disabled={!message.trim()&&!title.trim()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-[#0a2238] disabled:opacity-40"><Save size={14}/>{saved?<><Check size={14}/> Salvo</>:'Salvar anotação'}</button>
  </div>;
}
