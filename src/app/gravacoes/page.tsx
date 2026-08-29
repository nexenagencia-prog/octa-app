'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Play, Search } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { demoMeetings } from '@/lib/demo/data';
const source=demoMeetings.filter(m=>m.status==='ended');
export default function GravacoesPage(){const [q,setQ]=useState('');const recordings=[...source,...source].filter(m=>m.title.toLowerCase().includes(q.toLowerCase())).slice(0,3);return <PageShell title="Gravações" kicker="Replay inteligente" actions={<label className="octa-search !flex !min-w-[260px]"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar gravação"/></label>}>
  <div className="grid h-full grid-rows-[auto_1fr] gap-4"><section className="octa-panel flex items-center justify-between p-5"><div><p className="text-sm text-[#6a7e90]">Continue assistindo</p><h2 className="mt-1 text-2xl font-semibold">Planejamento de Marketing</h2></div><Link href="/library" className="octa-primary-button"><Play size={15} fill="currentColor"/> Abrir replay</Link></section><section className="grid min-h-0 grid-cols-3 gap-4">{recordings.map((m,i)=><article key={`${m.id}-${i}`} className="octa-panel overflow-hidden"><div className="relative h-[62%] bg-[#062b3c]">{m.thumbnailUrl&&<Image src={m.thumbnailUrl} alt={m.title} fill className="object-cover"/>}<div className="absolute inset-0 bg-black/15"/><Link href="/library" className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-white/85 text-[#08273a]" aria-label={`Abrir ${m.title}`}><Play size={16} fill="currentColor"/></Link></div><div className="p-4"><h3 className="font-semibold">{m.title}</h3><p className="mt-1 text-xs text-[#6a7e90]">{m.durationLabel} · Replay disponível</p></div></article>)}</section></div>
</PageShell>}
