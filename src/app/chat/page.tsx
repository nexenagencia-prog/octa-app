'use client';
import { FormEvent, useState } from 'react';
import { ArrowUpRight, Send, Sparkles, WandSparkles } from 'lucide-react';
import { PageShell } from '@/components/page-shell';

type Message={role:'user'|'assistant';content:string;demo?:boolean};
const suggestions=['Onde posso melhorar agora?','Qual meu ponto mais forte?','Como ser mais objetivo nas reuniões?'];

export default function Page(){
  const [input,setInput]=useState('');
  const [busy,setBusy]=useState(false);
  const [messages,setMessages]=useState<Message[]>([{role:'assistant',content:'Sou seu OCTA AI Coach. Posso usar seus resultados do OCTA Skills para ajudar você a evoluir em reuniões.'}]);

  async function ask(text:string){
    const clean=text.trim(); if(!clean||busy)return;
    const next=[...messages,{role:'user' as const,content:clean}];
    setMessages(next); setInput(''); setBusy(true);
    try{
      const response=await fetch('/api/octa-ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:clean,history:next.slice(-8)})});
      const data=await response.json();
      if(!response.ok) throw new Error(data?.error||'Não consegui analisar agora.');
      setMessages(items=>[...items,{role:'assistant',content:data.reply,demo:Boolean(data.demo)}]);
    }catch(error){setMessages(items=>[...items,{role:'assistant',content:error instanceof Error?error.message:'Não consegui responder agora.'}]);}
    finally{setBusy(false)}
  }
  const submit=(event:FormEvent)=>{event.preventDefault();void ask(input)};

  return <PageShell title="OCTA AI" kicker="Sua inteligência de reuniões">
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[.72fr_1.28fr]">
      <section className="octa-panel flex flex-col justify-between p-6">
        <div>
          <span className="grid size-12 place-items-center rounded-2xl bg-black text-white"><Sparkles size={19}/></span>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-.045em] text-[#101211]">Mais foco.<br/>Mais resultado.</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">Pergunte sobre clareza, objetividade, argumentação, condução e evolução nas suas reuniões.</p>
        </div>
        <div className="mt-8 space-y-2">{suggestions.map(s=><button key={s} onClick={()=>void ask(s)} className="flex w-full items-center justify-between rounded-2xl border border-black/8 bg-[#fafaf8] px-4 py-3 text-left text-sm text-black/65 transition hover:bg-white hover:text-black"><span>{s}</span><ArrowUpRight size={14}/></button>)}</div>
      </section>
      <section className="octa-panel flex min-h-0 flex-col p-5">
        <div className="flex items-center justify-between border-b border-black/6 pb-4"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-black/35">Performance Coach</p><h2 className="mt-1 text-lg font-semibold text-[#101211]">Conversa com OCTA AI</h2></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f1ee] px-3 py-1.5 text-[10px] font-medium text-black/45"><WandSparkles size={12}/> Beta</span></div>
        <div className="min-h-0 flex-1 space-y-3 overflow-auto py-5">{messages.map((m,i)=><div key={`${m.role}-${i}`} className={`max-w-[82%] rounded-[20px] px-4 py-3 text-sm leading-6 ${m.role==='user'?'ml-auto bg-black text-white':'border border-black/7 bg-white text-black/72 shadow-[0_8px_24px_rgba(0,0,0,.035)]'}`}><p>{m.content}</p>{m.demo&&<small className="mt-2 block text-[9px] uppercase tracking-[.12em] opacity-45">Demonstração</small>}</div>)}{busy&&<div className="inline-flex items-center gap-2 rounded-[20px] border border-black/7 bg-white px-4 py-3 text-sm text-black/40"><Sparkles size={14}/> Analisando sua performance…</div>}</div>
        <form onSubmit={submit} className="flex gap-2 border-t border-black/6 pt-4"><input value={input} onChange={e=>setInput(e.target.value)} className="octa-input flex-1" placeholder="Pergunte sobre sua performance…" maxLength={4000}/><button type="submit" disabled={busy||!input.trim()} className="grid size-11 shrink-0 place-items-center rounded-full bg-black text-white transition hover:bg-black/85 disabled:opacity-35" aria-label="Enviar"><Send size={16}/></button></form>
      </section>
    </div>
  </PageShell>;
}
