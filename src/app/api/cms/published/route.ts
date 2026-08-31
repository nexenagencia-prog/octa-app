import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { EMPTY_CMS_DOCUMENT, sanitizeCmsDocument, stripAutoCmsOverrides } from '@/lib/cms';

export const dynamic='force-dynamic';
export async function GET(){
  try{
    const supabase=await supabaseServer(); if(!supabase)return NextResponse.json(EMPTY_CMS_DOCUMENT,{headers:{'Cache-Control':'no-store'}});
    const {data,error}=await supabase.from('cms_revisions').select('document').eq('status', 'published').order('published_at',{ascending:false}).limit(1).maybeSingle();
    if(error||!data?.document)return NextResponse.json(EMPTY_CMS_DOCUMENT,{headers:{'Cache-Control':'public, max-age=30, stale-while-revalidate=120'}});
    return NextResponse.json(stripAutoCmsOverrides(sanitizeCmsDocument(data.document)),{headers:{'Cache-Control':'public, max-age=30, stale-while-revalidate=120'}});
  }catch{return NextResponse.json(EMPTY_CMS_DOCUMENT,{headers:{'Cache-Control':'no-store'}})}
}
