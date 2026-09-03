'use client';
import { useEffect,useMemo,useRef,useState } from 'react';
import { Activity,ArrowUp,Brain,Eye,EyeOff,MessageCircle,Mic2,Send,ShieldCheck,Sparkles,Square,X } from 'lucide-react';
import { OctaDigitalMark } from '@/components/ai/octa-digital-mark';
import { buildSkillsDraft,deriveLiveSignals,type LiveMeetingSignal } from '@/lib/live-meeting-coach';
import { overallScore,type MeetingSkillAnalysis } from '@/lib/skills-analysis';
import { saveMeetingAnalysis } from '@/lib/meeting-analysis-store';

type ParticipantRef={id:string;name:string};
type AIInsight={kind:'strategy'|'strength'|'attention';title:string;message:string;skill?:string|null;polarity?:'strength'|'weakness'|'neutral'};
type ChatMessage={role:'user'|'assistant';text:string;mode?:'ai'|'local'};
type Props={slug:string;title:string;participants:ParticipantRef[]};

export function MeetingStrategicAI({slug,title,participants}:Props){
 const[open,setOpen]=useState(false);
 const[listening,setListening]=useState(false);
 const[transcript,setTranscript]=useState('');
 const[status,setStatus]=useState('Preparando transcrição estratégica…');
 const[aiInsights,setAiInsights]=useState<AIInsight[]>([]);
 const[toast,setToast]=useState<AIInsight|null>(null);
 const[consents,setConsents]=useState<Record<string,boolean>>({});
 const[visualEnabled,setVisualEnabled]=useState(false);
 const[visualSupported,setVisualSupported]=useState<boolean|null>(null);
 const[visualSamples,setVisualSamples]=useState<number[]>([]);
 const[question,setQuestion]=useState('');
 const[chatBusy,setChatBusy]=useState(false);
 const[chatMessages,setChatMessages]=useState<ChatMessage[]>([{role:'assistant',text:'Estou acompanhando esta reunião. Pergunte como você está indo, o que melhorar ou o que fazer agora.',mode:'local'}]);
 const recognitionRef=useRef<any>(null);
 const lastSignalRef=useRef('');
 const lastAITranscriptRef=useRef('');
 const chatEndRef=useRef<HTMLDivElement|null>(null);
 const allConsented=participants.length>0&&participants.every(p=>consents[p.id]);

 const localSignals=useMemo(()=>deriveLiveSignals(transcript),[transcript]);
 const visualAverage=visualSamples.length?visualSamples.reduce((a,b)=>a+b,0)/visualSamples.length:null;
 const visualSignal=useMemo<LiveMeetingSignal|null>(()=>{
   if(!visualEnabled||visualSamples.length<4||visualAverage===null||visualAverage>=.55)return null;
   return{id:'visual-engagement-low',skill:'comunicacao',polarity:'weakness',title:'Queda provável de engajamento visual',message:'Os sinais visuais agregados diminuíram neste trecho. Considere encurtar a explicação, variar o ritmo ou devolver a conversa com uma pergunta.',evidence:`Engajamento visual agregado aproximado: ${Math.round(visualAverage*100)}%`,confidence:.58};
 },[visualAverage,visualEnabled,visualSamples.length]);
 const signals=useMemo(()=>visualSignal?[...localSignals,visualSignal]:localSignals,[localSignals,visualSignal]);

 function startListening(){
   const w=window as any;const Recognition=w.SpeechRecognition||w.webkitSpeechRecognition;
   if(!Recognition){setStatus('Este navegador não oferece transcrição de voz nativa. Você pode colar a transcrição no painel.');setOpen(true);return}
   try{recognitionRef.current?.stop?.()}catch{}
   const recognition=new Recognition();recognition.lang='pt-BR';recognition.continuous=true;recognition.interimResults=false;
   recognition.onresult=(event:any)=>{let text='';for(let i=event.resultIndex;i<event.results.length;i++)if(event.results[i].isFinal)text+=`${event.results[i][0].transcript} `;if(text)setTranscript(current=>`${current} ${text}`.trim())};
   recognition.onerror=(event:any)=>{setListening(false);setStatus(event?.error==='not-allowed'?'Permita o microfone para ativar a transcrição estratégica.':'A captura de voz foi interrompida. Você pode retomá-la pelo painel.')};
   recognition.onend=()=>setListening(false);
   recognition.start();recognitionRef.current=recognition;setListening(true);setStatus('Transcrição estratégica ativa · insights são privados para você.');
 }
 function stopListening(){try{recognitionRef.current?.stop?.()}catch{}setListening(false);setStatus('Transcrição pausada. Seus dados desta reunião continuam preservados localmente.');}

 async function askCoach(){
   const text=question.trim();if(!text||chatBusy)return;
   setQuestion('');setChatMessages(current=>[...current,{role:'user',text}]);
   if(transcript.trim().split(/\s+/).filter(Boolean).length<5){
     setChatMessages(current=>[...current,{role:'assistant',text:'Ainda preciso ouvir um pouco mais da reunião. Ative a transcrição ou cole uma transcrição para eu responder com base no que realmente aconteceu.',mode:'local'}]);
     return;
   }
   setChatBusy(true);
   try{
     const response=await fetch('/api/ai/live-meeting-coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({meetingId:slug,question:text,transcript:transcript.slice(-10000),signals:signals.slice(-10),visualEngagement:{enabled:visualEnabled,sampleCount:visualSamples.length,facePresenceRate:visualAverage}})});
     const data=await response.json();
     const answer=response.ok&&data?.answer?String(data.answer):'Não consegui analisar agora. Continue a reunião; os sinais locais continuam sendo acompanhados.';
     setChatMessages(current=>[...current,{role:'assistant',text:answer,mode:data?.mode==='ai'?'ai':'local'}]);
   }catch{
     const latest=signals.filter(signal=>signal.polarity==='weakness').slice(-1)[0];
     setChatMessages(current=>[...current,{role:'assistant',text:latest?`Foque agora em ${latest.title.toLowerCase()}. ${latest.message}`:'Ainda não há evidência suficiente para uma recomendação específica.',mode:'local'}]);
   }finally{setChatBusy(false)}
 }

 useEffect(()=>{const timer=window.setTimeout(()=>{if(!listening)startListening()},900);return()=>window.clearTimeout(timer)},[]);
 useEffect(()=>()=>{try{recognitionRef.current?.stop?.()}catch{}},[]);
 useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:'smooth',block:'nearest'})},[chatMessages,chatBusy]);

 useEffect(()=>{
   const latest=signals[signals.length-1];if(!latest||latest.id===lastSignalRef.current)return;lastSignalRef.current=latest.id;
   const insight:AIInsight={kind:latest.polarity==='strength'?'strength':latest.polarity==='weakness'?'attention':'strategy',title:latest.title,message:latest.message,skill:latest.skill,polarity:latest.polarity};
   setToast(insight);const timer=window.setTimeout(()=>setToast(current=>current===insight?null:current),7500);return()=>window.clearTimeout(timer);
 },[signals]);

 useEffect(()=>{
   if(transcript.length<140||transcript.length-lastAITranscriptRef.current.length<100)return;
   const timer=window.setTimeout(async()=>{
     lastAITranscriptRef.current=transcript;
     try{const response=await fetch('/api/ai/live-meeting-coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({meetingId:slug,transcript:transcript.slice(-7000),signals:signals.slice(-8),visualEngagement:{enabled:visualEnabled,sampleCount:visualSamples.length,facePresenceRate:visualAverage}})});const data=await response.json();if(response.ok&&Array.isArray(data.insights)&&data.insights.length){setAiInsights(data.insights);setToast(data.insights[0])}}catch{}
   },1800);return()=>window.clearTimeout(timer);
 },[slug,signals,transcript,visualAverage,visualEnabled,visualSamples.length]);

 useEffect(()=>{
   if(transcript.trim().split(/\s+/).length<20)return;
   const timer=window.setTimeout(()=>{
     const metrics=buildSkillsDraft(transcript,signals);if(!metrics.some(metric=>metric.evidenceSufficient))return;
     const strengths=signals.filter(s=>s.polarity==='strength').slice(-2).map(s=>s.title);
     const weaknesses=signals.filter(s=>s.polarity==='weakness').slice(-2).map(s=>s.title);
     const summary=[strengths.length?`Pontos fortes: ${strengths.join(', ')}.`:'',weaknesses.length?`Pontos a melhorar: ${weaknesses.join(', ')}.`:''].filter(Boolean).join(' ');
     const analysis:MeetingSkillAnalysis={meetingId:slug,meetingTitle:title,createdAt:new Date().toISOString(),source:'ai',summary:summary||'Análise estratégica em andamento.',metrics,overallScore:overallScore(metrics),transcript};
     saveMeetingAnalysis(analysis);fetch('/api/skills/analyses',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(analysis)}).catch(()=>{});
   },2200);return()=>window.clearTimeout(timer);
 },[signals,slug,title,transcript]);

 useEffect(()=>{
   if(!visualEnabled)return;
   let cancelled=false;let interval=0;
   const w=window as any;const FaceDetectorCtor=w.FaceDetector;
   if(!FaceDetectorCtor){setVisualSupported(false);setVisualEnabled(false);setStatus('Leitura visual indisponível neste navegador. A transcrição estratégica continua ativa.');return}
   setVisualSupported(true);const detector=new FaceDetectorCtor({fastMode:true,maxDetectedFaces:1});
   const sample=async()=>{const videos=Array.from(document.querySelectorAll('video')).filter((video:any)=>video.readyState>=2&&!video.paused) as HTMLVideoElement[];if(!videos.length)return;let present=0;let checked=0;for(const video of videos.slice(0,8)){try{const faces=await detector.detect(video);checked++;if(faces?.length)present++}catch{}}if(!cancelled&&checked)setVisualSamples(current=>[...current,present/checked].slice(-8))};
   sample();interval=window.setInterval(sample,5000);return()=>{cancelled=true;window.clearInterval(interval)};
 },[visualEnabled]);

 function toggleVisual(){
   if(visualEnabled){setVisualEnabled(false);setStatus('Leitura visual pausada.');return}
   if(!allConsented){setOpen(true);setStatus('Registre o aceite explícito de cada participante antes de ativar sinais visuais.');return}
   setVisualEnabled(true);setStatus('Sinais visuais agregados ativos. A OCTA não identifica pessoas nem diagnostica emoções.');
 }

 const latestInsights=[...aiInsights,...signals.slice(-3).map<AIInsight>(s=>({kind:s.polarity==='strength'?'strength':'attention',title:s.title,message:s.message,skill:s.skill,polarity:s.polarity}))].slice(-5).reverse();
 return <div className={`meeting-strategic-ai ${open?'is-open':''}`}>
   {toast&&<div className={`meeting-ai-toast ${toast.kind}`}><span>{toast.kind==='strength'?<Sparkles size={14}/>:<Activity size={14}/>}</span><div><b>{toast.title}</b><p>{toast.message}</p></div></div>}
   {open&&<section className="meeting-ai-panel" aria-label="OCTA AI estratégica">
     <header><div className="flex items-center gap-3"><OctaDigitalMark size={34}/><div><b>OCTA AI</b><span>Coach de performance ao vivo</span></div></div><button onClick={()=>setOpen(false)} aria-label="Fechar"><X size={16}/></button></header>
     <div className="meeting-ai-status"><span className={listening?'live':''}/><p>{status}</p></div>
     <div className="meeting-ai-section"><div className="meeting-ai-section-title"><Mic2 size={14}/><b>Transcrição em tempo real</b><button onClick={listening?stopListening:startListening}>{listening?<><Square size={11}/> Pausar</>:<><Mic2 size={11}/> Ativar</>}</button></div><textarea value={transcript} onChange={e=>setTranscript(e.target.value)} placeholder="A transcrição aparece aqui. Você também pode colar uma transcrição…"/></div>
     <div className="meeting-ai-section"><div className="meeting-ai-section-title"><MessageCircle size={14}/><b>Pergunte à OCTA</b><span>{listening?'ouvindo reunião':'contexto salvo'}</span></div><div className="max-h-52 overflow-y-auto space-y-2 pr-1">{chatMessages.map((message,index)=><div key={`${message.role}-${index}`} className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${message.role==='user'?'ml-8 bg-white/10 text-white':'mr-4 bg-black/20 text-white/80'}`}><b className="mr-1">{message.role==='user'?'Você':'OCTA'}</b>{message.text}{message.role==='assistant'&&message.mode==='local'&&<small className="ml-2 opacity-50">local</small>}</div>)}{chatBusy&&<div className="mr-4 rounded-2xl bg-black/20 px-3 py-2 text-xs text-white/60">Analisando esta reunião…</div>}<div ref={chatEndRef}/></div><form className="mt-2 flex gap-2" onSubmit={event=>{event.preventDefault();askCoach()}}><input value={question} onChange={event=>setQuestion(event.target.value)} placeholder="Ex.: O que devo melhorar agora?" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none placeholder:text-white/35"/><button type="submit" disabled={chatBusy||!question.trim()} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white disabled:opacity-35" aria-label="Perguntar à OCTA"><Send size={14}/></button></form><div className="mt-2 flex flex-wrap gap-1.5">{['Como estou indo?','O que melhorar agora?','Qual meu ponto forte?'].map(prompt=><button key={prompt} type="button" onClick={()=>setQuestion(prompt)} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/60">{prompt}</button>)}</div></div>
     <div className="meeting-ai-section"><div className="meeting-ai-section-title"><Brain size={14}/><b>Insights automáticos</b><span>{latestInsights.length} sinais</span></div><div className="meeting-ai-insights">{latestInsights.length?latestInsights.map((item,index)=><article key={`${item.title}-${index}`} className={item.polarity==='strength'?'positive':'attention'}><b>{item.title}</b><p>{item.message}</p>{item.skill&&<small>{item.skill}</small>}</article>):<p className="meeting-ai-empty">A OCTA começa a sugerir ações assim que houver evidência suficiente na conversa.</p>}</div></div>
     <div className="meeting-ai-section"><div className="meeting-ai-section-title"><ShieldCheck size={14}/><b>Engajamento visual</b><button onClick={toggleVisual} className={visualEnabled?'active':''}>{visualEnabled?<><EyeOff size={11}/> Pausar</>:<><Eye size={11}/> Ativar</>}</button></div><p className="meeting-ai-consent-copy">Privado para você. Só ativa depois que você registrar o aceite explícito de cada participante. Não identifica pessoas e não diagnostica emoções.</p><div className="meeting-ai-consents">{participants.map(p=><label key={p.id}><input type="checkbox" checked={Boolean(consents[p.id])} onChange={e=>setConsents(current=>({...current,[p.id]:e.target.checked}))}/><span>{p.name}</span><small>{consents[p.id]?'aceite registrado':'aguardando aceite'}</small></label>)}</div>{visualEnabled&&<div className="meeting-ai-visual-score"><Eye size={13}/><span>{visualAverage===null?'coletando sinais…':`engajamento visual agregado ~${Math.round(visualAverage*100)}%`}</span></div>}{visualSupported===false&&<p className="meeting-ai-warning">Seu navegador não oferece FaceDetector. Nenhuma inferência visual será feita.</p>}</div>
     <footer><span>Chat privado · Skills atualizado automaticamente</span><button onClick={()=>setOpen(false)}><ArrowUp size={13}/> minimizar</button></footer>
   </section>}
   <button className="meeting-ai-orb" onClick={()=>setOpen(v=>!v)} aria-label="Abrir OCTA AI"><OctaDigitalMark size={30}/><span><b>IA</b><small>{listening?'ao vivo':'pronta'}</small></span></button>
 </div>
}
