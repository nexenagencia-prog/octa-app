'use client';

import Image from 'next/image';
import { useMemo,useState } from 'react';
import { MessageCircle,Search,UsersRound,X } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { InstantMeetingClient } from '@/features/meeting/instant-meeting-client';
import { MeetingStrategicAI } from '@/features/meeting/meeting-strategic-ai';
import { demoParticipants } from '@/lib/demo/data';

type InviteMode='miniaturas'|'whatsapp';

export function InstantMeetingShell({slug,title}:{slug:string;title:string}){
  const[invitePickerOpen,setInvitePickerOpen]=useState(false);
  const[inviteMode,setInviteMode]=useState<InviteMode>('miniaturas');
  const[query,setQuery]=useState('');
  const[selected,setSelected]=useState('');
  const people=useMemo(()=>demoParticipants.filter(p=>p.displayName.toLowerCase().includes(query.toLowerCase())),[query]);
  const aiParticipants=useMemo(()=>demoParticipants.map(p=>({id:p.id,name:p.displayName})),[]);

  const inviteWhatsApp=(name:string)=>{
    const text=encodeURIComponent(`Olá ${name}, entre na minha reunião OCTA: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`,'_blank','noopener,noreferrer');
  };
  const chooseThumbnail=(id:string)=>{
    setSelected(id);
    window.setTimeout(()=>setInvitePickerOpen(false),180);
  };

  return <AppShell>
    <div className="instant-meeting-shell relative h-full min-h-0 overflow-hidden">
      {invitePickerOpen&&<aside className="instant-invite-picker">
        <div className="mb-3 flex items-center justify-between">
          <div><b className="text-sm text-white">Adicionar participante</b><p className="mt-1 text-[10px] text-white/45">Escolha como deseja convidar.</p></div>
          <button onClick={()=>setInvitePickerOpen(false)} aria-label="Fechar" className="grid size-8 place-items-center rounded-full bg-white/[.08] text-white/60"><X size={14}/></button>
        </div>
        <div className="instant-invite-modes">
          <button onClick={()=>setInviteMode('miniaturas')} className={inviteMode==='miniaturas'?'is-active':''}><UsersRound size={14}/> Miniaturas</button>
          <button onClick={()=>setInviteMode('whatsapp')} className={inviteMode==='whatsapp'?'is-active':''}><MessageCircle size={14}/> WhatsApp</button>
        </div>
        <label className="mb-3 mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-3"><Search size={14} className="text-white/40"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar participante" className="h-9 flex-1 bg-transparent text-xs text-white outline-none"/></label>
        {inviteMode==='miniaturas'?<div className="instant-invite-grid">{people.map(person=><button key={person.id} onClick={()=>chooseThumbnail(person.id)} className={`instant-invite-person ${selected===person.id?'is-selected':''}`}>{person.avatarUrl&&<Image src={person.avatarUrl} alt={person.displayName} width={56} height={56}/>}<b className="mt-2 block truncate text-[10px]">{person.displayName.split(' ')[0]}</b><span className="mt-1 block text-[8px] text-white/35">Selecionar</span></button>)}</div>:<div className="instant-whatsapp-list">{people.map(person=><button key={person.id} onClick={()=>inviteWhatsApp(person.displayName)} className="instant-whatsapp-row">{person.avatarUrl&&<Image src={person.avatarUrl} alt={person.displayName} width={42} height={42}/>}<span><b>{person.displayName}</b><small>Enviar convite pelo WhatsApp</small></span><MessageCircle size={15}/></button>)}</div>}
      </aside>}
      <div className="instant-meeting-main h-full min-h-0"><InstantMeetingClient slug={slug} title={title} onAddParticipant={()=>setInvitePickerOpen(v=>!v)}/></div>
      <MeetingStrategicAI slug={slug} title={title} participants={aiParticipants}/>
    </div>
  </AppShell>;
}
