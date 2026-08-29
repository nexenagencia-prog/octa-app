'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Play, Search } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { demoMeetings } from '@/lib/demo/data';

const source=demoMeetings.filter(m=>m.status==='ended');
export default function GravacoesPage(){
  const[q,setQ]=useState('');const[selectedId,setSelectedId]=useState(source[0]?.id??'');
  const recordings=useMemo(()=>[...source,...source,...source].map((m,i)=>({...m,virtualId:`${m.id}-${i}`})).filter(m=>m.title.toLowerCase().includes(q.toLowerCase())).slice(0,5),[q]);
  const selected=recordings.find(item=>item.virtualId===selectedId)??recordings[0];
  return <PageShell title="Gravações" kicker="Replay inteligente" actions={<label className="octa-search !flex !min-w-[260px]"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar gravação"/></label>}>
    <section className="recordings-cinema">
      {selected&&<div className="recordings-feature"><div className="recordings-feature-media">{selected.thumbnailUrl&&<Image src={selected.thumbnailUrl} alt={selected.title} fill priority className="object-cover"/>}<div className="recordings-feature-shade"/></div><div className="recordings-feature-copy"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-white/45">Gravação em destaque</p><h2>{selected.title}</h2><p>{selected.durationLabel} · Replay disponível · OCTA</p><div className="mt-5 flex gap-3"><Link href="/library" className="recording-play-button"><Play size={15} fill="currentColor"/> Assistir</Link><Link href="/skills" className="recording-ghost-button">Analisar com OCTA SKILLS</Link></div></div></div>}
      <div className="recordings-shelf"><h3>Suas gravações</h3><div className="recordings-strip no-scrollbar">{recordings.map(item=><button key={item.virtualId} onClick={()=>setSelectedId(item.virtualId)} className={`recording-thumb ${selected?.virtualId===item.virtualId?'is-active':''}`}><span className="recording-thumb-media">{item.thumbnailUrl&&<Image src={item.thumbnailUrl} alt="" fill className="object-cover"/>}<span className="recording-thumb-play"><Play size={13} fill="currentColor"/></span></span><strong>{item.title}</strong><small>{item.durationLabel}</small></button>)}</div></div>
    </section>
  </PageShell>;
}
