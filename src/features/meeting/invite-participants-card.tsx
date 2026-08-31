'use client';
import { FormEvent, useState } from 'react';
import { Mail, MessageCircle, Send, X } from 'lucide-react';

export function InviteParticipantsCard({meetingUrl,meetingTitle,hostName,onClose,onSent}:{meetingUrl:string;meetingTitle:string;hostName:string;onClose:()=>void;onSent?:(label:string)=>void}){
  const [channel,setChannel]=useState<'whatsapp'|'email'>('whatsapp'),[destination,setDestination]=useState(''),[sending,setSending]=useState(false),[status,setStatus]=useState('');
  const message=`${hostName} convidou você para a reunião “${meetingTitle}” na OCTA. Entrar agora: ${meetingUrl}`;
  async function submit(e:FormEvent){
    e.preventDefault();setStatus('');
    if(channel==='whatsapp'){
      const phone=destination.replace(/\D/g,'');
      const href=phone?`https://wa.me/${phone}?text=${encodeURIComponent(message)}`:`https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(href,'_blank','noopener,noreferrer');onSent?.('Convite aberto no WhatsApp');return;
    }
    if(!destination.includes('@')){setStatus('Digite um e-mail válido.');return}
    setSending(true);
    try{
      const res=await fetch('/api/invitations/email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:destination,meetingUrl,hostName,meetingTitle})});
      if(res.ok){setStatus('Convite enviado por e-mail.');onSent?.('Convite enviado por e-mail');setDestination('');return}
      const data=await res.json().catch(()=>({}));
      if(res.status===503){window.location.href=`mailto:${encodeURIComponent(destination)}?subject=${encodeURIComponent(`Convite OCTA · ${meetingTitle}`)}&body=${encodeURIComponent(message)}`;setStatus('Abrimos seu e-mail para envio imediato.');}
      else setStatus(data?.error||'Não foi possível enviar o convite.');
    }finally{setSending(false)}
  }
  return <div className="fixed inset-0 z-[240] grid place-items-center bg-black/35 p-4 backdrop-blur-sm"><section className="w-full max-w-[410px] rounded-[28px] border border-white/10 bg-[#07131e]/98 p-5 text-white shadow-[0_34px_120px_rgba(0,0,0,.5)]">
    <div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[.16em] text-cyan-300">Adicionar participantes</p><h3 className="mt-1 text-xl font-semibold">Enviar convite agora</h3></div><button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-white/8 text-white/65"><X size={15}/></button></div>
    <div className="mt-5 grid grid-cols-2 gap-2"><button onClick={()=>setChannel('whatsapp')} className={`flex h-11 items-center justify-center gap-2 rounded-[14px] border text-xs ${channel==='whatsapp'?'border-emerald-300/35 bg-emerald-300/10 text-emerald-200':'border-white/8 bg-white/[.03] text-white/55'}`}><MessageCircle size={15}/> WhatsApp</button><button onClick={()=>setChannel('email')} className={`flex h-11 items-center justify-center gap-2 rounded-[14px] border text-xs ${channel==='email'?'border-cyan-300/35 bg-cyan-300/10 text-cyan-200':'border-white/8 bg-white/[.03] text-white/55'}`}><Mail size={15}/> E-mail</button></div>
    <form onSubmit={submit} className="mt-4"><label className="text-[10px] text-white/45">{channel==='whatsapp'?'Número com DDD (opcional)':'E-mail do participante'}<input value={destination} onChange={e=>setDestination(e.target.value)} placeholder={channel==='whatsapp'?'Ex.: 5551999999999':'nome@empresa.com'} className="mt-2 h-12 w-full rounded-[15px] border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/25"/></label><div className="mt-3 rounded-[15px] border border-white/7 bg-white/[.025] p-3 text-[10px] leading-5 text-white/45">{message}</div>{status&&<p className="mt-3 text-[11px] text-cyan-200">{status}</p>}<button disabled={sending} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[15px] bg-white font-semibold text-[#07131e] disabled:opacity-50"><Send size={15}/>{sending?'Enviando…':'Enviar convite'}</button></form>
  </section></div>;
}
