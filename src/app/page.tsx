import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, CalendarDays, ChevronRight, MoreVertical,
  Play
} from 'lucide-react';
import { demoParticipants } from '@/lib/demo/data';
import { AppShell } from '@/components/app-shell';
import { HomeHeroOverlays } from '@/components/home-hero-overlays';
import { ProfileGreeting } from '@/components/profile-greeting';

const people = demoParticipants.slice(0,6);

export default function HomePage(){
  return <AppShell><div className="octa-content-grid">
        <section className="home-left min-w-0 pt-1">
          <ProfileGreeting className="text-[21px] font-medium text-[#08758a]"/>
          <h1 className="mt-1 text-[clamp(3rem,4.7vw,4.4rem)] font-medium leading-[.98] tracking-[-.055em] text-[#0a2238]">Seu dia<br/>começa aqui.</h1>

          <div className="mt-9" id="contatos">
            <h2 className="text-[15px] font-medium text-[#15314b]">Para reunião instantânea</h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2">{people.map((p)=><Link href={`/contatos?person=${p.id}`} key={p.id} className="group relative size-10 overflow-hidden rounded-full bg-white shadow-[0_2px_8px_rgba(7,31,45,.14)] ring-2 ring-white" aria-label={`Iniciar reunião com ${p.displayName}`}>
                {p.avatarUrl&&<Image src={p.avatarUrl} alt={p.displayName} fill className="object-cover transition duration-300 group-hover:scale-105"/>}
              </Link>)}</div>
              <Link href="/contatos" aria-label="Ver mais pessoas" className="grid size-11 place-items-center rounded-full border border-[#0a2238]/8 bg-white/60 text-[#17314a] shadow-sm"><ChevronRight size={20}/></Link>
            </div>
          </div>

          <section className="mt-8" id="agenda">
            <h2 className="text-[15px] font-medium text-[#17314a]">Próxima reunião às 14:30</h2>
            <div className="octa-meeting-card mt-3">
              <div className="grid size-12 place-items-center rounded-[16px] bg-gradient-to-br from-[#0b879a] to-[#005f72] text-white shadow-[0_12px_30px_rgba(7,119,139,.2)]"><CalendarDays size={21}/></div>
              <div className="min-w-0"><h3 className="truncate text-[16px] font-semibold text-[#0b2238]">Planejamento de Marketing</h3><p className="mt-1 text-xs text-[#30485e]">Hoje&nbsp; • &nbsp;14:30 – 15:30&nbsp; • &nbsp;6 participantes</p></div>
              <Link href="/reunioes" className="ml-auto text-[#17314a]" aria-label="Mais opções"><MoreVertical size={20}/></Link>
              <div className="col-span-full mt-1 flex gap-3 pl-[60px]"><Link href="/room/strategy-room" className="octa-primary-button"><Play size={14} fill="currentColor"/> Entrar na reunião</Link><Link href="/agenda" className="octa-secondary-button">Ver agenda</Link></div>
            </div>
          </section>

          <section className="mt-6 pb-10" id="reunioes">
            <h2 className="text-[15px] font-medium text-[#17314a]">Reuniões de hoje</h2>
            <div className="mt-3 overflow-hidden rounded-[22px] border border-[#0d2a44]/7 bg-white/58 shadow-[0_8px_30px_rgba(10,34,55,.045)]">
              <MeetingRow time="16:00" title="Kickoff Campanha Q2" duration="45 min" count="+3"/>
              <MeetingRow time="17:30" title="Alinhamento de Conteúdo" duration="30 min" count="+2"/>
              <Link href="/agenda" className="flex items-center justify-between px-4 py-4 text-sm text-[#17314a] hover:bg-white/55"><span>Ver agenda completa</span><ChevronRight size={18}/></Link>
            </div>
          </section>
        </section>

        <section className="home-right min-w-0">
          <div className="octa-space-card min-h-[610px]">
            <Image src="/octa-space-clean.png" alt="Ambiente futurista OCTA" fill priority sizes="(min-width: 1280px) 52vw, 100vw" quality={100} className="octa-space-image"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#001c2b]/12 via-transparent to-transparent"/>
            <HomeHeroOverlays/>
          </div>

          <div className="octa-connect-card octa-connect-clean">
            <Image src="/octa-space-clean.png" alt="Ambiente OCTA" fill sizes="(min-width: 1280px) 52vw, 100vw" quality={100} className="octa-connect-media"/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#03293a]/96 via-[#07364a]/72 to-[#0a2238]/36"/>
            <div className="relative z-10 grid h-full grid-cols-[.7fr_1fr_auto] items-center gap-7 p-7 text-white">
              <h2 className="text-[26px] font-medium leading-[1.02] tracking-[-.035em]">Conecte.<br/>Colabore.<br/>Evolua.</h2>
              <p className="max-w-[250px] text-[13px] leading-5 text-white/84">Todas as suas reuniões, contatos e gravações em um só lugar. Mais tempo para o que importa.</p>
              <Link href="/reunioes" className="grid size-14 place-items-center rounded-full border border-white/40 bg-white/5 backdrop-blur-lg" aria-label="Saiba mais"><Play size={19} fill="white"/></Link>
              <Link href="/reunioes" className="col-start-2 -mt-2 inline-flex w-fit items-center gap-5 rounded-full border border-white/30 px-4 py-2 text-xs">Saiba mais <ArrowRight size={14}/></Link>
            </div>
          </div>
        </section>
  </div></AppShell>;
}

function MeetingRow({time,title,duration,count}:{time:string;title:string;duration:string;count:string}){return <div className="grid grid-cols-[56px_1fr_54px_auto] items-center gap-2 border-b border-[#0d2a44]/7 px-4 py-3 text-xs text-[#17314a]"><strong className="font-medium">{time}</strong><span className="truncate">{title}</span><span className="text-[#5f7486]">{duration}</span><div className="flex items-center -space-x-1.5">{people.slice(0,3).map(p=>p.avatarUrl&&<Image key={p.id} src={p.avatarUrl} alt="" width={22} height={22} className="size-[22px] rounded-full border-2 border-white object-cover"/>)}<span className="ml-1.5 text-[10px] text-[#536b7f]">{count}</span></div></div>}
