'use client';
import { useEffect, useState } from 'react';
import { LayoutPanelLeft, MessageCircle, PanelLeftClose, RotateCcw, Settings2, Wrench } from 'lucide-react';
import { PageShell } from '@/components/page-shell';

const readPref=(key:string,fallback:boolean)=>{try{const value=localStorage.getItem(key);return value===null?fallback:value==='1'}catch{return fallback}};
const savePref=(key:string,value:boolean)=>{try{localStorage.setItem(key,value?'1':'0')}catch{}};

function Toggle({value,onChange}:{value:boolean;onChange:(value:boolean)=>void}){return <button type="button" aria-pressed={value} onClick={()=>onChange(!value)} className={`h-7 w-12 rounded-full p-1 transition ${value?'bg-[#0b7285]':'bg-[#cbd7de]'}`}><span className={`block size-5 rounded-full bg-white transition ${value?'translate-x-5':''}`}/></button>}

export default function Page(){
  const[dense,setDense]=useState(false);const[sidebarCollapsed,setSidebarCollapsed]=useState(false);const[chatEnabled,setChatEnabled]=useState(true);const[meetingTools,setMeetingTools]=useState(true);
  useEffect(()=>{setDense(readPref('octa-compact-mode',false));setSidebarCollapsed(readPref('octa-sidebar-collapsed',false));setChatEnabled(readPref('octa-chat-enabled',true));setMeetingTools(readPref('octa-meeting-tools',true))},[]);
  const update=(setter:(value:boolean)=>void,key:string,value:boolean)=>{setter(value);savePref(key,value);window.dispatchEvent(new Event('octa-preferences-updated'))};
  const reset=()=>{try{['octa-sidebar-collapsed','octa-chat-enabled','octa-notes','octa-compact-mode','octa-meeting-tools'].forEach(key=>localStorage.removeItem(key))}catch{}location.reload()};
  return <PageShell title="Configurações" kicker="Preferências"><div className="grid h-full grid-cols-2 gap-4"><section className="octa-panel p-6"><Settings2 size={28}/><h2 className="mt-4 text-xl font-semibold">Interface</h2><div className="mt-5 grid gap-3">
    <div className="settings-row"><div className="settings-copy"><b>Modo compacto</b><p>Reduzir espaçamento interno dos painéis.</p></div><Toggle value={dense} onChange={value=>update(setDense,'octa-compact-mode',value)}/></div>
    <div className="settings-row"><PanelLeftClose size={20}/><div className="settings-copy flex-1"><b>Barra lateral recolhida</b><p>Iniciar o aplicativo com o menu lateral compacto.</p></div><Toggle value={sidebarCollapsed} onChange={value=>update(setSidebarCollapsed,'octa-sidebar-collapsed',value)}/></div>
    <div className="settings-row"><MessageCircle size={20}/><div className="settings-copy flex-1"><b>Chat ao entrar</b><p>Abrir o chat automaticamente nas chamadas.</p></div><Toggle value={chatEnabled} onChange={value=>update(setChatEnabled,'octa-chat-enabled',value)}/></div>
    <div className="settings-row"><Wrench size={20}/><div className="settings-copy flex-1"><b>Mostrar ferramentas na reunião</b><p>Manter os atalhos de calculadora, filtros e anotações visíveis.</p></div><Toggle value={meetingTools} onChange={value=>update(setMeetingTools,'octa-meeting-tools',value)}/></div>
    <div className="settings-row"><LayoutPanelLeft size={20}/><div className="settings-copy"><b>Barra lateral</b><p>Use a seta da barra para expandir ou recolher a qualquer momento.</p></div></div>
  </div></section><section className="octa-panel p-6"><RotateCcw size={28}/><h2 className="mt-4 text-xl font-semibold">Restaurar preferências</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#697f91]">Apaga somente preferências locais deste navegador: interface, estado da barra, chat, ferramentas e anotações locais.</p><button onClick={reset} className="octa-secondary-button mt-6">Restaurar padrão</button></section></div></PageShell>}
