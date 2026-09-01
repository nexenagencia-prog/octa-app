'use client';
import { useEffect,useMemo,useState } from 'react';
import { ArrowUp,ChevronDown,Loader2,Sparkles,X } from 'lucide-react';
import { OctaDigitalMark } from './octa-digital-mark';
import { aggregateSkillAnalyses,overallScore } from '@/lib/skills-analysis';
import { ANALYSIS_UPDATED_EVENT,listMeetingAnalyses } from '@/lib/meeting-analysis-store';

type ChatMessage={role:'assistant'|'user';text:string;actions?:string[]};
const shortcuts=['O que devo melhorar?','Por que minha objetividade caiu?','Compare minhas últimas reuniões','Crie um treino para argumentação'];

export function OctaSkillCoach(){
 const[open,setOpen]=useState(false);const[input,setInput]=useState('');const[loading,setLoading]=useState(false);const[version,setVersion]=useState(0);const[messages,setMessages]=useState<ChatMessage[]>([{role:'assistant',text:'Eu conecto suas reuniões às Skills. Posso explicar suas notas, encontrar padrões e sugerir treinos práticos.'}]);
 useEffect(()=>{const sync=()=>setVersion(v=>v+1);window.addEventListener(ANALYSIS_UPDATED_EVENT,sync);window.addEventListener('storage',sync);return()=>{window.removeEventListener(ANALYSIS_UPDATED_EVENT,sync);window.removeEventListener('storage',sync)}},[]);
 const context=useMemo(()=>{void version;const analyses=listMeetingAnalyses().filter(a=>a.source==='ai');const skills=aggregateSkillAnalyses(analyses);return{overallScore:overallScore(skills),skills,recent:analyses.slice(0,5).map(a=>({meetingTitle:a.meetingTitle,summary:a.summary,overallScore:a.overallScore??null}))}},[version]);
 async function send(preset?:string){const question=(preset??input).trim();if(!question||loading)return;setMessages(m=>[...m,{role:'user',text:question}]);setInput('');setLoading(true);try{const response=await fetch('/api/ai/skills-coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,context})});const data=await response.json();if(!response.ok){setMessages(m=>[...m,{role:'assistant',text:data.message||'Não consegui consultar a IA agora.'}]);return}setMessages(m=>[...m,{role:'assistant',text:data.answer,actions:data.actions}])}catch{setMessages(m=>[...m,{role:'assistant',text:'A conexão com o coach falhou. Suas Skills continuam disponíveis normalmente.'}])}finally{setLoading(false)}}
 return <div className={`octa-ai-coach ${open?'is-open':''}`}>
   {open&&<section className="octa-ai-panel" aria-label="OCTA Coach"><header><div className="flex items-center gap-3"><OctaDigitalMark size={34}/><div><b>OCTA Coach</b><span>IA conectada às suas Skills</span></div></div><button onClick={()=>setOpen(false)} aria-label="Fechar coach"><X size={17}/></button></header><div className="octa-ai-scoreline"><Sparkles size={14}/><span>{context.overallScore===null?'Faça sua primeira análise de reunião':`Performance atual ${context.overallScore}/100`}</span></div><div className="octa-ai-messages">{messages.map((m,i)=><div key={i} className={`octa-ai-message ${m.role}`}><p>{m.text}</p>{m.actions?.length?<div className="octa-ai-actions">{m.actions.map(a=><span key={a}>{a}</span>)}</div>:null}</div>)}{loading&&<div className="octa-ai-thinking"><Loader2 size={15} className="animate-spin"/> analisando suas Skills...</div>}</div><div className="octa-ai-shortcuts">{shortcuts.slice(0,context.recent.length?4:2).map(item=><button key={item} onClick={()=>send(item)}>{item}</button>)}</div><form onSubmit={e=>{e.preventDefault();send()}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Pergunte sobre suas Skills..."/><button disabled={!input.trim()||loading} aria-label="Enviar"><ArrowUp size={17}/></button></form><footer>Análise baseada apenas nas evidências disponíveis.</footer></section>}
   <button className="octa-ai-orb" onClick={()=>setOpen(v=>!v)} aria-label={open?'Minimizar OCTA Coach':'Abrir OCTA Coach'}><OctaDigitalMark size={32}/><span>IA</span>{open&&<ChevronDown size={13}/>}</button>
 </div>
}
