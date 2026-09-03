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
  if(hiddenPrefixes.some(prefix=>path===prefix||path.startsWith(prefix)))return null;
  const submit=(event:React.FormEvent)=>{event.preventDefault();const value=query.trim();if(value)router.push(`/reunioes?q=${encodeURIComponent(value)}`)};
  return <>
    <header className="global-hero-topnav" aria-label="Navegação principal OCTA">
      <form className="global-hero-search" onSubmit={submit}>
        <Search size={23}/>
        <input value={query} onChange={event=>setQuery(event.target.value)} aria-label="Buscar" placeholder="Buscar reunião, pessoa ou gravação"/>
      </form>
      <nav className="global-hero-links" aria-label="Seções principais">
        {items.map(item=><Link key={item.href} href={item.href} className={path===item.href?'is-active':''}>{item.label}</Link>)}
      </nav>
      <button className="global-hero-bell" type="button" aria-label="Notificações"><Bell size={27}/></button>
    </header>
    <style jsx global>{`
      .global-hero-topnav{position:fixed;left:250px;right:0;top:0;z-index:59;height:112px;display:flex;align-items:center;gap:34px;padding:0 34px 0 32px;color:#fff;background:linear-gradient(90deg,rgba(82,61,54,.18),rgba(12,20,26,.22));backdrop-filter:blur(15px) saturate(108%);-webkit-backdrop-filter:blur(15px) saturate(108%);border-top:1px solid rgba(255,255,255,.04)}
      .global-hero-search{width:min(535px,38vw);height:66px;display:flex;align-items:center;gap:18px;padding:0 24px;border:1px solid rgba(255,255,255,.20);border-radius:34px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.92);box-shadow:inset 0 1px 0 rgba(255,255,255,.05);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}
      .global-hero-search input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#fff;font-size:16px;font-weight:400;letter-spacing:.01em}
      .global-hero-search input::placeholder{color:rgba(255,255,255,.66)}
      .global-hero-links{margin-left:auto;display:flex;align-items:center;gap:54px;height:100%}
      .global-hero-links a{position:relative;display:flex;height:100%;align-items:center;color:rgba(255,255,255,.78);font-size:18px;font-weight:400;white-space:nowrap;transition:color .18s ease}
      .global-hero-links a:hover,.global-hero-links a.is-active{color:#fff}
      .global-hero-links a.is-active:after{content:'';position:absolute;left:50%;bottom:13px;width:6px;height:6px;border-radius:50%;background:#fff;transform:translateX(-50%)}
      .global-hero-bell{display:grid;size:48px;place-items:center;border:0;background:transparent;color:#fff}
      body:has(.global-hero-topnav) .octa-topbar{visibility:hidden!important;pointer-events:none!important}
      @media(max-width:1279px){.global-hero-topnav{left:0;height:88px;padding:0 18px;gap:16px}.global-hero-search{width:min(430px,44vw);height:54px}.global-hero-links{gap:26px}.global-hero-links a{font-size:15px}}
      @media(max-width:900px){.global-hero-links{display:none}.global-hero-search{width:min(620px,calc(100vw - 86px))}.global-hero-bell{margin-left:auto}}
      @media(max-width:700px){.global-hero-topnav{height:74px;padding:0 12px}.global-hero-search{height:48px;padding:0 16px}.global-hero-search input{font-size:13px}.global-hero-bell{size:42px}}
    `}</style>
  </>;
}
