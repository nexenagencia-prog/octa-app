'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, CalendarClock, Check, Clock3, UserPlus, UsersRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { demoParticipants } from '@/lib/demo/data';

type ScheduledMeeting={title:string;date:string;time:string;participantIds:string[]};
type Invite={id:string;from:string;title:string;time:string;href:string};
const SCHEDULE_KEY='octa-scheduled-meetings';
const INVITES_KEY='octa-meeting-invitations';
const defaultInvite:Invite={id:'demo-invite',from:'Amanda Smith',title:'Alinhamento de Produto',time:'Hoje · 20:00',href:'/room/strategy-room'};
const participantById=new Map(demoParticipants.map(p=>[p.id,p]));
function readJSON<T>(key:string,fallback:T):T{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}

export function NotificationsCenter(){
  const [open,setOpen]=useState(false);const [invites,setInvites]=useState<Invite[]>([]);const [meetings,setMeetings]=useState<ScheduledMeeting[]>([]);const [dismissed,setDismissed]=useState<string[]>([]);
  const sync=()=>{setInvites(readJSON<Invite[]>(INVITES_KEY,[defaultInvite]));setMeetings(readJSON<ScheduledMeeting[]>(SCHEDULE_KEY,[]));setDismissed(readJSON<string[]>('octa-dismissed-meeting-alerts',[]))};
  useEffect(()=>{sync();const id=window.setInterval(sync,30000);window.addEventListener('octa-notifications-updated',sync);return()=>{window.clearInterval(id);window.removeEventListener('octa-notifications-updated',sync)}},[]);
  const upcoming=useMemo(()=>{const now=Date.now();return meetings.map((m,i)=>({m,id:`${m.date}-${m.time}-${i}`,at:new Date(`${m.date}T${m.time}:00`).getTime()})).filter(x=>x.at>now&&x.at-now<=60*60*1000&&!dismissed.includes(x.id)).sort((a,b)=>a.at-b.at)[0]},[meetings,dismissed]);
  const fallbackUpcoming=useMemo(()=>{if(upcoming)return null;const now=new Date();const future=new Date(now.getTime()+55*60*1000);return{m:{title:'Planejamento de Marketing',date:future.toISOString().slice(0,10),time:future.toTimeString().slice(0,5),participantIds:demoParticipants.slice(0,4).map(p=>p.id)},id:'demo-upcoming',at:future.getTime()}},[upcoming]);
  const alert=upcoming??(dismissed.includes('demo-upcoming')?null:fallbackUpcoming);
  const dismiss=(id:string)=>{const next=[...dismissed,id];setDismissed(next);try{localStorage.setItem('octa-dismissed-meeting-alerts',JSON.stringify(next))}catch{}};
  const count=invites.length+(alert?1:0);
  return <>
    <div className="relative"><button onClick={()=>setOpen(v=>!v)} className="relative grid size-11 place-items-center rounded-full text-[#102944] hover:bg-white/60" aria-label="Notificações"><Bell size={22}/>{count>0&&<span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-[#0b7285] text-[10px] font-semibold text-white">{count}</span>}</button>
      {open&&<div className="absolute right-0 top-14 z-[95] w-[360px] overflow-hidden rounded-[26px] border border-black/8 bg-white/95 p-3 shadow-[0_28px_80px_rgba(4,25,39,.18)] backdrop-blur-2xl"><div className="flex items-center justify-between px-2 py-2"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#698093]">Central</p><h3 className="text-base font-semibold text-[#0a2238]">Notificações</h3></div><button onClick={()=>setOpen(false)} className="grid size-8 place-items-center rounded-full hover:bg-black/5"><X size={15}/></button></div>
        <div className="mt-1 space-y-2">{invites.map(inv=><Link href={inv.href} key={inv.id} onClick={()=>setOpen(false)} className="flex gap-3 rounded-[18px] border border-[#0a2238]/7 bg-[#f7fafb] p-3"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e7f5f7] text-[#0b7285]"><UserPlus size={17}/></span><span className="min-w-0"><b className="block text-sm text-[#0a2238]">Convite para reunião</b><span className="mt-0.5 block text-xs text-[#577084]">{inv.from} convidou você para “{inv.title}”.</span><span className="mt-1 block text-[10px] text-[#8193a1]">{inv.time}</span></span></Link>)}
        {alert&&<Link href="/agenda" onClick={()=>setOpen(false)} className="flex gap-3 rounded-[18px] border border-[#0b879a]/18 bg-[#edf8fa] p-3"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-[#0b7285]"><CalendarClock size={17}/></span><span><b className="block text-sm text-[#0a2238]">Reunião em até 1 hora</b><span className="mt-0.5 block text-xs text-[#577084]">{alert.m.title} · {alert.m.time}</span></span></Link>}</div>
      </div>}
    </div>
    {alert&&<div className="fixed bottom-6 right-6 z-[92] w-[360px] rounded-[26px] border border-white/70 bg-white/92 p-4 shadow-[0_28px_90px_rgba(4,25,39,.22)] backdrop-blur-2xl"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#082f41] text-cyan-200"><Clock3 size={19}/></span><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#0b7285]">1 hora para sua reunião</p><h4 className="mt-1 truncate text-base font-semibold text-[#0a2238]">{alert.m.title}</h4><p className="mt-1 text-xs text-[#64798b]">Hoje · {alert.m.time}</p><div className="mt-3 flex items-center gap-2"><div className="flex -space-x-2">{alert.m.participantIds.slice(0,4).map(id=>{const p=participantById.get(id);return p?.avatarUrl?<Image key={id} src={p.avatarUrl} alt={p.displayName} width={28} height={28} className="size-7 rounded-full border-2 border-white object-cover"/>:null})}</div><span className="flex items-center gap-1 text-[10px] text-[#6d8191]"><UsersRound size={12}/>{alert.m.participantIds.length} participantes</span></div></div><button onClick={()=>dismiss(alert.id)} className="grid size-8 place-items-center rounded-full text-[#708493] hover:bg-black/5" aria-label="Ocultar notificação"><X size={15}/></button></div><Link href="/agenda" className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0b7285] text-xs font-semibold text-white"><Check size={14}/> Ver reunião</Link></div>}
  </>;
}
