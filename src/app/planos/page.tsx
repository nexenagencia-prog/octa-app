'use client';
import { useEffect,useState } from 'react';
import { Check, Crown, Sparkles, UsersRound } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { formatPlanPrice, octaPlans } from '@/lib/plans';
const icons={free:Sparkles,pro:Crown,business:UsersRound};
const PLAN_KEY='octa-selected-plan';
export default function PlanosPage(){const[selected,setSelected]=useState('pro');useEffect(()=>{try{setSelected(localStorage.getItem(PLAN_KEY)||'pro')}catch{}},[]);const choose=(id:string)=>{setSelected(id);try{localStorage.setItem(PLAN_KEY,id)}catch{}};return <PageShell title="Planos e preços" kicker="Escolha o nível ideal para você"><div className="octa-pricing-grid grid h-full grid-cols-3 gap-4">{octaPlans.map(plan=>{const Icon=icons[plan.id];const active=selected===plan.id;return <article key={plan.id} className={`octa-plan-card octa-plan-black octa-plan-premium ${plan.featured?'is-featured':''} ${active?'is-selected':''}`}><div className="octa-plan-shine"/><div className="relative z-[1] flex items-start justify-between"><span className="octa-plan-icon grid size-11 place-items-center rounded-2xl"><Icon size={20}/></span>{plan.featured&&<span className="octa-plan-badge rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[.12em]">Mais escolhido</span>}</div><h2 className="relative z-[1] mt-5 text-2xl font-semibold tracking-[-.04em]">{plan.name}</h2><div className="octa-plan-price relative z-[1] mt-3 flex items-end gap-1"><strong className="text-[42px] font-medium tracking-[-.06em]">{formatPlanPrice(plan)}</strong><span className="plan-muted mb-1 text-xs">{plan.suffix}</span></div><p className="plan-muted relative z-[1] mt-3 min-h-10 text-sm leading-5">{plan.description}</p><div className="relative z-[1] mt-5 space-y-2.5">{plan.features.map(f=><div key={f} className="plan-feature flex items-center gap-2 text-sm"><span className="octa-plan-check grid size-5 place-items-center rounded-full"><Check size={12}/></span>{f}</div>)}</div><button onClick={()=>choose(plan.id)} className="octa-plan-cta relative z-[1] mt-auto w-full">{active?'Selecionado':plan.id==='free'?'Usar Grátis':'Escolher '+plan.name}</button><p className="plan-muted relative z-[1] mt-2 text-center text-[10px]">{active?'Plano salvo como sua preferência':'Selecione para definir sua preferência'}</p></article>})}</div><style jsx global>{`
html[data-theme='dark'] .octa-pricing-grid .octa-plan-card,
body.dark .octa-pricing-grid .octa-plan-card,
.dark .octa-pricing-grid .octa-plan-card{
  color:#080808!important;
  border-color:rgba(255,255,255,.76)!important;
  background:linear-gradient(135deg,#f8f8f8 0%,#b9b9b9 18%,#f4f4f4 38%,#8f8f8f 58%,#e8e8e8 78%,#a7a7a7 100%)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(0,0,0,.22),0 20px 48px rgba(0,0,0,.34)!important;
}
html[data-theme='dark'] .octa-pricing-grid .octa-plan-card h2,
html[data-theme='dark'] .octa-pricing-grid .octa-plan-card strong,
html[data-theme='dark'] .octa-pricing-grid .octa-plan-card .plan-muted,
html[data-theme='dark'] .octa-pricing-grid .octa-plan-card .plan-feature,
body.dark .octa-pricing-grid .octa-plan-card h2,
body.dark .octa-pricing-grid .octa-plan-card strong,
body.dark .octa-pricing-grid .octa-plan-card .plan-muted,
body.dark .octa-pricing-grid .octa-plan-card .plan-feature,
.dark .octa-pricing-grid .octa-plan-card h2,
.dark .octa-pricing-grid .octa-plan-card strong,
.dark .octa-pricing-grid .octa-plan-card .plan-muted,
.dark .octa-pricing-grid .octa-plan-card .plan-feature{color:#080808!important;}
html[data-theme='dark'] .octa-pricing-grid .octa-plan-icon,
html[data-theme='dark'] .octa-pricing-grid .octa-plan-check,
body.dark .octa-pricing-grid .octa-plan-icon,
body.dark .octa-pricing-grid .octa-plan-check,
.dark .octa-pricing-grid .octa-plan-icon,
.dark .octa-pricing-grid .octa-plan-check{color:#050505!important;background:rgba(255,255,255,.30)!important;border-color:rgba(0,0,0,.16)!important;}
html[data-theme='dark'] .octa-pricing-grid .octa-plan-cta,
body.dark .octa-pricing-grid .octa-plan-cta,
.dark .octa-pricing-grid .octa-plan-cta{background:#080808!important;color:#f5f5f5!important;border-color:#080808!important;}
html[data-theme='dark'] .octa-pricing-grid .octa-plan-badge,
body.dark .octa-pricing-grid .octa-plan-badge,
.dark .octa-pricing-grid .octa-plan-badge{background:#080808!important;color:#f5f5f5!important;}
`}</style></PageShell>}
