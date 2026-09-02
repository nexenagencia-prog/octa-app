'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {ArrowRight,BookOpenText,Calculator,CalendarDays,FileImage,Filter,Home,Monitor,NotebookPen,Play,Sparkles,UserRound,VideoIcon} from 'lucide-react';
import {demoParticipants} from '@/lib/demo/data';
import homeStyles from '@/app/home-reference.module.css';

const side=[['Início','/',Home],['Reuniões','/reunioes',VideoIcon],['Agenda','/agenda',CalendarDays],['Contatos','/contatos',UserRound],['Gravações','/gravacoes',Play],['Calculadora','/calculadora',Calculator],['Filtros','/filtros',Filter],['Criar slides','/criar-slides',FileImage],['Anotar','/anotacoes',NotebookPen],['Lousa','/lousa',Monitor],['Minhas Anotações','/minhas-anotacoes',BookOpenText],['Skill','/skills',Sparkles]] as const;
const excluded=(path:string)=>path.startsWith('/login')||path.startsWith('/reset-password')||path.startsWith('/auth')||path.startsWith('/admin');

export function GlobalLegacySidebar(){
  const pathname=usePathname();
  const active=!excluded(pathname);
  const[name,setName]=useState('Sandro');
  const[headline,setHeadline]=useState('Marketing Digital');
  const[avatar,setAvatar]=useState(demoParticipants[0]?.avatarUrl||'/octa-hero-reference.webp');

  useEffect(()=>{
    if(!active)return;
    const apply=(p:any)=>{if(p?.displayName||p?.name)setName(p.displayName||p.name);if(p?.headline)setHeadline(p.headline);if(p?.avatarUrl)setAvatar(p.avatarUrl)};
    fetch('/api/profile',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>apply(d?.profile)).catch(()=>{});
    const sync=(e:Event)=>apply((e as CustomEvent).detail);
    window.addEventListener('octa-profile:updated',sync);
    return()=>window.removeEventListener('octa-profile:updated',sync);
  },[active]);

  if(!active)return null;
  return <>
    <div className="octa-home-sidebar-global">
      <aside className={homeStyles.sidebar}>
        <Link href="/" className={`${homeStyles.brand} octa-hero-brand-lock`}><span className={homeStyles.logoRing}/>OCTA</Link>
        <div className={`${homeStyles.profile} octa-hero-profile-lock`}><div className={homeStyles.avatar}><img src={avatar} alt={name}/><i/></div><div><strong>{name}</strong><span>{headline}</span></div></div>
        <div className={homeStyles.performance}><div><span>Performance do skills</span><b>82/100</b></div><i><em/></i></div>
        <nav>{side.map(([label,href,Icon])=>{const target=href.split('?')[0];const isActive=target==='/'?pathname==='/':pathname===target||pathname.startsWith(target+'/');return <Link key={label} href={href} className={isActive?homeStyles.active:''}><Icon size={20}/><span>{label}</span></Link>})}</nav>
        <Link href="/planos" className={homeStyles.plan}><span>◇</span><div><b>Plano Pro</b><small>Renova em 12 dias</small></div><ArrowRight size={16}/></Link>
      </aside>
    </div>
    <style jsx global>{`
      .octa-hero-brand-lock,.octa-hero-brand-lock *,.octa-hero-profile-lock strong{color:#fff!important;-webkit-text-fill-color:#fff!important}
      .octa-hero-profile-lock>div:last-child>span{color:rgba(255,255,255,.62)!important;-webkit-text-fill-color:rgba(255,255,255,.62)!important}
      .octa-home-sidebar-global>aside{background:linear-gradient(180deg,rgba(8,11,13,.98),rgba(9,11,12,.965))!important}
      @media (min-width:1280px){
        .octa-home-sidebar-global{position:fixed!important;inset:0 auto 0 0!important;width:250px!important;height:100dvh!important;z-index:2147482000!important;overflow:hidden!important}
        .octa-home-sidebar-global>aside{position:absolute!important;inset:0!important;width:250px!important;height:100dvh!important;min-height:100dvh!important;max-height:100dvh!important;border-radius:0!important;transform:none!important;margin:0!important}
        .octa-page>.octa-sidebar{display:none!important}
        .octa-page .octa-main,.octa-page.sidebar-collapsed .octa-main{margin-left:250px!important}
        body>main:not(.octa-page){margin-left:250px!important;width:calc(100% - 250px)!important;max-width:none!important}
        body>main:has(>section[class*="_workspace"]){margin-left:250px!important;width:calc(100% - 250px)!important;display:block!important}
        body>main:has(>section[class*="_workspace"])>aside:first-child{display:none!important}
        body>main:has(>.recordings-workspace){margin-left:250px!important;width:calc(100% - 250px)!important;display:block!important}
        body>main:has(>.recordings-workspace)>aside:first-child{display:none!important}
      }
    `}</style>
  </>;
}
