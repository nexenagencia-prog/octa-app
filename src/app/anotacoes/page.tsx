'use client';
import { useState } from 'react';
import { Check, Save, StickyNote } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { saveNote } from '@/lib/notes-store';

export default function AnotacoesPage(){
  const [title,setTitle]=useState('');const [content,setContent]=useState('');const [saved,setSaved]=useState(false);
  const persist=()=>{const plain=content.trim();if(!title.trim()&&!plain)return;saveNote({title,subject:'',content:plain,format:'plain'});setSaved(true);setTimeout(()=>setSaved(false),1600)};
  return <PageShell title="Anotar" kicker="Título e texto, sem distrações" actions={<span className="flex items-center gap-2 text-xs text-white/45"><StickyNote size={15}/> Bloco de notas</span>}>
    <section className="octa-note-simple">
      <div className="octa-note-simple-head"><div><p>NOTA</p><h2>Escreva o essencial.</h2></div><button onClick={persist} className="octa-note-save"><Save size={15}/>{saved?<><Check size={15}/> Salvo</>:'Salvar'}</button></div>
      <label>Título<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título da anotação"/></label>
      <label className="octa-note-text-label">Texto<textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Escreva aqui..."/></label>
    </section>
  </PageShell>;
}
