'use client';
import { useState } from 'react';
import { Check, Save, StickyNote } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { RichNoteEditor } from '@/features/notes/rich-note-editor';
import { saveNote } from '@/lib/notes-store';

export default function AnotacoesPage(){
  const [title,setTitle]=useState('');const [subject,setSubject]=useState('');const [content,setContent]=useState('');const [saved,setSaved]=useState(false);
  const persist=()=>{const plain=content.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').trim();if(!title.trim()&&!plain)return;saveNote({title,subject,content,format:'html'});setSaved(true);setTimeout(()=>setSaved(false),1600)};
  return <PageShell title="Anotar" kicker="Registre decisões, ideias e próximos passos" actions={<span className="flex items-center gap-2 text-xs text-[#557084]"><StickyNote size={15}/> Editor de anotações</span>}>
    <section className="octa-note-workspace">
      <div className="octa-note-workspace-head"><div><p className="text-[10px] uppercase tracking-[.14em] text-[#0b7285]">Nova anotação</p><h2>Escreva sem perder o contexto.</h2><p>O texto quebra linha automaticamente e a área pode ser expandida pela borda inferior.</p></div><button onClick={persist} className="octa-primary-button"><Save size={15}/>{saved?<><Check size={15}/> Salvo</>:'Salvar anotação'}</button></div>
      <div className="octa-note-fields"><label>Título<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex.: Próximos passos da reunião"/></label><label>Assunto<input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Ex.: Branding / proposta comercial"/></label></div>
      <RichNoteEditor value={content} onChange={setContent}/>
    </section>
  </PageShell>;
}
