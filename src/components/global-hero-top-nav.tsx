'use client';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {Bell,Search} from 'lucide-react';
import {useState} from 'react';

const items=[
  {href:'/',label:'Início'},
  {href:'/reunioes',label:'Reuniões'},
  {href:'/agenda',label:'Agenda'},
  {href:'/planos',label:'Planos e preços'},
];

const hiddenPrefixes=['/login','/reset-password','/auth/','/admin','/room/','/reuniao-instantanea'];

export function GlobalHeroTopNav(){
  const path=usePathname();
  const router=useRouter();
  const[query,setQuery]=useState('');
  if(path==='/'||hiddenPrefixes.some(prefix=>path===prefix||path.startsWith(prefix)))return null;
  const submit=(event:React.FormEvent)=>{event.preventDefault();const value=query.trim();if(value)router.push(`/reunioes?q=${encodeURIComponent(value)}`)};
  return <>
    <header className="global-hero-topnav" aria-label="Navegação principal OCTA">
      <form className="global-hero-search" onSubmit={submit}>
        <Search size={18}/>
        <input value={query} onChange={event=>setQuery(event.target.value)} aria-label="Buscar" placeholder="Buscar reunião, pessoa ou gravação"/>
      </form>
      <nav className="global-hero-links" aria-label="Seções principais">
        {items.map(item=><Link key={item.href} href={item.href} className={path===item.href?'is-active':''}>{item.label}</Link>)}
      </nav>
      <button className="global-hero-bell" type="button" aria-label="Notificações"><Bell size={21}/></button>
    </header>
    <style jsx global>{`
      .global-hero-topnav{position:fixed;left:250px;right:0;top:0;z-index:59;height:76px;display:flex;align-items:center;gap:24px;padding:0 28px 0 30px;color:#fff;background:none!important;background-color:transparent!important;background-image:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border:0!important;box-shadow:none!important}
      .global-hero-search{width:min(390px,31vw);height:44px;display:flex;align-items:center;gap:12px;padding:0 18px;border:1px solid rgba(255,255,255,.18);border-radius:23px;background:rgba(255,255,255,.065);color:rgba(255,255,255,.90);box-shadow:inset 0 1px 0 rgba(255,255,255,.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
      .global-hero-search input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#fff;font-size:13px;font-weight:400;letter-spacing:.005em}
      .global-hero-search input::placeholder{color:rgba(255,255,255,.62)}
      .global-hero-links{margin-left:auto;display:flex;align-items:center;gap:38px;height:100%}
      .global-hero-links a{position:relative;display:flex;height:100%;align-items:center;color:rgba(255,255,255,.76);font-size:15px;font-weight:400;white-space:nowrap;transition:color .18s ease}
      .global-hero-links a:hover,.global-hero-links a.is-active{color:#fff}
      .global-hero-links a.is-active:after{content:'';position:absolute;left:50%;bottom:7px;width:5px;height:5px;border-radius:50%;background:#fff;transform:translateX(-50%)}
      .global-hero-bell{display:grid;size:36px;place-items:center;border:0;background:transparent;color:#fff}
      body:has(.global-hero-topnav) .octa-topbar{visibility:hidden!important;pointer-events:none!important}
      body:has(.global-hero-topnav) .agenda-reference-top{display:none!important}
      body:has(.global-hero-topnav) .agenda-reference-action{margin-top:76px!important;height:66px!important}
      body:has(.global-hero-topnav) .agenda-reference-grid{height:calc(100dvh - 142px)!important}
      @media(max-width:1279px){.global-hero-topnav{left:0;height:70px;padding:0 18px;gap:14px;background:none!important;background-color:transparent!important;background-image:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;border:0!important}.global-hero-search{width:min(360px,42vw);height:42px}.global-hero-links{gap:24px}.global-hero-links a{font-size:14px}body:has(.global-hero-topnav) .agenda-reference-action{margin-top:70px!important}body:has(.global-hero-topnav) .agenda-reference-grid{height:calc(100dvh - 136px)!important}}
      @media(max-width:900px){.global-hero-links{display:none}.global-hero-search{width:min(520px,calc(100vw - 76px))}.global-hero-bell{margin-left:auto}}
      @media(max-width:700px){.global-hero-topnav{height:64px;padding:0 12px;background:none!important;background-color:transparent!important;background-image:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:none!important;border:0!important}.global-hero-search{height:40px;padding:0 14px}.global-hero-search input{font-size:12px}.global-hero-bell{size:36px}body:has(.global-hero-topnav) .agenda-reference-action{margin-top:64px!important}body:has(.global-hero-topnav) .agenda-reference-grid{height:calc(100dvh - 130px)!important}}
    `}</style>
  </>;
}
