import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bell, CalendarDays, ChevronRight, CircleUserRound, Clock3, MoreHorizontal, Play, Search, UserPlus, UsersRound, Video, VideoIcon, Waves } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { ProfileGreeting } from '@/components/profile-greeting';
import { demoParticipants } from '@/lib/demo/data';

const people = demoParticipants.slice(0,5);
const recordings = [
  ['Planejamento de Marketing','Hoje · 14:30 · 48 min','48:12'],
  ['Reunião com João Silva','Ontem · 15:00 · 32 min','32:46'],
  ['Alinhamento Comercial','Ontem · 10:30 · 26 min','26:10'],
  ['Briefing Campanha','18 Mai · 11:00 · 52 min','52:33'],
];

export default function HomePage(){
  return <AppShell variant="dashboard"><div className="octa-dashboard-shell">
    <section className="octa-dashboard-hero">
      <div className="octa-hero-photo" aria-hidden="true"><Image src="/octa-space-clean.png" alt="" fill priority className="object-cover"/></div>
      <div className="octa-hero-fade"/>
      <div className="octa-dashboard-search"><Search size={20}/><span>Buscar reunião, pessoa ou gravação...</span><kbd>⌘ K</kbd></div>
      <div className="octa-dashboard-user"><Bell size={20}/><span className="octa-alert-dot"/><Image src={people[0].avatarUrl!} alt="Denner Biersack" width={38} height={38}/><strong>Denner Biersack</strong><ChevronRight size={16}/></div>
      <div className="octa-hero-copy">
        <ProfileGreeting className="octa-dashboard-greeting"/>
        <h1>Suas reuniões.<br/>Seu tempo.<br/>Tudo conectado.</h1>
        <div className="octa-hero-description">A OCTA reúne reuniões, agenda, contatos e<br/>gravações em uma única experiência —<br/>para você ir além em cada conversa.</div>
        <div className="octa-hero-actions"><Link href="/reuniao-instantanea" className="is-primary">＋ <span>Nova reunião</span><ArrowRight size={17}/></Link><Link href="/agenda"><CalendarDays size={17}/> Agendar reunião</Link></div>
      </div>
      <div className="octa-next-meeting">
        <div className="octa-next-head"><span><CalendarDays size={18}/> Próxima reunião</span><MoreHorizontal size={18}/></div>
        <div className="octa-next-time"><strong>14:30</strong><span>Hoje</span><Link href="/agenda">Ver agenda <ArrowRight size={14}/></Link></div>
        <h3>Planejamento de Marketing</h3><AvatarStack/><span className="octa-plus-five">+5</span>
      </div>
      <blockquote>ϟ “Grandes ideias<br/>acontecem em boas conversas.”</blockquote>
      <div className="octa-metrics">
        <Metric icon={<Video size={18}/>} value="08" label="Reuniões hoje"/><Metric icon={<UsersRound size={18}/>} value="12" label="Contatos recentes"/><Metric icon={<Play size={18}/>} value="24" label="Gravações"/><Metric icon={<Waves size={18}/>} value="82%" label="Performance"/>
      </div>
    </section>

    <section className="octa-dashboard-grid">
      <div className="octa-quick panel"><h2>Ações rápidas</h2><div className="octa-quick-grid"><Quick href="/reuniao-instantanea" icon={<Video size={20}/>} title="Iniciar reunião" text="Agora, com um clique"/><Quick href="/agenda" icon={<CalendarDays size={20}/>} title="Agendar" text="Criar evento"/><Quick href="/contatos" icon={<UserPlus size={20}/>} title="Convidar pessoas" text="Adicionar participantes"/><Quick href="/gravar" icon={<VideoIcon size={20}/>} title="Gravar reunião" text="Iniciar gravação"/></div></div>
      <Link href="/chat" className="octa-ai-card"><div><h2>OCTA AI <small>Beta</small></h2><p>Sua IA de reuniões. Mais<br/>foco, mais resultados.</p><span>Abrir OCTA AI <ArrowRight size={14}/></span></div><div className="octa-ai-orb"/></Link>
      <Link href="/skills" className="octa-skills-card panel"><div><h2>OCTA Skills</h2><p>Sua evolução em<br/>cada conversa.</p><span>Ver análise <ArrowRight size={14}/></span></div><div className="octa-score"><strong>82</strong><small>/100</small></div></Link>

      <div className="octa-recent panel"><PanelTitle title="Reuniões recentes" href="/reunioes"/><MeetingLine name="Briefing Campanha" meta="Hoje · 10:30" person={0} action/><MeetingLine name="Alinhamento Comercial" meta="Hoje · 15:00" person={2} action/><MeetingLine name="Reunião com Cliente" meta="Ontem · 16:20" person={3}/></div>
      <div className="octa-recordings panel"><PanelTitle title="Gravações" href="/gravacoes"/>{recordings.map((r,i)=><div className="octa-recording-row" key={r[0]}><div className="octa-recording-thumb"><Image src="/octa-space-clean.png" alt="" fill className="object-cover"/><b>{r[2]}</b></div><div><strong>{r[0]}</strong><span>{r[1]}</span></div><MoreHorizontal size={16}/><button aria-label={`Reproduzir ${r[0]}`}><Play size={13} fill="currentColor"/></button></div>)}</div>
      <div className="octa-week panel"><PanelTitle title="Agenda da semana" href="/agenda"/><WeekCalendar/></div>
    </section>
  </div></AppShell>
}

function Metric({icon,value,label}:{icon:React.ReactNode;value:string;label:string}){return <div className="octa-metric"><i>{icon}</i><div><strong>{value}</strong><span>{label}</span></div></div>}
function Quick({href,icon,title,text}:{href:string;icon:React.ReactNode;title:string;text:string}){return <Link href={href}><i>{icon}</i><strong>{title}</strong><span>{text}</span></Link>}
function AvatarStack(){return <div className="octa-avatar-stack">{people.slice(0,4).map(p=><Image key={p.id} src={p.avatarUrl!} alt={p.displayName} width={30} height={30}/>)}</div>}
function PanelTitle({title,href}:{title:string;href:string}){return <div className="octa-panel-title"><h2>{title}</h2><Link href={href}>Ver todas <ArrowRight size={13}/></Link></div>}
function MeetingLine({name,meta,person,action=false}:{name:string;meta:string;person:number;action?:boolean}){return <div className="octa-meeting-line"><Image src={people[person].avatarUrl!} alt="" width={32} height={32}/><div><strong>{name}</strong><span>{meta}</span></div><AvatarStack/>{action?<Link href="/reunioes">Entrar <ArrowRight size={13}/></Link>:<button><Play size={12}/></button>}<MoreHorizontal size={15}/></div>}
function WeekCalendar(){const days=['Seg 18','Ter 19','Qua 20','Qui 21','Sex 22','Sáb 23','Dom 24'];return <div className="octa-calendar"><div className="octa-calendar-days">{days.map((d,i)=><span className={i===2?'active':''} key={d}>{d}</span>)}</div><div className="octa-calendar-body"><div className="octa-times">{['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(t=><span key={t}>{t}</span>)}</div><div className="octa-calendar-grid"><span className="event e1">Reunião com Cliente<small>09:00 – 10:00</small></span><span className="event e2">Alinhamento de Equipe<small>10:30 – 11:30</small></span><span className="event e3 dark">Planejamento de Marketing<small>14:30 – 16:00</small></span><span className="event e4">Apresentação<small>09:30 – 10:30</small></span><span className="event e5">Briefing Criativo<small>11:00 – 12:00</small></span><span className="event e6">Revisão de Campanha<small>15:00 – 16:00</small></span></div></div></div>}
