export async function runOpenAIJson<T>(instructions:string,input:string):Promise<{ok:true;data:T}|{ok:false;reason:'not_configured'|'provider_error';message:string}>{
 const openAIKey=process.env.OPENAI_API_KEY;
 const gatewayKey=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
 const useGateway=!openAIKey&&Boolean(gatewayKey);
 const key=openAIKey||gatewayKey;
 if(!key)return{ok:false,reason:'not_configured',message:'A IA ainda não está configurada no ambiente.'};
 try{
  const endpoint=useGateway?'https://ai-gateway.vercel.sh/v1/responses':'https://api.openai.com/v1/responses';
  const configuredModel=process.env.OPENAI_MODEL||'gpt-5.6-luna';
  const model=useGateway&&!configuredModel.includes('/')?`openai/${configuredModel}`:configuredModel;
  const response=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,instructions,input:`Responda SOMENTE com JSON válido, sem markdown.\n${input}`,reasoning:{effort:'low'},...(useGateway?{providerOptions:{gateway:{disallowPromptTraining:true}}}:{})})});
  if(!response.ok){const detail=await response.text().catch(()=>'');console.error('OCTA AI provider error',response.status,detail.slice(0,500));return{ok:false,reason:'provider_error',message:`Falha no provedor de IA (${response.status}).`}};
  const payload=await response.json();
  const text=payload.output_text??payload.output?.flatMap((item:any)=>item.content??[]).find((c:any)=>c.type==='output_text')?.text;
  if(!text)return{ok:false,reason:'provider_error',message:'A IA não retornou conteúdo utilizável.'};
  return{ok:true,data:JSON.parse(text) as T};
 }catch(error){console.error('OCTA AI response parse error',error);return{ok:false,reason:'provider_error',message:'Não foi possível interpretar a resposta da IA.'}}
}
