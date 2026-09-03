import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runOpenAIJson } from '@/lib/ai/openai-json';

const signalSchema=z.object({skill:z.string(),polarity:z.string(),title:z.string(),message:z.string()});
const bodySchema=z.object({
  meetingId:z.string().min(1).max(200),
  transcript:z.string().min(20).max(12000),
  signals:z.array(signalSchema).max(12).default([]),
  question:z.string().min(2).max(500).optional(),
  visualEngagement:z.object({enabled:z.boolean(),sampleCount:z.number().int().nonnegative(),facePresenceRate:z.number().min(0).max(1).nullable()}).optional(),
});

type Signal=z.infer<typeof signalSchema>;
type Insight={kind?:'strategy'|'strength'|'attention';title?:string;message?:string;skill?:string;polarity?:'strength'|'weakness'|'neutral'};
type ResponseShape={insights?:Insight[];answer?:string};

function localAnswer(question:string,transcript:string,signals:Signal[]){
  const q=question.toLocaleLowerCase('pt-BR');
  const weaknesses=signals.filter(signal=>signal.polarity==='weakness').slice(-3);
  const strengths=signals.filter(signal=>signal.polarity==='strength').slice(-3);
  const words=transcript.trim().split(/\s+/).filter(Boolean).length;
  const questions=(transcript.match(/\?/g)||[]).length;
  const latestWeakness=weaknesses[weaknesses.length-1];
  const latestStrength=strengths[strengths.length-1];

  if(/como (eu )?(estou|fui)|performance|desempenho|avalia/.test(q)){
    const parts=[latestStrength?`Ponto forte detectado: ${latestStrength.title}.`:null,latestWeakness?`Principal ajuste agora: ${latestWeakness.title}. ${latestWeakness.message}`:null,`Até aqui foram capturadas cerca de ${words} palavras e ${questions} perguntas explícitas.`].filter(Boolean);
    return parts.join(' ');
  }
  if(/melhorar|melhoria|erro|errando|corrigir|ajustar/.test(q)){
    if(latestWeakness)return `Priorize isto agora: ${latestWeakness.title}. ${latestWeakness.message}`;
    return 'Ainda não há evidência suficiente de um ponto fraco dominante. Continue a conversa e eu aviso quando surgir um padrão consistente.';
  }
  if(/ponto forte|acert|bom|melhor momento/.test(q)){
    if(latestStrength)return `Seu sinal positivo mais recente foi: ${latestStrength.title}. ${latestStrength.message}`;
    return 'Ainda não há evidência suficiente para destacar um ponto forte com segurança.';
  }
  if(/pergunta|perguntar|cliente|objeção|responder/.test(q)){
    if(latestWeakness)return `Antes de responder, explore melhor o ponto do interlocutor. Com base no sinal atual (${latestWeakness.title}), faça uma pergunta curta de esclarecimento e só depois avance.`;
    return 'Use uma pergunta aberta e curta para devolver a conversa ao interlocutor, por exemplo: “Qual é o ponto mais importante para você nessa decisão?”';
  }
  return latestWeakness?`Com base na reunião até agora, eu focaria em ${latestWeakness.title.toLowerCase()}. ${latestWeakness.message}`:latestStrength?`Até agora o sinal mais claro é positivo: ${latestStrength.title}. ${latestStrength.message}`:'Estou acompanhando a transcrição, mas ainda preciso de mais conversa para responder com evidência suficiente.';
}

export async function POST(request:Request){
  const parsed=bodySchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({ok:false,error:'invalid_payload',message:'Ainda não há contexto suficiente para uma sugestão estratégica.'},{status:400});

  const {question}=parsed.data;
  const systemPrompt=question
    ? `Você é a OCTA AI, coach privado de performance durante uma reunião. Responda diretamente à pergunta do usuário usando SOMENTE a transcrição, os sinais e os dados visuais agregados fornecidos. Seja curto, prático e específico. Foque em Comunicação, Clareza, Escuta, Objetividade, Perguntas, Argumentação e Condução. Nunca invente emoção, intenção, desinteresse, diagnóstico psicológico ou leitura mental. Não faça identificação biométrica. Se houver sinal visual, descreva no máximo como queda provável de engajamento visual, nunca como emoção ou intenção. Se faltarem evidências, diga isso claramente. Dê no máximo uma recomendação principal e, quando útil, uma frase que o usuário possa aplicar nos próximos 30 segundos. Retorne JSON {"answer":"...","insights":[]}.`
    : `Você é a OCTA AI atuando silenciosamente durante uma reunião. Gere no máximo 3 insights curtos, privados e acionáveis para o dono da conta. Foque em Comunicação, Clareza, Escuta, Objetividade, Perguntas, Argumentação e Condução. Use apenas a transcrição e sinais fornecidos. Nunca invente emoção, intenção, desinteresse, diagnóstico psicológico ou leitura mental. Se houver visualEngagement, trate somente como sinal de presença e, quando houver evidência suficiente, como queda provável de engajamento visual, sempre com linguagem probabilística. Não atribua identidade biométrica. Priorize sugestões que o usuário possa aplicar nos próximos 30 segundos. Retorne JSON {"insights":[{"kind":"strategy|strength|attention","title":"...","message":"...","skill":"...","polarity":"strength|weakness|neutral"}]}.`;

  const result=await runOpenAIJson<ResponseShape>(systemPrompt,JSON.stringify(parsed.data));
  if(!result.ok){
    if(question)return NextResponse.json({ok:true,mode:'local',answer:localAnswer(question,parsed.data.transcript,parsed.data.signals),insights:[]});
    return NextResponse.json({ok:false,error:result.reason,message:result.message},{status:result.reason==='not_configured'?503:502});
  }

  if(question){
    const answer=result.data.answer?.trim()||localAnswer(question,parsed.data.transcript,parsed.data.signals);
    return NextResponse.json({ok:true,mode:'ai',answer,insights:[]});
  }

  const insights=(result.data.insights??[]).slice(0,3).map(item=>({kind:item.kind||'strategy',title:item.title||'Sugestão estratégica',message:item.message||'',skill:item.skill||null,polarity:item.polarity||'neutral'})).filter(item=>item.message);
  return NextResponse.json({ok:true,insights});
}
