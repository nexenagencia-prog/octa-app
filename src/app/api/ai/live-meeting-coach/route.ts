import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runOpenAIJson } from '@/lib/ai/openai-json';

const bodySchema=z.object({
  meetingId:z.string().min(1).max(200),
  transcript:z.string().min(20).max(12000),
  signals:z.array(z.object({skill:z.string(),polarity:z.string(),title:z.string(),message:z.string()})).max(12).default([]),
  visualEngagement:z.object({enabled:z.boolean(),sampleCount:z.number().int().nonnegative(),facePresenceRate:z.number().min(0).max(1).nullable()}).optional(),
});

type Insight={kind?:'strategy'|'strength'|'attention';title?:string;message?:string;skill?:string;polarity?:'strength'|'weakness'|'neutral'};
type ResponseShape={insights?:Insight[]};

export async function POST(request:Request){
  const parsed=bodySchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({ok:false,error:'invalid_payload',message:'Ainda não há contexto suficiente para uma sugestão estratégica.'},{status:400});
  const result=await runOpenAIJson<ResponseShape>(
    `Você é a OCTA AI atuando silenciosamente durante uma reunião. Gere no máximo 3 insights curtos, privados e acionáveis para o dono da conta. Foque em Comunicação, Clareza, Escuta, Objetividade, Perguntas, Argumentação e Condução. Use apenas a transcrição e sinais fornecidos. Nunca invente emoção, intenção, desinteresse, diagnóstico psicológico ou leitura mental. Se houver visualEngagement, trate somente como sinal de presença/engajamento visual e use linguagem probabilística, por exemplo "queda provável de engajamento visual". Não atribua identidade biométrica. Priorize sugestões que o usuário possa aplicar nos próximos 30 segundos. Retorne JSON {"insights":[{"kind":"strategy|strength|attention","title":"...","message":"...","skill":"...","polarity":"strength|weakness|neutral"}]}.`,
    JSON.stringify(parsed.data),
  );
  if(!result.ok)return NextResponse.json({ok:false,error:result.reason,message:result.message},{status:result.reason==='not_configured'?503:502});
  const insights=(result.data.insights??[]).slice(0,3).map(item=>({kind:item.kind||'strategy',title:item.title||'Sugestão estratégica',message:item.message||'',skill:item.skill||null,polarity:item.polarity||'neutral'})).filter(item=>item.message);
  return NextResponse.json({ok:true,insights});
}
