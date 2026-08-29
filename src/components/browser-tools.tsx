'use client';
import { useEffect, useRef, useState } from 'react';
import { Camera, CircleDot, Mic, MicOff, MonitorUp, Printer, Square } from 'lucide-react';

export function ScreenSharePanel(){
  const [status,setStatus]=useState('Pronto para compartilhar sua tela.');
  const streamRef=useRef<MediaStream|null>(null);
  const start=async()=>{try{const stream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});streamRef.current=stream;setStatus('Compartilhamento ativo.');stream.getTracks().forEach(t=>t.addEventListener('ended',()=>setStatus('Compartilhamento encerrado.')))}catch{setStatus('Compartilhamento cancelado ou sem permissão.')}};
  const stop=()=>{streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;setStatus('Compartilhamento encerrado.');};
  return <ToolCard icon={<MonitorUp size={34}/>} title="Compartilhar tela" text={status}><button onClick={start} className="octa-primary-button">Compartilhar agora</button><button onClick={stop} className="octa-secondary-button">Parar</button></ToolCard>;
}

export function RecorderPanel(){
  const [status,setStatus]=useState('Gravação parada.'); const recorder=useRef<MediaRecorder|null>(null); const chunks=useRef<Blob[]>([]);
  const start=async()=>{try{if(!('MediaRecorder'in window)){setStatus('Gravação não suportada neste navegador.');return}const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});chunks.current=[];const r=new MediaRecorder(stream);r.ondataavailable=e=>e.data.size&&chunks.current.push(e.data);r.onstop=()=>{const blob=new Blob(chunks.current,{type:r.mimeType});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`octa-gravacao-${Date.now()}.webm`;a.click();URL.revokeObjectURL(url);stream.getTracks().forEach(t=>t.stop());setStatus('Gravação salva no dispositivo.');};r.start();recorder.current=r;setStatus('Gravando câmera e microfone...');}catch{setStatus('Câmera/microfone sem permissão ou indisponíveis.')}};
  const stop=()=>{if(recorder.current?.state==='recording')recorder.current.stop();};
  return <ToolCard icon={<CircleDot size={34}/>} title="Gravar" text={status}><button onClick={start} className="octa-primary-button"><CircleDot size={15}/> Iniciar</button><button onClick={stop} className="octa-secondary-button"><Square size={14}/> Parar e salvar</button></ToolCard>;
}

export function MicPanel(){
  const [muted,setMuted]=useState(true); const [status,setStatus]=useState('Microfone desligado.'); const stream=useRef<MediaStream|null>(null);
  const toggle=async()=>{try{if(!stream.current){stream.current=await navigator.mediaDevices.getUserMedia({audio:true});}const next=!muted;stream.current.getAudioTracks().forEach(t=>t.enabled=!next);setMuted(next);setStatus(next?'Microfone mutado.':'Microfone ativo.');}catch{setStatus('Permissão de microfone negada ou indisponível.')}};
  useEffect(()=>()=>stream.current?.getTracks().forEach(t=>t.stop()),[]);
  return <ToolCard icon={muted?<MicOff size={34}/>:<Mic size={34}/>} title="Microfone" text={status}><button onClick={toggle} className="octa-primary-button">{muted?'Ativar microfone':'Mutar microfone'}</button></ToolCard>;
}

export function PrintPanel(){
  return <ToolCard icon={<Camera size={34}/>} title="Printar tela" text="Use a impressão do navegador para salvar a tela atual como PDF ou enviar para uma impressora."><button onClick={()=>window.print()} className="octa-primary-button"><Printer size={15}/> Abrir captura / impressão</button></ToolCard>;
}

export function ToolCard({icon,title,text,children}:{icon:React.ReactNode;title:string;text:string;children:React.ReactNode}){return <div className="octa-tool-card"><div className="octa-tool-icon">{icon}</div><div><h2 className="text-2xl font-semibold tracking-[-.03em]">{title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#667c8f]">{text}</p><div className="mt-5 flex flex-wrap gap-3">{children}</div></div></div>}
