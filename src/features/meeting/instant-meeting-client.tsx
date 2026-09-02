'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useReducer, useRef, useState } from 'react';
import {
  Bell, Camera, CameraOff, ChevronLeft, ChevronRight, Copy, Filter, Heart, MessageCircle, Mic, MicOff,
  MoreHorizontal, PhoneOff, ScreenShare, Search, Send, SquarePen, UserPlus, UsersRound, Volume2, WandSparkles
} from 'lucide-react';
import { currentUser, demoMessages, demoParticipants } from '@/lib/demo/data';
import type { Participant } from '@/types/domain';
import { ChatOverlay } from '@/features/chat/chat-overlay';
import { WhiteboardPanel } from '@/features/whiteboard/whiteboard-panel';
import { MeetingDraggableFilter } from '@/components/meeting-draggable-filter';
import { NotesPanel } from '@/features/notes/notes-panel';
import { LiveKitStage } from './livekit-stage';
import { ParticipantStage } from './participant-stage';
import { PresentationMode } from './presentation-mode';
import type { PresentationSlide } from './presentation-model';
import { isLiveKitConfigured } from '@/lib/livekit/config';
import { filterCss } from '@/lib/video-filters';
import { createStageState, stageReducer } from '@/lib/participant-stage';

const meetingSlides:PresentationSlide[]=[
 {id:'octa-insight-1',name:'Inteligência que transforma reuniões em resultados',kind:'image',src:'/octa-hero-lake.webp',sourceName:'OCTA Insights'},
 {id:'octa-insight-2',name:'Conduza conversas com mais clareza',kind:'image',src:'/agenda-background.webp',sourceName:'OCTA Guia'},
 {id:'octa-insight-3',name:'Prepare a próxima decisão',kind:'image',src:'/octa-hero-man.webp',sourceName:'OCTA Playbook'}
];
const fmt=(seconds:number)=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;

function RealtimeSkillsPanel({host,elapsedSeconds,lowEngagement,lowMinute,topic,activityCount}:{host:Participant;elapsedSeconds:number;lowEngagement:boolean;lowMinute:string;topic:string;activityCount:number}){
 const metrics=[['Participação',Math.min(96,82+Math.min(8,activityCount))],['Objetividade',76],['Clareza',88],['Escuta ativa',86]] as const;
 return <article className="meeting-skill-card meeting-glass">
  <header><div><small>SKILLS EM TEMPO REAL</small><p>Análise baseada em fala, participação e interação</p></div><span className="meeting-live-pill">AO VIVO</span></header>
  <div className="meeting-skill-main"><div className="meeting-face-frame"><Image src={host.avatarUrl!} alt={host.displayName} fill sizes="180px" className="object-cover"/><i className="face-grid"/><span className="face-corner face-tl"/><span className="face-corner face-tr"/><span className="face-corner face-bl"/><span className="face-corner face-br"/></div><div className="meeting-skill-metrics">{metrics.map(([label,score])=><div key={label}><span>{label}</span><b>{score}/100</b><em className={score>=84?'strong':'evolving'}>{score>=84?'Forte':'Em evolução'}</em></div>)}</div></div>
  <div className={`meeting-engagement-event ${lowEngagement?'warning':''}`}><div><small>{lowEngagement?'BAIXA INTERAÇÃO ESTIMADA':'SINAIS DE INTERAÇÃO'}</small><b>{lowEngagement?lowMinute:fmt(elapsedSeconds)}</b></div><p>{lowEngagement?<>Queda de atividade durante <strong>{topic}</strong>. Sugestão: faça uma pergunta aberta, resuma o ponto e convide alguém que falou menos.</>:<>Nenhuma queda relevante detectada. O indicador usa apenas sinais observáveis da reunião, não inferência emocional pelo rosto.</>}</p></div>
 </article>;
}

function SlideRail({slides,onOpen}:{slides:PresentationSlide[];onOpen:(id:string)=>void}){
 const rail=useRef<HTMLDivElement>(null);const move=(dir:-1|1)=>rail.current?.scrollBy({left:dir*330,behavior:'smooth'});
 return <article className="meeting-slide-card meeting-glass"><header><div><small>APRESENTAÇÃO</small><b>Slides da reunião</b></div><div><button aria-label="Slide anterior" onClick={()=>move(-1)}><ChevronLeft size={16}/></button><button aria-label="Próximo slide" onClick={()=>move(1)}><ChevronRight size={16}/></button></div></header><div ref={rail} className="meeting-slide-rail no-scrollbar">{slides.map((slide,index)=><button key={slide.id} onClick={()=>onOpen(slide.id)} className="meeting-slide-thumb"><img src={slide.src} alt="" loading={index===0?'eager':'lazy'}/><span>{slide.name}</span><small>{index+1} / {slides.length}</small></button>)}</div><p>Clique em um slide para abrir em tela cheia e apresentar para todos.</p></article>;
}

function Highlights(){return <article className="meeting-highlights meeting-glass"><header><small>DESTAQUES PARA VOCÊ</small><Link href="/skills">Ver todos</Link></header><div><button><span>▣</span><b>Como conduzir reuniões mais produtivas</b><small>5 min de leitura</small></button><button><span>▤</span><b>Comunicação clara que realmente importa</b><small>7 min de leitura</small></button><button><span>◌</span><b>Técnicas para escuta ativa e empatia</b><small>4 min de leitura</small></button></div></article>}

export function InstantMeetingClient({slug,title,onAddParticipant}:{slug:string;title:string;onAddParticipant?:()=>void}){
 const[people,setPeople]=useState(demoParticipants);const[stage,dispatchStage]=useReducer(stageReducer,createStageState(currentUser.id,demoParticipants.map(person=>person.id)));
 const[chat,setChat]=useState(true);const[notes,setNotes]=useState(false);const[board,setBoard]=useState(false);const[filters,setFilters]=useState(false);const[presentationOpen,setPresentationOpen]=useState(false);const[presentationLaunchId,setPresentationLaunchId]=useState<string|null>(null);
 const[mic,setMic]=useState(true);const[camera,setCamera]=useState(true);const[participantsOpen,setParticipantsOpen]=useState(true);const[mutedAll,setMutedAll]=useState(false);const[filter,setFilter]=useState('natural');const[intensity,setIntensity]=useState(80);const[toast,setToast]=useState('');
 const[meetingTitle,setMeetingTitle]=useState(title);const[meetingHostLabel,setMeetingHostLabel]=useState('anfitrião fixo');const[heartCount,setHeartCount]=useState(128);const[elapsedSeconds,setElapsedSeconds]=useState(0);const[lastActivitySecond,setLastActivitySecond]=useState(0);const[activityCount,setActivityCount]=useState(0);
 const host=people.find(person=>person.id===currentUser.id)??people[0];
 useEffect(()=>{const timer=window.setInterval(()=>setElapsedSeconds(value=>value+1),1000);return()=>window.clearInterval(timer)},[]);
 const registerActivity=()=>{setLastActivitySecond(elapsedSeconds);setActivityCount(value=>value+1)};
 const lowEngagement=elapsedSeconds>=120&&elapsedSeconds-lastActivitySecond>=75;const lowMinute=fmt(Math.max(0,lastActivitySecond+75));
 const flash=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(''),1700)};
 const copyLink=async()=>{const url=typeof window==='undefined'?'':window.location.href;try{await navigator.clipboard.writeText(url);flash('Link copiado')}catch{flash('Copie o link da barra do navegador')}};
 const share=async()=>{const url=window.location.href;try{if(navigator.share)await navigator.share({title:meetingTitle,url});else await navigator.clipboard.writeText(url);flash('Link pronto para compartilhar')}catch{}};
 const muteAll=()=>{setMutedAll(value=>!value);setPeople(items=>items.map(person=>person.id===currentUser.id?person:{...person,canSpeak:false,isMuted:true}))};
 const onActiveSpeaker=(identity:string|null)=>{dispatchStage(identity?{type:'active-speaker',participantId:identity}:{type:'silence'});if(identity)registerActivity()};
 const openSlide=(id:string)=>{setPresentationLaunchId(id);setPresentationOpen(true);registerActivity()};
 const closePresentation=()=>{setPresentationOpen(false);setPresentationLaunchId(null)};
 return <main className="meeting-reference-page text-white"><section className="meeting-reference-workspace">
  <header className="meeting-reference-topbar"><div className="meeting-reference-search"><Search size={17}/><span>Buscar reunião, pessoa ou gravação</span></div><nav><Link className="active" href="/">Início</Link><Link href="/reunioes">Reuniões</Link><Link href="/agenda">Agenda</Link><Link href="/planos">Planos e preços</Link></nav><button aria-label="Notificações"><Bell size={19}/></button></header>
  <div className={`meeting-reference-grid ${participantsOpen?'':'participants-hidden'}`}>
   <section className="meeting-host-zone"><div className="meeting-status-card meeting-glass"><span className="meeting-status-dot"/><div><input aria-label="Nome da reunião" value={meetingTitle} onChange={e=>setMeetingTitle(e.target.value)}/><p><b>AO VIVO</b><input aria-label="Descrição do anfitrião" value={meetingHostLabel} onChange={e=>setMeetingHostLabel(e.target.value)}/></p></div><div className="meeting-status-actions">{onAddParticipant&&<button onClick={onAddParticipant} aria-label="Adicionar participante"><UserPlus size={15}/></button>}<button onClick={copyLink} aria-label="Copiar link"><Copy size={15}/></button><button aria-label="Mais opções"><MoreHorizontal size={16}/></button></div></div>
    <div className="meeting-reference-host-card instant-video-frame"><div className="absolute inset-0" style={{filter:filterCss(filter,intensity)}}>{isLiveKitConfigured?<LiveKitStage room={slug} identity={currentUser.id} name={currentUser.displayName} onActiveSpeaker={onActiveSpeaker}/>:<><Image src={host.avatarUrl!} alt={host.displayName} fill priority sizes="420px" className="object-cover"/><div className="meeting-host-shade"/></>}</div><div className="meeting-host-profile"><Image src={host.avatarUrl!} alt="" width={34} height={34}/><div><b>{host.displayName}</b><span>Seu vídeo · sempre fixo</span></div><button><Volume2 size={15}/></button></div><div className="meeting-host-social"><button onClick={()=>{setHeartCount(value=>value+1);registerActivity()}} aria-label="Curtir"><Heart size={18} fill="currentColor"/><span>{heartCount}</span></button><button onClick={()=>setChat(value=>!value)} aria-label="Ativar ou desativar chat"><MessageCircle size={18}/><span>{chat?'ON':'OFF'}</span></button><button onClick={share} aria-label="Compartilhar reunião"><Send size={18}/></button></div>{chat&&<ChatOverlay initialMessages={demoMessages} onClose={()=>setChat(false)} onActivity={registerActivity}/>}</div>
   </section>
   {participantsOpen&&<ParticipantStage participants={people} state={stage} dispatch={dispatchStage}/>} 
   <aside className="meeting-reference-right"><RealtimeSkillsPanel host={host} elapsedSeconds={elapsedSeconds} lowEngagement={lowEngagement} lowMinute={lowMinute} topic={meetingTitle||'assunto atual'} activityCount={activityCount}/><SlideRail slides={meetingSlides} onOpen={openSlide}/><Highlights/></aside>
  </div>
  <div className="instant-controls meeting-reference-controls"><Control label="Microfone" active={mic} onClick={()=>setMic(value=>!value)} icon={mic?<Mic size={18}/>:<MicOff size={18}/>}/><Control label="Câmera" active={camera} onClick={()=>setCamera(value=>!value)} icon={camera?<Camera size={18}/>:<CameraOff size={18}/>}/><Control label={chat?'Chat ligado':'Chat desligado'} active={chat} onClick={()=>setChat(value=>!value)} icon={<MessageCircle size={18}/>}/><Control label="Anotar" onClick={()=>setNotes(true)} icon={<SquarePen size={18}/>}/><Control label="Participantes" active={participantsOpen} onClick={()=>setParticipantsOpen(value=>!value)} icon={<UsersRound size={18}/>}/><Control label="Filtros" onClick={()=>setFilters(true)} icon={<Filter size={18}/>}/><Control label="Lousa" onClick={()=>setBoard(true)} icon={<WandSparkles size={18}/>}/><Control label="Compartilhar" onClick={()=>{setPresentationLaunchId(null);setPresentationOpen(true)}} icon={<ScreenShare size={18}/>}/><Control label={mutedAll?'Liberar falas':'Silenciar todos'} onClick={muteAll} icon={<MicOff size={18}/>}/><button className="meeting-leave" onClick={()=>window.location.href='/'}><PhoneOff size={17}/> Sair</button></div>
 </section>{notes&&<NotesPanel roomSlug={slug} meetingTitle={meetingTitle} onClose={()=>setNotes(false)}/>} {filters&&<MeetingDraggableFilter selected={filter} intensity={intensity} onSelect={setFilter} onIntensity={setIntensity} onClose={()=>setFilters(false)}/>} {board&&<WhiteboardPanel onClose={()=>setBoard(false)}/>}<PresentationMode open={presentationOpen} onClose={closePresentation} roomSlug={slug} participants={people.map(person=>({id:person.id,displayName:person.displayName,avatarUrl:person.avatarUrl}))} initialSlides={meetingSlides} launchSlideId={presentationLaunchId}/>{toast&&<div className="meeting-toast">{toast}</div>}</main>
}

function Control({label,icon,active=true,onClick}:{label:string;icon:React.ReactNode;active?:boolean;onClick?:()=>void}){return <button onClick={onClick} className={`meeting-control ${active?'active':'inactive'}`}><span>{icon}</span><b>{label}</b></button>}
