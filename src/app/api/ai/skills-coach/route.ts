import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runOpenAIJson } from '@/lib/ai/openai-json';

const bodySchema=z.object({question:z.string().min(2).max(800),context:z.object({profileName:z.string().max(120).optional(),overallScore:z.number().nullable().optional(),skills:z.array(z.object({key:z.string(),label:z.string(),score:z.number().nullable(),trend:z.number().nullable().optional(),count:z.number().optional()})).default([]),recent:z.array(z.object({meetingTitle:z.string(),summary:z.string(),overallScore:z.number().nullable().optional()})).default([])}).default({skills:[],recent:[]})});
type CoachResponse={answer?:string;focus?:string;actions?:string[]};

export async function GET(){return NextResponse.json({ok:true,configured:Boolean(process.env.OPENAI_API_KEY),model:process.env.OPENAI_MODEL||'gpt-5.6-luna'})}

export async function POST(request:Request){
 const parsed=bodySchema.safeParse(await request.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({ok:false,error:'invalid_question',message:'Escreva uma pergunta para a OCTA AI.'},{status:400});
 const result=await runOpenAIJson<CoachResponse>(`Você é a OCTA AI, copiloto privado de reuniões e performance profissional. Responda em português do Brasil, de forma natural, inteligente, objetiva e útil. Use o nome do perfil quando fizer sentido, sem repetir o nome em toda frase. Entenda a intenção do usuário antes de responder: você pode explicar evolução, comparar reuniões, preparar próximas conversas, apontar forças e fragilidades, transformar evidências em treino prático, sugerir perguntas, estruturar respostas e organizar próximos passos. Use exclusivamente os dados fornecidos quando citar reunião, nota, tendência, skill ou evidência. Nunca invente reunião, nota, tendência, fala, decisão ou evidência. Quando a pergunta puder ser respondida como orientação geral, deixe claro o que é orientação e o que vem dos dados do usuário. Se faltarem dados para uma conclusão específica, diga isso claramente e ainda ofereça um próximo passo útil. Evite respostas genéricas e repetições. Retorne JSON com answer, focus e actions (máximo 3 ações curtas e acionáveis).`,JSON.stringify(parsed.data));
 if(!result.ok)return NextResponse.json({ok:false,error:result.reason,message:result.message},{status:result.reason==='not_configured'?503:502});
 return NextResponse.json({ok:true,answer:result.data.answer||'Ainda não há dados suficientes para uma orientação confiável.',focus:result.data.focus||null,actions:(result.data.actions??[]).slice(0,3)});
}
