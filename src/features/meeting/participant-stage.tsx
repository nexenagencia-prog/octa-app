'use client';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Grid2X2, Lock, Maximize2, Minimize2, Mic2, Unlock } from 'lucide-react';
import type { Participant } from '@/types/domain';
import type { ParticipantStageAction, ParticipantStageState } from '@/lib/participant-stage';

type Props={participants:Participant[];state:ParticipantStageState;dispatch:React.Dispatch<ParticipantStageAction>};

export function ParticipantStage({participants,state,dispatch}:Props){
 const people=participants.filter(person=>person.id!==state.hostId);
 const focused=people.find(person=>person.id===state.focusedId)??null;
 const cycleSize=()=>dispatch({type:'set-size',size:state.size==='compact'?'normal':state.size==='normal'?'expanded':'compact'});
 return <aside className={`participant-stage participant-stage-${state.size}`}>
  <header className="participant-stage-head"><div><small>PALCO DOS PARTICIPANTES</small><b>{state.mode==='mosaic'?'Todos os participantes':focused?.displayName??'Participantes'}</b></div><div className="participant-stage-head-actions"><button onClick={cycleSize} aria-label="Encolher ou expandir segunda tela">{state.size==='expanded'?<Minimize2 size={15}/>:<Maximize2 size={15}/>}</button><button onClick={()=>dispatch({type:'show-mosaic'})} className={state.mode==='mosaic'?'active':''}><Grid2X2 size={14}/> <span>Mosaico</span></button></div></header>
  <div className="participant-stage-controls"><button onClick={()=>dispatch({type:'set-auto-speaker',enabled:!state.autoSpeaker})} className={state.autoSpeaker?'active':''}><Mic2 size={13}/> Destaque por voz: {state.autoSpeaker?'ligado':'desligado'}</button>{state.focusedId&&<button onClick={()=>state.lockedId?dispatch({type:'unlock'}):dispatch({type:'lock',participantId:state.focusedId!})} className={state.lockedId?'active':''}>{state.lockedId?<><Unlock size={13}/> Desbloquear destaque</>:<><Lock size={13}/> Bloquear destaque</>}</button>}</div>
  {state.mode==='focus'&&focused?<button className="participant-stage-focus" onClick={()=>dispatch({type:'show-mosaic'})}><Image src={focused.avatarUrl!} alt={focused.displayName} fill className="object-cover"/><div className="participant-stage-shade"/><div className="participant-stage-person-copy"><b>{focused.displayName}</b><span>{state.lockedId===focused.id?'Destaque bloqueado pelo anfitrião':state.autoSpeaker?'Último participante em destaque':'Destaque manual'}</span></div><span className="participant-stage-back"><Grid2X2 size={14}/> ver todos</span></button>:<div className="participant-stage-scroll no-scrollbar"> <div className="participant-stage-mosaic">{people.map((person,index)=><button key={person.id} onClick={()=>dispatch({type:'manual-focus',participantId:person.id})} className={`participant-stage-tile participant-stage-tile-${index%5}`}><Image src={person.avatarUrl!} alt={person.displayName} fill className="object-cover"/><div className="participant-stage-shade"/><span><b>{person.displayName}</b><small>{person.headline}</small></span></button>)}</div><div className="participant-stage-drag-hint"><ChevronDown size={14}/><span>arraste para baixo para ver mais participantes</span><ChevronUp size={14}/></div></div>}
 </aside>
}
