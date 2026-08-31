import { NextResponse } from 'next/server';

export async function POST(request:Request){
  try{
    const {email,meetingUrl,hostName,meetingTitle}=await request.json();
    if(!email || !meetingUrl) return NextResponse.json({error:'E-mail e link da reunião são obrigatórios.'},{status:400});
    const apiKey=process.env.RESEND_API_KEY;
    const from=process.env.OCTA_INVITE_FROM_EMAIL;
    if(!apiKey || !from) return NextResponse.json({error:'Envio de e-mail ainda não configurado no servidor.'},{status:503});
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[email],subject:`Convite OCTA · ${meetingTitle||'Reunião'}`,html:`<div style="font-family:Arial,sans-serif;color:#0a2238"><h2>${meetingTitle||'Você recebeu um convite para uma reunião'}</h2><p>${hostName?`${hostName} convidou você para uma reunião no OCTA.`:'Você foi convidado para uma reunião no OCTA.'}</p><p><a href="${meetingUrl}">Entrar na reunião</a></p></div>`})});
    if(!response.ok){const detail=await response.text();return NextResponse.json({error:'Não foi possível enviar o e-mail.',detail},{status:502})}
    return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:'Dados de convite inválidos.'},{status:400})}
}
