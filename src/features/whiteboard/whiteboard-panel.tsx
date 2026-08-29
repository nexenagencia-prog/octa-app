'use client';
import { PointerEvent, useRef, useState } from 'react';
import { Eraser, Minus, PenLine, RotateCcw, Sparkles, X } from 'lucide-react';
import type { WhiteboardStroke } from '@/types/domain';

const colors=['#ffffff','#79e6ff','#b78cff','#72ff9c','#ff79ba'];
export function WhiteboardPanel({onClose}:{onClose:()=>void}){
 const [strokes,setStrokes]=useState<WhiteboardStroke[]>([]); const [active,setActive]=useState<WhiteboardStroke|null>(null); const [color,setColor]=useState(colors[1]); const board=useRef<HTMLDivElement>(null);
 const point=(e:PointerEvent)=>{const r=board.current!.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}};
 function down(e:PointerEvent){(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); const s={id:crypto.randomUUID(),color,width:3,points:[point(e)]};setActive(s);setStrokes(x=>[...x,s]);}
 function move(e:PointerEvent){if(!active)return; const p=point(e); setActive(a=>a?{...a,points:[...a.points,p]}:a); setStrokes(xs=>xs.map(s=>s.id===active.id?{...s,points:[...s.points,p]}:s));}
 function up(){setActive(null)}
 return <div className="absolute inset-2 z-50 overflow-hidden rounded-[30px] border border-white/10 bg-[#07090d] shadow-2xl md:inset-4">
  <div className="absolute inset-0 soft-grid opacity-80"/>
  <svg className="absolute inset-0 size-full pointer-events-none">{strokes.map(s=><polyline key={s.id} points={s.points.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" style={{filter:`drop-shadow(0 0 7px ${s.color})`}}/>)}</svg>
  <div ref={board} onPointerDown={down} onPointerMove={move} onPointerUp={up} className="absolute inset-0 touch-none"/>
  <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between"><div className="glass flex items-center gap-2 rounded-full px-3 py-2"><Sparkles size={15}/><span className="text-sm font-semibold">Lousa mágica</span><span className="hidden text-xs text-white/35 sm:inline">grade inteligente</span></div><button onClick={onClose} className="glass grid size-10 place-items-center rounded-full"><X size={16}/></button></div>
  <div className="glass absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full p-2"><div className="grid size-10 place-items-center rounded-full bg-white text-black"><PenLine size={16}/></div>{colors.map(c=><button key={c} onClick={()=>setColor(c)} aria-label={`cor ${c}`} className="size-7 rounded-full border-2" style={{background:c,borderColor:color===c?'white':'transparent'}}/>)}<div className="mx-1 h-6 w-px bg-white/10"/><button aria-label="borracha" className="grid size-9 place-items-center rounded-full text-white/50"><Eraser size={16}/></button><button aria-label="linha" className="grid size-9 place-items-center rounded-full text-white/50"><Minus size={16}/></button><button onClick={()=>setStrokes([])} aria-label="limpar" className="grid size-9 place-items-center rounded-full text-white/50"><RotateCcw size={16}/></button></div>
 </div>
}
