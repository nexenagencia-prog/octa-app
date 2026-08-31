export type OctaPlan={id:'free'|'pro'|'business';name:string;price:number;currency:'BRL';suffix:string;description:string;featured?:boolean;features:string[]};
export const octaPlans:OctaPlan[]=[
  {id:'free',name:'Grátis',price:0,currency:'BRL',suffix:'',description:'Para começar e testar a experiência OCTA.',features:['Reuniões essenciais','Até 40 min por reunião','Chat e anotações','Filtros básicos']},
  {id:'pro',name:'Pro',price:69.90,currency:'BRL',suffix:'/mês',description:'Para profissionais que fazem reuniões todos os dias.',featured:true,features:['Reuniões de até 30 horas','Até 100 participantes','Gravações e biblioteca','Todos os filtros OCTA','Ferramentas flutuantes']},
  {id:'business',name:'Business',price:109.90,currency:'BRL',suffix:'/mês',description:'Para equipes que precisam de mais capacidade e gestão.',features:['Tudo do Pro','Até 300 participantes','Controles avançados do anfitrião','Espaço ampliado para gravações','Recursos de equipe']},
];
export const formatPlanPrice=(plan:OctaPlan)=>plan.price===0?'R$ 0':new Intl.NumberFormat('pt-BR',{style:'currency',currency:plan.currency}).format(plan.price);
