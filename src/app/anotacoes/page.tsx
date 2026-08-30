'use client';
import { PageShell } from '@/components/page-shell';
import { WhiteboardPanel } from '@/features/whiteboard/whiteboard-panel';
import { Sparkles } from 'lucide-react';

export default function AnotacoesPage(){
  return <PageShell title="Lousa" kicker="Anotar visualmente" actions={<span className="flex items-center gap-2 text-xs text-[#557084]"><Sparkles size={15}/> Desenho livre e formas</span>}>
    <div className="relative h-full min-h-[560px] overflow-hidden rounded-[30px]"><WhiteboardPanel mode="page"/></div>
  </PageShell>;
}
