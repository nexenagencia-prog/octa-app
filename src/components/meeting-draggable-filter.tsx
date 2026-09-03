'use client';
import { GripHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { VideoFilterPanel } from '@/components/video-filter-panel';

export function MeetingDraggableFilter({selected,intensity,onSelect,onIntensity,onClose}:{selected:string;intensity:number;onSelect:(id:string)=>void;onIntensity:(value:number)=>void;onClose:()=>void}){
  const panelRef=useRef<HTMLDivElement|null>(null);
  const drag=useRef<{offsetX:number;offsetY:number}|null>(null);
  const [position,setPosition]=useState({x:0,y:0});
  useEffect(()=>{
    const width=Math.min(440,window.innerWidth-32);
    const height=Math.min(650,window.innerHeight-32);
    setPosition({x:Math.max(16,window.innerWidth-width-24),y:Math.max(16,Math.min(88,(window.innerHeight-height)/2))});
  },[]);
  useEffect(()=>{
    const move=(e:PointerEvent)=>{if(!drag.current||!panelRef.current)return;const rect=panelRef.current.getBoundingClientRect();setPosition({x:Math.max(8,Math.min(window.innerWidth-rect.width-8,e.clientX-drag.current.offsetX)),y:Math.max(8,Math.min(window.innerHeight-rect.height-8,e.clientY-drag.current.offsetY))})};
    const up=()=>{drag.current=null};
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};
  },[]);
  return <div ref={panelRef} className="meeting-filter-overlay is-positioned" style={{left:position.x,top:position.y}}>
    <div className="meeting-filter-drag-handle !h-7 !bg-transparent" onPointerDown={e=>{const rect=panelRef.current?.getBoundingClientRect();if(!rect)return;drag.current={offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top};}} aria-label="Mover filtros" title="Arraste para mover"><GripHorizontal size={18}/></div>
    <VideoFilterPanel selected={selected} intensity={intensity} onSelect={onSelect} onIntensity={onIntensity} onClose={onClose}/>
  </div>;
}
