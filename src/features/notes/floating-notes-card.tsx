'use client';
import { Maximize2, Minimize2, PenLine, Save, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { saveNote } from '@/lib/notes-store';

export function FloatingNotesCard({roomSlug,meetingTitle,onClose}:{roomSlug?:string;meetingTitle?:string;onClose:()=>void}){
  const panelRef=useRef<HTMLDivElement|null>(null);
  const drag=useRef<{offsetX:number;offsetY:number}|null>(null);
  const noteIdRef=useRef<string|undefined>(undefined);
  const [position,setPosition]=useState({x:16,y:112});
  const [subject,setSubject]=useState('');
  const [content,setContent]=useState('');
  const [minimized,setMinimized]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const draftKey=`octa-note-draft:${roomSlug??'global'}`;

  useEffect(()=>{
    const place=()=>setPosition(current=>({
      x:Math.max(12,Math.min(current.x===16?window.innerWidth-Math.min(420,window.innerWidth-24)-24:current.x,window.innerWidth-96)),
      y:Math.max(12,Math.min(current.y,window.innerHeight-76)),
    }));
    place();window.addEventListener('resize',place);return()=>window.removeEventListener('resize',place);
  },[]);
  useEffect(()=>{try{const raw=localStorage.getItem(draftKey);if(raw){const draft=JSON.parse(raw);setSubject(draft.subject??'');setContent(draft.content??'');noteIdRef.current=draft.noteId??undefined}}catch{}},[draftKey]);
  useEffect(()=>{try{localStorage.setItem(draftKey,JSON.stringify({subject,content,noteId:noteIdRef.current}))}catch{}},[draftKey,subject,content]);
  useEffect(()=>{
    const move=(e:PointerEvent)=>{
      if(!drag.current||!panelRef.current||expanded)return;
      const rect=panelRef.current.getBoundingClientRect();
      setPosition({
        x:Math.max(8,Math.min(window.innerWidth-rect.width-8,e.clientX-drag.current.offsetX)),
        y:Math.max(8,Math.min(window.innerHeight-Math.min(rect.height,70),e.clientY-drag.current.offsetY)),
      });
    };
    const up=()=>{drag.current=null};
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};
  },[expanded]);
  const startDrag=(e:React.PointerEvent)=>{
    if(expanded)return;
    const target=e.target as HTMLElement;
    if(target.closest('button,textarea,input'))return;
    const rect=panelRef.current?.getBoundingClientRect();if(!rect)return;
    drag.current={offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top};
  };
  const handleSave=()=>{
    if(!subject.trim()&&!content.trim())return;
    const saved=saveNote({id:noteIdRef.current,title:subject.trim()||'Anotação sem assunto',subject:subject.trim(),content:content.trim(),format:'plain',roomSlug,meetingTitle});
    noteIdRef.current=saved.id;
    try{localStorage.removeItem(draftKey)}catch{}
    onClose();
  };

  return <div ref={panelRef} className={`floatingReferenceNote ${minimized?'isMinimized':''} ${expanded?'isExpanded':''}`} style={expanded?undefined:{left:position.x,top:position.y}}>
    <header className="noteHeader" onPointerDown={startDrag} title="Arraste o bloco para mover">
      <div className="noteTitle"><PenLine size={21}/><input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Assunto" aria-label="Assunto da anotação"/></div>
      <div className="noteWindow">
        <button type="button" aria-label={minimized?'Restaurar bloco de notas':'Minimizar bloco de notas'} onClick={()=>setMinimized(v=>!v)}><Minimize2 size={20}/></button>
        <button type="button" aria-label="Fechar bloco de notas" onClick={onClose}><X size={22}/></button>
      </div>
    </header>
    {!minimized&&<>
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Digite suas anotações aqui..." autoFocus/>
      <footer>
        <span className="saveHint">Salve para enviar a Minhas Anotações</span>
        <div className="footerActions">
          <button type="button" className="saveButton" onClick={handleSave} disabled={!subject.trim()&&!content.trim()}><Save size={15}/><span>Salvar</span></button>
          <button type="button" className="expandButton" aria-label={expanded?'Restaurar tamanho':'Expandir bloco de notas'} onClick={()=>setExpanded(v=>!v)}><Maximize2 size={16}/></button>
        </div>
      </footer>
    </>}
    <style jsx>{`
      .floatingReferenceNote{position:fixed;z-index:240;width:min(420px,calc(100vw - 24px));height:360px;min-width:300px;min-height:240px;padding:11px 10px 10px;border-radius:23px;border:1px solid rgba(255,255,255,.28);background:linear-gradient(135deg,rgba(112,101,92,.46) 0%,rgba(55,50,46,.51) 43%,rgba(10,12,13,.84) 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 26px 70px rgba(0,0,0,.44);backdrop-filter:blur(34px) saturate(118%);-webkit-backdrop-filter:blur(34px) saturate(118%);overflow:hidden;color:#f5f3f1;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,sans-serif;resize:both}
      .floatingReferenceNote.isMinimized{width:min(360px,calc(100vw - 24px));height:68px;min-height:68px;resize:none}
      .floatingReferenceNote.isExpanded{inset:18px!important;width:auto;height:auto;min-width:0;min-height:0;resize:none}
      .noteHeader{height:54px;padding:0 17px;display:flex;align-items:center;justify-content:space-between;touch-action:none;user-select:none;cursor:grab}
      .noteHeader:active{cursor:grabbing}
      .noteTitle{display:flex;align-items:center;gap:11px;min-width:0;flex:1;font-size:18px;font-weight:400;letter-spacing:-.025em}
      .noteTitle :global(svg){stroke-width:1.8;flex:0 0 auto}
      .noteTitle input{width:100%;min-width:0;border:0;background:transparent;outline:0;color:#f5f3f1;font:400 18px/1.2 -apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,sans-serif;letter-spacing:-.025em;padding:6px 0}
      .noteTitle input::placeholder{color:rgba(245,240,236,.58)}
      .noteWindow{display:flex;align-items:center;gap:14px;margin-left:12px}
      .noteWindow button,.expandButton{border:0;background:transparent;color:rgba(255,255,255,.92);padding:4px;display:grid;place-items:center;cursor:pointer}
      textarea{display:block;width:100%;height:calc(100% - 108px);resize:none;border:1px solid rgba(255,255,255,.075);border-radius:17px;background:linear-gradient(145deg,rgba(70,64,59,.17),rgba(8,10,11,.24));outline:0;padding:20px 22px;color:#f6f3f0;font:400 16px/1.55 -apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,sans-serif;letter-spacing:-.015em;box-shadow:inset 0 1px 16px rgba(0,0,0,.08)}
      textarea::placeholder{color:rgba(245,240,236,.58);opacity:1}
      footer{height:54px;padding:0 14px 0 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;color:#c8b6a8;font-size:11px}
      .saveHint{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .footerActions{display:flex;align-items:center;gap:8px}
      .saveButton{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.12);color:#fff;border-radius:12px;padding:8px 12px;display:flex;align-items:center;gap:7px;font:600 12px/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,sans-serif;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
      .saveButton:hover{background:rgba(255,255,255,.18)}
      .saveButton:disabled{opacity:.38;cursor:default}
      .expandButton{color:rgba(255,255,255,.55)}
      @media(max-width:760px){.floatingReferenceNote{width:calc(100vw - 20px);height:330px;min-width:0;min-height:220px;border-radius:21px}.noteHeader{padding:0 14px}.noteTitle input{font-size:17px}.noteWindow{gap:10px}textarea{padding:18px;font-size:15px}footer{padding:0 10px 0 14px;font-size:10px}.saveHint{display:none}.floatingReferenceNote.isExpanded{inset:10px!important}}
    `}</style>
  </div>;
}
