'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button, Card, Pill } from '@/components/ui';
import { isSupabaseConfigured, supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage(){
  const [email,setEmail]=useState('');
  const [status,setStatus]=useState('');
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);

  async function submit(e:FormEvent){
    e.preventDefault();
    if(sending)return;
    setStatus('');
    setSent(false);

    if(!isSupabaseConfigured){
      setStatus('Supabase não está configurado neste deploy.');
      return;
    }

    const supabase=supabaseBrowser();
    if(!supabase){
      setStatus('Não foi possível iniciar o acesso ao CMS.');
      return;
    }

    setSending(true);
    try{
      const {error}=await supabase.auth.signInWithOtp({
        email,
        options:{
          shouldCreateUser:false,
          emailRedirectTo:`${location.origin}/auth/callback?next=/admin`
        }
      });

      if(error){
        setStatus(error.message);
        return;
      }

      setSent(true);
      setStatus('E-mail enviado. Abra a mensagem mais recente da OCTA e clique no link para entrar no CMS.');
    }catch(error){
      setStatus(error instanceof Error ? error.message : 'Não foi possível enviar o e-mail de acesso.');
    }finally{
      setSending(false);
    }
  }

  return <main className="grid min-h-screen place-items-center p-5">
    <Card className="w-full max-w-md p-7 md:p-9">
      <Pill><Sparkles size={13}/> OCTA Access</Pill>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-.045em] text-[#0a2238]">Entre no CMS.</h1>
      <p className="mt-3 text-sm leading-6 text-[#536b7f]">Use o e-mail administrador para receber o link seguro de acesso.</p>

      <form onSubmit={submit} className="mt-8 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="voce@empresa.com"
          className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-4 text-[#17314a] outline-none placeholder:text-black/30"
        />
        <Button type="submit" disabled={sending} className="flex w-full items-center justify-center gap-2">
          {sending ? 'Enviando…' : sent ? 'E-mail enviado' : 'Continuar'}
          {sent ? <CheckCircle2 size={16}/> : <ArrowRight size={16}/>}
        </Button>
      </form>

      {status&&<div className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-5 ${sent ? 'border-[#0b7285]/20 bg-[#e7f5f7] text-[#17314a]' : 'border-black/10 bg-white/60 text-[#17314a]'}`}>{status}</div>}

      <Link href="/" className="mt-7 block text-center text-xs text-[#687d8e] hover:text-[#17314a]">Entrar em modo demo</Link>
    </Card>
  </main>
}
