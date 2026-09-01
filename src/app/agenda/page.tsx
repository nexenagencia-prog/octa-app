'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Plus, UsersRound, X } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { demoMeetings, demoParticipants } from '@/lib/demo/data';
import { buildMonthGrid, shiftMonth, toDateKey } from '@/lib/br-calendar';

const invitees=demoParticipants.slice(0,6);
const participantById=new Map(demoParticipants.map(person=>[person.id,person]));
type CreatedMeeting={id:string;title:string;date:string;time:string;participantIds:string[]};

function AgendaAvatars({ids}:{ids:string[]}){return <span className="agenda-avatar-stack">{ids.slice(0,4).map(id=>{const person=participantById.get(id);return person?.avatarUrl?<Image key={id} src={person.avatarUrl} alt={person.displayName} width={24} height={24} className="agenda-avatar"/>:null})}</span>}
function localKey(value:string){const d=new Date(value);return toDateKey(d.getFullYear(),d.getMonth(),d.getDate())}
function capitalize(value:string){return value.charAt(0).toUpperCase()+value.slice(1)}

function AgendaContent(){
 const search=useSearchParams();
 const now=useMemo(()=>new Date(),[]);
 const initialKey=toDateKey(now.getFullYear(),now.getMonth(),now.getDate());
 const[cursor,setCursor]=useState({year:now.getFullYear(),month:now.getMonth()});
 const[selectedKey,setSelectedKey]=useState(initialKey);
 const[showCreate,setShowCreate]=useState(search.get('new')==='1');
 const[created,setCreated]=useState<CreatedMeeting[]>([]);
 const[title,setTitle]=useState('');
 const[date,setDate]=useState(initialKey);
 const[time,setTime]=useState('14:30');
 const[selectedParticipants,setSelectedParticipants]=useState<string[]>([]);
 const grid=useMemo(()=>buildMonthGrid(cursor.year,cursor.month),[cursor]);
 const monthLabel=useMemo(()=>capitalize(new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(new Date(cursor.year,cursor.month,1))),[cursor]);
 const selectedDate=useMemo(()=>{const[y,m,d]=selectedKey.split('-').map(Number);return new Date(y,m-1,d)},[selectedKey]);
 const dayLabel=new Intl.DateTimeFormat('pt-BR',{day:'numeric',month:'long',year:'numeric'}).format(selectedDate);
 const demoForDay=useMemo(()=>demoMeetings.filter(meeting=>localKey(meeting.scheduledAt)===selectedKey),[selectedKey]);
 const createdForDay=useMemo(()=>created.filter(meeting=>meeting.date===selectedKey),[created,selectedKey]);
 const totalMeetings=demoForDay.length+createdForDay.length;
 const toggleParticipant=(id:string)=>setSelectedParticipants(ids=>ids.includes(id)?ids.filter(value=>value!==id):[...ids,id]);
 const moveMonth=(delta:number)=>setCursor(current=>shiftMonth(current.year,current.month,delta));
 const selectCell=(cell:(typeof grid)[number])=>{setSelectedKey(cell.key);if(!cell.currentMonth)setCursor({year:cell.date.getFullYear(),month:cell.date.getMonth()})};
 const openCreate=()=>{setDate(selectedKey);setShowCreate(true)};
 const save=()=>{if(!title.trim())return;const item={id:`created-${Date.now()}`,title:title.trim(),date,time,participantIds:selectedParticipants};setCreated(items=>[...items,item]);const[y,m]=date.split('-').map(Number);setSelectedKey(date);setCursor({year:y,month:m-1});setTitle('');setSelectedParticipants([]);setShowCreate(false)};

 return <PageShell title="Agenda" kicker="Organize seu dia" actions={<button onClick={openCreate} className="octa-primary-button"><Plus size={15}/> Agendar reunião</button>}><div className="relative grid h-full grid-cols-[.72fr_1.28fr] gap-4">
  <section className="octa-panel agenda-calendar-card p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{monthLabel}</h2><div className="flex gap-2"><button onClick={()=>moveMonth(-1)} className="octa-icon-button" aria-label="Mês anterior"><ChevronLeft size={17}/></button><button onClick={()=>moveMonth(1)} className="octa-icon-button" aria-label="Próximo mês"><ChevronRight size={17}/></button></div></div><div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs text-white/45">{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(day=><span key={day}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-2">{grid.map(cell=><button onClick={()=>selectCell(cell)} key={cell.key} className={`agenda-day aspect-square rounded-xl text-sm ${cell.key===selectedKey?'is-selected':''} ${cell.currentMonth?'':'is-outside'}`} aria-pressed={cell.key===selectedKey}>{cell.day}</button>)}</div><div className="agenda-summary mt-5 rounded-[20px] p-4"><div className="text-xs text-white/55">{capitalize(dayLabel)}</div><div className="mt-1 text-xl font-medium">{totalMeetings} {totalMeetings===1?'reunião':'reuniões'}</div><div className="mt-3 flex items-center gap-2 text-xs text-white/65"><Clock3 size={14}/>{totalMeetings?`${totalMeetings} compromisso${totalMeetings===1?'':'s'} neste dia`:'Dia livre para agendar'}</div></div></section>
  <section className="octa-panel agenda-calendar-card overflow-hidden p-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">{capitalize(dayLabel)}</h2><p className="text-sm text-white/45">Sua agenda selecionada</p></div><CalendarDays className="text-white/65"/></div><div className="mt-5 grid gap-3">{createdForDay.map(meeting=><article key={meeting.id} className="agenda-black-card grid grid-cols-[74px_1fr_auto] items-center gap-4 rounded-[20px] p-4"><div className="text-sm font-medium">{meeting.time}</div><div><h3 className="font-semibold">{meeting.title}</h3><div className="mt-1 flex items-center gap-2 text-xs text-white/50"><AgendaAvatars ids={meeting.participantIds}/><span>{new Date(`${meeting.date}T12:00:00`).toLocaleDateString('pt-BR')} • {meeting.participantIds.length} participantes</span></div></div><Link href="/room/strategy-room" className="octa-secondary-button">Entrar</Link></article>)}{demoForDay.map(meeting=><article key={meeting.id} className="agenda-black-card grid grid-cols-[74px_1fr_auto] items-center gap-4 rounded-[20px] p-4"><div className="text-sm font-medium">{new Date(meeting.scheduledAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</div><div><h3 className="font-semibold">{meeting.title}</h3><div className="mt-1 flex items-center gap-3 text-xs text-white/50"><AgendaAvatars ids={meeting.participantIds}/><span>{meeting.durationLabel}</span><span className="flex items-center gap-1"><UsersRound size={13}/>{meeting.participantIds.length} pessoas</span></div></div><Link href={`/room/${meeting.slug}`} className="octa-secondary-button">Entrar</Link></article>)}{!totalMeetings&&<div className="agenda-empty-state"><CalendarDays size={22}/><b>Nenhuma reunião neste dia</b><span>Selecione “Agendar reunião” para criar um compromisso em {selectedDate.toLocaleDateString('pt-BR')}.</span><button onClick={openCreate} className="octa-secondary-button">Agendar neste dia</button></div>}</div></section>
  {showCreate&&<div className="absolute inset-0 z-20 grid place-items-center rounded-[28px] bg-black/55 p-5 backdrop-blur-sm"><div className="w-full max-w-[520px] rounded-[30px] border border-white/10 bg-[#090a0b] p-6 text-white shadow-2xl"><div className="flex items-center justify-between"><div><p className="octa-kicker">Nova reunião</p><h2 className="mt-1 text-2xl font-semibold">Agendar</h2></div><button onClick={()=>setShowCreate(false)} className="octa-icon-button" aria-label="Fechar"><X size={17}/></button></div><label className="mt-5 block text-xs font-medium text-white/55">Assunto<input value={title} onChange={e=>setTitle(e.target.value)} className="octa-input mt-2 w-full" placeholder="Ex.: Branding"/></label><div className="mt-4 grid grid-cols-2 gap-3"><label className="block text-xs font-medium text-white/55">Data<input value={date} onChange={e=>setDate(e.target.value)} type="date" className="octa-input mt-2 w-full"/></label><label className="block text-xs font-medium text-white/55">Horário<input value={time} onChange={e=>setTime(e.target.value)} type="time" className="octa-input mt-2 w-full"/></label></div><div className="mt-5"><div className="flex items-center justify-between"><span className="text-xs font-medium text-white/55">Adicionar participantes</span><span className="text-[10px] text-white/40">{selectedParticipants.length} selecionados</span></div><div className="mt-3 flex flex-wrap gap-3">{invitees.map(person=>{const active=selectedParticipants.includes(person.id);return <button type="button" key={person.id} onClick={()=>toggleParticipant(person.id)} className={`group relative flex w-[64px] flex-col items-center gap-1.5 rounded-2xl p-2 transition ${active?'bg-white/12 ring-1 ring-white/25':'hover:bg-white/6'}`}><span className="relative size-10 overflow-hidden rounded-full bg-white/10">{person.avatarUrl&&<Image src={person.avatarUrl} alt={person.displayName} fill className="object-cover"/>}{active&&<span className="absolute bottom-0 right-0 grid size-4 place-items-center rounded-full bg-white text-black"><Check size={10}/></span>}</span><span className="w-full truncate text-[9px] text-white/60">{person.displayName.split(' ')[0]}</span></button>})}</div></div><button onClick={save} disabled={!title.trim()} className="octa-primary-button mt-5 w-full disabled:opacity-40">Salvar reunião</button></div></div>}
 </div></PageShell>
}
export default function AgendaPage(){return <Suspense fallback={null}><AgendaContent/></Suspense>}
