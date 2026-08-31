'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Camera, CameraOff, ChevronDown, Copy, Filter, MessageCircle, Mic, MicOff, MoreHorizontal, PhoneOff,
  ScreenShare, Sparkles, SquarePen, UserPlus, UsersRound, Volume2, WandSparkles, CircleDot, Play, RotateCcw
} from 'lucide-react';
import { currentUser, demoMessages } from '@/lib/demo/data';
import { getProfile, PROFILE_UPDATED_EVENT } from '@/lib/profile-store';
import { DashboardSidebar } from '@/components/nav';
import { ToolOverlayProvider } from '@/components/tool-overlay-context';
import { ToolOverlay } from '@/components/tool-overlay';
import { ShareScreenCard, ScreenRecordingCard } from './floating-call-tool-card';
import { ChatOverlay } from '@/features/chat/chat-overlay';
import { WhiteboardPanel } from '@/features/whiteboard/whiteboard-panel';
import { MeetingDraggableFilter } from '@/components/meeting-draggable-filter';
import { NotesPanel } from '@/features/notes/notes-panel';
import { LiveKitStage } from './livekit-stage';
import { CameraPreview } from './camera-preview';
import { InviteParticipantsCard } from './invite-participants-card';
import { isLiveKitConfigured } from '@/lib/livekit/config';

type MeetingPhase='setup'|'live'|'ended';

export function InstantMeetingClient({slug,title}:{slug:string;title:string}){
  const [profile,setProfile]=useState(()=>getProfile());
  useEffect(()=>{const sync=()=>setProfile(getProfile());sync();window.addEventListener(PROFILE_UPDATED_EVENT,sync);window.addEventListener('storage',sync);return()=>{window.removeEventListener(PROFILE_UPDATED_EVENT,sync);window.removeEventListener('storage',sync)}},[]);
  const [phase,setPhase]=useState<MeetingPhase>('setup');
  const [chat,setChat]=useState(false),[notes,setNotes]=useState(false),[board,setBoard]=useState(false),[filters,setFilters]=useState(false),[inviteOpen,setInviteOpen]=useState(false);
  const [shareCard,setShareCard]=useState(false),[screenSharing,setScreenSharing]=useState(false),[recordCard,setRecordCard]=useState(false),[sidebarCollapsed,setSidebarCollapsed]=useState(false);
  const [mic,setMic]=useState(true),[camera,setCamera]=useState(true),[participantsOpen,setParticipantsOpen]=useState(true),[mutedAll,setMutedAll]=useState(false);
  const [filter,setFilter]=useState('natural'),[intensity,setIntensity]=useState(72),[toast,setToast]=useState(''),[processedTrack,setProcessedTrack]=useState<MediaStreamTrack|null>(null),[roomNames,setRoomNames]=useState<string[]>([]);
  const onTrack=useCallback((track:MediaStreamTrack|null)=>setProcessedTrack(track),[]);
  const onParticipants=useCallback((names:string[])=>setRoomNames(names),[]);
  const meetingUrl=typeof window==='undefined'?`/reuniao-instantanea`:window.location.href;
  const phaseLabel=phase==='setup'?'PRÉ-CALL':phase==='live'?'AO VIVO':'PÓS-CALL';
  const remoteNames=useMemo(()=>roomNames.filter(name=>name&&name!==profile.displayName),[roomNames,profile.displayName]);
  const flash=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(''),1800)};
  const copyLink=async()=>{try{await navigator.clipboard.writeText(meetingUrl);flash('Link copiado')}catch{flash('Copie o link da barra do navegador')}};
  const endMeeting=()=>{setScreenSharing(false);setChat(false);setPhase('ended');flash('Reunião encerrada · câmera disponível para teste')};

  return <ToolOverlayProvider><main className="relative h-[100dvh] overflow-hidden bg-[#020812] p-4 text-white">
    <div className="flex h-full min-w-0 gap-4"><DashboardSidebar collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(v=>!v)}/>
      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(14,110,171,.13),transparent_34%)] px-4 py-4 lg:px-6">
        <header className="flex items-center justify-between gap-4"><div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[.025] px-4 py-2.5"><span className={`size-2.5 rounded-full ${phase==='live'?'bg-emerald-300 shadow-[0_0_16px_#38f5c4]':'bg-cyan-300/70'}`}/><div><div className="text-sm font-medium">{title}</div><div className="mt-0.5 text-[10px] uppercase tracking-[.16em] text-cyan-300">{phaseLabel} <span className="ml-2 text-white/35">· câmera 9:16</span></div></div><ChevronDown size={15} className="text-white/45"/></div><div className="flex items-center gap-2"><button onClick={()=>setInviteOpen(true)} className="flex h-10 items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/[.06] px-4 text-xs text-cyan-100"><UserPlus size={14}/> Adicionar participantes</button><button onClick={copyLink} className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 text-xs text-white/80"><Copy size={14}/> Copiar link</button><button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[.03]"><MoreHorizontal size={17}/></button></div></header>

        <div className="no-scrollbar mt-3 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] gap-4 overflow-y-auto 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-h-0 flex-col items-center justify-center">
            <div className="relative w-full max-w-[390px] overflow-hidden rounded-[32px] border border-white/10 bg-[#07121d] shadow-[0_30px_90px_rgba(0,0,0,.46)]" style={{aspectRatio:'9/16'}}>
              {phase==='live'&&isLiveKitConfigured?<>
                <CameraPreview enabled={camera} filterId={filter} intensity={intensity} onProcessedTrack={onTrack} className="absolute size-px opacity-0 pointer-events-none"/>
                <LiveKitStage room={slug} identity={currentUser.id} name={profile.displayName} screenShare={screenSharing} cameraEnabled={camera} microphoneEnabled={mic} processedTrack={processedTrack} onParticipantsChange={onParticipants} onScreenShareError={message=>{setScreenSharing(false);flash(message)}}/>
              </>:<CameraPreview enabled={camera} filterId={filter} intensity={intensity} onProcessedTrack={onTrack} className="absolute inset-0"/>}

              <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-xl"><span className="grid size-8 place-items-center rounded-full bg-white/[.08] text-[10px] font-semibold text-cyan-100">{profile.displayName.split(' ').map(part=>part[0]).slice(0,2).join('').toUpperCase()}</span><div><div className="text-[11px] font-semibold">{profile.displayName}</div><div className="text-[9px] text-white/45">Você · anfitrião</div></div></div>
              <div className="absolute right-4 top-4 z-10 flex flex-col gap-2"><span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] backdrop-blur-xl">{phaseLabel}</span><span className="grid size-9 place-items-center rounded-full border border-white/10 bg-black/35 backdrop-blur-xl"><Volume2 size={14}/></span></div>
              {phase==='live'&&chat&&<ChatOverlay initialMessages={demoMessages} onClose={()=>setChat(false)}/>} 
            </div>

            <div className="mt-3 flex w-full max-w-[590px] items-center gap-2 rounded-[18px] border border-white/[.06] bg-white/[.025] p-2"><div className="flex items-center gap-2 rounded-[14px] border border-cyan-300/30 bg-cyan-300/[.06] px-3 py-2"><span className="grid size-9 place-items-center rounded-[11px] bg-white/[.06] text-[10px] font-semibold text-cyan-100">{profile.displayName.split(' ').map(part=>part[0]).slice(0,2).join('').toUpperCase()}</span><div><b className="block text-[11px] font-medium">{profile.displayName}</b><span className="text-[9px] text-white/38">{phase==='setup'?'Teste sua câmera e microfone':phase==='live'?'Você está na reunião':'Teste a câmera antes da próxima call'}</span></div></div><span className="ml-auto px-3 text-[10px] text-white/35">{phase==='live'?(remoteNames.length?`${remoteNames.length} participante(s) conectado(s)`:'Aguardando participantes'):'Configuração disponível'}</span></div>

            <div className="mt-3 flex w-full max-w-[960px] items-center justify-center gap-1 rounded-[24px] border border-white/[.07] bg-white/[.03] p-2 backdrop-blur-xl">
              <Control label="Microfone" active={mic} onClick={()=>setMic(x=>!x)} icon={mic?<Mic size={18}/>:<MicOff size={18}/>}/>
              <Control label="Câmera" active={camera} onClick={()=>setCamera(x=>!x)} icon={camera?<Camera size={18}/>:<CameraOff size={18}/>}/>
              <Control label="Filtros" onClick={()=>setFilters(true)} icon={<Filter size={18}/>}/>
              {phase==='live'&&<><Control label="Chat" onClick={()=>setChat(x=>!x)} icon={<MessageCircle size={18}/>}/><Control label="Anotar" onClick={()=>setNotes(true)} icon={<SquarePen size={18}/>}/><Control label="Participantes" onClick={()=>setParticipantsOpen(x=>!x)} icon={<UsersRound size={18}/>}/><Control label="Lousa" onClick={()=>setBoard(true)} icon={<WandSparkles size={18}/>}/><Control label="Compartilhar" active={!screenSharing} onClick={()=>setShareCard(true)} icon={<ScreenShare size={18}/>}/><Control label="Gravar tela" onClick={()=>setRecordCard(true)} icon={<CircleDot size={18}/>}/></>}
              {phase==='setup'&&<button onClick={()=>setPhase('live')} className="ml-2 flex h-12 items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-[#07131e]"><Play size={16}/> Iniciar reunião</button>}
              {phase==='live'&&<button className="ml-2 flex h-12 items-center gap-2 rounded-full bg-[#ff4359] px-5 text-xs font-semibold" onClick={endMeeting}><PhoneOff size={17}/> Encerrar</button>}
              {phase==='ended'&&<button onClick={()=>setPhase('setup')} className="ml-2 flex h-12 items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-[#07131e]"><RotateCcw size={15}/> Nova reunião</button>}
            </div>
          </div>

          {participantsOpen&&<aside className="hidden min-h-0 flex-col gap-4 2xl:flex"><section className="flex min-h-0 flex-1 flex-col rounded-[28px] border border-white/[.07] bg-white/[.035] p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.18em] text-white/35">Controles do anfitrião</p><h3 className="mt-2 text-base font-medium">Participantes</h3><p className="mt-1 text-xs text-white/40">{1+remoteNames.length} pessoa(s) na reunião</p></div><button onClick={()=>setInviteOpen(true)} className="grid size-10 place-items-center rounded-full border border-cyan-300/15 bg-cyan-300/[.06] text-cyan-200" aria-label="Adicionar participantes"><UserPlus size={18}/></button></div><div className="no-scrollbar mt-4 flex-1 space-y-2 overflow-y-auto"><ParticipantRow name={profile.displayName} subtitle={`Anfitrião · ${mic&&!mutedAll?'Pode falar':'Microfone desligado'}`} active={mic&&!mutedAll}/>{remoteNames.map(name=><ParticipantRow key={name} name={name} subtitle="Participante conectado" active/>)}</div><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={()=>setInviteOpen(true)} className="flex h-11 items-center justify-center gap-2 rounded-[15px] bg-white/[.055] text-xs"><UsersRound size={15}/> Convidar</button><button onClick={()=>setMutedAll(x=>!x)} className="flex h-11 items-center justify-center gap-2 rounded-[15px] bg-white/[.055] text-xs"><MicOff size={15}/>{mutedAll?'Liberar falas':'Silenciar todos'}</button></div></section><button onClick={()=>flash('Insights serão gerados durante a reunião')} className="flex h-[92px] items-center gap-3 rounded-[24px] border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(8,94,130,.32),rgba(6,22,34,.75))] px-4 text-left"><span className="grid size-11 place-items-center rounded-full border border-cyan-300/30 text-cyan-300"><Sparkles size={19}/></span><span className="flex-1"><b className="block text-sm">Resumo rápido</b><span className="mt-1 block text-[10px] text-white/45">{phase==='live'?'Analisando a conversa':'Disponível durante a reunião'}</span></span><ChevronDown size={16} className="-rotate-90 text-white/55"/></button></aside>}
        </div>
      </section>
    </div>

    {inviteOpen&&<InviteParticipantsCard meetingUrl={meetingUrl} meetingTitle={title} hostName={profile.displayName} onClose={()=>setInviteOpen(false)} onSent={flash}/>} 
    {notes&&<NotesPanel roomSlug={slug} meetingTitle={title} onClose={()=>setNotes(false)}/>} {filters&&<MeetingDraggableFilter selected={filter} intensity={intensity} onSelect={setFilter} onIntensity={setIntensity} onClose={()=>setFilters(false)}/>} {board&&<WhiteboardPanel onClose={()=>setBoard(false)}/>} 
    {shareCard&&<ShareScreenCard active={screenSharing} onToggle={()=>setScreenSharing(v=>!v)} onHide={()=>setShareCard(false)}/>} {recordCard&&<ScreenRecordingCard onHide={()=>setRecordCard(false)}/>} 
    {toast&&<div className="fixed left-1/2 top-5 z-[280] -translate-x-1/2 rounded-full border border-white/10 bg-[#09131d]/95 px-4 py-2 text-xs shadow-2xl backdrop-blur-xl">{toast}</div>}
    <ToolOverlay/>
  </main></ToolOverlayProvider>;
}

function ParticipantRow({name,subtitle,active}:{name:string;subtitle:string;active:boolean}){return <div className="flex w-full items-center gap-3 rounded-[18px] border border-white/[.04] bg-black/10 p-2.5 text-left"><span className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-white/[.055] text-[10px] font-semibold text-cyan-100">{name.split(' ').map(part=>part[0]).slice(0,2).join('').toUpperCase()}</span><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{name}</div><div className="mt-1 text-[10px] text-white/38">{subtitle}</div></div><span className={`h-5 w-1 rounded-full ${active?'bg-emerald-300':'bg-white/15'}`}/></div>}

function Control({label,icon,active=true,onClick}:{label:string;icon:React.ReactNode;active?:boolean;onClick?:()=>void}){return <button onClick={onClick} className={`flex min-w-[70px] flex-col items-center justify-center gap-1 rounded-[16px] px-2 py-2 text-[9px] transition ${active?'text-white/76 hover:bg-white/[.055]':'bg-rose-500/10 text-rose-300'}`}><span className="grid size-7 place-items-center">{icon}</span><span className="hidden lg:block">{label}</span></button>}
