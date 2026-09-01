'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, FileText, ListChecks, Search, Send, Sparkles, Target, WandSparkles } from 'lucide-react';
import { PageShell } from '@/components/page-shell';

type Message={id:number;author:'OCTA AI'|'Você';body:string};
const prompts=[
  {icon:FileText,title:'Resumir última reunião',body:'Resuma a última reunião em decisões, riscos e próximos passos.'},
  {icon:ListChecks,title:'Criar follow-up',body:'Crie um follow-up objetivo da última reunião com responsáveis e prazos.'},
  {icon:Target,title:'Preparar próxima reunião',body:'Prepare um briefing da minha próxima reunião com contexto, objetivos e perguntas-chave.'},
  {icon:Search,title:'Encontrar uma decisão',body:'Ajude a localizar uma decisão tomada nas minhas reuniões recentes.'},
];

export default function Page(){
  const[input,setInput]=useState('');
  const[messages,setMessages]=useState<Message[]>([{id:1,author:'OCTA AI',body:'Posso transformar suas reuniões em decisões, próximos passos e preparação para a próxima conversa. O que você quer encontrar ou criar?'}]);
  const send=(preset?:string)=>{const body=(preset??input).trim();if(!body)return;setMessages(m=>[...m,{id:Date.now(),author:'Você',body},{id:Date.now()+1,author:'OCTA AI',body:'Entendi. Vou usar o contexto das suas reuniões disponíveis na OCTA para organizar isso. Quando a integração de dados estiver ativa, esta resposta será gerada a partir das suas gravações e transcrições reais.'}]);setInput('')};
  return <PageShell title="OCTA AI" kicker="Inteligência para cada reunião" actions={<Link href="/gravacoes" className="octa-secondary-button">Ver gravações <ArrowRight size={14}/></Link>}>
    <div className="grid h-full min-h-0 grid-cols-[360px_1fr] gap-4">
      <aside className="octa-panel min-h-0 overflow-y-auto p-5 no-scrollbar">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-black text-white"><Sparkles size={19}/></span><div><h2 className="font-semibold text-[#171717]">Ações inteligentes</h2><p className="text-xs text-black/45">Comece por uma tarefa frequente.</p></div></div>
        <div className="mt-5 grid gap-2">{prompts.map(({icon:Icon,title,body})=><button key={title} onClick={()=>send(body)} className="group flex items-center gap-3 rounded-2xl border border-black/8 bg-black/[.025] p-3 text-left transition hover:bg-black hover:text-white"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-black/5 group-hover:bg-white/10"><Icon size={16}/></span><span className="min-w-0 flex-1"><b className="block text-sm font-medium">{title}</b><small className="mt-0.5 block text-[11px] opacity-55">Usar contexto das suas reuniões</small></span><ArrowRight size={14} className="opacity-35"/></button>)}</div>
        <div className="mt-5 rounded-2xl bg-black p-4 text-white"><WandSparkles size={17}/><b className="mt-3 block text-sm">OCTA AI trabalha junto com Skills</b><p className="mt-1 text-xs leading-5 text-white/55">Use análise, transcrição e evolução para transformar conversa em ação.</p><Link href="/skills" className="mt-3 inline-flex items-center gap-1 text-xs text-white">Abrir Skills <ArrowRight size={12}/></Link></div>
      </aside>
      <section className="octa-panel flex min-h-0 flex-col overflow-hidden p-5">
        <div className="flex items-center justify-between border-b border-black/8 pb-4"><div><h2 className="font-semibold text-[#171717]">Conversa com OCTA AI</h2><p className="mt-1 text-xs text-black/45">Pergunte sobre reuniões, decisões, pessoas, gravações e próximos passos.</p></div><span className="rounded-full border border-black/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-black/55">Beta</span></div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-5 no-scrollbar">{messages.map(m=><div key={m.id} className={`${m.author==='Você'?'ml-auto bg-black text-white':'mr-auto border border-black/8 bg-black/[.025] text-[#222]'} max-w-[78%] rounded-[20px] px-4 py-3 text-sm leading-6`}><b className="mb-1 block text-[10px] uppercase tracking-[.12em] opacity-45">{m.author}</b>{m.body}</div>)}</div>
        <div className="flex items-center gap-2 rounded-[20px] border border-black/10 bg-white p-2 shadow-sm"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" placeholder="Pergunte algo sobre suas reuniões..."/><button onClick={()=>send()} disabled={!input.trim()} className="grid size-10 place-items-center rounded-2xl bg-black text-white disabled:opacity-25" aria-label="Enviar para OCTA AI"><Send size={16}/></button></div>
      </section>
    </div>
  </PageShell>
}
