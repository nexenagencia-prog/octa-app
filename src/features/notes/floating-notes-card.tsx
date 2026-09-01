'use client';
import { Check, GripHorizontal, Save, StickyNote, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { saveNote } from '@/lib/notes-store';

export function FloatingNotesCard({roomSlug,meetingTitle,onClose}:{roomSlug?:string;meetingTitle?:string;onClose:()=>void}){
  const panelRef=useRef<HTMLDivElement|null>(null);const drag=useRef<{offsetX:number;offsetY:number}|null>(null);
  const [position,setPosition]=useState({x:Math.max(16,typeof window==='undefined'?720:window.innerWidth-520),y:84});
  const [title,setTitle]=useState('');const [message,setMessage]=useState('');const [saved,setSaved]=useState(false);
  const draftKey=`octa-note-draft:${roomSlug??'global'}`;
  useEffect(()=>{try{const raw=localStorage.getItem(draftKey);if(raw){const draft=JSON.parse(raw);setTitle(draft.title??'');setMessage(draft.message??'')}}catch{}},[draftKey]);
  useEffect(()=>{try{localStorage.setItem(draftKey,JSON.stringify({title,message}))}catch{}},[draftKey,title,message]);
  useEffect(()=>{const move=(e:PointerEvent)=>{if(!drag.current||!panelRef.current)return;const rect=panelRef.current.getBoundingClientRect();setPosition({x:Math.max(8,Math.min(window.innerWidth-rect.width-8,e.clientX-drag.current.offsetX)),y:Math.max(8,Math.min(window.innerHeight-72,e.clientY-drag.current.offsetY))})};const up=()=>{drag.current=null};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)}},[]);
  const persist=()=>{const plain=message.trim();if(!plain&&!title.trim())return;saveNote({title,subject:'',content:plain,format:'plain',roomSlug,meetingTitle});setSaved(true);try{localStorage.removeItem(draftKey)}catch{}setTimeout(()=>setSaved(false),1800)};
  return <div ref={panelRef} className="octa-floating-note-card octa-floating-note-simple" style={{left:position.x,top:position.y}}>
    <div className="octa-note-drag-handle" onPointerDown={e=>{const rect=panelRef.current?.getBoundingClientRect();if(!rect)return;drag.current={offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top}}}><GripHorizontal size={18}/><span>Arraste para mover</span></div>
    <button onClick={onClose} aria-label="Fechar anotações" className="octa-note-close"><X size={16}/></button>
    <div className="flex items-center gap-2"><span className="octa-note-silver-icon grid size-9 place-items-center rounded-xl"><StickyNote size={17}/></span><div><strong className="text-sm">Anotar</strong><p className="text-[10px] text-white/40">Título e texto</p></div></div>
    <label className="mt-4 block text-[9px] font-medium uppercase tracking-[.12em] text-white/38">Título<input value={title} onChange={e=>setTitle(e.target.value)} className="octa-note-input" placeholder="Título da anotação"/></label>
    <label className="mt-3 block text-[9px] font-medium uppercase tracking-[.12em] text-white/38">Texto<textarea value={message} onChange={e=>setMessage(e.target.value)} className="octa-note-simple-textarea" placeholder="Escreva aqui..."/></label>
    <button onClick={persist} className="octa-note-save mt-3 inline-flex w-full items-center justify-center gap-2"><Save size={14}/>{saved?<><Check size={14}/> Salvo</>:'Salvar anotação'}</button>
  </div>;
}
