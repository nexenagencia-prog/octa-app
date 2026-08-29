'use client';
import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { EditableProfile, saveProfile } from '@/lib/profile-store';

export function ProfileEditor({profile,onClose,onSaved}:{profile:EditableProfile;onClose:()=>void;onSaved:(profile:EditableProfile)=>void}){
  const [draft,setDraft]=useState(profile); const fileRef=useRef<HTMLInputElement>(null);
  const chooseFile=(file?:File)=>{if(!file)return; const reader=new FileReader();reader.onload=()=>setDraft(x=>({...x,avatarUrl:String(reader.result??'')}));reader.readAsDataURL(file)};
  const submit=(e:React.FormEvent)=>{e.preventDefault();const next={...draft,displayName:draft.displayName.trim()||profile.displayName};saveProfile(next);onSaved(next);onClose();};
  return <div className="profile-editor-backdrop" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}><form onSubmit={submit} className="profile-editor-card">
    <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-[#0b7285]">Seu perfil</p><h2 className="mt-1 text-xl font-semibold tracking-[-.03em] text-[#0a2238]">Editar nome e foto</h2></div><button type="button" onClick={onClose} className="octa-icon-button"><X size={16}/></button></div>
    <div className="mt-5 flex items-center gap-4"><button type="button" onClick={()=>fileRef.current?.click()} className="relative size-20 overflow-hidden rounded-full bg-[#dce8ed]"><img src={draft.avatarUrl||profile.avatarUrl} alt="Prévia do perfil" className="h-full w-full object-cover"/><span className="absolute inset-x-0 bottom-0 grid h-7 place-items-center bg-black/45 text-white"><Camera size={13}/></span></button><div className="min-w-0 flex-1"><input ref={fileRef} hidden type="file" accept="image/*" onChange={e=>chooseFile(e.target.files?.[0])}/><p className="text-xs text-[#667b8e]">Clique na foto para trocar. A imagem fica salva neste navegador.</p></div></div>
    <label className="mt-5 block text-xs font-medium text-[#425d71]">Nome<input className="octa-input mt-2 w-full" value={draft.displayName} onChange={e=>setDraft(x=>({...x,displayName:e.target.value}))}/></label>
    <label className="mt-3 block text-xs font-medium text-[#425d71]">Descrição<input className="octa-input mt-2 w-full" value={draft.headline} onChange={e=>setDraft(x=>({...x,headline:e.target.value}))}/></label>
    <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="octa-secondary-button">Cancelar</button><button className="octa-primary-button">Salvar alterações</button></div>
  </form></div>;
}
