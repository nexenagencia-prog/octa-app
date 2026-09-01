import { SKILL_KEYS, type SkillKey, type SkillMetric } from './skills-analysis';

export type LiveSignalPolarity='strength'|'weakness'|'neutral';
export type LiveMeetingSignal={
  id:string;
  skill:SkillKey;
  polarity:LiveSignalPolarity;
  title:string;
  message:string;
  evidence:string;
  confidence:number;
};

const labels:Record<SkillKey,string>={comunicacao:'Comunicação',clareza:'Clareza',escuta:'Escuta',objetividade:'Objetividade',perguntas:'Perguntas',argumentacao:'Argumentação',conducao:'Condução'};
const words=(text:string)=>text.trim().split(/\s+/).filter(Boolean);
const excerpt=(text:string,max=170)=>text.trim().replace(/\s+/g,' ').slice(-max);

export function deriveLiveSignals(transcript:string):LiveMeetingSignal[]{
  const clean=transcript.trim();
  if(!clean)return[];
  const count=words(clean).length;
  const signals:LiveMeetingSignal[]=[];
  const add=(signal:Omit<LiveMeetingSignal,'id'>)=>signals.push({...signal,id:`${signal.skill}-${signal.polarity}-${signals.length}`});

  if(count>=85)add({skill:'objetividade',polarity:'weakness',title:'Recupere a objetividade',message:'Sua fala ficou longa. Faça uma pausa, resuma a ideia em uma frase e devolva a conversa com uma pergunta.',evidence:excerpt(clean),confidence:.86});
  if(/\?|\b(o que|qual|quais|como|por que|quando|onde)\b/i.test(clean))add({skill:'perguntas',polarity:'strength',title:'Boa exploração',message:'Você está usando perguntas para abrir espaço e entender a outra pessoa. Continue aprofundando antes de argumentar.',evidence:excerpt(clean),confidence:.82});
  if(/\b(próximo passo|vamos combinar|combinado|eu envio|seguimos|avançar|amanhã|hoje eu|fica definido)\b/i.test(clean))add({skill:'conducao',polarity:'strength',title:'Boa condução',message:'Você transformou a conversa em ação concreta. Confirme responsável e prazo para fechar o compromisso.',evidence:excerpt(clean),confidence:.84});
  if(/\b(porque|isso significa|em resumo|objetivamente|o ponto é|a razão é)\b/i.test(clean))add({skill:'clareza',polarity:'strength',title:'Mensagem estruturada',message:'A fala contém marcadores de explicação e síntese. Preserve essa estrutura para manter a mensagem clara.',evidence:excerpt(clean),confidence:.74});
  if(count>=35&&!/\?/u.test(clean))add({skill:'escuta',polarity:'weakness',title:'Abra espaço para o outro',message:'Há um trecho contínuo sem pergunta. Considere validar entendimento ou pedir a visão da outra pessoa.',evidence:excerpt(clean),confidence:.68});
  if(/\b(benefício|resultado|ganho|reduz|aumenta|economiza|resolve|impacto|valor)\b/i.test(clean))add({skill:'argumentacao',polarity:'strength',title:'Argumentação orientada a valor',message:'Você conectou a fala a impacto ou benefício. Reforce com uma evidência concreta ou exemplo.',evidence:excerpt(clean),confidence:.76});
  return signals.slice(-5);
}

export function buildSkillsDraft(transcript:string,signals:LiveMeetingSignal[]):SkillMetric[]{
  const enough=words(transcript).length>=18;
  return SKILL_KEYS.map(key=>{
    const relevant=signals.filter(signal=>signal.skill===key);
    const positive=relevant.filter(signal=>signal.polarity==='strength').length;
    const negative=relevant.filter(signal=>signal.polarity==='weakness').length;
    const evidenceSufficient=enough&&relevant.length>0;
    const score=evidenceSufficient?Math.max(35,Math.min(95,70+positive*9-negative*12)):null;
    const latest=relevant[relevant.length-1];
    return {
      key,
      label:labels[key],
      score,
      confidence:evidenceSufficient?Math.max(...relevant.map(signal=>signal.confidence)):0,
      evidenceSufficient,
      explanation:evidenceSufficient?(latest?.message??'Há evidência suficiente neste trecho.'):'Ainda não há evidência suficiente nesta reunião para avaliar esta competência.',
      recommendation:evidenceSufficient?(latest?.polarity==='weakness'?latest.message:'Repita o comportamento positivo em outros momentos da conversa.'):'Continue a reunião para gerar evidências reais.',
      evidence:evidenceSufficient?relevant.map(signal=>signal.evidence).filter(Boolean).slice(-3):[],
    };
  });
}
