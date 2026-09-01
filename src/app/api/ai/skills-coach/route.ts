import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runOpenAIJson } from '@/lib/ai/openai-json';

const bodySchema=z.object({question:z.string().min(2).max(800),context:z.object({overallScore:z.number().nullable().optional(),skills:z.array(z.object({key:z.string(),label:z.string(),score:z.number().nullable(),trend:z.number().nullable().optional(),count:z.number().optional()})).default([]),recent:z.array(z.object({meetingTitle:z.string(),summary:z.string(),overallScore:z.number().nullable().optional()})).default([])}).default({skills:[],recent:[]})});
type CoachResponse={answer?:string;focus?:string;actions?:string[]};

export async function POST(request:Request){
 const parsed=bodySchema.safeParse(await request.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({ok:false,error:'invalid_question',message:'Escreva uma pergunta para o coach.'},{status:400});
 const result=await runOpenAIJson<CoachResponse>(`Você é o OCTA Coach, especialista em desenvolvimento de comunicação em reuniões. Use exclusivamente os dados fornecidos. Nunca invente reunião, nota, tendência ou evidência. Explique de forma direta por que uma competência pode melhorar e dê exercícios práticos. Se os dados forem insuficientes, diga isso claramente. Retorne JSON com answer, focus e actions (máximo 3 ações).`,JSON.stringify(parsed.data));
 if(!result.ok)return NextResponse.json({ok:false,error:result.reason,message:result.message},{status:result.reason==='not_configured'?503:502});
 return NextResponse.json({ok:true,answer:result.data.answer||'Ainda não há dados suficientes para uma orientação confiável.',focus:result.data.focus||null,actions:(result.data.actions??[]).slice(0,3)});
}
