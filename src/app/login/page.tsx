'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button, Card, Pill } from '@/components/ui';
import { isSupabaseConfigured, supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage(){const [email,setEmail]=useState(''); const [status,setStatus]=useState('');
 async function submit(e:FormEvent){e.preventDefault(); if(!isSupabaseConfigured){setStatus('Modo demo ativo. Configure Supabase para enviar magic links.');return;} const supabase=supabaseBrowser(); if(!supabase)return; const {error}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:`${location.origin}/auth/callback?next=/admin`}}); setStatus(error?error.message:'Link enviado para seu e-mail.');}
 return <main className="grid min-h-screen place-items-center p-5"><Card className="w-full max-w-md p-7 md:p-9"><Pill><Sparkles size={13}/> OKTA Access</Pill><h1 className="mt-5 text-4xl font-semibold tracking-[-.045em]">Entre na sua presença.</h1><p className="mt-3 text-sm leading-6 text-white/45">Acesse agenda, reuniões e replays em uma única experiência.</p><form onSubmit={submit} className="mt-8 space-y-3"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@empresa.com" className="w-full rounded-2xl border border-white/10 bg-white/[.04] px-4 py-4 outline-none"/><Button className="flex w-full items-center justify-center gap-2">Continuar <ArrowRight size={16}/></Button></form>{status&&<p className="mt-4 text-sm text-white/55">{status}</p>}<Link href="/" className="mt-7 block text-center text-xs text-white/35 hover:text-white">Entrar em modo demo</Link></Card></main>}
