'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { AppShell } from '@/components/app-shell';

export default function HomePage(){
  const router=useRouter();
  const [query,setQuery]=useState('');
  const submit=(e:FormEvent)=>{e.preventDefault();const q=query.trim();if(q)router.push(`/reunioes?q=${encodeURIComponent(q)}`)};
  return <AppShell>
    <section className="octa-reference-stage" aria-label="OCTA">
      <Image src="/octa-home-reference.webp" alt="" fill priority sizes="100vw" className="octa-reference-image"/>

      <form className="octa-reference-search" onSubmit={submit}>
        <input aria-label="Buscar reunião, pessoa ou gravação" value={query} onChange={e=>setQuery(e.target.value)}/>
      </form>

      <Link href="/" className="octa-reference-hotspot hs-home" aria-label="Início"/>
      <Link href="/reunioes" className="octa-reference-hotspot hs-reunioes" aria-label="Reuniões"/>
      <Link href="/agenda" className="octa-reference-hotspot hs-agenda" aria-label="Agenda"/>
      <Link href="/contatos" className="octa-reference-hotspot hs-contatos" aria-label="Contatos"/>
      <Link href="/gravacoes" className="octa-reference-hotspot hs-gravacoes" aria-label="Gravações"/>
      <Link href="/chat" className="octa-reference-hotspot hs-ai" aria-label="OCTA AI"/>
      <Link href="/skills" className="octa-reference-hotspot hs-skills" aria-label="OCTA Skills"/>
      <Link href="/configuracoes" className="octa-reference-hotspot hs-config" aria-label="Configurações"/>
      <Link href="/profile" className="octa-reference-hotspot hs-profile" aria-label="Denner Biersack"/>

      <Link href="/reuniao-instantanea" className="octa-reference-hotspot hs-new-meeting" aria-label="Nova reunião"/>
      <Link href="/agenda" className="octa-reference-hotspot hs-schedule" aria-label="Agendar reunião"/>
      <Link href="/agenda" className="octa-reference-hotspot hs-next-meeting" aria-label="Próxima reunião — ver agenda"/>

      <Link href="/reuniao-instantanea" className="octa-reference-hotspot hs-quick-meeting" aria-label="Iniciar reunião"/>
      <Link href="/agenda" className="octa-reference-hotspot hs-quick-agenda" aria-label="Agendar"/>
      <Link href="/contatos" className="octa-reference-hotspot hs-quick-invite" aria-label="Convidar pessoas"/>
      <Link href="/gravar" className="octa-reference-hotspot hs-quick-record" aria-label="Gravar reunião"/>

      <Link href="/chat" className="octa-reference-hotspot hs-ai-card" aria-label="Abrir OCTA AI"/>
      <Link href="/skills" className="octa-reference-hotspot hs-skills-card" aria-label="Ver análise OCTA Skills"/>
      <Link href="/reunioes" className="octa-reference-hotspot hs-recent" aria-label="Ver reuniões recentes"/>
      <Link href="/gravacoes" className="octa-reference-hotspot hs-recordings" aria-label="Ver gravações"/>
      <Link href="/agenda" className="octa-reference-hotspot hs-week" aria-label="Ver agenda da semana"/>
    </section>
  </AppShell>
}
