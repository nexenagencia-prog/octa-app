'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FileText, Play, Search, Share2, Sparkles, Star } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { demoMeetings } from '@/lib/demo/data';
import './recordings-netflix.css';

const source=demoMeetings.filter(m=>m.status==='ended');
export default function GravacoesPage(){
  const[q,setQ]=useState('');const[selectedId,setSelectedId]=useState(source[0]?.id??'');
  const recordings=useMemo(()=>source.filter(m=>`${m.title} ${m.durationLabel}`.toLowerCase().includes(q.toLowerCase())),[q]);
  const selected=recordings.find(item=>item.id===selectedId)??recordings[0];
  return <PageShell title="Gravações" kicker="Replay inteligente" actions={<label className="octa-search !flex !min-w-[260px]"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar gravação"/></label>}>
    <section className="recordings-cinema">
      {selected?<div className="recordings-feature"><div className="recordings-feature-media">{selected.thumbnailUrl&&<Image src={selected.thumbnailUrl} alt={selected.title} fill priority className="object-cover"/>}<div className="recordings-feature-shade"/></div><div className="recordings-feature-copy"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-white/45">Gravação em destaque</p><h2>{selected.title}</h2><p>{selected.durationLabel} · Replay disponível · OCTA</p><div className="recordings-performance" aria-label="Maior performance, cinco estrelas"><span className="recordings-stars" aria-hidden="true">{Array.from({ length: 5 }).map((_,index)=><Star key={index} size={13} fill="currentColor" strokeWidth={1.4}/>)}</span><span className="recordings-performance-label">Maior performance</span></div><div className="mt-5 flex flex-wrap gap-3"><Link href="/library" className="recording-play-button"><Play size={15} fill="currentColor"/> Assistir</Link><Link href="/skills" className="recording-ghost-button"><Sparkles size={14}/> Analisar com Skills</Link><Link href="/chat" className="recording-ghost-button"><FileText size={14}/> Resumir com OCTA AI</Link><button type="button" onClick={()=>navigator.clipboard?.writeText(`${window.location.origin}/gravacoes`)} className="recording-ghost-button"><Share2 size={14}/> Compartilhar</button></div></div></div>:<div className="octa-panel grid h-56 place-items-center text-center text-sm text-black/45">Nenhuma gravação encontrada.</div>}
      <div className="recordings-shelf"><div className="flex items-end justify-between"><div><h3>Suas gravações</h3><p className="mt-1 text-xs">{recordings.length} {recordings.length===1?'gravação disponível':'gravações disponíveis'}</p></div></div><div className="recordings-strip no-scrollbar">{recordings.map(item=><button key={item.id} onClick={()=>setSelectedId(item.id)} className={`recording-thumb ${selected?.id===item.id?'is-active':''}`}><span className="recording-thumb-media">{item.thumbnailUrl&&<Image src={item.thumbnailUrl} alt="" fill className="object-cover"/>}<span className="recording-thumb-play"><Play size={13} fill="currentColor"/></span></span><strong>{item.title}</strong><small>{item.durationLabel}</small></button>)}</div></div>
    </section>
  </PageShell>;
}
