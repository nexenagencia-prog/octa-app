'use client';
import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { Bot, Mic, Send, Sparkles, Square, Volume2, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

type Message={role:'user'|'assistant';content:string;demo?:boolean};
const suggestions=['Onde posso melhorar agora?','Qual meu ponto mais forte?','Como ser mais objetivo nas reuniões?'];

export function OctaAICoach(){
  const pathname=usePathname();
  const[open,setOpen]=useState(false),[input,setInput]=useState(''),[busy,setBusy]=useState(false),[recording,setRecording]=useState(false),[status,setStatus]=useState('Pronto para melhorar sua performance');
  const[messages,setMessages]=useState<Message[]>([{role:'assistant',content:'Sou seu OCTA AI Coach. Uso seus resultados de Skills para ajudar você a evoluir em reuniões. O que quer melhorar hoje?'}]);
  const[position,setPosition]=useState({x:0,y:0});
  const recorder=useRef<MediaRecorder|null>(null),chunks=useRef<Blob[]>([]),drag=useRef<{x:number;y:number;px:number;py:number}|null>(null),audioRef=useRef<HTMLAudioElement|null>(null);
  useEffect(()=>()=>{audioRef.current?.pause();if(audioRef.current?.src)URL.revokeObjectURL(audioRef.current.src)},[]);
  const pointerDown=(event:ReactPointerEvent)=>{drag.current={x:event.clientX,y:event.clientY,px:position.x,py:position.y};event.currentTarget.setPointerCapture(event.pointerId)};
  const pointerMove=(event:ReactPointerEvent)=>{if(!drag.current)return;setPosition({x:drag.current.px+event.clientX-drag.current.x,y:drag.current.py+event.clientY-drag.current.y})};
  const pointerUp=()=>{drag.current=null};

  async function ask(text:string){const clean=text.trim();if(!clean||busy)return;const next=[...messages,{role:'user' as const,content:clean}];setMessages(next);setInput('');setBusy(true);setStatus('Analisando seus Skills…');try{const response=await fetch('/api/octa-ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:clean,history:next.slice(-8)})});const data=await response.json();if(!response.ok)throw new Error(data?.error||'Falha na IA');setMessages(items=>[...items,{role:'assistant',content:data.reply,demo:Boolean(data.demo)}]);setStatus(data.demo?'Modo demonstração · conecte OpenAI para análise completa':'Análise baseada na sua performance')}catch(error){setMessages(items=>[...items,{role:'assistant',content:error instanceof Error?error.message:'Não consegui responder agora.'}]);setStatus('Tente novamente')}finally{setBusy(false)}}
  const submit=(event:FormEvent)=>{event.preventDefault();void ask(input)};

  async function toggleRecording(){
    if(recording){recorder.current?.stop();return}
    try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});const media=new MediaRecorder(stream);chunks.current=[];media.ondataavailable=e=>{if(e.data.size)chunks.current.push(e.data)};media.onstop=async()=>{stream.getTracks().forEach(track=>track.stop());setRecording(false);setStatus('Transcrevendo sua pergunta…');const blob=new Blob(chunks.current,{type:media.mimeType||'audio/webm'});const form=new FormData();form.append('file',blob,'pergunta.webm');try{const response=await fetch('/api/octa-ai/audio',{method:'POST',body:form});const data=await response.json();if(!response.ok)throw new Error(data?.error||'Falha na transcrição');if(data.text)void ask(data.text);else setStatus('Não identifiquei fala no áudio.')}catch(error){setStatus(error instanceof Error?error.message:'Falha no áudio')}};recorder.current=media;media.start();setRecording(true);setStatus('Ouvindo… fale sua pergunta')}catch{setStatus('Permita acesso ao microfone para usar áudio.')}
  }
  async function speak(text:string){try{setStatus('Preparando resposta em voz…');const response=await fetch('/api/octa-ai/audio',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data?.error||'Voz indisponível')}const blob=await response.blob();audioRef.current?.pause();if(audioRef.current?.src)URL.revokeObjectURL(audioRef.current.src);const url=URL.createObjectURL(blob);const audio=new Audio(url);audioRef.current=audio;audio.onended=()=>setStatus('Pronto para continuar');await audio.play();setStatus('Falando…')}catch(error){setStatus(error instanceof Error?error.message:'Não consegui reproduzir a voz.')}}

  if(pathname.startsWith('/login')||pathname.startsWith('/reset-password')||pathname.startsWith('/auth')||pathname.startsWith('/admin')) return null;
  return <div className={`octa-ai ${open?'is-open':''}`} style={{transform:`translate(${position.x}px,${position.y}px)`}}>
    {open&&<section className="octa-ai-panel" aria-label="OCTA AI Coach"><header className="octa-ai-head"><div><span><Sparkles size={12}/> OCTA AI</span><strong>Performance Coach</strong></div><button onClick={()=>setOpen(false)} aria-label="Fechar OCTA AI"><X size={16}/></button></header><div className="octa-ai-status"><i className={busy?'is-thinking':''}/>{status}</div><div className="octa-ai-messages">{messages.map((m,i)=><div key={`${m.role}-${i}`} className={`octa-ai-message ${m.role}`}><p>{m.content}</p>{m.demo&&<small>Demonstração</small>}{m.role==='assistant'&&i>0&&<button onClick={()=>void speak(m.content)} aria-label="Ouvir resposta"><Volume2 size={13}/> Ouvir</button>}</div>)}{busy&&<div className="octa-ai-thinking"><i/><i/><i/></div>}</div><div className="octa-ai-suggestions">{suggestions.map(s=><button key={s} onClick={()=>void ask(s)}>{s}</button>)}</div><form className="octa-ai-compose" onSubmit={submit}><button type="button" className={recording?'is-recording':''} onClick={()=>void toggleRecording()} aria-label={recording?'Parar gravação':'Perguntar por áudio'}>{recording?<Square size={15}/>:<Mic size={16}/>}</button><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Pergunte sobre sua performance…" maxLength={4000}/><button type="submit" disabled={busy||!input.trim()} aria-label="Enviar"><Send size={16}/></button></form></section>}
    <button className="octa-ai-orb" onClick={()=>setOpen(v=>!v)} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} aria-label="Abrir OCTA AI Coach"><span className="octa-ai-orb-core"><Bot size={22}/></span><i/><b/></button>
  </div>
}
