'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CircleDot, Clock3, Link2, Plus, Search, ShieldCheck, UsersRound, Video } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { demoMeetings, demoParticipants } from '@/lib/demo/data';


function MeetingThumbs({ids}:{ids:string[]}){
  const people=ids.map(id=>demoParticipants.find(p=>p.id===id)).filter(Boolean).slice(0,5);
  return <div className="mt-4 flex items-center gap-2">{people.map(p=>p?.avatarUrl?<Image key={p.id} src={p.avatarUrl} alt={p.displayName} width={44} height={44} className="size-10 rounded-xl border border-black/5 object-cover shadow-sm"/>:null)}{ids.length>5&&<span className="grid size-10 place-items-center rounded-xl border border-black/5 bg-[#edf3f6] text-[11px] font-semibold text-[#60778a]">+{ids.length-5}</span>}</div>;
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
    <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_360px]">
      <div className="relative min-h-[620px] overflow-hidden rounded-[34px] border border-[#123247]/15 bg-[radial-gradient(circle_at_75%_18%,rgba(18,169,190,.24),transparent_30%),linear-gradient(145deg,#071923_0%,#0b2533_52%,#0a1721_100%)] p-5 text-white shadow-[0_26px_70px_rgba(7,29,43,.18)] md:p-7">
        <div className="pointer-events-none absolute -right-20 top-20 size-[390px] rounded-full border border-cyan-300/10 bg-cyan-300/[.03] shadow-[0_0_120px_rgba(34,211,238,.12)]"/>
        <div className="pointer-events-none absolute right-16 top-44 size-44 rounded-[42px] border border-cyan-200/20 bg-white/[.025] shadow-[inset_0_0_45px_rgba(89,216,235,.08),0_0_55px_rgba(43,199,224,.08)] backdrop-blur-xl"/>
        <div className="relative z-10 flex h-full flex-col">
          <div className="max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[.07] px-3 py-1.5 text-[11px] font-medium text-cyan-100"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_#6ee7b7]"/> OCTA Meetings</span><h2 className="mt-5 text-[34px] font-semibold tracking-[-.045em] md:text-[46px]">Entre na reunião em segundos.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/52">Cole o link recebido ou digite o ID da sala. Você continua dentro da estrutura do OCTA e entra na chamada quando estiver pronto.</p></div>
          <div className="mt-8 max-w-2xl rounded-[28px] border border-white/10 bg-white/[.055] p-4 shadow-[0_18px_50px_rgba(0,0,0,.18)] backdrop-blur-2xl md:p-5"><label className="text-xs font-medium text-white/60">ID da reunião ou link</label><div className="mt-3 flex flex-col gap-3 sm:flex-row"><div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4"><Link2 size={17} className="shrink-0 text-cyan-200/70"/><input value={meetingId} onChange={e=>setMeetingId(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')join()}} placeholder="Ex.: strategy-room ou link da reunião" className="h-14 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/28"/></div><button onClick={join} disabled={!meetingId.trim()} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0795a7] to-[#17b7cf] px-6 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(14,165,183,.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"><Video size={17}/> Entrar na reunião</button></div></div>
          <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-2"><Link href="/agenda" className="group rounded-[24px] border border-white/8 bg-white/[.035] p-4 transition hover:bg-white/[.065]"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-2xl bg-white/[.07] text-cyan-100"><CalendarDays size={18}/></span><ArrowRight size={16} className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60"/></div><h3 className="mt-5 text-base font-medium">Entrar pela agenda</h3><p className="mt-1 text-xs leading-5 text-white/42">Abra uma reunião que já está marcada para você.</p></Link><button onClick={()=>setMeetingId('strategy-room')} className="group rounded-[24px] border border-white/8 bg-white/[.035] p-4 text-left transition hover:bg-white/[.065]"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-2xl bg-white/[.07] text-cyan-100"><Video size={18}/></span><ArrowRight size={16} className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60"/></div><h3 className="mt-5 text-base font-medium">Usar sala de teste</h3><p className="mt-1 text-xs leading-5 text-white/42">Preenche um ID de demonstração sem iniciar automaticamente.</p></button></div>
          <div className="mt-auto max-w-2xl rounded-[22px] border border-white/8 bg-black/15 p-4"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200"><ShieldCheck size={17}/></span><div><h4 className="text-sm font-medium">Entrada segura</h4><p className="mt-1 text-xs leading-5 text-white/40">Confirme o nome da sala antes de entrar e compartilhe links apenas com participantes autorizados.</p></div></div></div>
        </div>
      </div>
      <aside className="grid min-h-0 gap-4 xl:grid-rows-[1fr_auto]">
        <section className="octa-panel min-h-0 p-5"><div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#0b7285]">Acesso rápido</p><h3 className="mt-1 text-xl font-semibold tracking-[-.035em] text-[#102944]">Reuniões recentes</h3></div><Clock3 size={19} className="text-[#7890a2]"/></div><div className="mt-5 space-y-2">{recent.map(m=><Link key={m.id} href={`/room/${m.slug}`} className="group flex items-center gap-3 rounded-[20px] border border-[#dfe8ed] bg-[#f8fbfc] p-3 transition hover:border-[#b9dbe2] hover:bg-white"><span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${m.status==='live'?'bg-[#0b8798] text-white':'bg-[#e8f1f4] text-[#0b7285]'}`}><Video size={17}/></span><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-[#16314a]">{m.title}</div><div className="mt-1 flex items-center gap-2 text-[11px] text-[#72889a]"><span>{m.status==='live'?'Agora':'Agendada'}</span><span>·</span><span>{m.durationLabel}</span></div></div><ArrowRight size={15} className="text-[#8da0af] transition group-hover:translate-x-1"/></Link>)}</div></section>
        <section className="rounded-[28px] border border-[#dce7ec] bg-white p-5 shadow-[0_16px_40px_rgba(15,47,68,.06)]"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[#e8f5f7] text-[#0b7285]"><UsersRound size={19}/></span><div><h3 className="text-sm font-semibold text-[#16314a]">Como funciona?</h3><p className="mt-0.5 text-xs text-[#718598]">ID ou link → confirmar → entrar na sala.</p></div></div><Link href="/contatos" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#0b7d8e]">Convidar um contato <ArrowRight size={13}/></Link></section>
      </aside>
    </section>
  </PageShell>
}

function ReunioesContent(){
  const search=useSearchParams();
  if(search.get('modo')==='entrar') return <JoinMeetingView/>;
  const q=(search.get('q')??'').toLowerCase();const list=demoMeetings.filter(m=>m.title.toLowerCase().includes(q));return <PageShell title="Reuniões" kicker="Salas e encontros" actions={<Link href="/room/strategy-room" className="octa-primary-button"><Plus size={15}/> Nova reunião</Link>}>
  <div className="grid h-full grid-rows-[auto_1fr] gap-4"><section className="octa-panel flex items-center justify-between p-4"><div className="flex items-center gap-2 text-sm text-[#64798b]"><Search size={16}/>{q?<>Resultados para <b className="text-[#17314a]">“{search.get('q')}”</b></>:<>Todas as suas reuniões</>}</div><span className="text-xs text-[#6c8091]">{list.length} encontradas</span></section><section className="grid min-h-0 grid-cols-3 gap-4">{list.slice(0,5).map((m,i)=><article key={m.id} className={`octa-panel flex min-h-0 flex-col p-5 ${!q&&i===0?'col-span-2 row-span-2':''}`}><div className="flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-xs ${m.status==='live'?'bg-emerald-100 text-emerald-700':'bg-[#edf3f6] text-[#5a7183]'}`}>{m.status==='live'?'Ao vivo':'Agendada'}</span><CircleDot size={18}/></div><div className="mt-auto"><Video size={!q&&i===0?48:28} className="mb-4 text-[#0b7285]"/><h2 className={`${!q&&i===0?'text-3xl':'text-xl'} font-semibold tracking-[-.03em]`}>{m.title}</h2><p className="mt-2 text-sm text-[#667b8e]">{m.durationLabel} · {m.participantIds.length} participantes</p><MeetingThumbs ids={m.participantIds}/><div className="mt-5"><Link href={`/room/${m.slug}`} className="octa-primary-button">Entrar na sala</Link></div></div></article>)}</section></div>
</PageShell>}

export default function ReunioesPage(){
  return <Suspense fallback={null}><ReunioesContent/></Suspense>;
}
