'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import styles from './login.module.css';

type Mode = 'signin' | 'signup';

function friendlyAuthMessage(message: string) {
  const value = message.toLowerCase();
  if (value.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (value.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (value.includes('user already registered')) return 'Este e-mail já possui uma conta.';
  if (value.includes('password should be')) return 'Use uma senha com pelo menos 6 caracteres.';
  if (value.includes('rate limit')) return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
  return message || 'Não foi possível concluir o acesso.';
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) router.replace('/');
    }).catch(() => undefined);
    return () => { active = false; };
  }, [router, supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (!supabase) {
      setMessage('Login temporariamente indisponível.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (mode === 'signup') {
        const emailRedirectTo = `${window.location.origin}/auth/callback?next=/`;
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { emailRedirectTo },
        });
        if (error) throw error;
        if (data.session) {
          router.replace('/');
          router.refresh();
          return;
        }
        setMessage('Conta criada. Confirme seu e-mail para entrar.');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) throw error;
      router.replace('/');
      router.refresh();
    } catch (error) {
      setMessage(friendlyAuthMessage(error instanceof Error ? error.message : 'Não foi possível entrar.'));
    } finally {
      setLoading(false);
    }
  }

  async function continueWithGoogle() {
    setMessage('');
    if (!supabase) {
      setMessage('Login temporariamente indisponível.');
      return;
    }
    setLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback?next=/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) {
      setMessage(friendlyAuthMessage(error.message));
      setLoading(false);
    }
  }

  async function forgotPassword() {
    setMessage('');
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setMessage('Digite seu e-mail para recuperar a senha.');
      return;
    }
    if (!supabase) {
      setMessage('Recuperação temporariamente indisponível.');
      return;
    }
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo });
      if (error) throw error;
      setMessage('Enviamos um link de recuperação para seu e-mail.');
    } catch (error) {
      setMessage(friendlyAuthMessage(error instanceof Error ? error.message : 'Não foi possível recuperar sua senha.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <section className={styles.card} aria-label="Acesso à conta">
        <header className={styles.header}>
          <h1 aria-label={mode === 'signin' ? 'Bem-vindo' : 'Criar conta'}>{mode === 'signin' ? <>Bem-<span>vindo</span></> : <>Criar <span>conta</span></>}</h1>
          <p>{mode === 'signin' ? 'Acesse sua conta para continuar' : 'Crie sua conta para começar'}</p>
        </header>

        <form className={styles.form} onSubmit={submit}>
          <label>
            <span>E-mail</span>
            <div className={styles.inputShell}>
              <Mail size={21} strokeWidth={1.6} />
              <input type="email" autoComplete="email" inputMode="email" placeholder="Digite seu e-mail" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} />
            </div>
          </label>

          <label>
            <span>Senha</span>
            <div className={styles.inputShell}>
              <LockKeyhole size={21} strokeWidth={1.6} />
              <input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} placeholder="Digite sua senha" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required disabled={loading} />
              <button className={styles.eye} type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar ou ocultar senha" disabled={loading}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>

          {mode === 'signin' && <button className={styles.forgot} type="button" onClick={forgotPassword} disabled={loading}>Esqueci minha senha</button>}
          {message && <p className={styles.message} role="status" aria-live="polite">{message}</p>}

          <button className={styles.primary} type="submit" disabled={loading}>
            <span>{loading ? 'Aguarde...' : mode === 'signin' ? 'Entrar' : 'Criar conta'}</span>
            <ArrowRight size={22} strokeWidth={1.6} />
          </button>
        </form>

        <div className={styles.divider}><span /> <em>ou continue com</em> <span /></div>

        <button className={styles.google} type="button" onClick={continueWithGoogle} disabled={loading}>
          <strong aria-hidden="true">G</strong>
          <span>Continuar com Google</span>
        </button>

        <p className={styles.switchText}>
          {mode === 'signin' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <button type="button" disabled={loading} onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(''); }}>
            {mode === 'signin' ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </section>
    </main>
  );
}
