import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { EMPTY_CMS_DOCUMENT, sanitizeCmsDocument } from '@/lib/cms';

async function admin(){const supabase=await supabaseServer();if(!supabase)return {supabase:null,user:null,ok:false};const {data:{user}}=await supabase.auth.getUser();if(!user)return {supabase,user:null,ok:false};const {data}=await supabase.rpc('cms_is_admin');return {supabase,user,ok:data===true}}
export async function GET(req:NextRequest){
  const a=await admin();if(!a.ok||!a.supabase)return NextResponse.json({error:'unauthorized'},{status:403});
  const mode=req.nextUrl.searchParams.get('status')||'draft';
  if(mode==='history'){const {data,error}=await a.supabase.from('cms_revisions').select('id,status,created_at,published_at,created_by').order('created_at',{ascending:false}).limit(30);return NextResponse.json(error?{error:error.message}:{items:data||[]},{headers:{'Cache-Control':'no-store'}})}
  const {data}=await a.supabase.from('cms_revisions').select('id,document,created_at').eq('status','draft').order('created_at',{ascending:false}).limit(1).maybeSingle();
  if(data?.document)return NextResponse.json({id:data.id,document:sanitizeCmsDocument(data.document)},{headers:{'Cache-Control':'no-store'}});
  const {data:published}=await a.supabase.from('cms_revisions').select('document').eq('status','published').order('published_at',{ascending:false}).limit(1).maybeSingle();
  return NextResponse.json({id:null,document:published?.document?sanitizeCmsDocument(published.document):EMPTY_CMS_DOCUMENT},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(req:NextRequest){
  const a=await admin();if(!a.ok||!a.supabase||!a.user)return NextResponse.json({error:'unauthorized'},{status:403});
  const body=await req.json().catch(()=>({}));const action=body.action;
  if(action==='saveDraft'){
    const document=sanitizeCmsDocument(body.document);const {data,error}=await a.supabase.from('cms_revisions').insert({status:'draft',document,created_by:a.user.id}).select('id').single();
    return NextResponse.json(error?{error:error.message}:{ok:true,id:data.id},{status:error?400:200});
  }
  if(action==='publish'){
    const document=sanitizeCmsDocument(body.document);await a.supabase.from('cms_revisions').update({status:'archived'}).eq('status','published');
    const {data,error}=await a.supabase.from('cms_revisions').insert({status:'published',document,created_by:a.user.id,published_at:new Date().toISOString()}).select('id').single();
    return NextResponse.json(error?{error:error.message}:{ok:true,id:data.id},{status:error?400:200});
  }
  if(action==='restore'&&body.revisionId){
    const {data:revision,error}=await a.supabase.from('cms_revisions').select('document').eq('id',body.revisionId).single();if(error||!revision)return NextResponse.json({error:'revision_not_found'},{status:404});
    const document=sanitizeCmsDocument(revision.document);const {data,error:insertError}=await a.supabase.from('cms_revisions').insert({status:'draft',document,created_by:a.user.id}).select('id').single();
    return NextResponse.json(insertError?{error:insertError.message}:{ok:true,id:data.id,document},{status:insertError?400:200});
  }
  return NextResponse.json({error:'invalid_action'},{status:400});
}
