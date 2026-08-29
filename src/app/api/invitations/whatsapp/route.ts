import { NextResponse } from 'next/server';

export async function POST(request:Request){
  try{
    const {phone,meetingUrl,hostName}=await request.json();
    if(!phone || !meetingUrl) return NextResponse.json({error:'WhatsApp e link da reunião são obrigatórios.'},{status:400});
    const token=process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId=process.env.WHATSAPP_PHONE_NUMBER_ID;
    const template=process.env.WHATSAPP_INVITE_TEMPLATE;
    const language=process.env.WHATSAPP_INVITE_LANGUAGE||'pt_BR';
    if(!token || !phoneNumberId || !template) return NextResponse.json({error:'Envio pelo WhatsApp ainda não configurado no servidor.'},{status:503});
    const cleanPhone=String(phone).replace(/\D/g,'');
    const response=await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to:cleanPhone,type:'template',template:{name:template,language:{code:language},components:[{type:'body',parameters:[{type:'text',text:hostName||'OCTA'},{type:'text',text:meetingUrl}]}]}})});
    if(!response.ok){const detail=await response.text();return NextResponse.json({error:'Não foi possível enviar pelo WhatsApp.',detail},{status:502})}
    return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:'Dados de convite inválidos.'},{status:400})}
}
