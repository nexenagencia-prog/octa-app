import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Mic2, Play, Plus, Search, Sparkles, UsersRound, Video } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { demoParticipants } from '@/lib/demo/data';
import { ProfileGreeting } from '@/components/profile-greeting';

const people=demoParticipants.slice(0,6);

export default function HomePage(){
  return <AppShell><section className="octa-v2-home">
    <div className="octa-v2-home-hero">
      <div className="octa-v2-home-copy">
        <ProfileGreeting className="octa-v2-greeting"/>
        <h1>Suas reuniões.<br/>Seu tempo.<br/><span>Tudo conectado.</span></h1>
        <p className="octa-v2-lead">A OCTA reúne reuniões, agenda, contatos e gravações em uma única experiência para você chegar mais preparado em cada conversa.</p>
        <div className="octa-v2-actions"><Link href="/reuniao-instantanea" className="octa-v2-primary"><Plus size={17}/> Nova reunião <ArrowRight size={15}/></Link><Link href="/agenda" className="octa-v2-secondary"><CalendarDays size={16}/> Agendar reunião</Link></div>
      </div>

      <div className="octa-v2-visual">
        <Image src="/octa-space-clean.png" alt="OCTA meetings" fill priority sizes="60vw" className="object-cover"/>
        <div className="octa-v2-visual-shade"/>
        <div className="octa-v2-profile-pill"><span className="size-2 rounded-full bg-[#8ef0d2]"/><span>Ambiente OCTA</span></div>
        <article className="octa-v2-next-dark">
          <div className="flex items-center justify-between"><span>Próxima reunião</span><span>•••</span></div>
          <strong>14:30 <small>Hoje</small></strong>
          <h3>Planejamento de Marketing</h3>
          <div className="flex items-center justify-between gap-4">
            <div className="flex -space-x-2">{people.slice(0,5).map(p=>p.avatarUrl?<Image key={p.id} src={p.avatarUrl} alt="" width={32} height={32} className="size-8 rounded-full border-2 border-[#0b0c0c] object-cover"/>:null)}<span className="grid size-8 place-items-center rounded-full border-2 border-[#0b0c0c] bg-white/10 text-[10px]">+5</span></div>
            <Link href="/room/strategy-room" className="octa-v2-round-link" aria-label="Entrar"><ArrowRight size={18}/></Link>
          </div>
        </article>
        <div className="octa-v2-quote">“Grandes ideias acontecem em boas conversas.”</div>
      </div>
    </div>

    <div className="octa-v2-stats">
      <Stat icon={<Video size={17}/>} value="08" label="Reuniões hoje"/>
      <Stat icon={<UsersRound size={17}/>} value="12" label="Contatos recentes"/>
      <Stat icon={<Play size={17}/>} value="24" label="Gravações"/>
      <Stat icon={<Sparkles size={17}/>} value="82%" label="Performance"/>
    </div>

    <div className="octa-v2-dashboard-grid">
      <section className="octa-hybrid-card octa-v2-quick">
        <header><div><span className="octa-v2-eyebrow">Ações rápidas</span><h2>Comece em segundos.</h2></div></header>
        <div className="octa-v2-quick-grid">
          <Quick href="/reuniao-instantanea" icon={<Video size={18}/>} title="Iniciar reunião" text="Começar agora"/>
          <Quick href="/agenda" icon={<CalendarDays size={18}/>} title="Agendar" text="Criar evento"/>
          <Quick href="/contatos" icon={<UsersRound size={18}/>} title="Convidar pessoas" text="Adicionar participantes"/>
          <Quick href="/gravar" icon={<Mic2 size={18}/>} title="Gravar reunião" text="Iniciar gravação"/>
        </div>
      </section>

      <section className="octa-hybrid-card octa-v2-ai-card">
        <div className="octa-v2-ai-orb"/><div className="relative z-10"><span className="octa-v2-eyebrow text-white/50">OCTA AI</span><h2>Inteligência para cada conversa.</h2><p>Resumo, decisões, tarefas e contexto em um só lugar.</p><Link href="/chat">Abrir OCTA AI <ArrowRight size={14}/></Link></div>
      </section>

      <section className="octa-hybrid-card octa-v2-skill-card">
        <div><span className="octa-v2-eyebrow">OCTA Skills</span><h2>Sua evolução, visível.</h2><p>Clareza, escuta, objetividade e condução com evidência.</p><Link href="/skills">Ver análise <ArrowRight size={14}/></Link></div>
        <div className="octa-v2-score"><strong>82</strong><span>/100</span></div>
      </section>

      <section className="octa-hybrid-card octa-v2-list-card">
        <header><div><span className="octa-v2-eyebrow">Reuniões recentes</span><h2>Continue de onde parou.</h2></div><Link href="/reunioes">Ver todas <ArrowRight size={13}/></Link></header>
        <HomeRow title="Briefing Campanha" meta="Hoje · 10:30" action="Entrar"/>
        <HomeRow title="Alinhamento Comercial" meta="Hoje · 15:00" action="Entrar"/>
        <HomeRow title="Reunião com Cliente" meta="Ontem · 16:20" action="Abrir"/>
      </section>

      <section className="octa-hybrid-card octa-v2-recordings-card">
        <header><div><span className="octa-v2-eyebrow">Gravações</span><h2>Momentos importantes.</h2></div><Link href="/gravacoes">Ver todas <ArrowRight size={13}/></Link></header>
        {['Planejamento de Marketing','Reunião com João Silva','Alinhamento Comercial'].map((title,i)=><div className="octa-v2-recording-row" key={title}><div className="octa-v2-recording-thumb"><Image src="/octa-space-clean.png" alt="" fill className="object-cover"/><span>{['48:12','32:46','26:10'][i]}</span></div><div className="min-w-0"><strong>{title}</strong><small>{i===0?'Hoje · 14:30':'Ontem · 15:00'}</small></div><Play size={15}/></div>)}
      </section>

      <section className="octa-hybrid-card octa-v2-agenda-card">
        <header><div><span className="octa-v2-eyebrow">Agenda da semana</span><h2>Seu ritmo, organizado.</h2></div><Link href="/agenda">Ver agenda <ArrowRight size={13}/></Link></header>
        <div className="octa-v2-mini-agenda"><div className="octa-v2-agenda-hours">{['08','10','12','14','16'].map(x=><span key={x}>{x}:00</span>)}</div><div className="octa-v2-agenda-body"><div className="octa-v2-event e1">Reunião com Cliente</div><div className="octa-v2-event e2">Planejamento de Marketing</div><div className="octa-v2-event e3">Revisão de Campanha</div></div></div>
      </section>
    </div>
  </section></AppShell>
}

function Stat({icon,value,label}:{icon:React.ReactNode;value:string;label:string}){return <div className="octa-v2-stat"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}
function Quick({href,icon,title,text}:{href:string;icon:React.ReactNode;title:string;text:string}){return <Link href={href} className="octa-v2-quick-item"><span>{icon}</span><strong>{title}</strong><small>{text}</small></Link>}
function HomeRow({title,meta,action}:{title:string;meta:string;action:string}){return <div className="octa-v2-home-row"><div className="size-9 rounded-full bg-[linear-gradient(145deg,#202323,#727777)]"/><div className="min-w-0 flex-1"><strong>{title}</strong><small>{meta}</small></div><button>{action}</button></div>}
