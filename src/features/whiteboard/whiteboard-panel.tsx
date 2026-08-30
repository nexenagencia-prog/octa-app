'use client';
import { PointerEvent, useMemo, useRef, useState } from 'react';
import { Circle, Eraser, Minus, MousePointer2, PenLine, Redo2, RotateCcw, Sparkles, Square, Triangle, Undo2, X } from 'lucide-react';
import type { WhiteboardShape, WhiteboardTool } from '@/types/domain';

const colors=['#f7fbff','#8ae8ff','#91a7ff','#77e5a2','#ff9bc9'];

type HistoryState={past:WhiteboardShape[][];present:WhiteboardShape[];future:WhiteboardShape[][]};

function shapeBox(shape:WhiteboardShape){
  const xs=shape.kind==='pen'&&shape.points?.length?shape.points.map(p=>p.x):[shape.start.x,shape.end.x];
  const ys=shape.kind==='pen'&&shape.points?.length?shape.points.map(p=>p.y):[shape.start.y,shape.end.y];
  return {left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};
}

function renderShape(shape:WhiteboardShape){
  const common={stroke:shape.color,strokeWidth:shape.width,fill:'none',strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  if(shape.kind==='pen') return <polyline key={shape.id} points={(shape.points??[]).map(p=>`${p.x},${p.y}`).join(' ')} {...common}/>;
  const x=Math.min(shape.start.x,shape.end.x),y=Math.min(shape.start.y,shape.end.y),w=Math.abs(shape.end.x-shape.start.x),h=Math.abs(shape.end.y-shape.start.y);
  if(shape.kind==='rectangle') return <rect key={shape.id} x={x} y={y} width={w} height={h} rx={14} {...common}/>;
  if(shape.kind==='circle') return <ellipse key={shape.id} cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2} {...common}/>;
  const top=`${x+w/2},${y}`,left=`${x},${y+h}`,right=`${x+w},${y+h}`;
  return <polygon key={shape.id} points={`${top} ${left} ${right}`} {...common}/>;
}

export function WhiteboardPanel({onClose,mode='overlay'}:{onClose?:()=>void;mode?:'overlay'|'page'}){
  const [history,setHistory]=useState<HistoryState>({past:[],present:[],future:[]});
  const [tool,setTool]=useState<WhiteboardTool>('pen');
  const [color,setColor]=useState(colors[1]);
  const [active,setActive]=useState<WhiteboardShape|null>(null);
  const board=useRef<HTMLDivElement>(null);
  const shapes=history.present;
  const canUndo=history.past.length>0,canRedo=history.future.length>0;
  const point=(e:PointerEvent)=>{const r=board.current!.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
  const commit=(next:WhiteboardShape[])=>setHistory(h=>({past:[...h.past,h.present],present:next,future:[]}));
  const undo=()=>setHistory(h=>h.past.length?{past:h.past.slice(0,-1),present:h.past[h.past.length-1],future:[h.present,...h.future]}:h);
  const redo=()=>setHistory(h=>h.future.length?{past:[...h.past,h.present],present:h.future[0],future:h.future.slice(1)}:h);
  const clear=()=>{if(shapes.length)commit([])};
  const eraseAt=(p:{x:number;y:number})=>{const idx=[...shapes].reverse().findIndex(s=>{const b=shapeBox(s);return p.x>=b.left-16&&p.x<=b.right+16&&p.y>=b.top-16&&p.y<=b.bottom+16});if(idx<0)return;const actual=shapes.length-1-idx;commit(shapes.filter((_,i)=>i!==actual));};
  function down(e:PointerEvent){
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);const p=point(e);
    if(tool==='eraser'){eraseAt(p);return}
    const shape:WhiteboardShape={id:crypto.randomUUID(),kind:tool,color,width:tool==='pen'?3:2.4,start:p,end:p,points:tool==='pen'?[p]:undefined};
    setActive(shape);
  }
  function move(e:PointerEvent){if(!active)return;const p=point(e);setActive(a=>a?{...a,end:p,points:a.kind==='pen'?[...(a.points??[]),p]:a.points}:a)}
  function up(){if(!active)return;const finished=active;setActive(null);const b=shapeBox(finished);if(finished.kind==='pen'||Math.abs(b.right-b.left)>4||Math.abs(b.bottom-b.top)>4)commit([...shapes,finished]);}
  const rendered=useMemo(()=>[...shapes,...(active?[active]:[])],[shapes,active]);
  const tools:[WhiteboardTool,React.ReactNode,string][]=[['pen',<PenLine size={17}/>, 'Caneta'],['rectangle',<Square size={17}/>, 'Quadrado'],['circle',<Circle size={17}/>, 'Círculo'],['triangle',<Triangle size={17}/>, 'Triângulo'],['eraser',<Eraser size={17}/>, 'Borracha']];
  return <div className={`${mode==='page'?'absolute inset-0':'absolute inset-2 md:inset-4'} z-50 overflow-hidden rounded-[30px] border border-white/10 bg-[#070b10] shadow-2xl`}>
    <div className="absolute inset-0 soft-grid opacity-90"/>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(55,181,205,.08),transparent_34%)]"/>
    <svg className="absolute inset-0 size-full pointer-events-none">{rendered.map(renderShape)}</svg>
    <div ref={board} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} className={`absolute inset-0 touch-none ${tool==='eraser'?'cursor-cell':'cursor-crosshair'}`} aria-label="Lousa escura interativa"/>
    <div className="pointer-events-none absolute left-5 right-5 top-5 z-10 flex items-center justify-between">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-[#0c131b]/80 px-4 py-2.5 text-white shadow-xl backdrop-blur-2xl"><Sparkles size={15} className="text-cyan-300"/><span className="text-sm font-semibold">Lousa OCTA</span><span className="hidden text-xs text-white/35 sm:inline">grade escura · mouse ou toque</span></div>
      {onClose&&<button onClick={onClose} className="pointer-events-auto grid size-10 place-items-center rounded-full border border-white/10 bg-[#0c131b]/80 text-white/75 backdrop-blur-2xl" aria-label="Fechar lousa"><X size={16}/></button>}
    </div>
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex w-[calc(100%-24px)] max-w-[760px] -translate-x-1/2 justify-center">
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 rounded-[22px] border border-white/10 bg-[#0c131b]/88 p-2 shadow-2xl backdrop-blur-2xl">
        {tools.map(([id,icon,label])=><button key={id} onClick={()=>setTool(id)} className={`flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium transition ${tool===id?'bg-white text-black':'text-white/60 hover:bg-white/8 hover:text-white'}`} aria-label={label}>{icon}<span className="hidden sm:inline">{label}</span></button>)}
        <span className="mx-1 h-7 w-px bg-white/10"/>
        {colors.map(c=><button key={c} onClick={()=>setColor(c)} aria-label={`Cor ${c}`} className={`size-7 rounded-full border-2 ${color===c?'border-white':'border-transparent'}`} style={{background:c}}/>)}
        <span className="mx-1 h-7 w-px bg-white/10"/>
        <button onClick={undo} disabled={!canUndo} className="grid size-10 place-items-center rounded-xl text-white/60 hover:bg-white/8 disabled:opacity-20" aria-label="Undo"><Undo2 size={17}/></button>
        <button onClick={redo} disabled={!canRedo} className="grid size-10 place-items-center rounded-xl text-white/60 hover:bg-white/8 disabled:opacity-20" aria-label="Redo"><Redo2 size={17}/></button>
        <button onClick={clear} disabled={!shapes.length} className="grid size-10 place-items-center rounded-xl text-white/60 hover:bg-white/8 disabled:opacity-20" aria-label="Clear"><RotateCcw size={17}/></button>
      </div>
    </div>
    <div className="pointer-events-none absolute right-5 top-20 hidden items-center gap-2 rounded-full border border-white/8 bg-black/25 px-3 py-2 text-[10px] text-white/35 lg:flex"><MousePointer2 size={13}/> Arraste para desenhar <Minus size={12}/> solte para concluir</div>
  </div>
}
