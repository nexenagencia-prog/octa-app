import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runOpenAIJson } from '@/lib/ai/openai-json';
import { SKILL_KEYS, normalizeScore, overallScore, type MeetingSkillAnalysis, type SkillMetric } from '@/lib/skills-analysis';

const bodySchema=z.object({meetingId:z.string().min(1),meetingTitle:z.string().min(1),transcript:z.string().min(80)});
const labels={comunicacao:'Comunicação',clareza:'Clareza',escuta:'Escuta',objetividade:'Objetividade',perguntas:'Perguntas',argumentacao:'Argumentação',conducao:'Condução'} as const;

type Raw={summary?:string;metrics?:Array<{key?:string;score?:number|null;confidence?:number;evidenceSufficient?:boolean;explanation?:string;recommendation?:string;evidence?:string[]}>};
export async function POST(request:Request){
 const parsed=bodySchema.safeParse(await request.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({ok:false,error:'transcript_too_short',message:'É preciso ter uma transcrição suficiente para avaliar a reunião.'},{status:400});
 const {meetingId,meetingTitle,transcript}=parsed.data;
 const result=await runOpenAIJson<Raw>(`Você é o avaliador de comunicação da OCTA. Avalie SOMENTE evidências presentes na transcrição. Competências válidas: comunicacao, clareza, escuta, objetividade, perguntas, argumentacao, conducao. Para cada competência retorne key, score de 0 a 100 ou null, confidence 0 a 1, evidenceSufficient, explanation curta, recommendation prática e evidence com até 3 trechos curtos. Se não houver evidência suficiente, score deve ser null e evidenceSufficient false.`,JSON.stringify({meetingTitle,transcript}));
 if(!result.ok)return NextResponse.json({ok:false,error:result.reason,message:result.message},{status:result.reason==='not_configured'?503:502});
 const raw=result.data;
 const metrics:SkillMetric[]=SKILL_KEYS.map(key=>{const found=raw.metrics?.find(m=>m.key===key);const sufficient=Boolean(found?.evidenceSufficient)&&Array.isArray(found?.evidence)&&found!.evidence!.length>0;return{key,label:labels[key],score:sufficient?normalizeScore(found?.score):null,confidence:Math.max(0,Math.min(1,Number(found?.confidence)||0)),evidenceSufficient:sufficient,explanation:found?.explanation||'Sem evidência suficiente para uma avaliação confiável.',recommendation:found?.recommendation||'Colete mais contexto em uma próxima reunião.',evidence:(found?.evidence??[]).slice(0,3)}});
 const analysis:MeetingSkillAnalysis={meetingId,meetingTitle,createdAt:new Date().toISOString(),source:'ai',summary:raw.summary||'Análise concluída com base apenas na transcrição disponível.',metrics,overallScore:overallScore(metrics),transcript};
 return NextResponse.json({ok:true,analysis});
}
