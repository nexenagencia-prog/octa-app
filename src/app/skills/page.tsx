'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, BrainCircuit, Check, ChevronRight, Clock3, MessageSquareText, Play, Search, Sparkles, Target, TrendingUp } from 'lucide-react';
import { PageShell } from '@/components/page-shell';

type Tab='visao'|'transcricao'|'treino'|'evolucao';
const transcript=[
  {time:'14:32:18',speaker:'Você',text:'Precisamos entender primeiro qual resultado vocês querem alcançar.'},
  {time:'14:34:02',speaker:'Amanda',text:'Nosso problema hoje é principalmente aquisição.'},
  {time:'14:35:10',speaker:'Você',text:'Entendi. Quanto isso representa atualmente para vocês?'},
  {time:'14:41:08',speaker:'Amanda',text:'Se conseguirmos resolver isso antes de outubro seria perfeito.'},
  {time:'14:43:20',speaker:'Você',text:'Talvez a gente consiga ajustar alguma coisa.'},
];
const scoreRows=[['Comunicação',88],['Clareza',91],['Escuta',84],['Objetividade',76],['Perguntas',89],['Argumentação',81],['Condução',85]] as const;

export default function SkillsPage(){
  const [tab,setTab]=useState<Tab>('visao');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState<number|null>(null);
  const [training,setTraining]=useState(false);
  const filtered=useMemo(()=>transcript.filter(x=>`${x.speaker} ${x.text}`.toLowerCase().includes(query.toLowerCase())),[query]);
  return <PageShell title="OCTA SKILLS" kicker="Cada reunião vira aprendizado prático" actions={<div className="flex items-center gap-2"><span className="rounded-full bg-[#e8f3f5] px-3 py-2 text-[11px] font-semibold text-[#0b7285]">Análise privada</span><Link href="/reunioes" className="octa-mini-button">Ver reuniões <ChevronRight size={13}/></Link></div>}>
    <div className="skills-shell">
      <nav className="skills-tabs">{([['visao','Visão geral'],['transcricao','Transcrição'],['treino','Treino'],['evolucao','Evolução']] as [Tab,string][]).map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={tab===id?'is-active':''}>{label}</button>)}</nav>
      <div className="skills-body no-scrollbar">
        {tab==='visao'&&<Overview/>}
        {tab==='transcricao'&&<section className="grid h-full min-h-0 grid-cols-[1fr_360px] gap-4">
          <div className="octa-panel min-h-0 overflow-hidden p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#0b7285]">Transcrição inteligente</p><h2 className="mt-1 text-xl font-semibold text-[#17314a]">Planejamento de Marketing</h2></div><label className="octa-search !flex !min-w-[260px]"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar nesta reunião..."/></label></div><div className="no-scrollbar mt-4 h-[calc(100%-62px)] overflow-y-auto pr-1">{filtered.map((row,i)=><button key={`${row.time}-${i}`} onClick={()=>setSelected(transcript.indexOf(row))} className={`skills-transcript-row ${selected===transcript.indexOf(row)?'is-active':''}`}><span>{row.time}</span><strong>{row.speaker}</strong><p>{row.text}</p></button>)}</div></div>
          <aside className="octa-panel min-h-0 p-5">{selected!==null?<div className="flex h-full flex-col"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#0b7285]">Como eu poderia ter dito?</p><h3 className="mt-4 text-sm font-semibold text-[#17314a]">Você disse</h3><p className="mt-2 rounded-2xl bg-white/60 p-4 text-sm leading-6 text-[#425d70]">“{transcript[selected].text}”</p><h3 className="mt-5 text-sm font-semibold text-[#17314a]">OCTA sugere</h3><p className="mt-2 rounded-2xl bg-[#e8f3f5] p-4 text-sm leading-6 text-[#174154]">“Antes de avançarmos, quero entender exatamente o impacto desse ponto e o que precisa acontecer para resolvermos isso.”</p><p className="mt-4 text-xs leading-5 text-[#708493]">Mais específica, conecta a pergunta ao contexto e reduz linguagem insegura.</p><button className="mt-auto octa-primary-button justify-center"><Play size={13}/> Ver momento</button></div>:<div className="grid h-full place-items-center text-center text-sm text-[#8293a0]"><div><MessageSquareText className="mx-auto mb-3"/><p>Selecione uma fala para receber uma reformulação contextual.</p></div></div>}</aside>
        </section>}
        {tab==='treino'&&<section className="grid h-full min-h-0 grid-cols-[.9fr_1.1fr] gap-4"><div className="octa-panel p-6"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#0b7285]">Oportunidade perdida · 41:08</p><h2 className="mt-3 text-2xl font-semibold tracking-[-.03em] text-[#17314a]">Treinar este momento</h2><p className="mt-4 text-sm leading-6 text-[#647b8d]">Amanda disse: “O investimento ficou acima do que imaginávamos.”</p><div className="mt-5 rounded-2xl bg-white/60 p-4"><p className="text-[11px] font-semibold text-[#17314a]">OCTA SKILLS assume o papel de Amanda.</p><p className="mt-2 text-xs leading-5 text-[#718697]">Responda novamente e compare a nova abordagem com o momento original.</p></div><button onClick={()=>setTraining(true)} className="mt-5 octa-primary-button"><BrainCircuit size={14}/> Iniciar simulação</button></div><div className="octa-panel p-6">{training?<div className="flex h-full flex-col"><div className="rounded-2xl bg-[#0b2238] p-4 text-sm leading-6 text-white">Amanda: O investimento ficou acima do que imaginávamos.</div><div className="mt-3 ml-auto max-w-[80%] rounded-2xl bg-[#e6f2f4] p-4 text-sm leading-6 text-[#17314a]">Quando você diz acima, está comparando com o orçamento disponível ou com o retorno esperado?</div><div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><Check size={16}/> Melhor.</div><p className="mt-2 text-xs leading-5 text-emerald-700/80">Você investigou a origem da objeção antes de defender o preço.</p></div><button onClick={()=>setTraining(false)} className="mt-auto octa-secondary-button justify-center">Tentar novamente</button></div>:<div className="grid h-full place-items-center text-center text-sm text-[#8293a0]"><div><BrainCircuit className="mx-auto mb-3"/><p>A simulação aparecerá aqui.</p></div></div>}</div></section>}
        {tab==='evolucao'&&<Evolution/>}
      </div>
    </div>
  </PageShell>;
}

function Overview(){return <div className="skills-reference-overview">
  <section className="skills-reference-portrait">
    <div className="skills-reference-portrait-copy"><h2>Visão geral</h2><p>82/100</p></div>
  </section>
  <section className="skills-reference-summary">
    <div className="skills-reference-summary-top">
      <article><span>Variação</span><strong>+6,4%</strong><small>vs. semana anterior</small></article>
      <article><span>Reuniões analisadas</span><strong>8</strong><small>6 com alta evidência</small></article>
    </div>
    <p className="skills-reference-summary-copy">Você manteve consistência em clareza e perguntas. O maior ganho desta semana veio de objetividade nas respostas.</p>
  </section>
  <section className="skills-reference-card skills-reference-goal">
    <h3>Meta de evolução</h3><p>Chegar a 90 de performance</p><strong>82 / 90</strong>
    <div className="skills-reference-progress"><i/></div><div className="skills-reference-card-foot"><span>91% da meta</span><span>+8 pontos restantes</span></div>
  </section>
  <section className="skills-reference-card skills-reference-recent">
    <h3>Últimas reuniões</h3>
    <div className="skills-reference-meeting"><span>Planejamento de Marketing</span><strong>88</strong></div>
    <div className="skills-reference-meeting"><span>Reunião Semanal da Diretoria</span><strong>84</strong></div>
    <div className="skills-reference-meeting"><span>Laboratório de Marca</span><strong>79</strong></div>
  </section>
  <section className="skills-reference-card skills-reference-insight">
    <h3>Pontos fortes</h3><p>Você investigou antes de oferecer e confirmou entendimento antes de avançar.</p><button>Ver evidências <ArrowRight size={16}/></button>
  </section>
  <section className="skills-reference-card skills-reference-insight">
    <h3>Oportunidades</h3><p>A resposta à objeção de preço demorou para chegar ao ponto central.</p><button>Rever momento <ArrowRight size={16}/></button>
  </section>
</div>}
function InsightCard({icon,title,text,action}:{icon:React.ReactNode;title:string;text:string;action:string}){return <article className="octa-panel flex min-h-[176px] flex-col p-5"><div className="grid size-9 place-items-center rounded-xl bg-[#e9f3f5] text-[#0b7285]">{icon}</div><h3 className="mt-3 font-semibold text-[#17314a]">{title}</h3><p className="mt-2 text-xs leading-5 text-[#6f8494]">{text}</p><button className="mt-auto flex items-center gap-2 pt-4 text-[11px] font-semibold text-[#0b7285]">{action}<ArrowRight size={12}/></button></article>}
function Evolution(){const rows=[['Clareza','72 → 84','↑'],['Objetividade','68 → 81','↑'],['Perguntas de diagnóstico','61 → 79','↑'],['Interrupções','9 → 4','↓'],['Expressões de insegurança','18 → 7','↓']];return <section className="grid h-full min-h-0 grid-cols-[1fr_360px] gap-4"><div className="octa-panel p-6"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[#e8f3f5] text-[#0b7285]"><BarChart3/></span><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#0b7285]">Sua evolução</p><h2 className="text-2xl font-semibold text-[#17314a]">Últimas 10 reuniões</h2></div></div><div className="mt-6 space-y-3">{rows.map(([label,value,trend])=><div key={label} className="flex items-center justify-between rounded-2xl bg-white/55 px-4 py-3"><span className="text-sm text-[#38566b]">{label}</span><strong className="text-sm text-[#17314a]">{value} <span className="text-[#0b8a72]">{trend}</span></strong></div>)}</div></div><aside className="skills-focus-card"><Sparkles size={20}/><p className="mt-4 text-[10px] uppercase tracking-[.16em] text-white/55">Foco para hoje</p><h3 className="mt-2 text-xl font-semibold">Antes da próxima reunião</h3><ol className="mt-5 space-y-4 text-sm leading-6 text-white/78"><li>1. Faça mais perguntas antes de apresentar solução.</li><li>2. Entenda a origem da objeção antes de responder.</li><li>3. Termine com um próximo passo concreto.</li></ol></aside></section>}
