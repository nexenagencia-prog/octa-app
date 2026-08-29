'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CircleDot, Plus, Search, Video } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { demoMeetings } from '@/lib/demo/data';

function ReunioesContent(){const search=useSearchParams();const q=(search.get('q')??'').toLowerCase();const list=demoMeetings.filter(m=>m.title.toLowerCase().includes(q));return <PageShell title="Reuniões" kicker="Salas e encontros" actions={<Link href="/room/strategy-room" className="octa-primary-button"><Plus size={15}/> Nova reunião</Link>}>
  <div className="grid h-full grid-rows-[auto_1fr] gap-4"><section className="octa-panel flex items-center justify-between p-4"><div className="flex items-center gap-2 text-sm text-[#64798b]"><Search size={16}/>{q?<>Resultados para <b className="text-[#17314a]">“{search.get('q')}”</b></>:<>Todas as suas reuniões</>}</div><span className="text-xs text-[#6c8091]">{list.length} encontradas</span></section><section className="grid min-h-0 grid-cols-3 gap-4">{list.slice(0,5).map((m,i)=><article key={m.id} className={`octa-panel flex min-h-0 flex-col p-5 ${!q&&i===0?'col-span-2 row-span-2':''}`}><div className="flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-xs ${m.status==='live'?'bg-emerald-100 text-emerald-700':'bg-[#edf3f6] text-[#5a7183]'}`}>{m.status==='live'?'Ao vivo':'Agendada'}</span><CircleDot size={18}/></div><div className="mt-auto"><Video size={!q&&i===0?48:28} className="mb-4 text-[#0b7285]"/><h2 className={`${!q&&i===0?'text-3xl':'text-xl'} font-semibold tracking-[-.03em]`}>{m.title}</h2><p className="mt-2 text-sm text-[#667b8e]">{m.durationLabel} · {m.participantIds.length} participantes</p><div className="mt-5"><Link href={`/room/${m.slug}`} className="octa-primary-button">Entrar na sala</Link></div></div></article>)}</section></div>
</PageShell>}

export default function ReunioesPage(){
  return <Suspense fallback={null}><ReunioesContent/></Suspense>;
}
