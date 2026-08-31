'use client';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, KeyRound, Mail, Sparkles } from 'lucide-react';
import { Button, Card, Pill } from '@/components/ui';
import { isSupabaseConfigured, supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [status,setStatus]=useState('');
  const [loading,setLoading]=useState(false);
  const [hasSession,setHasSession]=useState(false);
  const [settingPassword,setSettingPassword]=useState(false);
  const [recovering,setRecovering]=useState(false);
  const [passwordSaved,setPasswordSaved]=useState(false);

  const reset = useMemo(()=>typeof window!=='undefined' ? new URLSearchParams(window.location.search).get('reset') : null,[]);

  useEffect(()=>{
    if(reset==='success') setStatus('Senha redefinida. Entre com sua nova senha.');
    if(reset==='expired') setStatus('O link de redefinição expirou. Solicite um novo abaixo.');
    if(!isSupabaseConfigured)return;
    const supabase=supabaseBrowser();
    if(!supabase)return;
    supabase.auth.getUser().then(({data})=>{
      if(data.user){
        setHasSession(true);
        setEmail(data.user.email||'');
      }
    }).catch(()=>{});
  },[reset]);

  async function submit(e:FormEvent){
    e.preventDefault();
    if(loading)return;
    setStatus('');

    if(!isSupabaseConfigured){
      setStatus('Supabase não está configurado neste deploy.');
      return;
    }
    const supabase=supabaseBrowser();
    if(!supabase){
      setStatus('Não foi possível iniciar o acesso ao CMS.');
      return;
    }

    setLoading(true);
    try{
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error){
        setStatus(error.message==='Invalid login credentials'?'E-mail ou senha incorretos.':error.message);
        return;
      }
      location.assign('/admin');
    }catch(error){
      setStatus(error instanceof Error ? error.message : 'Não foi possível entrar no CMS.');
    }finally{
      setLoading(false);
    }
  }

  async function sendRecovery(e:FormEvent){
    e.preventDefault();
    if(loading)return;
    setStatus('');
    if(!email.trim()){
      setStatus('Digite seu e-mail administrador para redefinir a senha.');
      return;
    }
    const supabase=supabaseBrowser();
    if(!supabase){
      setStatus('Não foi possível iniciar a recuperação de senha.');
      return;
    }
    setLoading(true);
    try{
      const configuredSite=(process.env.NEXT_PUBLIC_SITE_URL||window.location.origin).replace(/\/$/,'');
      const redirectTo=`${configuredSite}/reset-password`;
      const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo});
      if(error){
        setStatus(error.message);
        return;
      }
      setStatus('E-mail de recuperação enviado. Abra a mensagem mais recente da OCTA e clique em redefinir senha.');
    }catch(error){
      setStatus(error instanceof Error ? error.message : 'Não foi possível enviar a recuperação de senha.');
    }finally{
      setLoading(false);
    }
  }

  async function definePassword(e:FormEvent){
    e.preventDefault();
    if(loading)return;
    setStatus('');
    setPasswordSaved(false);

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
      setStatus('Não foi possível iniciar o acesso ao CMS.');
      return;
    }

    setLoading(true);
    try{
      const {error}=await supabase.auth.updateUser({password});
      if(error){
        setStatus(error.message);
        return;
      }
      setPasswordSaved(true);
      setSettingPassword(false);
      setConfirmPassword('');
      setStatus('Senha definida. Nos próximos acessos, use seu e-mail e esta senha.');
    }catch(error){
      setStatus(error instanceof Error ? error.message : 'Não foi possível definir a senha.');
    }finally{
      setLoading(false);
    }
  }

  const mainForm=<form onSubmit={submit} className="mt-8 space-y-3">
    <input
      type="email"
      required
      autoComplete="email"
      value={email}
      onChange={e=>setEmail(e.target.value)}
      placeholder="voce@empresa.com"
      className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-4 text-[#17314a] outline-none placeholder:text-black/30"
    />
    <input
      type="password"
      required
      autoComplete="current-password"
      value={password}
      onChange={e=>setPassword(e.target.value)}
      placeholder="Sua senha"
      className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-4 text-[#17314a] outline-none placeholder:text-black/30"
    />
    <div className="flex justify-end">
      <button type="button" onClick={()=>{setRecovering(true);setStatus('')}} className="text-xs font-medium text-[#536b7f] hover:text-[#17314a]">Esqueci minha senha</button>
    </div>
    <Button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2">
      {loading ? 'Entrando…' : 'Entrar'} <ArrowRight size={16}/>
    </Button>
  </form>;

  const recoveryForm=<form onSubmit={sendRecovery} className="mt-8 space-y-3">
    <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm leading-6 text-[#536b7f]">Digite o e-mail administrador. Você receberá um link seguro para criar uma nova senha.</div>
    <input
      type="email"
      required
      autoComplete="email"
      value={email}
      onChange={e=>setEmail(e.target.value)}
      placeholder="voce@empresa.com"
      className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-4 text-[#17314a] outline-none placeholder:text-black/30"
    />
    <Button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2">
      {loading ? 'Enviando…' : 'Enviar link de redefinição'} <Mail size={16}/>
    </Button>
    <button type="button" onClick={()=>{setRecovering(false);setStatus('')}} className="w-full py-2 text-xs text-[#687d8e]">Voltar para entrar</button>
  </form>;

  return <main className="grid min-h-screen place-items-center p-5">
    <Card className="w-full max-w-md p-7 md:p-9">
      <Pill><Sparkles size={13}/> OCTA Access</Pill>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-.045em] text-[#0a2238]">{recovering?'Redefina sua senha.':'Entre no CMS.'}</h1>
      <p className="mt-3 text-sm leading-6 text-[#536b7f]">{recovering?'Receba um link seguro e crie uma nova senha.':'Acesse com seu e-mail administrador e senha.'}</p>

      {!settingPassword&&(recovering?recoveryForm:mainForm)}

      {hasSession&&!recovering&&<div className="mt-5 border-t border-black/10 pt-5">
        {!settingPassword?<button type="button" onClick={()=>{setSettingPassword(true);setPassword('');setStatus('')}} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-sm font-medium text-[#17314a] hover:bg-white">
          <KeyRound size={15}/> Definir minha senha
        </button>:<form onSubmit={definePassword} className="space-y-3">
          <div className="mb-2 text-sm font-medium text-[#17314a]">Crie sua senha de acesso</div>
          <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nova senha" className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-4 text-[#17314a] outline-none placeholder:text-black/30" />
          <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="Confirmar nova senha" className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-4 text-[#17314a] outline-none placeholder:text-black/30" />
          <Button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2">{loading?'Salvando…':'Salvar senha'} <CheckCircle2 size={16}/></Button>
          <button type="button" onClick={()=>{setSettingPassword(false);setPassword('');setConfirmPassword('');setStatus('')}} className="w-full py-2 text-xs text-[#687d8e]">Cancelar</button>
        </form>}
      </div>}

      {status&&<div className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-5 ${passwordSaved || reset==='success' ? 'border-[#0b7285]/20 bg-[#e7f5f7] text-[#17314a]' : 'border-black/10 bg-white/60 text-[#17314a]'}`}>{status}</div>}
      <Link href="/" className="mt-7 block text-center text-xs text-[#687d8e] hover:text-[#17314a]">Voltar ao OCTA</Link>
    </Card>
  </main>;
}
