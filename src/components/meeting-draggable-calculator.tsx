'use client';
import { GripHorizontal, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CalculatorPanel } from '@/components/calculator-panel';

export function MeetingDraggableCalculator({onClose}:{onClose:()=>void}){
  const panelRef=useRef<HTMLDivElement|null>(null);const drag=useRef<{offsetX:number;offsetY:number}|null>(null);const[position,setPosition]=useState({x:0,y:82});
  useEffect(()=>{setPosition({x:Math.max(12,window.innerWidth-380),y:82})},[]);
  useEffect(()=>{const move=(e:PointerEvent)=>{if(!drag.current||!panelRef.current)return;const rect=panelRef.current.getBoundingClientRect();setPosition({x:Math.max(8,Math.min(window.innerWidth-rect.width-8,e.clientX-drag.current.offsetX)),y:Math.max(8,Math.min(window.innerHeight-rect.height-8,e.clientY-drag.current.offsetY))})};const up=()=>{drag.current=null};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)}},[]);
  return <div ref={panelRef} className="meeting-calculator-overlay is-positioned" style={{left:position.x,top:position.y}}><div className="calculator-drag-handle" onPointerDown={e=>{const rect=panelRef.current?.getBoundingClientRect();if(!rect)return;drag.current={offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top};}}><GripHorizontal size={18}/></div><button onClick={onClose} aria-label="Fechar calculadora" className="meeting-tool-close"><X size={15}/></button><CalculatorPanel/></div>;
}
