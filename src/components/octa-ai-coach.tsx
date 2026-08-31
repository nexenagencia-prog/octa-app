'use client';
import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { AudioLines, MessageCircle, Mic, Send, Sparkles, Volume2, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

type Message={role:'user'|'assistant';content:string;demo?:boolean};
const suggestions=['Onde posso melhorar agora?','Qual meu ponto mais forte?','Como ser mais objetivo nas reuniões?'];

type BrowserRecognition={
  lang:string;interimResults:boolean;continuous:boolean;
  onresult:((event:any)=>void)|null;onerror:((event:any)=>void)|null;onend:(()=>void)|null;
  start:()=>void;stop:()=>void;abort:()=>void;
};

export function OctaAICoach(){
  const pathname=usePathname();
  const[open,setOpen]=useState(false),[input,setInput]=useState(''),[busy,setBusy]=useState(false),[recording,setRecording]=useState(false),[status,setStatus]=useState('Pronto para melhorar sua performance');
  const[messages,setMessages]=useState<Message[]>([{role:'assistant',content:'Sou seu OCTA AI Coach. Uso seus resultados de Skills para ajudar você a evoluir em reuniões. O que quer melhorar hoje?'}]);
  const[position,setPosition]=useState({x:0,y:0});
  const drag=useRef<{x:number;y:number;px:number;py:number}|null>(null),audioRef=useRef<HTMLAudioElement|null>(null),recognitionRef=useRef<BrowserRecognition|null>(null);
  useEffect(()=>()=>{audioRef.current?.pause();if(audioRef.current?.src)URL.revokeObjectURL(audioRef.current.src);recognitionRef.current?.abort()},[]);
  const pointerDown=(event:ReactPointerEvent)=>{drag.current={x:event.clientX,y:event.clientY,px:position.x,py:position.y};event.currentTarget.setPointerCapture(event.pointerId)};
  const pointerMove=(event:ReactPointerEvent)=>{if(!drag.current)return;setPosition({x:drag.current.px+event.clientX-drag.current.x,y:drag.current.py+event.clientY-drag.current.y})};
  const pointerUp=()=>{drag.current=null};

  async function ask(text:string){
    const clean=text.trim();if(!clean||busy)return;
    const next=[...messages,{role:'user' as const,content:clean}];setMessages(next);setInput('');setBusy(true);setStatus('Analisando seus Skills…');
    try{
      const response=await fetch('/api/octa-ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:clean,history:next.slice(-8)})});
      const data=await response.json();if(!response.ok)throw new Error(data?.error||'Falha na IA');
      setMessages(items=>[...items,{role:'assistant',content:data.reply,demo:Boolean(data.demo)}]);
      setStatus(data.demo?'Modo demonstração · conecte OpenAI para análise completa':'Análise baseada na sua performance');
    }catch(error){setMessages(items=>[...items,{role:'assistant',content:error instanceof Error?error.message:'Não consegui responder agora.'}]);setStatus('Tente novamente')}
    finally{setBusy(false)}
  }
  const submit=(event:FormEvent)=>{event.preventDefault();void ask(input)};

  function toggleRecording(){
    if(recording){recognitionRef.current?.stop();return}
    const Recognition=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
    if(!Recognition){setStatus('Áudio não está disponível neste navegador. Digite sua pergunta.');return}
    try{
      const recognition:BrowserRecognition=new Recognition();recognition.lang='pt-BR';recognition.interimResults=false;recognition.continuous=false;
      recognition.onresult=(event:any)=>{const text=event?.results?.[0]?.[0]?.transcript?.trim?.()||'';if(text){setStatus('Pergunta recebida');void ask(text)}else setStatus('Não identifiquei fala no áudio.')};
      recognition.onerror=(event:any)=>{setRecording(false);setStatus(event?.error==='not-allowed'?'Permita acesso ao microfone para usar áudio.':'Não consegui ouvir. Tente novamente.')};
      recognition.onend=()=>{setRecording(false);recognitionRef.current=null};
      recognitionRef.current=recognition;recognition.start();setRecording(true);setStatus('Ouvindo… fale normalmente');
    }catch{setRecording(false);setStatus('Não consegui iniciar o microfone. Tente novamente.')}
  }

  function browserSpeak(text:string){
    if(!('speechSynthesis' in window))throw new Error('Voz indisponível neste navegador.');
    window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='pt-BR';utterance.rate=.98;utterance.pitch=1;
    utterance.onstart=()=>setStatus('Falando…');utterance.onend=()=>setStatus('Pronto para continuar');utterance.onerror=()=>setStatus('Não consegui reproduzir a voz.');window.speechSynthesis.speak(utterance);
  }
  async function speak(text:string){
    try{
      setStatus('Preparando resposta em voz…');const response=await fetch('/api/octa-ai/audio',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
      if(!response.ok){browserSpeak(text);return}
      const blob=await response.blob();audioRef.current?.pause();if(audioRef.current?.src)URL.revokeObjectURL(audioRef.current.src);const url=URL.createObjectURL(blob);const audio=new Audio(url);audioRef.current=audio;audio.onended=()=>setStatus('Pronto para continuar');await audio.play();setStatus('Falando…');
    }catch{try{browserSpeak(text)}catch(error){setStatus(error instanceof Error?error.message:'Voz indisponível')}}
  }

  if(pathname.startsWith('/login')||pathname.startsWith('/reset-password')||pathname.startsWith('/auth')||pathname.startsWith('/admin')) return null;
  return <div className={`octa-ai ${open?'is-open':''}`} style={{transform:`translate(${position.x}px,${position.y}px)`}}>
    {open&&<section className="octa-ai-panel" aria-label="OCTA AI Coach">
      <header className="octa-ai-head"><div><span><Sparkles size={12}/> OCTA AI</span><strong>Performance Coach</strong></div><button onClick={()=>setOpen(false)} aria-label="Fechar OCTA AI"><X size={16}/></button></header>
      <div className="octa-ai-status"><i className={busy||recording?'is-thinking':''}/>{status}</div>
      <div className="octa-ai-messages">{messages.map((m,i)=><div key={`${m.role}-${i}`} className={`octa-ai-message-row ${m.role}`}>{m.role==='assistant'&&<span className="octa-ai-message-icon" aria-hidden="true"><MessageCircle size={12}/></span>}<div className={`octa-ai-message ${m.role}`}><p>{m.content}</p>{m.demo&&<small>Demonstração</small>}{m.role==='assistant'&&i>0&&<button onClick={()=>void speak(m.content)} aria-label="Ouvir resposta"><Volume2 size={13}/> Ouvir</button>}</div></div>)}{busy&&<div className="octa-ai-thinking"><i/><i/><i/></div>}</div>
      <div className="octa-ai-suggestions">{suggestions.map(s=><button key={s} onClick={()=>void ask(s)}>{s}</button>)}</div>
      <form className="octa-ai-compose" onSubmit={submit}><button type="button" className={recording?'is-recording':''} onClick={toggleRecording} aria-label={recording?'Parar áudio':'Perguntar por áudio'}><Mic size={16}/></button><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Pergunte sobre sua performance…" maxLength={4000}/><button type="submit" disabled={busy||!input.trim()} aria-label="Enviar"><Send size={16}/></button></form>
    </section>}
    <button className="octa-ai-orb" onClick={()=>setOpen(v=>!v)} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} aria-label="Abrir OCTA AI Coach"><span className="octa-ai-orb-core"><AudioLines size={21}/></span><i/><b/></button>
  </div>
}
