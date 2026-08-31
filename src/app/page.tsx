'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Bell, BookOpenText, CalendarDays, ChevronDown, ChevronRight,
  CirclePlay, Home, MoreVertical, Play, Plus, Search, Settings, Sparkles,
  UserRoundPlus, UsersRound, Video
} from 'lucide-react';
import { demoParticipants } from '@/lib/demo/data';

const people=demoParticipants.slice(0,5);
const avatar=(i:number)=>people[i]?.avatarUrl || '/octa-hero-reference.webp';

export default function HomePage(){
  const router=useRouter();
  const [query,setQuery]=useState('');
  const search=(e:FormEvent)=>{e.preventDefault();if(query.trim())router.push(`/reunioes?q=${encodeURIComponent(query.trim())}`)};
  return <main className="octa-third-home">
    <aside className="octa-third-sidebar">
      <div className="octa-third-brand">
        <div className="octa-third-logo" aria-hidden="true"><i/><i/><i/></div>
        <strong>OCTA</strong>
      </div>

      <Link href="/reunioes" className="octa-third-side-search" aria-label="Buscar"><Search size={18}/></Link>
      <Link href="/" className="octa-third-home-button" aria-label="Início"><Home size={20}/></Link>

      <nav className="octa-third-side-links">
        <SideLink href="/reunioes" icon={<Video/>} label="Reuniões"/>
        <SideLink href="/agenda" icon={<CalendarDays/>} label="Agenda"/>
        <SideLink href="/contatos" icon={<UsersRound/>} label="Contatos"/>
        <SideLink href="/gravacoes" icon={<CirclePlay/>} label="Gravações"/>
        <SideLink href="/chat" icon={<Sparkles/>} label="OCTA AI" badge="Novo"/>
        <SideLink href="/skills" icon={<BookOpenText/>} label="OCTA Skills"/>
        <SideLink href="/configuracoes" icon={<Bell/>} label="Notificações"/>
        <SideLink href="/configuracoes" icon={<Settings/>} label="Configurações"/>
      </nav>

      <Link href="/profile" className="octa-third-profile-side">
        <div><Image src={avatar(0)} alt="" fill className="object-cover"/><i/></div>
        <strong>Denner Biersack</strong><small>Marketing Digital</small>
      </Link>
      <button className="octa-third-collapse" aria-label="Recolher menu"><ChevronDown size={16}/></button>
    </aside>

    <section className="octa-third-main">
      <header className="octa-third-topbar">
        <form className="octa-third-search" onSubmit={search}>
          <Search size={17}/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar reunião, pessoa ou gravação..."/>
          <kbd>⌘ K</kbd>
        </form>
        <button className="octa-third-bell" aria-label="Notificações"><Bell size={19}/><i/></button>
        <Link href="/profile" className="octa-third-profile-top">
          <Image src={avatar(0)} alt="" width={34} height={34} className="object-cover"/>
          <span>Denner Biersack</span><ChevronDown size={14}/>
        </Link>
      </header>

      <section className="octa-third-hero">
        <div className="octa-third-copy">
          <p>Bem-vindo de volta, Denner 👋</p>
          <h1>Suas reuniões.<br/>Seu tempo.<br/>Tudo conectado.</h1>
          <div className="octa-third-lead">A OCTA reúne reuniões, agenda, contatos e gravações em uma única experiência — para você ir além em cada conversa.</div>
          <div className="octa-third-ctas">
            <Link href="/reuniao-instantanea" className="octa-third-primary"><Plus size={18}/>Nova reunião<ArrowRight size={16}/></Link>
            <Link href="/agenda" className="octa-third-secondary"><CalendarDays size={17}/>Agendar reunião</Link>
          </div>
        </div>

        <div className="octa-third-photo">
          <Image src="/octa-hero-reference.webp" alt="Profissional trabalhando no notebook" fill priority className="octa-third-hero-image"/>
          <div className="octa-third-photo-shade"/>
          <article className="octa-third-next">
            <div className="octa-third-next-head"><span><CalendarDays size={17}/></span><small>Próxima reunião</small><MoreVertical size={17}/></div>
            <div className="octa-third-time">14:30 <small>Hoje</small><Link href="/agenda">Ver agenda <ArrowRight size={12}/></Link></div>
            <h2>Planejamento de Marketing</h2>
            <div className="octa-third-next-bottom">
              <div className="octa-third-avatars">
                {[0,1,2,3].map(i=><Image key={i} src={avatar(i)} alt="" width={31} height={31} className="object-cover"/>)}
                <b>+5</b>
              </div>
            </div>
          </article>
          <p className="octa-third-quote">⚡ “Grandes ideias<br/>acontecem em boas conversas.”</p>
        </div>
      </section>

      <section className="octa-third-metrics">
        <Metric icon={<Video/>} value="08" label="Reuniões hoje"/>
        <Metric icon={<UsersRound/>} value="12" label="Contatos recentes"/>
        <Metric icon={<CirclePlay/>} value="24" label="Gravações"/>
        <Metric icon={<Sparkles/>} value="82%" label="Performance"/>
      </section>

      <section className="octa-third-middle">
        <article className="octa-third-card octa-third-actions">
          <h2>Ações rápidas</h2>
          <div>
            <Action href="/reuniao-instantanea" icon={<Video/>} title="Iniciar reunião" sub="Agora, com um clique"/>
            <Action href="/agenda" icon={<CalendarDays/>} title="Agendar" sub="Criar evento"/>
            <Action href="/contatos" icon={<UserRoundPlus/>} title="Convidar pessoas" sub="Adicionar participantes"/>
            <Action href="/gravacoes" icon={<CirclePlay/>} title="Gravar reunião" sub="Iniciar gravação"/>
          </div>
        </article>

        <Link href="/chat" className="octa-third-ai">
          <div className="octa-third-ai-copy"><h2>OCTA AI <b>Beta</b></h2><p>Sua IA de reuniões. Mais foco, mais resultados.</p><span>Abrir OCTA AI <ArrowRight size={12}/></span></div>
          <div className="octa-third-ai-orb octa-third-ai-static"><i/><i/><i/></div>
        </Link>

        <Link href="/skills" className="octa-third-card octa-third-skills">
          <div><h2>OCTA Skills</h2><p>Sua evolução em<br/>cada conversa.</p><span>Ver análise <ArrowRight size={12}/></span></div>
          <div className="octa-third-ring"><strong>82</strong><small>/100</small></div>
        </Link>
      </section>

      <section className="octa-third-bottom">
        <article className="octa-third-card octa-third-recent">
          <CardHead title="Reuniões recentes" href="/reunioes" label="Ver todas"/>
          <MeetingItem photo={avatar(0)} title="Briefing Campanha" meta="Hoje · 10:30"/>
          <MeetingItem photo={avatar(1)} title="Alinhamento Comercial" meta="Hoje · 15:00"/>
          <MeetingItem photo={avatar(2)} title="Reunião com Cliente" meta="Ontem · 16:20"/>
        </article>

        <article className="octa-third-card octa-third-recordings">
          <CardHead title="Gravações" href="/gravacoes" label="Ver todas"/>
          <RecordingItem photo={avatar(0)} title="Planejamento de Marketing" meta="Hoje · 14:30 · 48 min" duration="48:12"/>
          <RecordingItem photo={avatar(0)} title="Reunião com João Silva" meta="Ontem · 15:00 · 32 min" duration="32:46"/>
          <RecordingItem photo={avatar(0)} title="Alinhamento Comercial" meta="Ontem · 10:30 · 26 min" duration="26:10"/>
          <RecordingItem photo={avatar(1)} title="Briefing Campanha" meta="18 Mai · 11:00 · 52 min" duration="52:33"/>
        </article>

        <article className="octa-third-card octa-third-agenda">
          <CardHead title="Agenda da semana" href="/agenda" label="Ver agenda"/>
          <div className="octa-third-days"><span>Seg 18</span><span>Ter 19</span><b>Qua 20</b><span>Qui 21</span><span>Sex 22</span><span>Sáb 23</span><span>Dom 24</span></div>
          <div className="octa-third-calendar">
            <div className="octa-third-hours">{['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(x=><span key={x}>{x}</span>)}</div>
            <div className="octa-third-grid">
              <Event className="a" title="Reunião com Cliente" time="09:00 – 10:00"/>
              <Event className="b" title="Alinhamento de Equipe" time="10:30 – 11:30"/>
              <Event className="c" title="Planejamento de Marketing" time="14:30 – 16:00"/>
              <Event className="d" title="Apresentação" time="09:30 – 10:30"/>
              <Event className="e" title="Briefing Criativo" time="11:00 – 12:00"/>
              <Event className="f" title="Revisão de Campanha" time="15:00 – 16:00"/>
            </div>
          </div>
        </article>
      </section>
    </section>
  </main>
}

function SideLink({href,icon,label,badge}:{href:string;icon:React.ReactNode;label:string;badge?:string}){return <Link href={href} className="octa-third-side-link"><span>{icon}</span><b>{label}</b>{badge&&<small>{badge}</small>}</Link>}
function Metric({icon,value,label}:{icon:React.ReactNode;value:string;label:string}){return <div className="octa-third-metric"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}
function Action({href,icon,title,sub}:{href:string;icon:React.ReactNode;title:string;sub:string}){return <Link href={href} className="octa-third-action"><span>{icon}</span><strong>{title}</strong><small>{sub}</small></Link>}
function CardHead({title,href,label}:{title:string;href:string;label:string}){return <header className="octa-third-cardhead"><h2>{title}</h2><Link href={href}>{label}<ArrowRight size={11}/></Link></header>}
function MeetingItem({photo,title,meta}:{photo:string;title:string;meta:string}){return <div className="octa-third-meeting"><Image src={photo} alt="" width={31} height={31} className="object-cover"/><div><strong>{title}</strong><small>{meta}</small></div><div className="octa-third-mini-avatars">{[0,1,2].map(i=><Image key={i} src={avatar(i)} alt="" width={18} height={18}/>)}</div><Link href="/reunioes">Entrar<ArrowRight size={10}/></Link><MoreVertical size={14}/></div>}
function RecordingItem({photo,title,meta,duration}:{photo:string;title:string;meta:string;duration:string}){return <div className="octa-third-recording"><div className="octa-third-thumb"><Image src={photo} alt="" fill className="object-cover"/><span>{duration}</span></div><div><strong>{title}</strong><small>{meta}</small></div><MoreVertical size={14}/><Link href="/gravacoes" aria-label="Reproduzir"><Play size={12}/></Link></div>}
function Event({className,title,time}:{className:string;title:string;time:string}){return <div className={`octa-third-event ${className}`}><strong>{title}</strong><small>{time}</small></div>}
