'use client';
import {useEffect,useMemo,useRef,useState,type PointerEvent as ReactPointerEvent,type ReactNode} from 'react';
import {Bold,Brush,Circle,Eraser,Maximize2,Minus,Minimize2,MousePointer2,PenLine,Redo2,RotateCcw,ScreenShare,Sparkles,Square,Triangle,Type,Undo2,X} from 'lucide-react';
import type {WhiteboardShape,WhiteboardTool} from '@/types/domain';

const colors=['#f7fbff','#d7cbc0','#b8bcc0','#7c8186','#ffffff','#5b5f63'];
type HistoryState={past:WhiteboardShape[][];present:WhiteboardShape[];future:WhiteboardShape[][]};
type ShareDetail={active:boolean;track?:MediaStreamTrack};

function shapeBox(shape:WhiteboardShape){
  if(shape.kind==='text')return{left:shape.start.x,right:shape.start.x+Math.max(120,(shape.text?.length??1)*(shape.fontSize??32)*.55),top:shape.start.y-(shape.fontSize??32),bottom:shape.start.y+10};
  const xs=shape.kind==='pen'&&shape.points?.length?shape.points.map(point=>point.x):[shape.start.x,shape.end.x];
  const ys=shape.kind==='pen'&&shape.points?.length?shape.points.map(point=>point.y):[shape.start.y,shape.end.y];
  return{left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};
}

function renderShape(shape:WhiteboardShape){
  if(shape.kind==='text')return <text key={shape.id} x={shape.start.x} y={shape.start.y} fill={shape.color} fontSize={shape.fontSize??32} fontWeight={shape.fontWeight??400} fontFamily="-apple-system,BlinkMacSystemFont,'SF Pro Display',Inter,sans-serif">{shape.text}</text>;
  const common={stroke:shape.color,strokeWidth:shape.width,fill:'none',strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  if(shape.kind==='pen')return <polyline key={shape.id} points={(shape.points??[]).map(point=>`${point.x},${point.y}`).join(' ')} {...common}/>;
  const x=Math.min(shape.start.x,shape.end.x),y=Math.min(shape.start.y,shape.end.y),w=Math.abs(shape.end.x-shape.start.x),h=Math.abs(shape.end.y-shape.start.y);
  if(shape.kind==='rectangle')return <rect key={shape.id} x={x} y={y} width={w} height={h} rx={14} {...common}/>;
  if(shape.kind==='circle')return <ellipse key={shape.id} cx={x+w/2} cy={y+h/2} rx={w/2} ry={h/2} {...common}/>;
  return <polygon key={shape.id} points={`${x+w/2},${y} ${x},${y+h} ${x+w},${y+h}`} {...common}/>;
}

function drawShareCanvas(canvas:HTMLCanvasElement,items:WhiteboardShape[],sourceWidth:number,sourceHeight:number){
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const width=1280,height=720;canvas.width=width;canvas.height=height;
  const sx=width/Math.max(1,sourceWidth),sy=height/Math.max(1,sourceHeight);
  ctx.clearRect(0,0,width,height);
  const gradient=ctx.createLinearGradient(0,0,width,height);gradient.addColorStop(0,'#49423d');gradient.addColorStop(.45,'#242322');gradient.addColorStop(1,'#090b0c');ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);
  ctx.strokeStyle='rgba(255,255,255,.055)';ctx.lineWidth=1;
  for(let x=0;x<width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke()}
  for(let y=0;y<height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke()}
  items.forEach(shape=>{
    ctx.save();ctx.strokeStyle=shape.color;ctx.fillStyle=shape.color;ctx.lineWidth=Math.max(1,shape.width*((sx+sy)/2));ctx.lineCap='round';ctx.lineJoin='round';
    if(shape.kind==='text'){
      ctx.font=`${shape.fontWeight??400} ${Math.max(10,(shape.fontSize??32)*sy)}px -apple-system,BlinkMacSystemFont,Arial,sans-serif`;
      ctx.fillText(shape.text??'',shape.start.x*sx,shape.start.y*sy);ctx.restore();return;
    }
    const points=shape.points??[];
    if(shape.kind==='pen'&&points.length){ctx.beginPath();ctx.moveTo(points[0].x*sx,points[0].y*sy);points.slice(1).forEach(point=>ctx.lineTo(point.x*sx,point.y*sy));ctx.stroke();ctx.restore();return}
    const x=Math.min(shape.start.x,shape.end.x)*sx,y=Math.min(shape.start.y,shape.end.y)*sy,w=Math.abs(shape.end.x-shape.start.x)*sx,h=Math.abs(shape.end.y-shape.start.y)*sy;
    if(shape.kind==='rectangle'){ctx.strokeRect(x,y,w,h)}
    else if(shape.kind==='circle'){ctx.beginPath();ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);ctx.stroke()}
    else {ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.stroke()}
    ctx.restore();
  });
}

export function WhiteboardPanel({onClose,mode='overlay'}:{onClose?:()=>void;mode?:'overlay'|'page'}){
  const[history,setHistory]=useState<HistoryState>({past:[],present:[],future:[]});
  const[tool,setTool]=useState<WhiteboardTool>('pen');const[color,setColor]=useState(colors[0]);const[active,setActive]=useState<WhiteboardShape|null>(null);
  const[sharing,setSharing]=useState(false);const[minimized,setMinimized]=useState(false);const[fontSize,setFontSize]=useState(32);const[fontWeight,setFontWeight]=useState<400|700>(400);const[strokeWidth,setStrokeWidth]=useState(3);
  const[textDraft,setTextDraft]=useState<{x:number;y:number}|null>(null);const[textValue,setTextValue]=useState('');const[position,setPosition]=useState({x:90,y:70});const[size,setSize]=useState({w:900,h:650});
  const panel=useRef<HTMLDivElement>(null);const board=useRef<HTMLDivElement>(null);const drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);const resize=useRef<{x:number;y:number;w:number;h:number}|null>(null);
  const shareCanvas=useRef<HTMLCanvasElement|null>(null);const shareTrack=useRef<MediaStreamTrack|null>(null);

  useEffect(()=>{if(mode!=='overlay')return;const w=Math.min(1040,window.innerWidth-32),h=Math.min(720,window.innerHeight-40);setSize({w,h});setPosition({x:Math.max(16,(window.innerWidth-w)/2),y:Math.max(12,(window.innerHeight-h)/2)})},[mode]);
  useEffect(()=>{const move=(event:globalThis.PointerEvent)=>{if(drag.current&&panel.current){const rect=panel.current.getBoundingClientRect();setPosition({x:Math.max(8,Math.min(window.innerWidth-rect.width-8,drag.current.left+event.clientX-drag.current.x)),y:Math.max(8,Math.min(window.innerHeight-Math.min(rect.height,70),drag.current.top+event.clientY-drag.current.y))})}if(resize.current)setSize({w:Math.min(window.innerWidth-16,Math.max(360,resize.current.w+event.clientX-resize.current.x)),h:Math.min(window.innerHeight-16,Math.max(420,resize.current.h+event.clientY-resize.current.y))})};const up=()=>{drag.current=null;resize.current=null};window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)}},[]);

  const shapes=history.present;const rendered=useMemo(()=>[...shapes,...(active?[active]:[])],[shapes,active]);
  useEffect(()=>{if(!shareCanvas.current||!sharing)return;const rect=board.current?.getBoundingClientRect();drawShareCanvas(shareCanvas.current,rendered,rect?.width??size.w,rect?.height??size.h)},[rendered,sharing,size]);
  useEffect(()=>()=>{if(shareTrack.current){window.dispatchEvent(new CustomEvent<ShareDetail>('octa-whiteboard-share',{detail:{active:false,track:shareTrack.current}}));shareTrack.current.stop();shareTrack.current=null}},[]);

  const point=(event:ReactPointerEvent)=>{const rect=board.current!.getBoundingClientRect();return{x:event.clientX-rect.left,y:event.clientY-rect.top}};
  const commit=(next:WhiteboardShape[])=>setHistory(state=>({past:[...state.past,state.present],present:next,future:[]}));const undo=()=>setHistory(state=>state.past.length?{past:state.past.slice(0,-1),present:state.past.at(-1)!,future:[state.present,...state.future]}:state);const redo=()=>setHistory(state=>state.future.length?{past:[...state.past,state.present],present:state.future[0],future:state.future.slice(1)}:state);const clear=()=>shapes.length&&commit([]);
  const eraseAt=(target:{x:number;y:number})=>{const reverseIndex=[...shapes].reverse().findIndex(shape=>{const box=shapeBox(shape);return target.x>=box.left-22&&target.x<=box.right+22&&target.y>=box.top-22&&target.y<=box.bottom+22});if(reverseIndex>=0)commit(shapes.filter((_,index)=>index!==shapes.length-1-reverseIndex))};
  const down=(event:ReactPointerEvent)=>{const start=point(event);if(tool==='eraser'){eraseAt(start);return}if(tool==='text'){setTextDraft(start);setTextValue('');return}setActive({id:crypto.randomUUID(),kind:tool,color,width:strokeWidth,start,end:start,points:tool==='pen'?[start]:undefined})};
  const move=(event:ReactPointerEvent)=>{if(!active)return;const end=point(event);setActive(current=>current?{...current,end,points:current.kind==='pen'?[...(current.points??[]),end]:current.points}:current)};const up=()=>{if(!active)return;const finished=active;setActive(null);const box=shapeBox(finished);if(finished.kind==='pen'||Math.abs(box.right-box.left)>4||Math.abs(box.bottom-box.top)>4)commit([...shapes,finished])};
  const addText=()=>{if(textDraft&&textValue.trim())commit([...shapes,{id:crypto.randomUUID(),kind:'text',color,width:1,start:textDraft,end:textDraft,text:textValue.trim(),fontSize,fontWeight}]);setTextDraft(null);setTextValue('')};

  const stopSharing=()=>{const track=shareTrack.current;if(track)window.dispatchEvent(new CustomEvent<ShareDetail>('octa-whiteboard-share',{detail:{active:false,track}}));track?.stop();shareTrack.current=null;shareCanvas.current=null;setSharing(false)};
  const toggleSharing=()=>{
    if(sharing){stopSharing();return}
    const canvas=document.createElement('canvas');const rect=board.current?.getBoundingClientRect();drawShareCanvas(canvas,rendered,rect?.width??size.w,rect?.height??size.h);
    const capture=canvas.captureStream?.(15);const track=capture?.getVideoTracks()[0];if(!track)return;
    shareCanvas.current=canvas;shareTrack.current=track;setSharing(true);
    window.dispatchEvent(new CustomEvent<ShareDetail>('octa-whiteboard-share',{detail:{active:true,track}}));
    track.addEventListener('ended',()=>{shareTrack.current=null;shareCanvas.current=null;setSharing(false)},{once:true});
  };
  const close=()=>{stopSharing();onClose?.()};
  const tools:[WhiteboardTool,ReactNode,string][]=[['pen',<PenLine size={16}/>,'Caneta'],['text',<Type size={16}/>,'Texto'],['rectangle',<Square size={16}/>,'Quadrado'],['circle',<Circle size={16}/>,'Círculo'],['triangle',<Triangle size={16}/>,'Triângulo'],['eraser',<Eraser size={16}/>,'Borracha inteligente']];
  const style=mode==='overlay'?{left:position.x,top:position.y,width:minimized?Math.min(460,size.w):size.w,height:minimized?68:size.h}:undefined;

  return <div ref={panel} style={style} className={`${mode==='page'?'absolute inset-0':'fixed'} whiteboard-glass z-[260] overflow-hidden rounded-[24px] border border-white/25 text-white`}>
    <header className="whiteboard-window-header absolute left-0 right-0 top-0 z-30 flex h-[68px] items-center gap-3 px-5" onPointerDown={event=>{if(mode!=='overlay'||(event.target as HTMLElement).closest('button'))return;drag.current={x:event.clientX,y:event.clientY,left:position.x,top:position.y}}}>
      <div className="flex min-w-0 flex-1 items-center gap-3"><span className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/10"><Brush size={18}/></span><div className="min-w-0"><b className="block truncate text-[16px] font-medium tracking-[-.02em]">Lousa OCTA</b><span className="block text-[10px] text-white/45">Flutuante · somente a lousa é transmitida</span></div></div>
      <button type="button" aria-pressed={sharing} onClick={toggleSharing} className={`whiteboard-share flex h-10 items-center gap-2 rounded-full border px-4 text-[11px] transition ${sharing?'border-emerald-300/35 bg-emerald-300/15 text-emerald-100':'border-white/14 bg-white/8 text-white/70'}`} title="Transmitir somente o conteúdo da lousa"><ScreenShare size={15}/><span>{sharing?'Lousa visível aos participantes':'Mostrar aos participantes'}</span></button>
      {mode==='overlay'&&<button type="button" onClick={()=>setMinimized(value=>!value)} aria-label={minimized?'Restaurar lousa':'Minimizar lousa'} className="grid size-9 place-items-center rounded-full text-white/72 hover:bg-white/10"><Minimize2 size={18}/></button>}
      {onClose&&<button type="button" onClick={close} aria-label="Fechar lousa" className="grid size-9 place-items-center rounded-full text-white/90 hover:bg-white/10"><X size={20}/></button>}
    </header>
    {!minimized&&<><div ref={board} onPointerDown={down} onPointerMove={move} onPointerUp={up} className={`whiteboard-stage absolute bottom-[76px] left-3 right-3 top-[72px] touch-none overflow-hidden rounded-[18px] border border-white/[.07] ${tool==='eraser'?'cursor-cell':tool==='text'?'cursor-text':'cursor-crosshair'}`}><div className="pointer-events-none absolute inset-0 whiteboard-grid"/><svg className="pointer-events-none absolute inset-0 size-full">{rendered.map(renderShape)}</svg>{textDraft&&<div className="absolute z-20 min-w-[220px] rounded-xl border border-white/15 bg-black/70 px-3 py-2 backdrop-blur-xl" style={{left:textDraft.x,top:textDraft.y}}><input autoFocus value={textValue} onChange={event=>setTextValue(event.target.value)} onKeyDown={event=>{if(event.key==='Enter')addText();if(event.key==='Escape')setTextDraft(null)}} placeholder="Digite e pressione Enter" className="w-full bg-transparent text-white outline-none" style={{fontSize:Math.min(fontSize,32),fontWeight}}/></div>}</div>
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 w-[calc(100%-24px)] -translate-x-1/2"><div className="pointer-events-auto mx-auto flex max-w-[980px] flex-wrap items-center justify-center gap-1.5 rounded-[20px] border border-white/12 bg-black/35 p-2 shadow-2xl backdrop-blur-2xl">{tools.map(([id,icon,label])=><button key={id} onClick={()=>setTool(id)} className={`flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[10px] transition ${tool===id?'bg-white text-black':'text-white/65 hover:bg-white/8'}`}>{icon}<span>{label}</span></button>)}<span className="mx-1 h-7 w-px bg-white/10"/><button onClick={()=>setFontWeight(weight=>weight===700?400:700)} className={`grid size-9 place-items-center rounded-xl text-white/70 ${fontWeight===700?'bg-white/12':''}`} aria-label="Negrito"><Bold size={16}/></button><select aria-label="Tamanho do texto" className="h-9 rounded-xl border border-white/10 bg-black/35 px-2 text-[11px] text-white outline-none" value={fontSize} onChange={event=>setFontSize(Number(event.target.value))}>{[12,16,20,24,32,40,48,56,64,72].map(value=><option key={value}>{value}</option>)}</select><label className="flex items-center gap-1 px-2 text-[9px] text-white/45">Traço<input type="range" min="1" max="12" value={strokeWidth} onChange={event=>setStrokeWidth(Number(event.target.value))}/></label>{colors.map(value=><button key={value} onClick={()=>setColor(value)} aria-label={`Cor ${value}`} className={`size-6 rounded-full border-2 ${color===value?'border-white':'border-transparent'}`} style={{background:value}}/>)}<button onClick={undo} disabled={!history.past.length} className="grid size-9 place-items-center text-white/60 disabled:opacity-20" aria-label="Desfazer"><Undo2 size={16}/></button><button onClick={redo} disabled={!history.future.length} className="grid size-9 place-items-center text-white/60 disabled:opacity-20" aria-label="Refazer"><Redo2 size={16}/></button><button onClick={clear} disabled={!shapes.length} className="grid size-9 place-items-center text-white/60 disabled:opacity-20" aria-label="Limpar lousa"><RotateCcw size={16}/></button></div></div><div className="pointer-events-none absolute right-5 top-[78px] hidden items-center gap-2 text-[10px] text-white/32 lg:flex"><MousePointer2 size={13}/> Texto, formas e desenho <Minus size={12}/> borracha apaga objetos</div>{mode==='overlay'&&<button onPointerDown={event=>{resize.current={x:event.clientX,y:event.clientY,w:size.w,h:size.h}}} aria-label="Redimensionar lousa" className="absolute bottom-2 right-2 z-40 grid size-8 place-items-center rounded-xl bg-black/25 text-white/55 backdrop-blur-xl"><Maximize2 size={14}/></button>}</>}
    <style jsx>{`.whiteboard-glass{background:linear-gradient(135deg,rgba(112,101,92,.38),rgba(55,50,46,.46) 43%,rgba(9,11,12,.76));box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 34px 110px rgba(0,0,0,.48);backdrop-filter:blur(34px) saturate(118%);-webkit-backdrop-filter:blur(34px) saturate(118%);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,sans-serif;transition:width .18s ease,height .18s ease}.whiteboard-window-header{background:linear-gradient(180deg,rgba(255,255,255,.035),transparent);touch-action:none;user-select:none;cursor:grab}.whiteboard-stage{background:linear-gradient(145deg,rgba(46,43,40,.30),rgba(6,8,9,.46));box-shadow:inset 0 1px 18px rgba(0,0,0,.12)}.whiteboard-grid{background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:28px 28px}.whiteboard-share{backdrop-filter:blur(20px)}@media(max-width:760px){.whiteboard-share span{display:none}.whiteboard-glass{border-radius:20px!important}}`}</style>
  </div>
}
