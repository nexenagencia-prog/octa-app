'use client';
import { GripHorizontal, X } from 'lucide-react';
import { CalculatorPanel } from '@/components/calculator-panel';
import { useToolOverlay } from '@/components/tool-overlay-context';
import { FloatingNotesCard } from '@/features/notes/floating-notes-card';
import { useEffect, useRef, useState } from 'react';

export function ToolOverlay(){
  const {tool,closeTool}=useToolOverlay();
  const panelRef=useRef<HTMLDivElement|null>(null);const drag=useRef<{offsetX:number;offsetY:number}|null>(null);const [position,setPosition]=useState({x:0,y:0});
  useEffect(()=>{if(tool!=='calculator')return;const frame=requestAnimationFrame(()=>{const rect=panelRef.current?.getBoundingClientRect();const width=rect?.width??410;const height=rect?.height??590;setPosition({x:Math.max(8,(window.innerWidth-width)/2),y:Math.max(8,(window.innerHeight-height)/2)})});return()=>cancelAnimationFrame(frame)},[tool]);
  useEffect(()=>{const move=(e:PointerEvent)=>{if(!drag.current||!panelRef.current)return;const rect=panelRef.current.getBoundingClientRect();setPosition({x:Math.max(8,Math.min(window.innerWidth-rect.width-8,e.clientX-drag.current.offsetX)),y:Math.max(8,Math.min(window.innerHeight-rect.height-8,e.clientY-drag.current.offsetY))})};const up=()=>{drag.current=null};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)}},[]);
  if(!tool)return null;
  if(tool==='notes')return <FloatingNotesCard onClose={closeTool}/>;
  if(tool==='filters')return null;
  return <div ref={panelRef} className="octa-floating-tool is-positioned octa-calculator-glass" data-tool="calculator" style={{left:position.x,top:position.y}}><div className="relative"><div className="calculator-drag-handle" onPointerDown={e=>{const rect=panelRef.current?.getBoundingClientRect();if(!rect)return;drag.current={offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top};}} aria-label="Mover calculadora" title="Arraste para mover"><GripHorizontal size={18}/></div><button onClick={closeTool} aria-label="Fechar calculadora" className="floating-tool-close"><X size={15}/></button><CalculatorPanel/></div></div>;
}
