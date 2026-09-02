'use client';
import {useEffect,useRef,useState} from 'react';
import {Maximize2,Minimize2,PenLine,X} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {PageShell} from '@/components/page-shell';
import {saveNote} from '@/lib/notes-store';

export default function AnotacoesPage(){
 const router=useRouter();
 const [content,setContent]=useState('');
 const [minimized,setMinimized]=useState(false);
 const [expanded,setExpanded]=useState(false);
 const [savedAt,setSavedAt]=useState('');
 const first=useRef(true);
 useEffect(()=>{if(first.current){first.current=false;return}const timer=setTimeout(()=>{if(content.trim())saveNote({title:'Bloco de notas',subject:'',content:content.trim(),format:'plain'});setSavedAt(new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}))},650);return()=>clearTimeout(timer)},[content]);
 return <PageShell title="Anotar" kicker="">
  <div className={`noteStage ${expanded?'expanded':''}`}>
   <section className={`noteCard ${minimized?'minimized':''}`}>
    <header><div className="noteTitle"><PenLine size={29}/><span>Bloco de notas</span></div><div className="noteWindow"><button aria-label="Minimizar" onClick={()=>setMinimized(v=>!v)}><Minimize2 size={28}/></button><button aria-label="Fechar" onClick={()=>router.push('/')}><X size={31}/></button></div></header>
    {!minimized&&<><textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Digite suas anotações aqui..." autoFocus/><footer><div><span>Salvo automaticamente</span><i>•</i><b>{savedAt||new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</b></div><button aria-label="Expandir" onClick={()=>setExpanded(v=>!v)}><Maximize2 size={20}/></button></footer></>}
   </section>
  </div>
  <style jsx>{`
   .noteStage{width:min(100%,940px);margin:10px auto 0;transition:.25s ease}.noteStage.expanded{position:fixed;z-index:80;inset:24px;width:auto;margin:0;display:grid;place-items:center}.noteCard{width:100%;min-height:625px;padding:20px 14px 18px;border-radius:31px;border:1px solid rgba(255,255,255,.30);background:linear-gradient(135deg,rgba(124,113,103,.36) 0%,rgba(58,53,49,.40) 44%,rgba(13,15,16,.68) 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 28px 80px rgba(0,0,0,.38);backdrop-filter:blur(34px) saturate(115%);-webkit-backdrop-filter:blur(34px) saturate(115%);overflow:hidden;color:#f5f3f1;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,sans-serif}.noteCard.minimized{min-height:88px;height:88px}.noteCard header{height:74px;padding:0 31px;display:flex;align-items:center;justify-content:space-between}.noteTitle{display:flex;align-items:center;gap:17px;font-size:27px;font-weight:400;letter-spacing:-.025em}.noteTitle :global(svg){stroke-width:1.8}.noteWindow{display:flex;align-items:center;gap:28px}.noteWindow button,.noteCard footer button{border:0;background:transparent;color:rgba(255,255,255,.92);padding:4px;display:grid;place-items:center;cursor:pointer}.noteCard textarea{display:block;width:100%;height:430px;resize:none;border:1px solid rgba(255,255,255,.075);border-radius:22px;background:linear-gradient(145deg,rgba(70,64,59,.18),rgba(12,14,15,.20));outline:0;padding:31px 35px;color:#f6f3f0;font:400 25px/1.55 -apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,sans-serif;letter-spacing:-.02em;box-shadow:inset 0 1px 16px rgba(0,0,0,.08)}.noteCard textarea::placeholder{color:rgba(245,240,236,.57);opacity:1}.noteCard footer{height:78px;padding:0 34px;display:flex;align-items:center;justify-content:space-between;color:#bca18b;font-size:17px}.noteCard footer div{display:flex;align-items:center;gap:18px}.noteCard footer span{font-weight:400}.noteCard footer i{font-style:normal;color:#a98d78}.noteCard footer b{font-weight:450}.noteCard footer button{color:rgba(255,255,255,.48)}.expanded .noteCard{max-width:1120px;min-height:min(760px,calc(100vh - 48px))}.expanded .noteCard textarea{height:calc(100vh - 245px)}
   @media(max-width:760px){.noteStage{margin-top:0}.noteCard{min-height:520px;border-radius:24px}.noteCard header{padding:0 18px}.noteTitle{font-size:21px}.noteWindow{gap:14px}.noteCard textarea{height:340px;padding:24px;font-size:20px}.noteCard footer{padding:0 20px;font-size:13px}.noteCard footer div{gap:10px}}
  `}</style>
 </PageShell>
}
