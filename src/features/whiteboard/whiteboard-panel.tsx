'use client';
import { PointerEvent, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Circle, Eraser, GripHorizontal, Highlighter, Maximize2, Minus, MousePointer2, PenLine,
  Redo2, RotateCcw, ScreenShare, Sparkles, Square, TextCursorInput, Triangle, Undo2, X,
  ZoomIn, ZoomOut
} from 'lucide-react';
import type { WhiteboardShape, WhiteboardTool } from '@/types/domain';

const colors=['#f7fbff','#8ae8ff','#91a7ff','#77e5a2','#ff9bc9','#ffd166','#ff6b6b','#b48cff','#00d4ff','#111827'];
type HistoryState={past:WhiteboardShape[][];present:WhiteboardShape[];future:WhiteboardShape[][]};

function shapeBox(shape:WhiteboardShape){
  const xs=(shape.kind==='pen'||shape.kind==='highlighter')&&shape.points?.length?shape.points.map(p=>p.x):[shape.start.x,shape.end.x];
  const ys=(shape.kind==='pen'||shape.kind==='highlighter')&&shape.points?.length?shape.points.map(p=>p.y):[shape.start.y,shape.end.y];
  return{left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};
}
function renderShape(shape:WhiteboardShape){
  if(shape.kind==='text') return <text key={shape.id} x={shape.start.x} y={shape.start.y} fill={shape.color} fontSize={Math.max(14,shape.width*5)} fontFamily="Inter, ui-sans-serif, system-ui" opacity={shape.opacity??1}>{shape.text}</text>;
  const common={stroke:shape.color,strokeWidth:shape.width,fill:'none',strokeLinecap:'round' as const,strokeLinejoin:'round' as const,opacity:shape.opacity??1};
  if(shape.kind==='pen'||shape.kind==='highlighter')return <polyline key={shape.id} points={(shape.points??[]).map(p=>`${p.x},${p.y}`).join(' ')} {...common}/>;
  const x=Math.min(shape.start.x,shape.end.x),y=Math.min(shape.start.y,shape.end.y),w=Math.abs(shape.end.x-shape.start.x),h=Math.abs(shape.end.y-shape.start.y);
  if(shape.kind==='rectangle')return <rect key={shape.id} x={x} y={y} width={w} height={h} rx={14} {...common}/>;
  if(shape.kind==='circle')return <ellipse key={shape.id} cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2} {...common}/>;
  return <polygon key={shape.id} points={`${x+w/2},${y} ${x},${y+h} ${x+w},${y+h}`} {...common}/>;
}

export function WhiteboardPanel({onClose,mode='overlay'}:{onClose?:()=>void;mode?:'overlay'|'page'}){
  const [history,setHistory]=useState<HistoryState>({past:[],present:[],future:[]});
  const [tool,setTool]=useState<WhiteboardTool>('pen');
  const [color,setColor]=useState(colors[1]);
  const [strokeWidth,setStrokeWidth]=useState(3);
  const [zoom,setZoom]=useState(1);
  const [active,setActive]=useState<WhiteboardShape|null>(null);
  const [sharing,setSharing]=useState(false);
  const [position,setPosition]=useState({x:90,y:70});
  const [size,setSize]=useState({w:900,h:650});
  const panel=useRef<HTMLDivElement>(null),board=useRef<HTMLDivElement>(null);
  const drag=useRef<{x:number;y:number;left:number;top:number}|null>(null),resize=useRef<{x:number;y:number;w:number;h:number}|null>(null),stream=useRef<MediaStream|null>(null);

  useEffect(()=>{if(mode!=='overlay')return;const w=Math.min(1040,window.innerWidth-48),h=Math.min(760,window.innerHeight-70);setSize({w,h});setPosition({x:Math.max(16,(window.innerWidth-w)/2),y:Math.max(14,(window.innerHeight-h)/2-26)})},[mode]);
  useEffect(()=>{const move=(e:globalThis.PointerEvent)=>{
    if(drag.current)setPosition({x:Math.max(8,Math.min(window.innerWidth-size.w-8,drag.current.left+e.clientX-drag.current.x)),y:Math.max(8,Math.min(window.innerHeight-70,drag.current.top+e.clientY-drag.current.y))});
    if(resize.current)setSize({w:Math.max(560,Math.min(window.innerWidth-position.x-8,resize.current.w+e.clientX-resize.current.x)),h:Math.max(440,Math.min(window.innerHeight-position.y-8,resize.current.h+e.clientY-resize.current.y))});
  };const up=()=>{drag.current=null;resize.current=null};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)}},[position.x,position.y,size.w,size.h]);
  useEffect(()=>()=>{stream.current?.getTracks().forEach(t=>t.stop())},[]);

  const shapes=history.present;
  const point=(e:PointerEvent)=>{const r=board.current!.getBoundingClientRect();return{x:(e.clientX-r.left)/zoom,y:(e.clientY-r.top)/zoom}};
  const commit=(next:WhiteboardShape[])=>setHistory(h=>({past:[...h.past,h.present].slice(-80),present:next,future:[]}));
  const undo=()=>setHistory(h=>h.past.length?{past:h.past.slice(0,-1),present:h.past.at(-1)!,future:[h.present,...h.future]}:h);
  const redo=()=>setHistory(h=>h.future.length?{past:[...h.past,h.present],present:h.future[0],future:h.future.slice(1)}:h);
  const clear=()=>shapes.length&&commit([]);
  const eraseAt=(p:{x:number;y:number})=>{const idx=[...shapes].reverse().findIndex(s=>{const b=shapeBox(s);return p.x>=b.left-18&&p.x<=b.right+18&&p.y>=b.top-18&&p.y<=b.bottom+18});if(idx>=0)commit(shapes.filter((_,i)=>i!==shapes.length-1-idx))};

  const down=(e:PointerEvent)=>{
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const p=point(e);
    if(tool==='eraser'){eraseAt(p);return}
    if(tool==='text'){
      const text=window.prompt('Digite o texto para inserir na lousa:')?.trim();
      if(text)commit([...shapes,{id:crypto.randomUUID(),kind:'text',color,width:strokeWidth,start:p,end:p,text:text.slice(0,180),opacity:1}]);
      return;
    }
    setActive({id:crypto.randomUUID(),kind:tool,color,width:tool==='highlighter'?Math.max(10,strokeWidth*3):strokeWidth,start:p,end:p,points:(tool==='pen'||tool==='highlighter')?[p]:undefined,opacity:tool==='highlighter'?.35:1});
  };
  const move=(e:PointerEvent)=>{if(!active)return;const p=point(e);setActive(a=>a?{...a,end:p,points:(a.kind==='pen'||a.kind==='highlighter')?[...(a.points??[]),p]:a.points}:a)};
  const up=()=>{if(!active)return;const finished=active;setActive(null);const b=shapeBox(finished);if(finished.kind==='pen'||finished.kind==='highlighter'||Math.abs(b.right-b.left)>4||Math.abs(b.bottom-b.top)>4)commit([...shapes,finished])};
  const rendered=useMemo(()=>[...shapes,...(active?[active]:[])],[shapes,active]);

  const shareScreen=async()=>{try{
    if(sharing){stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;setSharing(false);return}
    const next=await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});stream.current=next;setSharing(true);
    next.getVideoTracks()[0]?.addEventListener('ended',()=>{stream.current=null;setSharing(false)});
  }catch{setSharing(false)}};

  const tools:[WhiteboardTool,ReactNode,string][]=[
    ['pen',<PenLine size={17}/>,'Caneta'],['highlighter',<Highlighter size={17}/>,'Marca-texto'],['text',<TextCursorInput size={17}/>,'Texto'],
    ['rectangle',<Square size={17}/>,'Quadrado'],['circle',<Circle size={17}/>,'Círculo'],['triangle',<Triangle size={17}/>,'Triângulo'],['eraser',<Eraser size={17}/>,'Borracha']
  ];
  const style=mode==='overlay'?{left:position.x,top:position.y,width:size.w,height:size.h}:undefined;

  return <div ref={panel} style={style} className={`${mode==='page'?'absolute inset-0':'fixed'} z-[80] overflow-hidden rounded-[30px] border border-white/10 bg-[#070b10] shadow-[0_34px_120px_rgba(0,0,0,.65)]`}>
    <div className="absolute inset-0 soft-grid opacity-90"/><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(55,181,205,.08),transparent_34%)]"/>
    <svg className="pointer-events-none absolute inset-0 size-full"><g transform={`scale(${zoom})`}>{rendered.map(renderShape)}</g></svg>
    <div ref={board} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} className={`absolute inset-0 touch-none ${tool==='eraser'?'cursor-cell':'cursor-crosshair'}`} aria-label="Lousa escura interativa"/>
    <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex items-center justify-between gap-3">
      <div className={`pointer-events-auto flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-[#0c131b]/88 px-4 py-2.5 text-white shadow-xl backdrop-blur-2xl ${mode==='overlay'?'cursor-grab active:cursor-grabbing':''}`} onPointerDown={e=>{if(mode!=='overlay')return;drag.current={x:e.clientX,y:e.clientY,left:position.x,top:position.y}}}>
        <GripHorizontal size={15} className="text-white/35"/><Sparkles size={15} className="text-cyan-300"/><span className="text-sm font-semibold">Lousa OCTA</span><span className="hidden text-xs text-white/35 md:inline">{mode==='overlay'?'arraste para mover':'desenho, texto, formas e marcação'}</span>
      </div>
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="flex h-10 items-center rounded-full border border-white/10 bg-[#0c131b]/88 px-1 backdrop-blur-2xl">
          <button onClick={()=>setZoom(z=>Math.max(.7,Math.round((z-.1)*10)/10))} className="grid size-8 place-items-center text-white/55" aria-label="Diminuir zoom"><ZoomOut size={14}/></button>
          <span className="min-w-10 text-center text-[9px] text-white/45">{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(1.6,Math.round((z+.1)*10)/10))} className="grid size-8 place-items-center text-white/55" aria-label="Aumentar zoom"><ZoomIn size={14}/></button>
        </div>
        <button onClick={shareScreen} className={`flex h-10 items-center gap-2 rounded-full border px-4 text-xs backdrop-blur-2xl ${sharing?'border-cyan-300/35 bg-cyan-300/15 text-cyan-200':'border-white/10 bg-[#0c131b]/88 text-white/72'}`}><ScreenShare size={15}/>{sharing?'Compartilhando':'Compartilhar tela'}</button>
        {onClose&&<button onClick={onClose} className="grid size-10 place-items-center rounded-full border border-white/10 bg-[#0c131b]/88 text-white/75 backdrop-blur-2xl" aria-label="Fechar lousa"><X size={16}/></button>}
      </div>
    </div>
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex w-[calc(100%-24px)] max-w-[1040px] -translate-x-1/2 justify-center">
      <div className="pointer-events-auto flex max-h-[118px] flex-wrap items-center justify-center gap-1.5 overflow-y-auto rounded-[22px] border border-white/10 bg-[#0c131b]/92 p-2 shadow-2xl backdrop-blur-2xl">
        {tools.map(([id,icon,label])=><button key={id} onClick={()=>setTool(id)} className={`flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium ${tool===id?'bg-white text-black':'text-white/60 hover:bg-white/8 hover:text-white'}`}>{icon}<span className="hidden sm:inline">{label}</span></button>)}
        <span className="mx-1 h-7 w-px bg-white/10"/>
        <label className="flex h-10 items-center gap-2 rounded-xl border border-white/8 px-2 text-[9px] text-white/45">Traço
          <input type="range" min="1" max="10" step="1" value={strokeWidth} onChange={e=>setStrokeWidth(Number(e.target.value))} className="w-20 accent-cyan-300"/>
          <b className="min-w-4 text-white/70">{strokeWidth}</b>
        </label>
        <span className="mx-1 h-7 w-px bg-white/10"/>
        {colors.map(c=><button key={c} onClick={()=>setColor(c)} className={`size-7 rounded-full border-2 shadow-[0_0_0_1px_rgba(255,255,255,.05)] ${color===c?'border-white scale-110':'border-transparent'}`} style={{background:c}} aria-label={`Cor ${c}`}/>)}
        <span className="mx-1 h-7 w-px bg-white/10"/>
        <button onClick={undo} disabled={!history.past.length} className="grid size-10 place-items-center rounded-xl text-white/60 disabled:opacity-20" aria-label="Desfazer"><Undo2 size={17}/></button>
        <button onClick={redo} disabled={!history.future.length} className="grid size-10 place-items-center rounded-xl text-white/60 disabled:opacity-20" aria-label="Refazer"><Redo2 size={17}/></button>
        <button onClick={clear} disabled={!shapes.length} className="grid size-10 place-items-center rounded-xl text-white/60 disabled:opacity-20" aria-label="Limpar lousa"><RotateCcw size={17}/></button>
      </div>
    </div>
    <div className="pointer-events-none absolute right-5 top-20 hidden items-center gap-2 rounded-full border border-white/8 bg-black/25 px-3 py-2 text-[10px] text-white/35 lg:flex"><MousePointer2 size={13}/> Arraste para desenhar <Minus size={12}/> solte para concluir</div>
    {mode==='overlay'&&<button aria-label="Redimensionar lousa" onPointerDown={e=>{e.preventDefault();resize.current={x:e.clientX,y:e.clientY,w:size.w,h:size.h}}} className="absolute bottom-2 right-2 z-20 grid size-9 cursor-nwse-resize place-items-center rounded-xl border border-white/10 bg-black/35 text-white/45"><Maximize2 size={15}/></button>}
  </div>;
}
