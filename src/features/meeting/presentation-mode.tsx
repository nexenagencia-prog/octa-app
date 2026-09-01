'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, FileImage, MonitorUp, Upload, X } from 'lucide-react';
import { loadPresentationFiles, type PresentationSlide } from './presentation-model';

type PresentationParticipant = { id: string; displayName: string; avatarUrl?: string | null };

type Props = {
  open: boolean;
  onClose: () => void;
  participants: PresentationParticipant[];
  initialSlides?: PresentationSlide[];
};

export function PresentationMode({ open, onClose, participants, initialSlides = [] }: Props) {
  const [slides, setSlides] = useState<PresentationSlide[]>(initialSlides);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [liveId, setLiveId] = useState<string | null>(null);
  const [participantsVisible, setParticipantsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setSlides(initialSlides), [initialSlides]);
  const preview = useMemo(() => slides.find((slide) => slide.id === previewId) ?? null, [slides, previewId]);
  const live = useMemo(() => slides.find((slide) => slide.id === liveId) ?? null, [slides, liveId]);
  const liveIndex = live ? slides.findIndex((slide) => slide.id === live.id) : -1;

  const moveLive = (direction: -1 | 1) => {
    if (liveIndex < 0) return;
    const next = Math.min(slides.length - 1, Math.max(0, liveIndex + direction));
    setLiveId(slides[next]?.id ?? null);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && previewId && !liveId) setPreviewId(null);
      if (liveId && event.key === 'ArrowLeft') moveLive(-1);
      if (liveId && event.key === 'ArrowRight') moveLive(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, previewId, liveId, liveIndex, slides.length]);

  if (!open) return null;

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setLoading(true);
    setError('');
    try {
      const loaded = await loadPresentationFiles(files);
      setSlides((current) => [...current, ...loaded]);
      if (!previewId && loaded[0]) setPreviewId(loaded[0].id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível abrir esses arquivos');
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (live) {
    return <div className="fixed inset-0 z-[120] flex bg-[#050505] text-white">
      <section className="relative flex min-w-0 flex-1 items-center justify-center bg-black p-4 md:p-8">
        <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-emerald-200"><span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_14px_#6effb0]"/> AO VIVO</div>
        <img src={live.src} alt={live.name} className="max-h-[calc(100vh-112px)] max-w-full rounded-[24px] object-contain shadow-[0_30px_100px_rgba(0,0,0,.55)]" />
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/75 p-2 backdrop-blur-2xl">
          <button aria-label="Slide anterior" onClick={() => moveLive(-1)} disabled={liveIndex <= 0} className="grid size-10 place-items-center rounded-full bg-white/[.07] disabled:opacity-25"><ArrowLeft size={17}/></button>
          <span className="min-w-[72px] text-center text-xs text-white/70">{liveIndex + 1} / {slides.length}</span>
          <button aria-label="Próximo slide" onClick={() => moveLive(1)} disabled={liveIndex >= slides.length - 1} className="grid size-10 place-items-center rounded-full bg-white/[.07] disabled:opacity-25"><ArrowRight size={17}/></button>
          <button aria-label={participantsVisible ? 'Ocultar participantes' : 'Mostrar participantes'} onClick={() => setParticipantsVisible((value) => !value)} className="ml-2 flex h-10 items-center gap-2 rounded-full bg-white/[.07] px-4 text-xs">{participantsVisible ? <EyeOff size={15}/> : <Eye size={15}/>} {participantsVisible ? 'Ocultar participantes' : 'Mostrar participantes'}</button>
          <button onClick={() => { setLiveId(null); setPreviewId(null); }} className="h-10 rounded-full bg-white px-4 text-xs font-semibold text-black">Parar apresentação</button>
        </div>
      </section>
      {participantsVisible && <aside className="hidden w-[220px] shrink-0 border-l border-white/[.08] bg-[#090909] p-3 lg:block"><div className="px-2 py-3 text-[10px] uppercase tracking-[.16em] text-white/35">Participantes</div><div className="space-y-2">{participants.map((participant) => <div key={participant.id} className="flex items-center gap-3 rounded-2xl border border-white/[.06] bg-white/[.035] p-2">{participant.avatarUrl ? <img src={participant.avatarUrl} alt="" className="size-10 rounded-xl object-cover"/> : <div className="grid size-10 place-items-center rounded-xl bg-white/10 text-xs font-semibold">{participant.displayName.slice(0,1)}</div>}<div className="min-w-0 truncate text-xs font-medium">{participant.displayName}</div></div>)}</div></aside>}
    </div>;
  }

  return <div className="fixed inset-0 z-[115] bg-black/45 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !preview) onClose(); }}>
    {preview && <section className="absolute bottom-4 left-4 right-[390px] top-4 hidden items-center justify-center rounded-[30px] border border-white/10 bg-[#080808] p-6 shadow-2xl lg:flex">
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-2 text-[10px] uppercase tracking-[.14em] text-white/60"><Eye size={13}/> Só você está vendo</div>
      <button aria-label="Fechar prévia" onClick={() => setPreviewId(null)} className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/[.07] text-white/70"><X size={16}/></button>
      <img src={preview.src} alt={preview.name} className="max-h-[calc(100vh-150px)] max-w-full rounded-[20px] object-contain"/>
      <button onClick={() => setLiveId(preview.id)} className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-black shadow-xl"><MonitorUp size={15}/> Apresentar este slide</button>
    </section>}
    <aside className="absolute bottom-0 right-0 top-0 flex w-full max-w-[370px] flex-col border-l border-white/10 bg-[#080808] text-white shadow-2xl">
      <header className="flex items-center justify-between border-b border-white/[.07] px-5 py-4"><div><div className="text-[10px] uppercase tracking-[.17em] text-white/35">Apresentação</div><h2 className="mt-1 text-base font-semibold">Slides da reunião</h2></div><button aria-label="Fechar apresentação" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-white/[.06] text-white/60"><X size={16}/></button></header>
      <div className="p-4"><button onClick={() => fileRef.current?.click()} className="flex w-full items-center justify-between rounded-[22px] border border-dashed border-white/15 bg-white/[.035] p-4 text-left transition hover:bg-white/[.06]"><span><span className="block text-sm font-semibold">Adicionar PDF ou imagens</span><span className="mt-1 block text-[11px] text-white/40">PDF, JPEG e PNG · múltiplos arquivos</span></span>{loading ? <span className="text-[10px] text-white/50">carregando...</span> : <Upload size={18} className="text-white/50"/>}</button><input ref={fileRef} type="file" multiple accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={(event) => onFiles(event.target.files)}/>{error && <p className="mt-2 rounded-xl bg-rose-500/10 px-3 py-2 text-[11px] text-rose-200">{error}</p>}</div>
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 pb-6">{slides.length === 0 ? <div className="mt-8 grid place-items-center rounded-[24px] border border-white/[.06] bg-white/[.025] p-8 text-center"><FileImage size={24} className="text-white/25"/><p className="mt-3 text-xs text-white/45">Seus slides aparecem aqui antes de qualquer coisa ser compartilhada.</p></div> : slides.map((slide, index) => <button key={slide.id} aria-label={`${slide.name} · abrir prévia`} onClick={() => setPreviewId(slide.id)} className={`group w-full rounded-[20px] border p-2 text-left transition ${previewId === slide.id ? 'border-white/30 bg-white/[.08]' : 'border-white/[.07] bg-white/[.03] hover:bg-white/[.055]'}`}><div className="relative aspect-video overflow-hidden rounded-[14px] bg-black"><img src={slide.src} alt="" className="h-full w-full object-contain"/><span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[9px]">{index + 1}</span></div><div className="mt-2 truncate px-1 text-[11px] font-medium text-white/70">{slide.name}</div></button>)}</div>
    </aside>
  </div>;
}
