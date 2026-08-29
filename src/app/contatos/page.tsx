'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Mail, MessageCircle, Plus, Search, Send, Video } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { demoParticipants } from '@/lib/demo/data';
import { getProfile } from '@/lib/profile-store';

type AddedContact={id:string;displayName:string;headline:string;email:string;phone:string;avatarUrl?:string};
const CONTACTS_KEY='octa-added-contacts-v1';

function readAddedContacts():AddedContact[]{
  if(typeof window==='undefined') return [];
  try{return JSON.parse(localStorage.getItem(CONTACTS_KEY)||'[]')}catch{return []}
}

export default function ContatosPage(){
  const[query,setQuery]=useState('');
  const[email,setEmail]=useState('');
  const[phone,setPhone]=useState('');
  const[added,setAdded]=useState<AddedContact[]>([]);
  const[status,setStatus]=useState('');
  const[sending,setSending]=useState('');
  useEffect(()=>setAdded(readAddedContacts()),[]);
  const contacts=useMemo(()=>[
    ...added,
    ...demoParticipants.map(p=>({id:p.id,displayName:p.displayName,headline:p.headline??'',email:'',phone:'',avatarUrl:p.avatarUrl}))
  ],[added]);
  const list=contacts.filter(p=>`${p.displayName} ${p.headline} ${p.email}`.toLowerCase().includes(query.toLowerCase()));
  const addContact=(event:FormEvent)=>{
    event.preventDefault(); const clean=email.trim().toLowerCase(); if(!clean)return;
    if(added.some(c=>c.email===clean)){setStatus('Este e-mail já está nos seus contatos.');return}
    const label=clean.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
    const next=[{id:`email-${Date.now()}`,displayName:label||clean,headline:'Contato por e-mail',email:clean,phone:phone.trim()},...added];
    setAdded(next); localStorage.setItem(CONTACTS_KEY,JSON.stringify(next)); setEmail(''); setPhone(''); setStatus('Contato adicionado.');
  };
  const invite=async(kind:'email'|'whatsapp',contact:AddedContact)=>{
    const destination=kind==='email'?contact.email:contact.phone;
    if(!destination){setStatus(kind==='email'?'Adicione um e-mail para este contato.':'Adicione um WhatsApp para este contato.');return}
    setSending(`${contact.id}-${kind}`);setStatus('');
    try{
      const response=await fetch(`/api/invitations/${kind}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({[kind==='email'?'email':'phone']:destination,meetingUrl:`${window.location.origin}/room/strategy-room`,hostName:getProfile().displayName})});
      const data=await response.json(); if(!response.ok)throw new Error(data.error||'Falha ao enviar convite.'); setStatus(`Convite enviado por ${kind==='email'?'e-mail':'WhatsApp'}.`);
    }catch(error){setStatus(error instanceof Error?error.message:'Falha ao enviar convite.')}finally{setSending('')}
  };
  return <PageShell title="Contatos" kicker="Sua rede" actions={<label className="octa-search !flex !min-w-[260px]"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar contato"/></label>}>
    <div className="flex h-full min-h-0 flex-col gap-4">
      <form onSubmit={addContact} className="octa-panel flex flex-wrap items-end gap-3 p-4">
        <label className="min-w-[240px] flex-1 text-xs font-medium text-[#425d71]">Adicionar por e-mail<input required type="email" className="octa-input mt-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} placeholder="pessoa@empresa.com"/></label>
        <label className="min-w-[210px] flex-1 text-xs font-medium text-[#425d71]">WhatsApp <span className="font-normal text-[#7c8e9d]">(opcional)</span><input className="octa-input mt-2 w-full" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+55 51 99999-9999"/></label>
        <button className="octa-primary-button h-[42px]"><Plus size={15}/> Adicionar contato</button>
      </form>
      {status&&<p className="-mt-1 text-xs font-medium text-[#08758a]" role="status">{status}</p>}
      <div className="grid min-h-0 flex-1 content-start grid-cols-4 gap-3 overflow-y-auto pr-1 no-scrollbar">{list.map(p=><article key={p.id} className="octa-panel octa-contact-card flex min-h-0 items-center gap-3 p-3"><div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#dce6eb]">{p.avatarUrl?<Image src={p.avatarUrl} alt={p.displayName} fill className="object-cover"/>:<div className="grid h-full w-full place-items-center text-sm font-semibold text-[#0a5264]">{p.displayName.slice(0,2).toUpperCase()}</div>}</div><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold">{p.displayName}</h2><p className="truncate text-[11px] text-[#697f91]">{p.email||p.headline}</p><div className="mt-2 flex flex-wrap gap-1.5"><Link href="/room/strategy-room" className="octa-mini-button !px-2 !py-1.5"><Video size={12}/> Reunião</Link><Link href={`/chat?person=${p.id}`} className="octa-mini-button !px-2 !py-1.5" aria-label={`Conversar com ${p.displayName}`}><MessageCircle size={12}/></Link>{p.email&&<button type="button" disabled={!!sending} onClick={()=>invite('email',p)} className="octa-mini-button !px-2 !py-1.5"><Mail size={12}/> {sending===`${p.id}-email`?'Enviando...':'Convidar por e-mail'}</button>}{p.phone&&<button type="button" disabled={!!sending} onClick={()=>invite('whatsapp',p)} className="octa-mini-button !px-2 !py-1.5"><Send size={12}/> {sending===`${p.id}-whatsapp`?'Enviando...':'Convidar por WhatsApp'}</button>}</div></div></article>)}</div>
    </div>
  </PageShell>;
}
