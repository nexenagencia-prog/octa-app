'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell, BookOpenText, Brush, Calculator, CalendarDays, ChevronRight, Moon, Sun,
  CircleUserRound, Home, Menu,
  NotebookPen, Pencil, Search, Settings, Sparkles, UsersRound, Video, VideoIcon
} from 'lucide-react';
import { useToolOverlay } from '@/components/tool-overlay-context';
import { ProfileEditor } from '@/components/profile-editor';
import { defaultEditableProfile, EditableProfile, getProfile, PROFILE_UPDATED_EVENT } from '@/lib/profile-store';
import { NotificationsCenter } from '@/components/notifications-center';

const topItems=[{href:'/',label:'Início'},{href:'/reunioes',label:'Reuniões'},{href:'/agenda',label:'Agenda'},{href:'/planos',label:'Planos e preços'}];
const sidePrimary=[{href:'/',label:'Início',icon:Home},{href:'/agenda',label:'Agenda',icon:CalendarDays},{href:'/reunioes',label:'Reuniões',icon:VideoIcon},{href:'/reuniao-instantanea',label:'Reunião instantânea',icon:Video},{href:'/contatos',label:'Contatos',icon:UsersRound},{href:'/gravacoes',label:'Gravações',icon:VideoIcon}];
const sideLinks=[
  {href:'/lousa',label:'Lousa',icon:Brush},
  {href:'/reunioes?modo=entrar',label:'Entrar em reunião',icon:Video},
  {href:'/minhas-anotacoes',label:'Minhas Anotações',icon:BookOpenText},{href:'/skills',label:'Octa skills',icon:Sparkles},
];

export function OctaLogo(){return <Link href="/" className="octa-wordmark" aria-label="OCTA início" data-cms-id="global.wordmark" data-cms-type="text">OCTA</Link>}

function ThemeToggle(){
  const [theme,setTheme]=useState<'light'|'dark'>('light');
  useEffect(()=>{try{const saved=(localStorage.getItem('octa-theme') as 'light'|'dark'|null)??'light';setTheme(saved);document.documentElement.dataset.theme=saved}catch{}},[]);
  const toggle=()=>setTheme(current=>{const next=current==='dark'?'light':'dark';try{localStorage.setItem('octa-theme',next);document.documentElement.dataset.theme=next}catch{}return next});
  return <button onClick={toggle} className="octa-theme-toggle" data-cms-id="global.top.theme" data-cms-type="button" aria-label={theme==='dark'?'Ativar tema claro':'Ativar tema escuro'} title={theme==='dark'?'Tema claro':'Tema escuro'}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}<span>{theme==='dark'?'Claro':'Escuro'}</span></button>
}

export function DashboardSidebar({collapsed=false,onToggle,dashboard=false}:{collapsed?:boolean;onToggle?:()=>void;dashboard?:boolean}){
  const path=usePathname();const {openTool}=useToolOverlay();const [profile,setProfile]=useState<EditableProfile>(defaultEditableProfile);const [editing,setEditing]=useState(false);
  useEffect(()=>{setProfile(getProfile());const onUpdate=(e:Event)=>setProfile((e as CustomEvent<EditableProfile>).detail??getProfile());window.addEventListener(PROFILE_UPDATED_EVENT,onUpdate);return()=>window.removeEventListener(PROFILE_UPDATED_EVENT,onUpdate)},[]);
  const item=(href:string,label:string,Icon:any)=><Link key={`${href}-${label}`} href={href} data-cms-id={`global.sidebar.${label.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} data-cms-type="container" title={collapsed?label:undefined} className={`octa-side-item ${path===href?'is-active':''}`}><Icon size={19}/><span className="octa-side-label" data-cms-id={`global.sidebar.label.${label.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} data-cms-type="text">{label}</span></Link>;
  const tool=(label:string,Icon:any,kind:'calculator'|'notes')=><button key={kind} onClick={()=>openTool(kind)} title={collapsed?label:undefined} className="octa-side-item w-full text-left"><Icon size={19}/><span className="octa-side-label" data-cms-id={`global.sidebar.tool.${kind}`} data-cms-type="text">{label}</span></button>;
  return <><aside className={`octa-sidebar hidden xl:flex ${collapsed?'is-collapsed':''} ${dashboard?'is-dashboard':''}`}>
    {dashboard&&<div className="octa-dashboard-brand"><div className="octa-logo-mark"><span/><span/></div><OctaLogo/></div>}
    <div className={`octa-profile flex items-center gap-3 px-5 pt-6 ${dashboard?'octa-dashboard-profile':''}`} data-cms-id="global.sidebar.profile" data-cms-type="container">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-white/30 bg-white/15"><img src={profile.avatarUrl} alt={profile.displayName} className="h-full w-full object-cover"/><span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#092638] bg-emerald-400"/></div>
      <div className="octa-profile-copy min-w-0 flex-1"><div className="truncate text-[17px] font-medium text-white" data-cms-id="global.sidebar.profile.name" data-cms-type="text">{profile.displayName}</div><div className="mt-0.5 truncate text-xs text-white/55" data-cms-id="global.sidebar.profile.headline" data-cms-type="text">{profile.headline}</div></div>
      {!collapsed&&<button onClick={()=>setEditing(true)} className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/15" aria-label="Editar perfil"><Pencil size={14}/></button>}
    </div>
    <nav className="octa-side-nav no-scrollbar overflow-y-auto">{sidePrimary.map(({href,label,icon})=>item(href,label,icon))}<div className="octa-side-divider"/>{tool('Calculadora',Calculator,'calculator')}{tool('Anotar',NotebookPen,'notes')}{sideLinks.map(({href,label,icon})=>item(href,label,icon))}</nav>
    <div className="octa-sidebar-footer">{item('/configuracoes','Configurações',Settings)}<button onClick={onToggle} className="octa-expand-orb" aria-label={collapsed?'Expandir menu':'Recolher menu'}><ChevronRight size={19}/></button></div>
  </aside>{editing&&<ProfileEditor profile={profile} onClose={()=>setEditing(false)} onSaved={setProfile}/>}</>;
}

export function TopNav(){const path=usePathname();const router=useRouter();const[query,setQuery]=useState('');const runSearch=(e:React.FormEvent)=>{e.preventDefault();if(query.trim())router.push(`/reunioes?q=${encodeURIComponent(query.trim())}`)};return <header className="octa-topbar"><OctaLogo/><nav className="hidden items-center gap-8 lg:flex">{topItems.map(({href,label})=><Link key={label} href={href} data-cms-id={`global.top.link.${label.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} data-cms-type="text" className={`octa-toplink ${path===href?'is-active':''}`}>{label}</Link>)}</nav><div className="ml-auto flex min-w-0 items-center gap-4"><ThemeToggle/><form onSubmit={runSearch} className="octa-search hidden min-w-[340px] xl:flex" data-cms-id="global.top.search" data-cms-type="container"><Search size={21}/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Buscar" placeholder="Buscar reunião, pessoa ou gravação"/></form><NotificationsCenter/><Link href="/profile" className="grid size-10 place-items-center rounded-full bg-white/70 text-[#102944] lg:hidden"><CircleUserRound size={18}/></Link></div></header>}

export function MobileNav(){const path=usePathname();return <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-black/10 bg-white/90 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,.15)] backdrop-blur-2xl xl:hidden">{sidePrimary.slice(0,4).map(({href,label,icon:Icon})=><Link key={label} aria-label={label} href={href} className={`grid size-11 place-items-center rounded-full ${path===href?'bg-[#092638] text-white':'text-[#0f2b45]/55'}`}><Icon size={18}/></Link>)}<Link href="/configuracoes" aria-label="Menu" className="grid size-11 place-items-center rounded-full text-[#0f2b45]/55"><Menu size={18}/></Link></nav>}
