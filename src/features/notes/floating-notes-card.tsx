'use client';
import { Maximize2, Minimize2, PenLine, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { saveNote } from '@/lib/notes-store';

export function FloatingNotesCard({roomSlug,meetingTitle,onClose}:{roomSlug?:string;meetingTitle?:string;onClose:()=>void}){
  const panelRef=useRef<HTMLDivElement|null>(null);
  const drag=useRef<{offsetX:number;offsetY:number}|null>(null);
  const noteIdRef=useRef<string|undefined>(undefined);
  const [position,setPosition]=useState({x:16,y:72});
  const [content,setContent]=useState('');
  const [minimized,setMinimized]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const [savedAt,setSavedAt]=useState(()=>new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}));
  const draftKey=`octa-note-draft:${roomSlug??'global'}`;

  useEffect(()=>{
    const place=()=>setPosition(current=>({
      x:Math.max(16,Math.min(current.x===16?window.innerWidth-Math.min(720,window.innerWidth-32)-24:current.x,window.innerWidth-120)),
      y:Math.max(16,Math.min(current.y,window.innerHeight-88)),
    }));
    place();window.addEventListener('resize',place);return()=>window.removeEventListener('resize',place);
  },[]);
  useEffect(()=>{try{const raw=localStorage.getItem(draftKey);if(raw){const draft=JSON.parse(raw);setContent(draft.content??'');noteIdRef.current=draft.noteId??undefined}}catch{}},[draftKey]);
  useEffect(()=>{try{localStorage.setItem(draftKey,JSON.stringify({content,noteId:noteIdRef.current}))}catch{}},[draftKey,content]);
  useEffect(()=>{
    if(!content.trim())return;
    const timer=setTimeout(()=>{
      const saved=saveNote({id:noteIdRef.current,title:'Bloco de notas',subject:'',content:content.trim(),format:'plain',roomSlug,meetingTitle});
      noteIdRef.current=saved.id;
      setSavedAt(new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}));
      try{localStorage.setItem(draftKey,JSON.stringify({content,noteId:saved.id}))}catch{}
    },650);
    return()=>clearTimeout(timer);
  },[content,draftKey,meetingTitle,roomSlug]);
  useEffect(()=>{
    const move=(e:PointerEvent)=>{
      if(!drag.current||!panelRef.current||expanded)return;
      const rect=panelRef.current.getBoundingClientRect();
      setPosition({
        x:Math.max(8,Math.min(window.innerWidth-rect.width-8,e.clientX-drag.current.offsetX)),
        y:Math.max(8,Math.min(window.innerHeight-Math.min(rect.height,88),e.clientY-drag.current.offsetY)),
      });
    };
    const up=()=>{drag.current=null};
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};
  },[expanded]);
  const startDrag=(e:React.PointerEvent)=>{
    if(expanded)return;
    const target=e.target as HTMLElement;
    if(target.closest('button,textarea'))return;
    const rect=panelRef.current?.getBoundingClientRect();if(!rect)return;
    drag.current={offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top};
  };

  return <div ref={panelRef} className={`floatingReferenceNote ${minimized?'isMinimized':''} ${expanded?'isExpanded':''}`} style={expanded?undefined:{left:position.x,top:position.y}}>
    <header className="noteHeader" onPointerDown={startDrag} title="Arraste o bloco para mover">
      <div className="noteTitle"><PenLine size={27}/><span>Bloco de notas</span></div>
      <div className="noteWindow">
        <button type="button" aria-label={minimized?'Restaurar bloco de notas':'Minimizar bloco de notas'} onClick={()=>setMinimized(v=>!v)}><Minimize2 size={25}/></button>
        <button type="button" aria-label="Fechar bloco de notas" onClick={onClose}><X size={29}/></button>
      </div>
    </header>
    {!minimized&&<>
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Digite suas anotações aqui..." autoFocus/>
      <footer>
        <div><span>Salvo automaticamente</span><i>•</i><b>{savedAt}</b></div>
        <button type="button" aria-label={expanded?'Restaurar tamanho':'Expandir bloco de notas'} onClick={()=>setExpanded(v=>!v)}><Maximize2 size={19}/></button>
      </footer>
    </>}
    <style jsx>{`
      .floatingReferenceNote{position:fixed;z-index:240;width:min(720px,calc(100vw - 32px));min-width:min(430px,calc(100vw - 32px));height:min(520px,calc(100vh - 32px));min-height:300px;padding:15px 12px 14px;border-radius:27px;border:1px solid rgba(255,255,255,.28);background:linear-gradient(135deg,rgba(112,101,92,.46) 0%,rgba(55,50,46,.51) 43%,rgba(10,12,13,.82) 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 30px 90px rgba(0,0,0,.42);backdrop-filter:blur(34px) saturate(118%);-webkit-backdrop-filter:blur(34px) saturate(118%);overflow:hidden;color:#f5f3f1;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,sans-serif;resize:both}
      .floatingReferenceNote.isMinimized{width:min(520px,calc(100vw - 32px));height:86px;min-height:86px;resize:none}
      .floatingReferenceNote.isExpanded{inset:18px!important;width:auto;height:auto;min-width:0;min-height:0;resize:none}
      .noteHeader{height:70px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;touch-action:none;user-select:none;cursor:grab}
      .noteHeader:active{cursor:grabbing}
      .noteTitle{display:flex;align-items:center;gap:15px;font-size:25px;font-weight:400;letter-spacing:-.025em}
      .noteTitle :global(svg){stroke-width:1.8}
      .noteWindow{display:flex;align-items:center;gap:24px}
      .noteWindow button,footer button{border:0;background:transparent;color:rgba(255,255,255,.92);padding:4px;display:grid;place-items:center;cursor:pointer}
      textarea{display:block;width:100%;height:calc(100% - 142px);resize:none;border:1px solid rgba(255,255,255,.075);border-radius:20px;background:linear-gradient(145deg,rgba(70,64,59,.17),rgba(8,10,11,.24));outline:0;padding:27px 30px;color:#f6f3f0;font:400 22px/1.55 -apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,sans-serif;letter-spacing:-.02em;box-shadow:inset 0 1px 16px rgba(0,0,0,.08)}
      textarea::placeholder{color:rgba(245,240,236,.58);opacity:1}
      footer{height:72px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;color:#bca18b;font-size:15px}
      footer div{display:flex;align-items:center;gap:16px}footer i{font-style:normal;color:#a98d78}footer b{font-weight:450}footer button{color:rgba(255,255,255,.5)}
      @media(max-width:760px){.floatingReferenceNote{min-width:0;width:calc(100vw - 20px);height:min(480px,calc(100vh - 20px));border-radius:23px}.noteHeader{padding:0 17px}.noteTitle{font-size:20px}.noteWindow{gap:12px}textarea{padding:22px;font-size:18px}footer{padding:0 18px;font-size:12px}footer div{gap:9px}.floatingReferenceNote.isExpanded{inset:10px!important}}
    `}</style>
  </div>;
}
