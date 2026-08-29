'use client';
import { useEffect, useState } from 'react';
import { MessageCircle, MessageSquareOff, Send } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
const KEY='octa-chat-enabled';
export default function Page(){
 const [enabled,setEnabled]=useState(true); const [input,setInput]=useState(''); const [messages,setMessages]=useState([{id:1,author:'Amanda',body:'Esse ponto ficou muito claro.'},{id:2,author:'Você',body:'Vou compartilhar a proposta agora.'}]);
 useEffect(()=>{try{setEnabled(localStorage.getItem(KEY)!=='0')}catch{}},[]);
 const toggle=()=>setEnabled(v=>{const n=!v;try{localStorage.setItem(KEY,n?'1':'0')}catch{}return n});
 const send=()=>{const body=input.trim();if(!body||!enabled)return;setMessages(m=>[...m,{id:Date.now(),author:'Você',body}]);setInput('')};
 return <PageShell title="Chat" kicker="Controle da conversa"><div className="grid h-full grid-cols-[.7fr_1.3fr] gap-4"><section className="octa-panel p-6"><div className="octa-tool-icon">{enabled?<MessageCircle size={34}/>:<MessageSquareOff size={34}/>}</div><h2 className="mt-5 text-2xl font-semibold">Chat {enabled?'ativado':'desativado'}</h2><p className="mt-2 text-sm text-[#687d8e]">Defina se o chat aparece durante as reuniões.</p><button onClick={toggle} className="octa-primary-button mt-6">{enabled?'Desativar chat':'Ativar chat'}</button></section><section className="octa-panel flex min-h-0 flex-col p-5"><h2 className="font-semibold">Prévia da conversa</h2><div className="mt-4 flex-1 space-y-3 overflow-auto rounded-[20px] bg-[#062b3c] p-4 text-sm text-white">{messages.map(m=><div key={m.id} className={`${m.author==='Você'?'ml-auto max-w-[78%] bg-[#0b8197]':'bg-white/10'} rounded-2xl p-3`}><b>{m.author}</b><p className="mt-1 text-white/80">{m.body}</p></div>)}</div><div className="mt-3 flex gap-2"><input disabled={!enabled} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} className="octa-input flex-1" placeholder={enabled?'Digite uma mensagem':'Chat desativado'}/><button onClick={send} disabled={!enabled||!input.trim()} className="octa-icon-button disabled:opacity-40"><Send size={17}/></button></div></section></div></PageShell>
}
