'use client';
import { Sparkles, X } from 'lucide-react';
import { videoFilterPresets } from '@/lib/video-filters';

export function VideoFilterPanel({selected,intensity,onSelect,onIntensity,onClose}:{selected:string;intensity:number;onSelect:(id:string)=>void;onIntensity:(value:number)=>void;onClose:()=>void}){
  return <div className="video-filter-panel" role="dialog" aria-label="Filtros de vídeo">
    <div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.12em] text-white/45">Filtros de vídeo</p><h3 className="mt-1 text-sm font-semibold text-white">Pele inteligente + estilo</h3></div><button onClick={onClose} aria-label="Fechar filtros" className="grid size-8 place-items-center rounded-full bg-white/10 text-white/70"><X size={15}/></button></div>
    <div className="mt-4 rounded-[16px] border border-cyan-300/12 bg-cyan-300/[.045] p-3 text-[10px] leading-4 text-white/48"><span className="mr-2 inline-flex align-middle text-cyan-300"><Sparkles size={13}/></span>Os filtros de pele analisam os pixels da pele em tempo real para suavizar e equilibrar a imagem sem aplicar o efeito no fundo inteiro.</div>
    <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">{videoFilterPresets.map(p=><button key={p.id} onClick={()=>onSelect(p.id)} className={`filter-preset ${selected===p.id?'is-active':''}`}><span className={`filter-preview filter-${p.id}`}/><span>{p.name}</span>{p.smart&&<small className="block text-[8px] text-cyan-300/70">inteligente</small>}</button>)}</div>
    <label className="mt-4 block text-[11px] text-white/55">Intensidade <span className="float-right text-white/80">{intensity}%</span><input className="mt-2 w-full accent-cyan-400" type="range" min="0" max="100" value={intensity} onChange={e=>onIntensity(Number(e.target.value))}/></label>
  </div>;
}
