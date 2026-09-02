'use client';
import {useEffect,useRef,useState} from 'react';
import {GripHorizontal,X} from 'lucide-react';
import {CalculatorPanel} from '@/components/calculator-panel';

export function GlobalCalculatorOverlay(){
  const [open,setOpen]=useState(false);
  const [position,setPosition]=useState({x:0,y:96});
  const panelRef=useRef<HTMLDivElement|null>(null);
  const drag=useRef<{x:number;y:number}|null>(null);

  useEffect(()=>{
    const openCalculator=(event:MouseEvent)=>{
      const target=event.target as HTMLElement|null;
      const link=target?.closest?.('a[href="/calculadora"]');
      if(!link)return;
      event.preventDefault();
      setOpen(true);
      setPosition({x:Math.max(18,window.innerWidth-430),y:96});
    };
    document.addEventListener('click',openCalculator,true);
    return()=>document.removeEventListener('click',openCalculator,true);
  },[]);

  useEffect(()=>{
    const move=(event:PointerEvent)=>{
      if(!drag.current||!panelRef.current)return;
      const rect=panelRef.current.getBoundingClientRect();
      setPosition({
        x:Math.max(10,Math.min(window.innerWidth-rect.width-10,event.clientX-drag.current.x)),
        y:Math.max(10,Math.min(window.innerHeight-rect.height-10,event.clientY-drag.current.y)),
      });
    };
    const stop=()=>{drag.current=null};
    window.addEventListener('pointermove',move);
    window.addEventListener('pointerup',stop);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop)};
  },[]);

  if(!open)return null;
  return <div ref={panelRef} role="dialog" aria-label="Calculadora flutuante" style={{position:'fixed',left:position.x,top:position.y,zIndex:2147483000,width:390,maxWidth:'calc(100vw - 20px)',border:'1px solid rgba(255,255,255,.18)',borderRadius:28,background:'linear-gradient(145deg,rgba(52,55,59,.66),rgba(14,17,21,.74))',backdropFilter:'blur(32px) saturate(145%)',WebkitBackdropFilter:'blur(32px) saturate(145%)',boxShadow:'0 30px 90px rgba(0,0,0,.46), inset 0 1px 0 rgba(255,255,255,.12)',padding:'14px 14px 16px',overflow:'hidden'}}>
    <div onPointerDown={event=>{const rect=panelRef.current?.getBoundingClientRect();if(!rect)return;drag.current={x:event.clientX-rect.left,y:event.clientY-rect.top}}} style={{height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'grab',color:'rgba(255,255,255,.62)',touchAction:'none',userSelect:'none'}} title="Arraste para mover"><GripHorizontal size={21}/></div>
    <button type="button" onClick={()=>setOpen(false)} aria-label="Fechar calculadora" style={{position:'absolute',right:14,top:13,width:30,height:30,borderRadius:'50%',border:'1px solid rgba(255,255,255,.12)',background:'rgba(255,255,255,.08)',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}><X size={15}/></button>
    <CalculatorPanel/>
  </div>;
}
