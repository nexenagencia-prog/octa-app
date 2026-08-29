'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell, BookOpenText, Calculator, CalendarDays, ChevronRight,
  CircleDot, CircleUserRound, Filter, Home, Menu, MonitorUp,
  MessageCircle, NotebookPen, Pencil, Search, Settings, Sparkles, UsersRound, Video, VideoIcon
} from 'lucide-react';
import { useToolOverlay } from '@/components/tool-overlay-context';
import { ProfileEditor } from '@/components/profile-editor';
import { defaultEditableProfile, EditableProfile, getProfile, PROFILE_UPDATED_EVENT } from '@/lib/profile-store';

const topItems=[{href:'/',label:'Início'},{href:'/reunioes',label:'Reuniões'},{href:'/agenda',label:'Agenda'},{href:'/planos',label:'Planos e preços'}];
const sidePrimary=[{href:'/',label:'Início',icon:Home},{href:'/agenda',label:'Agenda',icon:CalendarDays},{href:'/reunioes',label:'Reuniões',icon:VideoIcon},{href:'/contatos',label:'Contatos',icon:UsersRound},{href:'/gravacoes',label:'Gravações',icon:VideoIcon}];
const sideLinks=[
  {href:'/compartilhar-tela',label:'Compartilhar Tela',icon:MonitorUp},{href:'/gravar',label:'Gravar',icon:CircleDot},
  {href:'/room/strategy-room',label:'Entrar em reunião',icon:Video},{href:'/feed',label:'Feed',icon:MessageCircle},
  {href:'/minhas-anotacoes',label:'Minhas Anotações',icon:BookOpenText},{href:'/skills',label:'OCTA SKILLS',icon:Sparkles},
];

export function OctaLogo(){return <Link href="/" className="flex items-center gap-3" aria-label="OCTA início"><span className="octa-mark" aria-hidden="true"><i/><i/><i/><i/><i/><i/></span><span className="text-[25px] font-semibold tracking-[-.035em] text-[#0b2238]">OCTA</span></Link>}

export function DashboardSidebar({collapsed=false,onToggle}:{collapsed?:boolean;onToggle?:()=>void}){
  const path=usePathname();const router=useRouter();const {openTool}=useToolOverlay();const [profile,setProfile]=useState<EditableProfile>(defaultEditableProfile);const [editing,setEditing]=useState(false);
  useEffect(()=>{setProfile(getProfile());const onUpdate=(e:Event)=>setProfile((e as CustomEvent<EditableProfile>).detail??getProfile());window.addEventListener(PROFILE_UPDATED_EVENT,onUpdate);return()=>window.removeEventListener(PROFILE_UPDATED_EVENT,onUpdate)},[]);
  const item=(href:string,label:string,Icon:any)=><Link key={`${href}-${label}`} href={href} title={collapsed?label:undefined} className={`octa-side-item ${path===href?'is-active':''}`}><Icon size={19}/><span className="octa-side-label">{label}</span></Link>;
  const tool=(label:string,Icon:any,kind:'calculator'|'filters'|'notes')=><button key={kind} onClick={()=>kind==='filters'?router.push('/reunioes'):openTool(kind)} title={collapsed?label:undefined} className="octa-side-item w-full text-left"><Icon size={19}/><span className="octa-side-label">{label}</span></button>;
  return <><aside className={`octa-sidebar hidden xl:flex ${collapsed?'is-collapsed':''}`}>
    <div className="octa-profile flex items-center gap-3 px-5 pt-6">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-white/30 bg-white/15"><img src={profile.avatarUrl} alt={profile.displayName} className="h-full w-full object-cover"/><span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#092638] bg-emerald-400"/></div>
      <div className="octa-profile-copy min-w-0 flex-1"><div className="truncate text-[17px] font-medium text-white">{profile.displayName}</div><div className="mt-0.5 truncate text-xs text-white/55">{profile.headline}</div></div>
      {!collapsed&&<button onClick={()=>setEditing(true)} className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/15" aria-label="Editar perfil"><Pencil size={14}/></button>}
    </div>
    <nav className="octa-side-nav no-scrollbar overflow-y-auto">{sidePrimary.map(({href,label,icon})=>item(href,label,icon))}<div className="octa-side-divider"/>{tool('Calculadora',Calculator,'calculator')}{tool('Filtros',Filter,'filters')}{tool('Anotar',NotebookPen,'notes')}{sideLinks.map(({href,label,icon})=>item(href,label,icon))}</nav>
    <div className="octa-sidebar-footer">{item('/configuracoes','Configurações',Settings)}<button onClick={onToggle} className="octa-expand-orb" aria-label={collapsed?'Expandir menu':'Recolher menu'}><ChevronRight size={19}/></button></div>
  </aside>{editing&&<ProfileEditor profile={profile} onClose={()=>setEditing(false)} onSaved={setProfile}/>}</>;
}

export function TopNav(){const path=usePathname();const router=useRouter();const[query,setQuery]=useState('');const runSearch=(e:React.FormEvent)=>{e.preventDefault();if(query.trim())router.push(`/reunioes?q=${encodeURIComponent(query.trim())}`)};return <header className="octa-topbar"><OctaLogo/><nav className="hidden items-center gap-8 lg:flex">{topItems.map(({href,label})=><Link key={label} href={href} className={`octa-toplink ${path===href?'is-active':''}`}>{label}</Link>)}</nav><div className="ml-auto flex min-w-0 items-center gap-4"><form onSubmit={runSearch} className="octa-search hidden min-w-[340px] xl:flex"><Search size={21}/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Buscar" placeholder="Buscar reunião, pessoa ou gravação"/></form><Link href="/agenda" className="relative grid size-11 place-items-center rounded-full text-[#102944] hover:bg-white/60" aria-label="Notificações"><Bell size={22}/><span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-[#0b7285] text-[10px] font-semibold text-white">2</span></Link><Link href="/profile" className="grid size-10 place-items-center rounded-full bg-white/70 text-[#102944] lg:hidden"><CircleUserRound size={18}/></Link></div></header>}

export function MobileNav(){const path=usePathname();return <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-black/10 bg-white/90 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,.15)] backdrop-blur-2xl xl:hidden">{sidePrimary.slice(0,4).map(({href,label,icon:Icon})=><Link key={label} aria-label={label} href={href} className={`grid size-11 place-items-center rounded-full ${path===href?'bg-[#092638] text-white':'text-[#0f2b45]/55'}`}><Icon size={18}/></Link>)}<Link href="/configuracoes" aria-label="Menu" className="grid size-11 place-items-center rounded-full text-[#0f2b45]/55"><Menu size={18}/></Link></nav>}
