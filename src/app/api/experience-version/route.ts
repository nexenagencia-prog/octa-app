import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { normalizeExperienceVersion } from '@/lib/experience-version';

export async function GET(){
  const supabase=await supabaseServer();
  if(!supabase) return NextResponse.json({version:'v1',configured:false});
  const {data}=await supabase.from('octa_app_settings').select('value').eq('key','experience_version').maybeSingle();
  return NextResponse.json({version:normalizeExperienceVersion(data?.value)});
}

export async function POST(request:Request){
  const supabase=await supabaseServer();
  if(!supabase) return NextResponse.json({error:'Supabase não configurado.'},{status:503});
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:'Não autenticado.'},{status:401});
  const {data:admin}=await supabase.from('cms_admins').select('user_id').eq('user_id',user.id).maybeSingle();
  if(!admin) return NextResponse.json({error:'Somente administradores podem alterar a versão.'},{status:403});
  const body=await request.json().catch(()=>({}));
  const version=normalizeExperienceVersion(body.version);
  const {error}=await supabase.from('octa_app_settings').upsert({key:'experience_version',value:version,updated_by:user.id},{onConflict:'key'});
  if(error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({version});
}
