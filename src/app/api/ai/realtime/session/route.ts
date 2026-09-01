import { NextResponse } from 'next/server';

export const runtime='nodejs';

export async function POST(request:Request){
 const apiKey=process.env.OPENAI_API_KEY;
 if(!apiKey)return NextResponse.json({ok:false,message:'OCTA AI voice is not configured.'},{status:503});
 const sdp=await request.text();
 if(!sdp.trim())return NextResponse.json({ok:false,message:'Missing WebRTC offer.'},{status:400});
 const model=process.env.OPENAI_REALTIME_MODEL||'gpt-realtime-2.1';
 const voice=process.env.OPENAI_REALTIME_VOICE||'marin';
 const session={
  type:'realtime',
  model,
  instructions:'Você é a OCTA AI, assistente privada de reuniões. Fale em português do Brasil com voz feminina, sofisticada, calma, natural e objetiva. Nunca invente reunião, nota, tendência ou evidência. Quando não houver contexto suficiente, diga isso claramente.',
  audio:{input:{turn_detection:{type:'server_vad'}},output:{voice}}
 };
 const body=new FormData();body.set('sdp',sdp);body.set('session',JSON.stringify(session));
 const upstream=await fetch('https://api.openai.com/v1/realtime/calls',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`},body});
 const payload=await upstream.text();
 if(!upstream.ok)return NextResponse.json({ok:false,message:'A voz da OCTA AI não conseguiu conectar.'},{status:upstream.status>=500?502:upstream.status});
 return new Response(payload,{status:200,headers:{'Content-Type':'application/sdp'}});
}
