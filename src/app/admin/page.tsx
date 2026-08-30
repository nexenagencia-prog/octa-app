import { redirect } from 'next/navigation';
import { CmsEditor } from '@/components/cms-editor';
import { supabaseServer } from '@/lib/supabase/server';

export default async function AdminPage(){
  const supabase=await supabaseServer();
  if(!supabase)return <main className="cms-admin-gate"><div><h1>OCTA CMS</h1><p>Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ativar o painel administrativo.</p></div></main>;
  const {data:{user}}=await supabase.auth.getUser(); if(!user)redirect('/login');
  const {data:isAdmin}=await supabase.rpc('cms_is_admin');
  if(isAdmin!==true)return <main className="cms-admin-gate"><div><h1>Acesso restrito</h1><p>Esta conta não possui permissão de administrador do CMS.</p></div></main>;
  return <CmsEditor/>;
}
