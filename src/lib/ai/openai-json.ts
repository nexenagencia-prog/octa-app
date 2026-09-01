export async function runOpenAIJson<T>(instructions:string,input:string):Promise<{ok:true;data:T}|{ok:false;reason:'not_configured'|'provider_error';message:string}>{
 const key=process.env.OPENAI_API_KEY;
 if(!key)return{ok:false,reason:'not_configured',message:'A IA ainda não está configurada no ambiente.'};
 try{
  const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-5.6-luna',instructions,input:`Responda SOMENTE com JSON válido, sem markdown.\n${input}`,reasoning:{effort:'low'}})});
  if(!response.ok)return{ok:false,reason:'provider_error',message:`Falha no provedor de IA (${response.status}).`};
  const payload=await response.json();
  const text=payload.output_text??payload.output?.flatMap((item:any)=>item.content??[]).find((c:any)=>c.type==='output_text')?.text;
  if(!text)return{ok:false,reason:'provider_error',message:'A IA não retornou conteúdo utilizável.'};
  return{ok:true,data:JSON.parse(text) as T};
 }catch{return{ok:false,reason:'provider_error',message:'Não foi possível interpretar a resposta da IA.'}}
}
