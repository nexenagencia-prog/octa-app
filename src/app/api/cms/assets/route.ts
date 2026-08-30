import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { supabaseServer } from '@/lib/supabase/server';

const MAX_SIZE = 25 * 1024 * 1024;
const ALLOWED_PREFIXES=['image/','video/'];

export async function POST(req:NextRequest){
  const supabase=await supabaseServer();if(!supabase)return NextResponse.json({error:'supabase_not_configured'},{status:503});
  const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:'unauthorized'},{status:401});
  const {data:isAdmin}=await supabase.rpc('cms_is_admin');if(isAdmin!==true)return NextResponse.json({error:'forbidden'},{status:403});
  const form=await req.formData();const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'file_required'},{status:400});
  if(file.size>MAX_SIZE)return NextResponse.json({error:'file_too_large'},{status:413});
  if(!ALLOWED_PREFIXES.some(prefix=>file.type.startsWith(prefix)))return NextResponse.json({error:'unsupported_media_type'},{status:415});
  const ext=(file.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'').slice(0,8).toLowerCase();
  const path=`${user.id}/${new Date().toISOString().slice(0,10)}/${randomUUID()}.${ext}`;
  const bytes=await file.arrayBuffer();
  const {error}=await supabase.storage.from('cms-assets').upload(path,bytes,{contentType:file.type,upsert:false,cacheControl:'3600'});if(error)return NextResponse.json({error:error.message},{status:400});
  const {data:publicData}=supabase.storage.from('cms-assets').getPublicUrl(path);const url=publicData.publicUrl;
  await supabase.from('cms_assets').insert({storage_path:path,public_url:url,mime_type:file.type,size_bytes:file.size,created_by:user.id});
  return NextResponse.json({url,path,mimeType:file.type,size:file.size});
}
