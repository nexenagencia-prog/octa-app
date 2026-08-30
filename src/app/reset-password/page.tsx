'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, KeyRound, Sparkles } from 'lucide-react';
import { Button, Card, Pill } from '@/components/ui';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function ResetPasswordPage(){
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [status,setStatus]=useState('Validando link seguro…');
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    const supabase=supabaseBrowser();
    if(!supabase){
      setStatus('Não foi possível iniciar a redefinição de senha.');
      return;
    }
    supabase.auth.getUser().then(({data,error})=>{
      if(error||!data.user){
        setStatus('Este link não é mais válido ou já expirou. Solicite uma nova redefinição.');
        setReady(false);
        return;
      }
      setStatus('');
      setReady(true);
    }).catch(()=>{
      setStatus('Este link não é mais válido ou já expirou. Solicite uma nova redefinição.');
      setReady(false);
    });
  },[]);

  async function submit(e:FormEvent){
    e.preventDefault();
    if(loading||!ready)return;
    setStatus('');
    if(password.length<8){
      setStatus('Use uma senha com pelo menos 8 caracteres.');
      return;
    }
    if(password!==confirmPassword){
      setStatus('As senhas não coincidem.');
      return;
    }
    const supabase=supabaseBrowser();
    if(!supabase){
      setStatus('Não foi possível iniciar a redefinição de senha.');
      return;
    }
    setLoading(true);
    try{
      const {error}=await supabase.auth.updateUser({password});
      if(error){
        setStatus(error.message);
        return;
      }
      await supabase.auth.signOut();
      location.assign('/login?reset=success');
    }catch(error){
      setStatus(error instanceof Error ? error.message : 'Não foi possível redefinir a senha.');
    }finally{
      setLoading(false);
    }
  }

  return <main className="grid min-h-screen place-items-center p-5">
    <Card className="w-full max-w-md p-7 md:p-9">
      <Pill><Sparkles size={13}/> OCTA Access</Pill>
      <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white"><KeyRound size={19}/></div>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-.045em] text-[#0a2238]">Crie uma nova senha.</h1>
      <p className="mt-3 text-sm leading-6 text-[#536b7f]">Use pelo menos 8 caracteres. Depois você voltará ao login do CMS.</p>

      {ready&&<form onSubmit={submit} className="mt-8 space-y-3">
        <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nova senha" className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-4 text-[#17314a] outline-none placeholder:text-black/30" />
        <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Confirmar nova senha" className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-4 text-[#17314a] outline-none placeholder:text-black/30" />
        <Button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2">{loading?'Salvando…':'Salvar nova senha'} <CheckCircle2 size={16}/></Button>
      </form>}

      {status&&<div className="mt-4 rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-sm leading-5 text-[#17314a]">{status}</div>}
      {!ready&&<Link href="/login?reset=expired" className="mt-4 block rounded-2xl bg-black px-4 py-3 text-center text-sm font-medium text-white">Solicitar novo link</Link>}
      <Link href="/login" className="mt-7 block text-center text-xs text-[#687d8e] hover:text-[#17314a]">Voltar para entrar</Link>
    </Card>
  </main>;
}
