'use client';

import Link from 'next/link';
import { Grip, Play, Plus, UsersRound, Video } from 'lucide-react';
import { useRef, useState } from 'react';

type Point={x:number;y:number};
type DragKey='meeting'|'quick';

const initialPositions:Record<DragKey,Point>={
  meeting:{x:28,y:28},
  quick:{x:28,y:360},
};

export function HomeHeroOverlays(){
  const boundsRef=useRef<HTMLDivElement>(null);
  const [positions,setPositions]=useState(initialPositions);
  const dragRef=useRef<{key:DragKey;pointerId:number;startX:number;startY:number;origin:Point}|null>(null);

  const beginDrag=(key:DragKey)=>(event:React.PointerEvent<HTMLDivElement>)=>{
    if((event.target as HTMLElement).closest('a,button')) return;
    const node=event.currentTarget;
    node.setPointerCapture(event.pointerId);
    dragRef.current={key,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,origin:positions[key]};
  };

  const moveDrag=(key:DragKey)=>(event:React.PointerEvent<HTMLDivElement>)=>{
    const drag=dragRef.current;
    if(!drag||drag.key!==key||drag.pointerId!==event.pointerId||!boundsRef.current) return;
    const bounds=boundsRef.current.getBoundingClientRect();
    const card=event.currentTarget.getBoundingClientRect();
    const nextX=drag.origin.x+(event.clientX-drag.startX);
    const nextY=drag.origin.y+(event.clientY-drag.startY);
    setPositions(current=>({...current,[key]:{
      x:Math.max(10,Math.min(nextX,bounds.width-card.width-10)),
      y:Math.max(10,Math.min(nextY,bounds.height-card.height-10)),
    }}));
  };

  const endDrag=(event:React.PointerEvent<HTMLDivElement>)=>{
    if(dragRef.current?.pointerId===event.pointerId) dragRef.current=null;
  };

  return <div ref={boundsRef} className="home-hero-overlay absolute inset-0 z-20 overflow-hidden">
    <div className="home-floating-card home-next-meeting-card" style={{transform:`translate3d(${positions.meeting.x}px,${positions.meeting.y}px,0)`}} onPointerDown={beginDrag('meeting')} onPointerMove={moveDrag('meeting')} onPointerUp={endDrag} onPointerCancel={endDrag}>
      <div className="home-drag-handle" aria-hidden="true"><Grip size={15}/></div>
      <p className="text-[13px] text-white/72">Próxima reunião em</p>
      <strong className="mt-1 block text-[38px] font-medium tracking-[-.055em] text-white">2h 18min</strong>
      <h3 className="mt-3 text-[15px] font-medium text-white">Planejamento de Marketing</h3>
      <p className="mt-2 text-[11px] text-white/70">Hoje&nbsp; • &nbsp;14:30&nbsp; • &nbsp;6 participantes</p>
      <div className="mt-5 flex gap-2.5">
        <Link href="/room/strategy-room" className="home-overlay-primary"><Play size={13} fill="currentColor"/> Entrar</Link>
        <Link href="/agenda" className="home-overlay-secondary">Ver agenda</Link>
      </div>
    </div>

    <div className="home-floating-card home-quick-card" style={{transform:`translate3d(${positions.quick.x}px,${positions.quick.y}px,0)`}} onPointerDown={beginDrag('quick')} onPointerMove={moveDrag('quick')} onPointerUp={endDrag} onPointerCancel={endDrag}>
      <div className="home-drag-handle" aria-hidden="true"><Grip size={15}/></div>
      <h3 className="text-[13px] font-medium text-white">Ações rápidas</h3>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Link href="/reunioes" className="home-quick-action"><Plus size={21}/><span>Nova<br/>reunião</span></Link>
        <Link href="/contatos" className="home-quick-action"><UsersRound size={20}/><span>Contatos</span></Link>
        <Link href="/gravacoes" className="home-quick-action"><Video size={20}/><span>Gravações</span></Link>
      </div>
    </div>
  </div>;
}
