'use client';
import { Brush,ScreenShare } from 'lucide-react';import { PageShell } from '@/components/page-shell';import { WhiteboardPanel } from '@/features/whiteboard/whiteboard-panel';
export default function LousaPage(){return <PageShell title="Lousa" kicker="Texto, formas, desenho e colaboração" actions={<span className="flex items-center gap-2 text-xs text-black/55"><Brush size={15}/> Texto até 72px · <ScreenShare size={14}/> compartilhar</span>}><div className="whiteboard-page-frame relative h-full min-h-0 rounded-[30px]"><WhiteboardPanel mode="page"/></div></PageShell>}
