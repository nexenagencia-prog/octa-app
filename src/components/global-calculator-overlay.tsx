'use client';
import {useEffect,useRef,useState} from 'react';
import {GripHorizontal,X} from 'lucide-react';
import {CalculatorPanel} from '@/components/calculator-panel';
import {FloatingNotesCard} from '@/features/notes/floating-notes-card';

// Global floating tools open centered over the current page; calculator inherits the hero glass palette.
export function GlobalCalculatorOverlay(){
  const [open,setOpen]=useState(false);
  const [notesOpen,setNotesOpen]=useState(false);
  const [position,setPosition]=useState({x:0,y:0});
  const panelRef=useRef<HTMLDivElement|null>(null);
  const drag=useRef<{x:number;y:number}|null>(null);

  const centerCalculator=()=>{
    const width=Math.min(390,window.innerWidth-20);
    const measured=panelRef.current?.getBoundingClientRect().height??520;
    const height=Math.min(measured,window.innerHeight-20);
    setPosition({x:Math.max(10,(window.innerWidth-width)/2),y:Math.max(10,(window.innerHeight-height)/2)});
  };

  useEffect(()=>{
    const handleGlobalTools=(event:MouseEvent)=>{
      const target=event.target as HTMLElement|null;
      const calculatorLink=target?.closest?.('a[href="/calculadora"]');
      const notesLink=target?.closest?.('a[href="/anotacoes"]');
      if(calculatorLink){
        event.preventDefault();
        event.stopPropagation();
        setNotesOpen(false);
        setOpen(true);
        return;
      }
      if(notesLink){
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        setNotesOpen(true);
      }
    };
    document.addEventListener('click',handleGlobalTools,true);
    return()=>document.removeEventListener('click',handleGlobalTools,true);
  },[]);

  useEffect(()=>{
    if(!open)return;
    const frame=requestAnimationFrame(centerCalculator);
    const onResize=()=>centerCalculator();
    window.addEventListener('resize',onResize);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',onResize)};
  },[open]);

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

  return <>
    {notesOpen&&<FloatingNotesCard onClose={()=>setNotesOpen(false)}/>}
    {open&&<div ref={panelRef} className="heroGlassCalculator" role="dialog" aria-label="Calculadora flutuante" style={{position:'fixed',left:position.x,top:position.y,zIndex:2147483000,width:390,maxWidth:'calc(100vw - 20px)',border:'1px solid rgba(255,255,255,.38)',borderRadius:28,background:'linear-gradient(145deg,rgba(225,214,203,.38),rgba(145,137,130,.34) 48%,rgba(92,96,98,.30))',backdropFilter:'blur(36px) saturate(138%)',WebkitBackdropFilter:'blur(36px) saturate(138%)',boxShadow:'0 30px 90px rgba(20,20,20,.24), inset 0 1px 0 rgba(255,255,255,.28)',padding:'14px 14px 16px',overflow:'hidden'}}>
      <div onPointerDown={event=>{const rect=panelRef.current?.getBoundingClientRect();if(!rect)return;drag.current={x:event.clientX-rect.left,y:event.clientY-rect.top}}} style={{height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'grab',color:'rgba(255,255,255,.78)',touchAction:'none',userSelect:'none'}} title="Arraste para mover"><GripHorizontal size={21}/></div>
      <button type="button" onClick={()=>setOpen(false)} aria-label="Fechar calculadora" style={{position:'absolute',right:14,top:13,width:30,height:30,borderRadius:'50%',border:'1px solid rgba(255,255,255,.24)',background:'rgba(255,255,255,.14)',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer',backdropFilter:'blur(12px)'}}><X size={15}/></button>
      <CalculatorPanel/>
      <style jsx global>{`
        .heroGlassCalculator .calculator-shell{background:linear-gradient(145deg,rgba(232,222,213,.30),rgba(151,142,135,.28) 48%,rgba(82,86,89,.26))!important;border:1px solid rgba(255,255,255,.28)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 18px 46px rgba(31,30,29,.16)!important;backdrop-filter:blur(28px) saturate(132%)!important;-webkit-backdrop-filter:blur(28px) saturate(132%)!important}
        .heroGlassCalculator .calculator-display{background:linear-gradient(145deg,rgba(255,255,255,.15),rgba(113,107,102,.15))!important;border-color:rgba(255,255,255,.22)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important}
        .heroGlassCalculator .calculator-display span{color:rgba(255,255,255,.72)!important}.heroGlassCalculator .calculator-display strong{color:#fff!important;text-shadow:0 1px 16px rgba(0,0,0,.14)}
        .heroGlassCalculator .calculator-key{background:linear-gradient(145deg,rgba(255,255,255,.18),rgba(100,96,93,.16))!important;border-color:rgba(255,255,255,.20)!important;color:#fff!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.14)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}
        .heroGlassCalculator .calculator-key:hover{background:rgba(255,255,255,.24)!important}.heroGlassCalculator .calculator-key.is-op{background:linear-gradient(145deg,rgba(238,229,221,.44),rgba(126,119,113,.36))!important;color:#fff!important;border-color:rgba(255,255,255,.28)!important}
        .heroGlassCalculator .calculator-topline,.heroGlassCalculator .calculator-footer{color:rgba(255,255,255,.72)!important}
      `}</style>
    </div>}
  </>;
}
