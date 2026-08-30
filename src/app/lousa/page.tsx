'use client';
import { Brush, ScreenShare } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { WhiteboardPanel } from '@/features/whiteboard/whiteboard-panel';

export default function LousaPage(){
  return <PageShell title="Lousa" kicker="Desenhe, organize e compartilhe visualmente" actions={<span className="flex items-center gap-2 text-xs text-[#557084]"><Brush size={15}/> Formas, desenho e <ScreenShare size={14}/> compartilhamento</span>}>
    <div className="relative h-[calc(100vh-150px)] min-h-[650px] overflow-hidden rounded-[30px]"><WhiteboardPanel mode="page"/></div>
  </PageShell>;
}
