import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, CircleUserRound, Mic2, Play, Plus, Sparkles, UsersRound, Video } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { demoParticipants } from '@/lib/demo/data';

const people=demoParticipants.slice(0,5);

export default function HomePage(){
  return <AppShell><div className="octa-ref-home" data-search-shortcut="⌘ K" data-profile-name="Denner Biersack">
    <section className="octa-ref-hero">
      <div className="octa-ref-copy">
        <div className="octa-ref-greeting">Bem-vindo de volta, Denner 👋</div>
        <h1>Suas reuniões.<br/>Seu tempo.<br/>Tudo conectado.</h1>
        <p>A OCTA reúne reuniões, agenda, contatos e gravações em uma única experiência — para você ir além em cada conversa.</p>
        <div className="octa-ref-cta-row">
          <Link href="/reuniao-instantanea" className="octa-ref-primary"><Plus size={17}/>Nova reunião<ArrowRight size={16}/></Link>
          <Link href="/agenda" className="octa-ref-secondary"><CalendarDays size={17}/>Agendar reunião</Link>
        </div>
      </div>

      <div className="octa-ref-photo">
        <Image src="/octa-hero-photo.jpg" alt="Profissional trabalhando em uma reunião OCTA" fill priority className="object-cover"/>
        <div className="octa-ref-photo-fade"/>
        <div className="octa-ref-lightwash"/><div className="octa-ref-hero-glow"/>
        <article className="octa-ref-next">
          <div className="octa-ref-next-top"><span><CalendarDays size={15}/></span><small>Próxima reunião</small><b>•••</b></div>
          <div className="octa-ref-time">14:30 <small>Hoje</small></div>
          <h3>Planejamento de Marketing</h3>
          <div className="octa-ref-next-bottom">
            <div className="octa-ref-avatars">{people.map((p,i)=>p.avatarUrl?<Image key={p.id} src={p.avatarUrl} alt="" width={30} height={30} className="rounded-full object-cover"/>:<span key={i}/>) }<span className="octa-ref-more">+5</span></div>
            <Link href="/agenda">Ver agenda <ArrowRight size={13}/></Link>
          </div>
        </article>
        <div className="octa-ref-quote">“Grandes ideias<br/>acontecem em boas conversas.”</div>
      </div>
    </section>

    <section className="octa-ref-metrics">
      <Metric icon={<Video size={17}/>} value="08" label="Reuniões hoje"/>
      <Metric icon={<UsersRound size={17}/>} value="12" label="Contatos recentes"/>
      <Metric icon={<Play size={17}/>} value="24" label="Gravações"/>
      <Metric icon={<Sparkles size={17}/>} value="82%" label="Performance"/>
    </section>

    <section className="octa-ref-topgrid">
      <div className="octa-ref-card octa-ref-actions">
        <h2>Ações rápidas</h2>
        <div className="octa-ref-action-grid">
          <Action href="/reuniao-instantanea" icon={<Video size={18}/>} title="Iniciar reunião" sub="Agora, com um clique"/>
          <Action href="/agenda" icon={<CalendarDays size={18}/>} title="Agendar" sub="Criar evento"/>
          <Action href="/contatos" icon={<UsersRound size={18}/>} title="Convidar pessoas" sub="Adicionar participantes"/>
          <Action href="/gravar" icon={<Mic2 size={18}/>} title="Gravar reunião" sub="Iniciar gravação"/>
        </div>
      </div>

      <div className="octa-ref-ai">
        <div><h2>OCTA AI <span>Beta</span></h2><p>Sua IA de reuniões. Mais foco, mais resultados.</p><Link href="/chat">Abrir OCTA AI <ArrowRight size={13}/></Link></div>
        <div className="octa-ai-visual octa-ai-glass-sphere" aria-hidden="true">
          <div className="octa-ai-orbit"/>
          <div className="octa-ai-orb-core"/>
          <div className="octa-ai-highlight"/>
          <div className="octa-ai-caustic"/>
        </div>
      </div>

      <div className="octa-ref-card octa-ref-skills">
        <div><h2>OCTA Skills</h2><p>Sua evolução em<br/>cada conversa.</p><Link href="/skills">Ver análise <ArrowRight size={13}/></Link></div>
        <div className="octa-ref-ring"><strong>82</strong><span>/100</span></div>
      </div>
    </section>

    <section className="octa-ref-bottomgrid">
      <div className="octa-ref-card octa-ref-recent">
        <CardHead title="Reuniões recentes" href="/reunioes"/>
        <MeetingRow title="Briefing Campanha" meta="Hoje · 10:30" action="Entrar"/>
        <MeetingRow title="Alinhamento Comercial" meta="Hoje · 15:00" action="Entrar"/>
        <MeetingRow title="Reunião com Cliente" meta="Ontem · 16:20" action="Abrir"/>
      </div>

      <div className="octa-ref-card octa-ref-recordings">
        <CardHead title="Gravações" href="/gravacoes"/>
        <Recording title="Planejamento de Marketing" meta="Hoje · 14:30 · 48 min" time="48:12"/>
        <Recording title="Reunião com João Silva" meta="Ontem · 15:00 · 32 min" time="32:46"/>
        <Recording title="Alinhamento Comercial" meta="Ontem · 10:30 · 26 min" time="26:10"/>
        <Recording title="Briefing Campanha" meta="18 Mai · 11:00 · 52 min" time="52:33"/>
      </div>

      <div className="octa-ref-card octa-ref-agenda">
        <CardHead title="Agenda da semana" href="/agenda"/>
        <div className="octa-ref-calendar-head"><span>Seg 18</span><span>Ter 19</span><b>Qua 20</b><span>Qui 21</span><span>Sex 22</span><span>Sáb 23</span><span>Dom 24</span></div>
        <div className="octa-ref-calendar">
          <div className="octa-ref-hours">{['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'].map(x=><span key={x}>{x}</span>)}</div>
          <div className="octa-ref-gridlines">
            <div className="octa-ref-event a">Reunião com Cliente<small>09:00 – 10:00</small></div>
            <div className="octa-ref-event b">Alinhamento de Equipe<small>10:30 – 11:30</small></div>
            <div className="octa-ref-event c">Planejamento de Marketing<small>14:30 – 16:00</small></div>
            <div className="octa-ref-event d">Apresentação<small>09:30 – 10:30</small></div>
            <div className="octa-ref-event e">Revisão de Campanha<small>15:00 – 16:00</small></div>
            <div className="octa-ref-event f">Briefing Criativo<small>11:00 – 12:00</small></div>
          </div>
        </div>
      </div>
    </section>
  </div></AppShell>
}

function Metric({icon,value,label}:{icon:React.ReactNode;value:string;label:string}){return <div className="octa-ref-metric"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}
function Action({href,icon,title,sub}:{href:string;icon:React.ReactNode;title:string;sub:string}){return <Link href={href} className="octa-ref-action"><span>{icon}</span><strong>{title}</strong><small>{sub}</small></Link>}
function CardHead({title,href}:{title:string;href:string}){return <div className="octa-ref-cardhead"><h2>{title}</h2><Link href={href}>Ver todas <ArrowRight size={12}/></Link></div>}
function MeetingRow({title,meta,action}:{title:string;meta:string;action:string}){return <div className="octa-ref-meeting-row"><div className="octa-ref-person"/><div><strong>{title}</strong><small>{meta}</small></div><div className="octa-ref-mini-people"><i/><i/><i/></div><button>{action}<ArrowRight size={12}/></button></div>}
function Recording({title,meta,time}:{title:string;meta:string;time:string}){return <div className="octa-ref-recording"><div className="octa-ref-thumb"><Image src="/octa-hero-photo.jpg" alt="" fill className="object-cover"/><span>{time}</span></div><div><strong>{title}</strong><small>{meta}</small></div><button aria-label="Reproduzir"><Play size={14}/></button></div>}
