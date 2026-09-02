'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Copy, ImagePlus, LayoutTemplate,
  Maximize2, Plus, Save, Shapes, Trash2, Type, Upload, X
} from 'lucide-react';
import { loadPresentationFiles } from '@/features/meeting/presentation-model';
import {
  SLIDE_HEIGHT, SLIDE_WIDTH, createDeck, createSlide, deleteDeck, duplicateDeck, getAsset,
  getDeck, listDecks, saveAsset, saveDeck, type SlideDeck, type SlideElement, type SlidePage,
} from '@/lib/local-slide-studio';

const clamp = (value:number,min:number,max:number) => Math.max(min,Math.min(max,value));
const layouts = [
  ['cover','Capa'],['editorial','Editorial'],['data','Dados'],['image','Imagem'],['columns','Colunas'],['blank','Vazio']
] as const;

function AssetImage({assetId,className}:{assetId:string;className?:string}) {
  const[src,setSrc]=useState('');
  useEffect(()=>{let url='';let mounted=true;getAsset(assetId).then(asset=>{if(!asset||!mounted)return;url=URL.createObjectURL(asset.blob);setSrc(url)});return()=>{mounted=false;if(url)URL.revokeObjectURL(url)}},[assetId]);
  if(!src)return <div className={`${className??''} bg-white/10`}/>;
  return <img src={src} alt="" draggable={false} className={className}/>;
}

function SlideMini({slide,active,onClick,index}:{slide:SlidePage;active?:boolean;onClick?:()=>void;index?:number}) {
  return <button type="button" onClick={onClick} className={`group w-full rounded-[18px] border p-2 text-left transition ${active?'border-[#e6b889]/65 bg-white/[.10]':'border-white/[.08] bg-white/[.035] hover:bg-white/[.07]'}`}>
    <div className="relative aspect-video overflow-hidden rounded-[12px]" style={{background:slide.background}}>
      {slide.elements.slice(0,10).map(element=>{
        const style:any={position:'absolute',left:`${element.x/SLIDE_WIDTH*100}%`,top:`${element.y/SLIDE_HEIGHT*100}%`,width:`${element.w/SLIDE_WIDTH*100}%`,height:`${element.h/SLIDE_HEIGHT*100}%`,borderRadius:element.radius?`${Math.max(3,element.radius/5)}px`:undefined};
        if(element.type==='shape')return <div key={element.id} style={{...style,background:element.fill??'rgba(255,255,255,.12)'}}/>;
        if(element.type==='image'&&element.assetId)return <div key={element.id} style={style} className="overflow-hidden"><AssetImage assetId={element.assetId} className="h-full w-full object-cover" /></div>;
        if(element.type==='text')return <div key={element.id} style={{...style,color:element.color??'#fff',fontWeight:element.fontWeight??500,fontSize:`${Math.max(6,(element.fontSize??48)/7)}px`,lineHeight:1.04,textAlign:element.align??'left',overflow:'hidden'}}>{element.text}</div>;
        return null;
      })}
      {typeof index==='number'&&<span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[7px] text-white">{index+1}</span>}
    </div>
    <div className="mt-2 truncate px-1 text-[10px] text-white/55">{slide.name}</div>
  </button>
}

type StageProps={
  slide:SlidePage;
  selectedId?:string|null;
  interactive?:boolean;
  onSelect?:(id:string|null)=>void;
  onChange?:(id:string,patch:Partial<SlideElement>)=>void;
};

function SlideStage({slide,selectedId=null,interactive=false,onSelect,onChange}:StageProps){
  const wrapRef=useRef<HTMLDivElement>(null);
  const[scale,setScale]=useState(.5);
  useEffect(()=>{const node=wrapRef.current;if(!node)return;const resize=()=>setScale(node.clientWidth/SLIDE_WIDTH);resize();const observer=new ResizeObserver(resize);observer.observe(node);return()=>observer.disconnect()},[]);
  const start=(event:React.PointerEvent,element:SlideElement,mode:'move'|'resize')=>{
    if(!interactive||!onChange)return;
    event.preventDefault();event.stopPropagation();onSelect?.(element.id);
    const rect=wrapRef.current?.getBoundingClientRect();if(!rect)return;
    const startX=event.clientX,startY=event.clientY,initial={...element};
    const move=(e:PointerEvent)=>{
      const dx=(e.clientX-startX)/rect.width*SLIDE_WIDTH;
      const dy=(e.clientY-startY)/rect.height*SLIDE_HEIGHT;
      if(mode==='move')onChange(element.id,{x:clamp(initial.x+dx,0,SLIDE_WIDTH-initial.w),y:clamp(initial.y+dy,0,SLIDE_HEIGHT-initial.h)});
      else onChange(element.id,{w:clamp(initial.w+dx,80,SLIDE_WIDTH-initial.x),h:clamp(initial.h+dy,50,SLIDE_HEIGHT-initial.y)});
    };
    const end=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end)};
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',end,{once:true});
  };
  return <div ref={wrapRef} className="relative aspect-video w-full overflow-hidden rounded-[24px] border border-white/[.13] shadow-[0_35px_100px_rgba(0,0,0,.30)]" style={{background:slide.background}} onPointerDown={()=>interactive&&onSelect?.(null)}>
    <div style={{position:'absolute',left:0,top:0,width:SLIDE_WIDTH,height:SLIDE_HEIGHT,transform:`scale(${scale})`,transformOrigin:'0 0'}}>
      {slide.elements.map(element=>{
        const selected=element.id===selectedId;
        const base:React.CSSProperties={position:'absolute',left:element.x,top:element.y,width:element.w,height:element.h,transform:`rotate(${element.rotation??0}deg)`,borderRadius:element.radius??0,cursor:interactive?'move':'default',outline:selected?'3px solid rgba(237,190,143,.88)':'none',outlineOffset:4,userSelect:'none'};
        return <div key={element.id} style={base} onPointerDown={e=>start(e,element,'move')}>
          {element.type==='shape'&&<div className="h-full w-full" style={{background:element.fill??'rgba(255,255,255,.12)',borderRadius:'inherit'}}/>}
          {element.type==='image'&&element.assetId&&<AssetImage assetId={element.assetId} className="h-full w-full select-none object-cover" />}
          {element.type==='text'&&<div className="flex h-full w-full items-start whitespace-pre-wrap" style={{color:element.color??'#fff',fontSize:element.fontSize??48,fontWeight:element.fontWeight??500,textAlign:element.align??'left',lineHeight:1.06,justifyContent:element.align==='center'?'center':element.align==='right'?'flex-end':'flex-start'}}>{element.text}</div>}
          {interactive&&selected&&<button type="button" aria-label="Redimensionar elemento" onPointerDown={e=>start(e,element,'resize')} className="absolute -bottom-3 -right-3 size-7 rounded-full border-2 border-white bg-[#d9aa7c] shadow-lg"/>}
        </div>;
      })}
    </div>
  </div>
}

export default function CreateSlidesPage(){
  const[decks,setDecks]=useState<SlideDeck[]>([]);
  const[deck,setDeck]=useState<SlideDeck|null>(null);
  const[selectedSlideId,setSelectedSlideId]=useState<string|null>(null);
  const[selectedElementId,setSelectedElementId]=useState<string|null>(null);
  const[status,setStatus]=useState('Salvo neste computador');
  const[presenting,setPresenting]=useState(false);
  const[presentIndex,setPresentIndex]=useState(0);
  const[busy,setBusy]=useState(false);
  const imageInput=useRef<HTMLInputElement>(null);
  const importInput=useRef<HTMLInputElement>(null);
  const hydrated=useRef(false);

  const refresh=async()=>setDecks(await listDecks());
  useEffect(()=>{refresh().catch(()=>setStatus('Armazenamento local indisponível'))},[]);
  const currentSlide=useMemo(()=>deck?.slides.find(slide=>slide.id===selectedSlideId)??deck?.slides[0]??null,[deck,selectedSlideId]);
  const selectedElement=useMemo(()=>currentSlide?.elements.find(element=>element.id===selectedElementId)??null,[currentSlide,selectedElementId]);

  useEffect(()=>{
    if(!deck||!hydrated.current)return;
    setStatus('Salvando...');
    const timer=window.setTimeout(()=>{saveDeck(deck).then(saved=>{setDeck(current=>current?.id===saved.id?{...current,updatedAt:saved.updatedAt}:current);setStatus('Salvo neste computador');refresh()}).catch(()=>setStatus('Não foi possível salvar'))},420);
    return()=>window.clearTimeout(timer);
  },[deck?.title,deck?.slides]);

  useEffect(()=>{
    if(!presenting)return;
    const key=(event:KeyboardEvent)=>{if(event.key==='Escape')setPresenting(false);if(event.key==='ArrowRight')setPresentIndex(index=>Math.min((deck?.slides.length??1)-1,index+1));if(event.key==='ArrowLeft')setPresentIndex(index=>Math.max(0,index-1))};
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[presenting,deck?.slides.length]);

  const openDeck=async(id:string)=>{
    hydrated.current=false;
    const loaded=await getDeck(id);if(!loaded)return;
    setDeck(loaded);setSelectedSlideId(loaded.slides[0]?.id??null);setSelectedElementId(null);
    window.setTimeout(()=>{hydrated.current=true},0);
  };
  const newDeck=async()=>{
    const created=createDeck();
    await saveDeck(created);await refresh();await openDeck(created.id);
  };
  const updateDeck=(fn:(deck:SlideDeck)=>SlideDeck)=>setDeck(current=>current?fn(current):current);
  const updateCurrentSlide=(fn:(slide:SlidePage)=>SlidePage)=>updateDeck(current=>({...current,slides:current.slides.map(slide=>slide.id===currentSlide?.id?fn(slide):slide)}));
  const updateElement=(id:string,patch:Partial<SlideElement>)=>updateCurrentSlide(slide=>({...slide,elements:slide.elements.map(element=>element.id===id?{...element,...patch}:element)}));
  const addText=()=>{
    const element:SlideElement={id:crypto.randomUUID(),type:'text',x:180,y:180,w:900,h:160,text:'Novo título',fontSize:64,fontWeight:560,color:'#ffffff',align:'left'};
    updateCurrentSlide(slide=>({...slide,elements:[...slide.elements,element]}));setSelectedElementId(element.id);
  };
  const addShape=()=>{
    const element:SlideElement={id:crypto.randomUUID(),type:'shape',x:260,y:230,w:560,h:300,fill:'rgba(236,188,143,.32)',radius:44};
    updateCurrentSlide(slide=>({...slide,elements:[...slide.elements,element]}));setSelectedElementId(element.id);
  };
  const addLayout=(kind:typeof layouts[number][0])=>{
    const slide=createSlide(kind);
    updateDeck(current=>({...current,slides:[...current.slides,slide]}));setSelectedSlideId(slide.id);setSelectedElementId(null);
  };
  const deleteSlide=()=>{
    if(!deck||!currentSlide||deck.slides.length===1)return;
    const index=deck.slides.findIndex(slide=>slide.id===currentSlide.id);
    const remaining=deck.slides.filter(slide=>slide.id!==currentSlide.id);
    updateDeck(current=>({...current,slides:remaining}));setSelectedSlideId(remaining[Math.max(0,index-1)]?.id??remaining[0]?.id??null);setSelectedElementId(null);
  };
  const duplicateSlide=()=>{
    if(!currentSlide)return;
    const clone:SlidePage={...currentSlide,id:crypto.randomUUID(),name:`${currentSlide.name} — cópia`,elements:currentSlide.elements.map(element=>({...element,id:crypto.randomUUID()}))};
    updateDeck(current=>({...current,slides:[...current.slides,clone]}));setSelectedSlideId(clone.id);
  };
  const moveSlide=(direction:-1|1)=>{
    if(!currentSlide)return;
    updateDeck(current=>{const slides=[...current.slides];const index=slides.findIndex(slide=>slide.id===currentSlide.id);const target=index+direction;if(index<0||target<0||target>=slides.length)return current;[slides[index],slides[target]]=[slides[target],slides[index]];return {...current,slides}});
  };
  const removeElement=()=>{
    if(!selectedElementId)return;
    updateCurrentSlide(slide=>({...slide,elements:slide.elements.filter(element=>element.id!==selectedElementId)}));setSelectedElementId(null);
  };
  const addImageFile=async(file:File)=>{
    const asset=await saveAsset(file,file.name);
    const element:SlideElement={id:crypto.randomUUID(),type:'image',assetId:asset.id,x:320,y:170,w:960,h:540,radius:26};
    updateCurrentSlide(slide=>({...slide,elements:[...slide.elements,element]}));setSelectedElementId(element.id);
  };
  const importFiles=async(files:FileList|null)=>{
    if(!files?.length)return;
    setBusy(true);setStatus('Importando...');
    try{
      const loaded=await loadPresentationFiles(files);
      const pages:SlidePage[]=[];
      for(const source of loaded){
        const blob=await (await fetch(source.src)).blob();
        const asset=await saveAsset(blob,source.name);
        pages.push({id:crypto.randomUUID(),name:source.name,background:'#171919',elements:[{id:crypto.randomUUID(),type:'image',assetId:asset.id,x:0,y:0,w:SLIDE_WIDTH,h:SLIDE_HEIGHT,radius:0}]});
      }
      updateDeck(current=>({...current,slides:[...current.slides,...pages]}));
      if(pages[0])setSelectedSlideId(pages[0].id);
      setStatus('Importação concluída');
    }catch(error){setStatus(error instanceof Error?error.message:'Falha ao importar')}finally{setBusy(false);if(importInput.current)importInput.current.value=''}
  };
  const present=()=>{if(!deck)return;const index=Math.max(0,deck.slides.findIndex(slide=>slide.id===currentSlide?.id));setPresentIndex(index);setPresenting(true)};

  if(!deck)return <main className="min-h-screen bg-[#151719] px-5 py-7 text-white md:px-8 lg:px-10">
    <section className="mx-auto max-w-[1500px]">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><div className="text-[10px] uppercase tracking-[.2em] text-[#d9aa7c]">OCTA Studio</div><h1 className="mt-2 text-3xl font-medium tracking-[-.04em] md:text-4xl">Criar slides</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/48">Crie apresentações completas no seu computador. Nada é enviado para a nuvem.</p></div>
        <button onClick={newDeck} className="flex h-12 items-center gap-2 rounded-full bg-[#eee4d8] px-5 text-sm font-semibold text-[#28231f]"><Plus size={17}/>Nova apresentação</button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {decks.length===0?<button onClick={newDeck} className="min-h-[260px] rounded-[30px] border border-dashed border-white/15 bg-white/[.035] p-8 text-left backdrop-blur-2xl"><div className="grid size-12 place-items-center rounded-2xl bg-white/[.08]"><Plus/></div><h2 className="mt-8 text-xl font-medium">Sua primeira apresentação</h2><p className="mt-2 text-sm text-white/40">Comece em branco ou escolha um layout Apple-style.</p></button>:decks.map(item=><article key={item.id} className="rounded-[30px] border border-white/[.10] bg-[linear-gradient(145deg,rgba(100,90,81,.24),rgba(34,38,40,.45))] p-3 backdrop-blur-[30px]">
          <SlideMini slide={item.slides[0]}/>
          <div className="px-2 pb-2 pt-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-base font-medium">{item.title}</h2><p className="mt-1 text-[11px] text-white/42">{item.slides.length} slide{item.slides.length===1?'':'s'} · {new Date(item.updatedAt).toLocaleDateString('pt-BR')}</p></div></div>
          <div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>openDeck(item.id)} className="rounded-full bg-[#eee4d8] px-4 py-2 text-[11px] font-semibold text-[#28231f]">Editar</button><button onClick={async()=>{await openDeck(item.id);setPresentIndex(0);setPresenting(true)}} className="rounded-full border border-white/12 bg-white/[.06] px-4 py-2 text-[11px]">Apresentar</button><button onClick={async()=>{const next=window.prompt('Novo nome da apresentação',item.title)?.trim();if(next){await saveDeck({...item,title:next});await refresh()}}} className="rounded-full border border-white/12 bg-white/[.06] px-3 py-2 text-[10px]">Renomear</button><button onClick={async()=>{await duplicateDeck(item);await refresh()}} className="grid size-8 place-items-center rounded-full bg-white/[.06]" title="Duplicar"><Copy size={13}/></button><button onClick={async()=>{if(window.confirm('Excluir esta apresentação do computador?')){await deleteDeck(item.id);await refresh()}}} className="grid size-8 place-items-center rounded-full bg-white/[.06]" title="Excluir"><Trash2 size={13}/></button></div></div>
        </article>)}
      </div>
    </section>
  </main>;

  return <main className="min-h-screen bg-[#151719] p-3 text-white md:p-4">
    <div className="mx-auto flex max-w-[1720px] flex-col gap-3">
      <header className="flex flex-wrap items-center gap-3 rounded-[24px] border border-white/[.10] bg-[linear-gradient(145deg,rgba(103,91,80,.30),rgba(31,35,37,.45))] px-4 py-3 backdrop-blur-[30px]">
        <button onClick={()=>{hydrated.current=false;setDeck(null);setSelectedSlideId(null);setSelectedElementId(null);refresh()}} className="grid size-10 place-items-center rounded-full bg-white/[.07]" title="Voltar à biblioteca"><ArrowLeft size={17}/></button>
        <input value={deck.title} onChange={event=>updateDeck(current=>({...current,title:event.target.value}))} className="min-w-[220px] flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-white/30" aria-label="Nome da apresentação"/>
        <span className="text-[10px] text-white/40"><Save size={12} className="mr-1 inline"/>{status}</span>
        <button onClick={present} className="flex h-10 items-center gap-2 rounded-full bg-[#eee4d8] px-4 text-[11px] font-semibold text-[#28231f]"><Maximize2 size={15}/>Apresentar</button>
      </header>

      <div className="grid min-h-[760px] gap-3 xl:grid-cols-[190px_minmax(0,1fr)_270px]">
        <aside className="rounded-[26px] border border-white/[.09] bg-white/[.035] p-3 backdrop-blur-[28px]">
          <div className="flex items-center justify-between px-1 pb-3"><span className="text-[10px] uppercase tracking-[.16em] text-white/42">Slides</span><button onClick={()=>addLayout('blank')} className="grid size-8 place-items-center rounded-full bg-white/[.07]"><Plus size={14}/></button></div>
          <div className="no-scrollbar max-h-[690px] space-y-2 overflow-y-auto">{deck.slides.map((slide,index)=><SlideMini key={slide.id} slide={slide} index={index} active={slide.id===currentSlide?.id} onClick={()=>{setSelectedSlideId(slide.id);setSelectedElementId(null)}}/>)}</div>
        </aside>

        <section className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 rounded-[22px] border border-white/[.09] bg-white/[.035] p-2 backdrop-blur-[28px]">
            <button onClick={addText} className="tool"><Type size={15}/>Texto</button>
            <button onClick={()=>imageInput.current?.click()} className="tool"><ImagePlus size={15}/>Imagem</button>
            <button onClick={addShape} className="tool"><Shapes size={15}/>Figura</button>
            <button onClick={()=>importInput.current?.click()} className="tool"><Upload size={15}/>{busy?'Importando...':'PDF/JPEG'}</button>
            <span className="mx-1 h-7 w-px bg-white/10"/>
            {layouts.slice(0,5).map(([kind,label])=><button key={kind} onClick={()=>addLayout(kind)} className="tool"><LayoutTemplate size={14}/>{label}</button>)}
            <input ref={imageInput} type="file" accept="image/jpeg,image/png" className="hidden" onChange={event=>{const file=event.target.files?.[0];if(file)addImageFile(file).catch(()=>setStatus('Falha ao adicionar imagem'));event.currentTarget.value=''}}/>
            <input ref={importInput} type="file" multiple accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={event=>importFiles(event.target.files)}/>
          </div>
          <div className="flex min-h-[610px] flex-1 items-center justify-center rounded-[30px] border border-white/[.08] bg-[radial-gradient(circle_at_50%_32%,rgba(223,176,132,.13),transparent_36%),rgba(255,255,255,.025)] p-5 backdrop-blur-3xl">
            {currentSlide&&<div className="w-full max-w-[1220px]"><SlideStage slide={currentSlide} selectedId={selectedElementId} interactive onSelect={setSelectedElementId} onChange={updateElement}/></div>}
          </div>
          <div className="flex justify-between rounded-[20px] border border-white/[.08] bg-white/[.03] px-3 py-2 text-[10px] text-white/42"><span>Arraste elementos para reposicionar · use o ponto no canto para redimensionar</span><div className="flex gap-2"><button onClick={()=>moveSlide(-1)} className="rounded-full bg-white/[.06] px-3 py-1.5">Mover ↑</button><button onClick={()=>moveSlide(1)} className="rounded-full bg-white/[.06] px-3 py-1.5">Mover ↓</button><button onClick={duplicateSlide} className="rounded-full bg-white/[.06] px-3 py-1.5">Duplicar slide</button><button onClick={deleteSlide} disabled={deck.slides.length===1} className="rounded-full bg-white/[.06] px-3 py-1.5 disabled:opacity-30">Excluir slide</button></div></div>
        </section>

        <aside className="rounded-[26px] border border-white/[.09] bg-[linear-gradient(145deg,rgba(95,84,74,.22),rgba(30,34,36,.45))] p-4 backdrop-blur-[30px]">
          <div className="text-[10px] uppercase tracking-[.16em] text-white/42">{selectedElement?'Elemento':'Slide'}</div>
          {!selectedElement&&currentSlide&&<div className="mt-5 space-y-5">
            <label className="block text-[11px] text-white/55">Nome do slide<input value={currentSlide.name} onChange={event=>updateCurrentSlide(slide=>({...slide,name:event.target.value}))} className="field mt-2"/></label>
            <label className="block text-[11px] text-white/55">Fundo<input type="color" value={currentSlide.background.startsWith('#')?currentSlide.background:'#2c3030'} onChange={event=>updateCurrentSlide(slide=>({...slide,background:event.target.value}))} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-transparent p-1"/></label>
            <div className="rounded-[20px] border border-white/[.08] bg-white/[.035] p-4 text-xs leading-5 text-white/45">Selecione um texto, imagem ou figura no palco para editar suas propriedades.</div>
          </div>}
          {selectedElement&&<div className="mt-5 space-y-4">
            {selectedElement.type==='text'&&<><label className="label">Texto<textarea value={selectedElement.text??''} onChange={event=>updateElement(selectedElement.id,{text:event.target.value})} rows={5} className="field mt-2 resize-none"/></label><div className="grid grid-cols-2 gap-2"><label className="label">Tamanho<input type="number" min={12} max={180} value={selectedElement.fontSize??48} onChange={event=>updateElement(selectedElement.id,{fontSize:Number(event.target.value)})} className="field mt-2"/></label><label className="label">Peso<select value={selectedElement.fontWeight??500} onChange={event=>updateElement(selectedElement.id,{fontWeight:Number(event.target.value)})} className="field mt-2"><option value="390">Regular</option><option value="500">Médio</option><option value="600">Semibold</option><option value="700">Bold</option></select></label></div><label className="label">Cor<input type="color" value={selectedElement.color??'#ffffff'} onChange={event=>updateElement(selectedElement.id,{color:event.target.value})} className="mt-2 h-10 w-full rounded-xl bg-transparent"/></label><div className="grid grid-cols-3 gap-1">{(['left','center','right'] as const).map(value=><button key={value} onClick={()=>updateElement(selectedElement.id,{align:value})} className={`rounded-xl px-2 py-2 text-[10px] ${selectedElement.align===value?'bg-[#e7d9c9] text-black':'bg-white/[.05]'}`}>{value==='left'?'Esq.':value==='center'?'Centro':'Dir.'}</button>)}</div></>}
            {selectedElement.type==='shape'&&<><label className="label">Cor da figura<input type="color" value={(selectedElement.fill??'#c59a72').startsWith('#')?(selectedElement.fill??'#c59a72'):'#c59a72'} onChange={event=>updateElement(selectedElement.id,{fill:event.target.value})} className="mt-2 h-10 w-full rounded-xl bg-transparent"/></label><label className="label">Arredondamento<input type="range" min="0" max="180" value={selectedElement.radius??0} onChange={event=>updateElement(selectedElement.id,{radius:Number(event.target.value)})} className="mt-2 w-full"/></label></>}
            {selectedElement.type==='image'&&<><button onClick={()=>imageInput.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[.10] bg-white/[.05] py-3 text-xs"><ImagePlus size={15}/>Adicionar outra imagem</button><label className="label">Cantos<input type="range" min="0" max="100" value={selectedElement.radius??0} onChange={event=>updateElement(selectedElement.id,{radius:Number(event.target.value)})} className="mt-2 w-full"/></label></>}
            <div className="grid grid-cols-2 gap-2">{(['x','y','w','h'] as const).map(key=><label key={key} className="label uppercase">{key}<input type="number" value={Math.round(selectedElement[key])} onChange={event=>updateElement(selectedElement.id,{[key]:Number(event.target.value)})} className="field mt-1"/></label>)}</div>
            <label className="label">Rotação<input type="range" min="-180" max="180" value={selectedElement.rotation??0} onChange={event=>updateElement(selectedElement.id,{rotation:Number(event.target.value)})} className="mt-2 w-full"/></label>
            <button onClick={removeElement} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500/10 py-3 text-xs text-rose-100"><Trash2 size={14}/>Excluir elemento</button>
          </div>}
        </aside>
      </div>
    </div>

    {presenting&&deck&&<div className="fixed inset-0 z-[2147483600] flex flex-col bg-[rgba(19,20,21,.88)] p-4 text-white backdrop-blur-[34px]">
      <div className="flex items-center justify-between px-2 pb-3"><div><div className="text-[9px] uppercase tracking-[.16em] text-white/38">Apresentação local</div><div className="mt-1 text-sm font-medium">{deck.title}</div></div><button onClick={()=>setPresenting(false)} className="grid size-10 place-items-center rounded-full bg-white/[.07]"><X size={17}/></button></div>
      <div className="flex min-h-0 flex-1 items-center justify-center">{deck.slides[presentIndex]&&<div className="w-full max-w-[1600px]"><SlideStage slide={deck.slides[presentIndex]}/></div>}</div>
      <div className="mx-auto mt-3 flex w-full max-w-[1050px] items-center gap-2 overflow-x-auto rounded-[22px] border border-white/[.12] bg-[linear-gradient(145deg,rgba(103,91,80,.45),rgba(35,39,41,.62))] p-2 backdrop-blur-[30px]">
        <button onClick={()=>setPresentIndex(index=>Math.max(0,index-1))} disabled={presentIndex===0} className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[.07] disabled:opacity-25"><ChevronLeft size={17}/></button>
        {deck.slides.map((slide,index)=><div key={slide.id} className="w-[120px] shrink-0"><SlideMini slide={slide} active={index===presentIndex} onClick={()=>setPresentIndex(index)}/></div>)}
        <button onClick={()=>setPresentIndex(index=>Math.min(deck.slides.length-1,index+1))} disabled={presentIndex===deck.slides.length-1} className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[.07] disabled:opacity-25"><ChevronRight size={17}/></button>
      </div>
    </div>}

    <style jsx global>{`
      .tool{display:flex;height:38px;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.045);padding:0 12px;font-size:10px;color:rgba(255,255,255,.72);transition:.18s}.tool:hover{background:rgba(255,255,255,.09);color:#fff}
      .field{width:100%;border:1px solid rgba(255,255,255,.10);border-radius:13px;background:rgba(255,255,255,.05);padding:10px 11px;color:#fff;font-size:12px;outline:none}.field:focus{border-color:rgba(230,184,137,.48);background:rgba(255,255,255,.075)}
      .label{display:block;font-size:10px;color:rgba(255,255,255,.48)}
      .octa-home-sidebar-global [class*="brand"],.octa-home-sidebar-global [class*="profile"] strong{color:#fff!important;-webkit-text-fill-color:#fff!important}
      .octa-home-sidebar-global [class*="brand"]{letter-spacing:.06em!important}
    `}</style>
  </main>;
}
