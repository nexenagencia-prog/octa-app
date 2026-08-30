'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowLeft, BookOpenText, Calculator, CalendarDays, Camera, CameraOff, ChevronDown, Copy,
  Filter, Heart, Home, MessageCircle, Mic, MicOff, MoreHorizontal, NotebookPen, PhoneOff,
  ScreenShare, Send, Settings, Sparkles, SquarePen, UserPlus, UsersRound, Video, Volume2,
  WandSparkles, X, CircleDot, ContactRound, Play, Plus, Search
} from 'lucide-react';
import { currentUser, demoMessages, demoParticipants } from '@/lib/demo/data';
import { ChatOverlay } from '@/features/chat/chat-overlay';
import { WhiteboardPanel } from '@/features/whiteboard/whiteboard-panel';
import { MeetingDraggableFilter } from '@/components/meeting-draggable-filter';
import { NotesPanel } from '@/features/notes/notes-panel';
import { LiveKitStage } from './livekit-stage';
import { isLiveKitConfigured } from '@/lib/livekit/config';
import { filterCss } from '@/lib/video-filters';

const leftLinks=[
  {href:'/',label:'Início',icon:Home},{href:'/agenda',label:'Agenda',icon:CalendarDays},{href:'/reunioes',label:'Reuniões',icon:Video},
  {href:'/contatos',label:'Contatos',icon:ContactRound},{href:'/gravacoes',label:'Gravações',icon:Video},{href:'/calculadora',label:'Calculadora',icon:Calculator},
  {href:'/anotacoes',label:'Anotar',icon:NotebookPen},{href:'/compartilhar-tela',label:'Compartilhar Tela',icon:ScreenShare},
  {href:'/gravar',label:'Gravar',icon:CircleDot},{href:'/gravacoes',label:'Gravações',icon:Play},{href:'/minhas-anotacoes',label:'Minhas Anotações',icon:BookOpenText},
];

function Sidebar(){
  return <aside className="hidden w-[280px] shrink-0 flex-col border-r border-white/[.06] bg-[#040b13] p-4 xl:flex">
    <div className="flex items-center justify-between px-2"><Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-[-.03em]"><Sparkles size={24}/> OCTA</Link><Link href="/" className="grid size-9 place-items-center rounded-full border border-white/10 text-white/55"><ArrowLeft size={16}/></Link></div>
    <div className="mt-6 flex items-center gap-3 rounded-[18px] border border-white/[.06] bg-white/[.045] p-3"><Image src={currentUser.avatarUrl!} alt={currentUser.displayName} width={52} height={52} className="size-12 rounded-full object-cover"/><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{currentUser.displayName}</div><div className="mt-0.5 text-[11px] text-white/45">{currentUser.headline}</div><div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-300"/> Online</div></div></div>
    <div className="mt-4 flex h-10 items-center gap-2 rounded-xl border border-white/[.06] bg-white/[.04] px-3 text-white/35"><Search size={15}/><span className="text-xs">Pesquisar...</span></div>
    <nav className="no-scrollbar mt-4 flex-1 space-y-1 overflow-y-auto">{leftLinks.map((item,index)=><Link key={`${item.href}-${index}`} href={item.href} className="flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] text-white/72 transition hover:bg-white/[.055] hover:text-white"><item.icon size={17}/><span>{item.label}</span></Link>)}<Link href="/skills" className="mt-3 flex h-11 items-center gap-3 rounded-xl border border-cyan-400/45 bg-cyan-400/[.07] px-3 text-[13px] font-medium text-white"><Sparkles size={17} className="text-cyan-300"/> OCTA SKILLS</Link></nav>
  </aside>;
}

export function InstantMeetingClient({slug,title}:{slug:string;title:string}){
  const [people,setPeople]=useState(demoParticipants);
  const [focused,setFocused]=useState('u-host');
  const [chat,setChat]=useState(true);const [notes,setNotes]=useState(false);const [board,setBoard]=useState(false);const [filters,setFilters]=useState(false);
  const [mic,setMic]=useState(true);const [camera,setCamera]=useState(true);const [participantsOpen,setParticipantsOpen]=useState(true);const [mutedAll,setMutedAll]=useState(false);
  const [filter,setFilter]=useState('natural');const [intensity,setIntensity]=useState(80);const [toast,setToast]=useState('');
  const focus=useMemo(()=>people.find(p=>p.id===focused)??people[0],[people,focused]);
  const flash=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(''),1700)};
  const copyLink=async()=>{const url=typeof window==='undefined'?'':window.location.href;try{await navigator.clipboard.writeText(url);flash('Link copiado')}catch{flash('Copie o link da barra do navegador')}};
  const share=async()=>{const url=window.location.href;try{if(navigator.share)await navigator.share({title,url});else await navigator.clipboard.writeText(url);flash('Link pronto para compartilhar')}catch{}};
  const muteAll=()=>{setMutedAll(x=>!x);setPeople(ps=>ps.map(p=>p.id==='u-host'?p:{...p,canSpeak:false,isMuted:true}))};
  return <main className="relative h-[100dvh] overflow-hidden bg-[#020812] text-white">
    <div className="flex h-full min-w-0"><Sidebar/>
      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(14,110,171,.13),transparent_34%)] px-4 py-4 lg:px-6">
        <header className="flex items-center justify-between gap-4"><div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[.025] px-4 py-2.5"><span className="size-2.5 rounded-full bg-emerald-300 shadow-[0_0_16px_#38f5c4]"/><div><div className="text-sm font-medium">{title}</div><div className="mt-0.5 text-[10px] uppercase tracking-[.16em] text-emerald-300">AO VIVO <span className="ml-2 text-white/35">· 9:16</span></div></div><ChevronDown size={15} className="text-white/45"/></div><div className="flex items-center gap-2"><button onClick={copyLink} className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 text-xs text-white/80"><Copy size={14}/> Copiar link</button><button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[.03]"><MoreHorizontal size={17}/></button></div></header>
        <div className="no-scrollbar mt-3 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] gap-4 overflow-y-auto 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-h-0 flex-col items-center justify-center">
            <div className="relative w-full max-w-[390px] overflow-hidden rounded-[32px] border border-white/10 bg-[#07121d] shadow-[0_30px_90px_rgba(0,0,0,.46)]" style={{aspectRatio:'9/16'}}>
              <div className="absolute inset-0" style={{filter:filterCss(filter,intensity)}}>{isLiveKitConfigured?<LiveKitStage room={slug} identity={currentUser.id} name={currentUser.displayName}/>:<><Image src={focus.avatarUrl!} alt={focus.displayName} fill priority className="object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-[#020812]/90 via-transparent to-[#020812]/30"/></>}</div>
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 p-1.5 pr-3 backdrop-blur-xl"><Image src={focus.avatarUrl!} alt={focus.displayName} width={34} height={34} className="size-8 rounded-full object-cover"/><div><div className="text-[11px] font-semibold">{focus.displayName}</div><div className="text-[9px] text-white/45">Ao vivo</div></div></div>
              <div className="absolute right-4 top-4 z-10 flex flex-col gap-2"><span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] backdrop-blur-xl">9:16</span><span className="grid size-9 place-items-center rounded-full border border-white/10 bg-black/35 backdrop-blur-xl"><Volume2 size={14}/></span></div>
              <div className="absolute right-[-66px] top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 lg:flex"><button className="flex size-11 flex-col items-center justify-center rounded-full border border-white/10 bg-[#06101a] text-white/80"><Heart size={17}/><span className="mt-0.5 text-[8px]">128</span></button><button onClick={()=>setChat(true)} className="flex size-11 flex-col items-center justify-center rounded-full border border-white/10 bg-[#06101a] text-white/80"><MessageCircle size={17}/><span className="mt-0.5 text-[8px]">32</span></button><button onClick={share} className="grid size-11 place-items-center rounded-full border border-white/10 bg-[#06101a] text-white/80"><Send size={17}/></button></div>
              {chat&&<ChatOverlay initialMessages={demoMessages} onClose={()=>setChat(false)}/>} 
            </div>
            <div className="mt-3 flex w-full max-w-[590px] items-center gap-2 overflow-x-auto rounded-[18px] border border-white/[.06] bg-white/[.025] p-2 no-scrollbar">{people.map(p=><button key={p.id} onClick={()=>setFocused(p.id)} className={`relative shrink-0 rounded-[15px] border p-1 ${focused===p.id?'border-cyan-300/60 bg-cyan-300/10':'border-white/8 bg-white/[.025]'}`}><Image src={p.avatarUrl!} alt={p.displayName} width={52} height={52} className="size-11 rounded-[11px] object-cover"/><span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#06101a] bg-emerald-300"/></button>)}<span className="grid size-12 shrink-0 place-items-center rounded-[14px] border border-white/8 text-xs text-white/55">+3</span></div>
            <div className="mt-3 flex w-full max-w-[900px] items-center justify-center gap-1 rounded-[24px] border border-white/[.07] bg-white/[.03] p-2 backdrop-blur-xl">
              <Control label="Microfone" active={mic} onClick={()=>setMic(x=>!x)} icon={mic?<Mic size={18}/>:<MicOff size={18}/>}/><Control label="Câmera" active={camera} onClick={()=>setCamera(x=>!x)} icon={camera?<Camera size={18}/>:<CameraOff size={18}/>}/><Control label="Chat" onClick={()=>setChat(x=>!x)} icon={<MessageCircle size={18}/>}/><Control label="Anotar" onClick={()=>setNotes(true)} icon={<SquarePen size={18}/>}/><Control label="Participantes" onClick={()=>setParticipantsOpen(x=>!x)} icon={<UsersRound size={18}/>}/><Control label="Filtros" onClick={()=>setFilters(true)} icon={<Filter size={18}/>}/><Control label="Lousa" onClick={()=>setBoard(true)} icon={<WandSparkles size={18}/>}/><Control label="Compartilhar" onClick={share} icon={<ScreenShare size={18}/>}/><button className="ml-2 flex h-12 items-center gap-2 rounded-full bg-[#ff4359] px-5 text-xs font-semibold" onClick={()=>window.location.href='/'}><PhoneOff size={17}/> Sair</button>
            </div>
          </div>
          {participantsOpen&&<aside className="hidden min-h-0 flex-col gap-4 2xl:flex"><section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-white/[.07] bg-white/[.035] p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.18em] text-white/35">Controles do anfitrião</p><h3 className="mt-2 text-base font-medium">Participantes</h3><p className="mt-1 text-xs text-white/40">{people.length} pessoas na reunião</p></div><UserPlus size={18} className="text-white/45"/></div><div className="no-scrollbar mt-4 flex-1 space-y-2 overflow-y-auto">{people.map(p=><button key={p.id} onClick={()=>setFocused(p.id)} className="flex w-full items-center gap-3 rounded-[18px] border border-white/[.04] bg-black/10 p-2.5 text-left hover:bg-white/[.045]"><Image src={p.avatarUrl!} alt={p.displayName} width={48} height={48} className="size-11 rounded-[13px] object-cover"/><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{p.displayName}</div><div className="mt-1 text-[10px] text-white/38">{p.role==='host'?'Anfitrião':'Participante'} · {p.canSpeak&&!mutedAll?'Pode falar':'Aguardando'}</div></div><span className={`h-5 w-1 rounded-full ${p.canSpeak&&!mutedAll?'bg-emerald-300':'bg-white/15'}`}/><MoreHorizontal size={15} className="text-white/35"/></button>)}</div><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={()=>flash('Convite pronto para compartilhar')} className="flex h-11 items-center justify-center gap-2 rounded-[15px] bg-white/[.055] text-xs"><UsersRound size={15}/> Convidar</button><button onClick={muteAll} className="flex h-11 items-center justify-center gap-2 rounded-[15px] bg-white/[.055] text-xs"><MicOff size={15}/>{mutedAll?'Liberar falas':'Silenciar todos'}</button></div></section><button onClick={()=>flash('3 insights disponíveis')} className="flex h-[92px] items-center gap-3 rounded-[24px] border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(8,94,130,.32),rgba(6,22,34,.75))] px-4 text-left"><span className="grid size-11 place-items-center rounded-full border border-cyan-300/30 text-cyan-300"><Sparkles size={19}/></span><span className="flex-1"><b className="block text-sm">Resumo rápido</b><span className="mt-1 block text-[10px] text-white/45">3 insights gerados</span></span><ChevronDown size={16} className="-rotate-90 text-white/55"/></button></aside>}
        </div>
      </section>
    </div>
    {notes&&<NotesPanel roomSlug={slug} meetingTitle={title} onClose={()=>setNotes(false)}/>} {filters&&<MeetingDraggableFilter selected={filter} intensity={intensity} onSelect={setFilter} onIntensity={setIntensity} onClose={()=>setFilters(false)}/>} {board&&<WhiteboardPanel onClose={()=>setBoard(false)}/>} 
    {toast&&<div className="fixed left-1/2 top-5 z-[90] -translate-x-1/2 rounded-full border border-white/10 bg-[#09131d]/90 px-4 py-2 text-xs shadow-2xl backdrop-blur-xl">{toast}</div>}
  </main>;
}

function Control({label,icon,active=true,onClick}:{label:string;icon:React.ReactNode;active?:boolean;onClick?:()=>void}){
  return <button onClick={onClick} className={`flex min-w-[70px] flex-col items-center justify-center gap-1 rounded-[16px] px-2 py-2 text-[9px] transition ${active?'text-white/76 hover:bg-white/[.055]':'bg-rose-500/10 text-rose-300'}`}><span className="grid size-7 place-items-center">{icon}</span><span className="hidden lg:block">{label}</span></button>;
}
