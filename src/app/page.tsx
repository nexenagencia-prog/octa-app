import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Mic2, MoreHorizontal, Play, Plus, Sparkles, UsersRound, Video } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { demoParticipants } from '@/lib/demo/data';

const people=demoParticipants.slice(0,5);

export default function HomePage(){
  return <AppShell>
    <div className="octa-live-home">
      <section className="octa-live-hero">
        <div className="octa-live-hero-copy">
          <div className="octa-live-greeting">Bem-vindo de volta, Denner 👋</div>
          <h1>Suas reuniões.<br/>Seu tempo.<br/>Tudo conectado.</h1>
          <p>A OCTA reúne reuniões, agenda, contatos e gravações em uma única experiência — para você ir além em cada conversa.</p>
          <div className="octa-live-hero-actions">
            <Link href="/reuniao-instantanea" className="octa-live-primary"><Plus size={16}/>Nova reunião<ArrowRight size={15}/></Link>
            <Link href="/agenda" className="octa-live-secondary"><CalendarDays size={16}/>Agendar reunião</Link>
          </div>
        </div>

        <div className="octa-live-hero-photo">
          <Image src="/octa-hero-reference.webp" alt="Profissional em reunião OCTA" fill priority className="octa-live-hero-image"/>
          <div className="octa-live-hero-fade"/>
          <article className="octa-live-next-card">
            <div className="octa-live-next-label"><span><CalendarDays size={14}/></span><small>Próxima reunião</small><MoreHorizontal size={15}/></div>
            <div className="octa-live-next-time">14:30 <small>Hoje</small></div>
            <h3>Planejamento de Marketing</h3>
            <div className="octa-live-next-bottom">
              <div className="octa-live-avatars">
                {people.map((p,i)=>p.avatarUrl?<Image key={p.id} src={p.avatarUrl} alt="" width={30} height={30} className="object-cover"/>:<span key={i}/>)}
                <span className="octa-live-more">+5</span>
              </div>
              <Link href="/agenda">Ver agenda <ArrowRight size={12}/></Link>
            </div>
          </article>
          <div className="octa-live-quote">Grandes ideias acontecem em boas conversas.</div>
        </div>
      </section>

      <section className="octa-live-metrics">
        <Metric icon={<Video size={16}/>} value="08" label="Reuniões hoje"/>
        <Metric icon={<UsersRound size={16}/>} value="12" label="Contatos recentes"/>
        <Metric icon={<Play size={16}/>} value="24" label="Gravações"/>
        <Metric icon={<Sparkles size={16}/>} value="82%" label="Performance"/>
      </section>

      <section className="octa-live-top-grid">
        <div className="octa-live-card octa-live-actions">
          <h2>Ações rápidas</h2>
          <div className="octa-live-actions-grid">
            <QuickAction href="/reuniao-instantanea" icon={<Video size={17}/>} title="Iniciar reunião" sub="Agora, com um clique"/>
            <QuickAction href="/agenda" icon={<CalendarDays size={17}/>} title="Agendar" sub="Criar evento"/>
            <QuickAction href="/contatos" icon={<UsersRound size={17}/>} title="Convidar pessoas" sub="Adicionar participantes"/>
            <QuickAction href="/gravar" icon={<Mic2 size={17}/>} title="Gravar reunião" sub="Iniciar gravação"/>
          </div>
        </div>

        <Link href="/chat" className="octa-live-ai">
          <div className="octa-live-ai-copy"><h2>OCTA AI <span>Beta</span></h2><p>Sua IA de reuniões. Mais foco, mais resultados.</p><b>Abrir OCTA AI <ArrowRight size={12}/></b></div>
          <div className="octa-ai-visual" aria-hidden="true"><div className="octa-ai-orbit"/><div className="octa-ai-orb-core"/><div className="octa-ai-highlight"/><div className="octa-ai-caustic"/></div>
        </Link>

        <Link href="/skills" className="octa-live-card octa-live-skills">
          <div><h2>OCTA Skills</h2><p>Sua evolução em cada conversa.</p><b>Ver análise <ArrowRight size={12}/></b></div>
          <div className="octa-live-skill-ring"><strong>82</strong><span>/100</span></div>
        </Link>
      </section>

      <section className="octa-live-bottom-grid">
        <div className="octa-live-card octa-live-recent">
          <CardHead title="Reuniões recentes" href="/reunioes"/>
          <MeetingItem title="Briefing Campanha" meta="Hoje · 10:30" action="Entrar"/>
          <MeetingItem title="Alinhamento Comercial" meta="Hoje · 15:00" action="Entrar"/>
          <MeetingItem title="Reunião com Cliente" meta="Ontem · 16:20" action="Entrar"/>
        </div>

        <div className="octa-live-card octa-live-recordings">
          <CardHead title="Gravações" href="/gravacoes"/>
          <RecordingItem title="Planejamento de Marketing" meta="Hoje · 14:30 · 48 min" time="48:12"/>
          <RecordingItem title="Reunião com João Silva" meta="Ontem · 15:00 · 32 min" time="32:46"/>
          <RecordingItem title="Alinhamento Comercial" meta="Ontem · 10:30 · 26 min" time="26:10"/>
          <RecordingItem title="Briefing Campanha" meta="18 Mai · 11:00 · 52 min" time="52:33"/>
        </div>

        <div className="octa-live-card octa-live-agenda">
          <CardHead title="Agenda da semana" href="/agenda"/>
          <div className="octa-live-calendar-head"><span>Seg 18</span><span>Ter 19</span><b>Qua 20</b><span>Qui 21</span><span>Sex 22</span><span>Sáb 23</span><span>Dom 24</span></div>
          <div className="octa-live-calendar">
            <div className="octa-live-hours">{['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00'].map(x=><span key={x}>{x}</span>)}</div>
            <div className="octa-live-calendar-grid">
              <div className="octa-live-event a">Reunião com Cliente<small>09:00 – 10:00</small></div>
              <div className="octa-live-event b">Alinhamento de Equipe<small>10:30 – 11:30</small></div>
              <PlanningDarkEvent/>
              <div className="octa-live-event d">Apresentação<small>09:30 – 10:30</small></div>
              <div className="octa-live-event e">Revisão de Campanha<small>15:00 – 16:00</small></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppShell>
}

function Metric({icon,value,label}:{icon:React.ReactNode;value:string;label:string}){return <div className="octa-live-metric"><span>{icon}</span><strong>{value}</strong><small>{label}</small></div>}
function QuickAction({href,icon,title,sub}:{href:string;icon:React.ReactNode;title:string;sub:string}){return <Link href={href} className="octa-live-action"><span>{icon}</span><strong>{title}</strong><small>{sub}</small></Link>}
function CardHead({title,href}:{title:string;href:string}){return <div className="octa-live-card-head"><h2>{title}</h2><Link href={href}>Ver todas <ArrowRight size={11}/></Link></div>}
function MeetingItem({title,meta,action}:{title:string;meta:string;action:string}){return <div className="octa-live-meeting-item"><div className="octa-live-avatar-main"><Image src="/octa-hero-reference.webp" alt="" fill className="object-cover"/></div><div><strong>{title}</strong><small>{meta}</small></div><div className="octa-live-participants">{people.slice(0,3).map(p=>p.avatarUrl?<Image key={p.id} src={p.avatarUrl} alt="" width={20} height={20} className="object-cover"/>:null)}</div><Link href="/reunioes">{action}<ArrowRight size={11}/></Link></div>}
function RecordingItem({title,meta,time}:{title:string;meta:string;time:string}){return <div className="octa-live-recording-item"><div className="octa-live-thumb"><Image src="/octa-hero-reference.webp" alt="" fill className="object-cover"/><span>{time}</span></div><div><strong>{title}</strong><small>{meta}</small></div><MoreHorizontal size={14}/><Link href="/gravacoes" aria-label="Reproduzir"><Play size={13}/></Link></div>}
function PlanningDarkEvent(){return <div className="octa-live-event c">Planejamento de Marketing<small>14:30 – 16:00</small></div>}
