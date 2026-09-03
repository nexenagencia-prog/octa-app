'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CircleDot, Clock3, Link2, Plus, Search, ShieldCheck, UsersRound, Video } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { demoMeetings, demoParticipants } from '@/lib/demo/data';

const glass='border border-white/[.09] bg-[rgba(24,25,26,.68)] shadow-[0_18px_46px_rgba(0,0,0,.24),inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-[28px]';

function MeetingThumbs({ids}:{ids:string[]}){
  const people=ids.map(id=>demoParticipants.find(p=>p.id===id)).filter(Boolean).slice(0,5);
  return <div className="mt-4 flex items-center gap-2">{people.map(p=>p?.avatarUrl?<Image key={p.id} src={p.avatarUrl} alt={p.displayName} width={44} height={44} className="size-10 rounded-xl border border-white/10 object-cover shadow-sm"/>:null)}{ids.length>5&&<span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[.07] text-[11px] font-semibold text-white/60">+{ids.length-5}</span>}</div>;
}

function normalizeRoom(value:string){
  const raw=value.trim();
  if(!raw) return '';
  try{
    const url=new URL(raw);
    const bits=url.pathname.split('/').filter(Boolean);
    return bits.at(-1)??'';
  }catch{
    return raw.replace(/^.*\/room\//,'').replace(/[^a-zA-Z0-9-_]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  }
}

function JoinMeetingView(){
  const router=useRouter();
  const [meetingId,setMeetingId]=useState('');
  const recent=useMemo(()=>demoMeetings.filter(m=>m.status!=='ended').slice(0,4),[]);
  const join=()=>{const slug=normalizeRoom(meetingId);if(slug)router.push(`/room/${slug}`)};
  return <PageShell title="Entrar em reunião" kicker="Acesso rápido" actions={<Link href="/reunioes" className="octa-secondary-button">Ver reuniões</Link>}>
    <section className="reunioes-home-surface grid min-h-0 flex-1 gap-4 text-white xl:grid-cols-[minmax(0,1.35fr)_360px]">
      <div className={`relative min-h-[620px] overflow-hidden rounded-[34px] p-5 md:p-7 ${glass}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(205,157,116,.12),transparent_30%),linear-gradient(145deg,rgba(18,19,20,.72),rgba(10,13,15,.82))]"/>
        <div className="pointer-events-none absolute -right-24 top-14 size-[390px] rounded-full border border-white/[.05] bg-white/[.018]"/>
        <div className="pointer-events-none absolute right-16 top-44 size-44 rounded-[42px] border border-white/[.08] bg-white/[.025] shadow-[inset_0_0_45px_rgba(255,255,255,.035)] backdrop-blur-xl"/>
        <div className="relative z-10 flex h-full flex-col">
          <div className="max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.055] px-3 py-1.5 text-[11px] font-medium text-white/70"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,.6)]"/> OCTA Meetings</span><h2 className="mt-5 text-[34px] font-semibold tracking-[-.045em] md:text-[46px]">Entre na reunião em segundos.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/52">Cole o link recebido ou digite o ID da sala. Você continua dentro da estrutura do OCTA e entra na chamada quando estiver pronto.</p></div>
          <div className={`mt-8 max-w-2xl rounded-[28px] p-4 md:p-5 ${glass}`}><label className="text-xs font-medium text-white/60">ID da reunião ou link</label><div className="mt-3 flex flex-col gap-3 sm:flex-row"><div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4"><Link2 size={17} className="shrink-0 text-[#e7b98e]"/><input value={meetingId} onChange={e=>setMeetingId(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')join()}} placeholder="Ex.: strategy-room ou link da reunião" className="h-14 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/28"/></div><button onClick={join} disabled={!meetingId.trim()} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[linear-gradient(90deg,rgba(98,70,52,.96),rgba(130,93,67,.94))] px-6 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(0,0,0,.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"><Video size={17}/> Entrar na reunião</button></div></div>
          <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-2"><Link href="/agenda" className={`group rounded-[24px] p-4 transition hover:bg-white/[.07] ${glass}`}><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-2xl bg-white/[.07] text-[#efc29e]"><CalendarDays size={18}/></span><ArrowRight size={16} className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60"/></div><h3 className="mt-5 text-base font-medium">Entrar pela agenda</h3><p className="mt-1 text-xs leading-5 text-white/42">Abra uma reunião que já está marcada para você.</p></Link><button onClick={()=>setMeetingId('strategy-room')} className={`group rounded-[24px] p-4 text-left transition hover:bg-white/[.07] ${glass}`}><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-2xl bg-white/[.07] text-[#efc29e]"><Video size={18}/></span><ArrowRight size={16} className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60"/></div><h3 className="mt-5 text-base font-medium">Usar sala de teste</h3><p className="mt-1 text-xs leading-5 text-white/42">Preenche um ID de demonstração sem iniciar automaticamente.</p></button></div>
          <div className={`mt-auto max-w-2xl rounded-[22px] p-4 ${glass}`}><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200"><ShieldCheck size={17}/></span><div><h4 className="text-sm font-medium">Entrada segura</h4><p className="mt-1 text-xs leading-5 text-white/40">Confirme o nome da sala antes de entrar e compartilhe links apenas com participantes autorizados.</p></div></div></div>
        </div>
      </div>
      <aside className="grid min-h-0 gap-4 xl:grid-rows-[1fr_auto]">
        <section className={`min-h-0 rounded-[28px] p-5 ${glass}`}><div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#e7b98e]">Acesso rápido</p><h3 className="mt-1 text-xl font-semibold tracking-[-.035em] text-white">Reuniões recentes</h3></div><Clock3 size={19} className="text-white/45"/></div><div className="mt-5 space-y-2">{recent.map(m=><Link key={m.id} href={`/room/${m.slug}`} className="group flex items-center gap-3 rounded-[20px] border border-white/[.07] bg-white/[.035] p-3 transition hover:border-white/[.14] hover:bg-white/[.065]"><span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${m.status==='live'?'bg-emerald-400/15 text-emerald-200':'bg-white/[.07] text-[#efc29e]'}`}><Video size={17}/></span><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-white/90">{m.title}</div><div className="mt-1 flex items-center gap-2 text-[11px] text-white/45"><span>{m.status==='live'?'Agora':'Agendada'}</span><span>·</span><span>{m.durationLabel}</span></div></div><ArrowRight size={15} className="text-white/35 transition group-hover:translate-x-1 group-hover:text-white/70"/></Link>)}</div></section>
        <section className={`rounded-[28px] p-5 ${glass}`}><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-white/[.07] text-[#efc29e]"><UsersRound size={19}/></span><div><h3 className="text-sm font-semibold text-white/90">Como funciona?</h3><p className="mt-0.5 text-xs text-white/45">ID ou link → confirmar → entrar na sala.</p></div></div><Link href="/contatos" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#efc29e]">Convidar um contato <ArrowRight size={13}/></Link></section>
      </aside>
    </section>
  </PageShell>
}

function ReunioesContent(){
  const search=useSearchParams();
  if(search.get('modo')==='entrar') return <JoinMeetingView/>;
  const q=(search.get('q')??'').toLowerCase();
  const list=demoMeetings.filter(m=>m.title.toLowerCase().includes(q));
  return <PageShell title="Reuniões" kicker="Salas e encontros" actions={<Link href="/room/strategy-room" className="octa-primary-button"><Plus size={15}/> Nova reunião</Link>}>
    <div className="reunioes-home-surface grid h-full grid-rows-[auto_1fr] gap-4 text-white">
      <section className={`flex items-center justify-between rounded-[22px] p-4 ${glass}`}><div className="flex items-center gap-2 text-sm text-white/55"><Search size={16}/>{q?<>Resultados para <b className="text-white/90">“{search.get('q')}”</b></>:<>Todas as suas reuniões</>}</div><span className="text-xs text-white/45">{list.length} encontradas</span></section>
      <section className="grid min-h-0 grid-cols-3 gap-4">{list.slice(0,5).map((m,i)=><article key={m.id} className={`flex min-h-0 flex-col rounded-[26px] p-5 ${glass} ${!q&&i===0?'col-span-2 row-span-2':''}`}><div className="flex items-center justify-between"><span className={`rounded-full border px-3 py-1 text-xs ${m.status==='live'?'border-emerald-300/15 bg-emerald-300/10 text-emerald-200':'border-white/[.08] bg-white/[.055] text-white/60'}`}>{m.status==='live'?'Ao vivo':'Agendada'}</span><CircleDot size={18} className="text-white/40"/></div><div className="mt-auto"><Video size={!q&&i===0?48:28} className="mb-4 text-[#efc29e]"/><h2 className={`${!q&&i===0?'text-3xl':'text-xl'} font-semibold tracking-[-.03em] text-white`}>{m.title}</h2><p className="mt-2 text-sm text-white/50">{m.durationLabel} · {m.participantIds.length} participantes</p><MeetingThumbs ids={m.participantIds}/><div className="mt-5"><Link href={`/room/${m.slug}`} className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(90deg,rgba(98,70,52,.96),rgba(130,93,67,.94))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(0,0,0,.2)] transition hover:brightness-110">Entrar na sala</Link></div></div></article>)}</section>
    </div>
  </PageShell>
}

export default function ReunioesPage(){
  return <Suspense fallback={null}><ReunioesContent/></Suspense>;
}
