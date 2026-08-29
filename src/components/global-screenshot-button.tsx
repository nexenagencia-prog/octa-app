'use client';
import { Camera, ChevronRight, X } from 'lucide-react';
import { useRef, useState } from 'react';

export function GlobalScreenshotButton(){
  const [minimized,setMinimized]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const hideTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const flash=(text:string)=>{setMessage(text);if(hideTimer.current)clearTimeout(hideTimer.current);hideTimer.current=setTimeout(()=>setMessage(''),2200)};
  const capture=async()=>{if(busy)return;setBusy(true);try{
    if(!navigator.mediaDevices?.getDisplayMedia){flash('Captura não suportada neste navegador');return;}
    const stream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});const video=document.createElement('video');video.srcObject=stream;video.muted=true;await video.play();await new Promise(r=>setTimeout(r,120));
    const canvas=document.createElement('canvas');canvas.width=video.videoWidth||window.innerWidth;canvas.height=video.videoHeight||window.innerHeight;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('canvas');ctx.drawImage(video,0,0,canvas.width,canvas.height);stream.getTracks().forEach(track=>track.stop());
    canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`octa-print-${new Date().toISOString().replace(/[:.]/g,'-')}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);flash('Print salvo')},'image/png');
  }catch(error){if((error as DOMException)?.name!=='NotAllowedError')flash('Não foi possível capturar a tela');}finally{setBusy(false)}};
  return <div className={`octa-global-screenshot ${minimized?'is-minimized':''}`}>
    {message&&<span className="octa-screenshot-message">{message}</span>}
    <button onClick={capture} className="octa-screenshot-main" aria-label="Print instantâneo da tela" title="Print da tela"><Camera size={18}/>{!minimized&&<span>{busy?'Capturando...':'Print'}</span>}</button>
    <button onClick={()=>setMinimized(v=>!v)} className="octa-screenshot-minimize" aria-label={minimized?'Mostrar controle de print':'Ocultar texto do print'}>{minimized?<ChevronRight size={13}/>:<X size={12}/>}</button>
  </div>;
}
