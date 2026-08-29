'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MessageCircle, Search, Video } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { demoParticipants } from '@/lib/demo/data';

export default function ContatosPage(){const[query,setQuery]=useState('');const list=demoParticipants.filter(p=>`${p.displayName} ${p.headline??''}`.toLowerCase().includes(query.toLowerCase()));return <PageShell title="Contatos" kicker="Sua rede" actions={<label className="octa-search !flex !min-w-[260px]"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar contato"/></label>}><div className="grid h-full content-start grid-cols-4 gap-3 overflow-y-auto pr-1 no-scrollbar">{list.map(p=><article key={p.id} className="octa-panel octa-contact-card flex min-h-0 items-center gap-3 p-3"><div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#dce6eb]">{p.avatarUrl&&<Image src={p.avatarUrl} alt={p.displayName} fill className="object-cover"/>}</div><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold">{p.displayName}</h2><p className="truncate text-[11px] text-[#697f91]">{p.headline}</p><div className="mt-2 flex gap-1.5"><Link href="/room/strategy-room" className="octa-mini-button !px-2 !py-1.5"><Video size={12}/> Reunião</Link><Link href={`/chat?person=${p.id}`} className="octa-mini-button !px-2 !py-1.5" aria-label={`Conversar com ${p.displayName}`}><MessageCircle size={12}/></Link></div></div></article>)}</div></PageShell>}
