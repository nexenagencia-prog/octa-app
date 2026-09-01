'use client';
import { useEffect, useState } from 'react';
import { getProfile, PROFILE_UPDATED_EVENT, type EditableProfile } from '@/lib/profile-store';

export function ProfileGreeting({className=''}:{className?:string}){
  const [name,setName]=useState(()=>getProfile().displayName);
  useEffect(()=>{
    const sync=()=>setName(getProfile().displayName);
    const onUpdate=(event:Event)=>setName(((event as CustomEvent<EditableProfile>).detail?.displayName)||getProfile().displayName);
    sync();
    window.addEventListener(PROFILE_UPDATED_EVENT,onUpdate);
    window.addEventListener('storage',sync);
    return()=>{window.removeEventListener(PROFILE_UPDATED_EVENT,onUpdate);window.removeEventListener('storage',sync)};
  },[]);
  const firstName=name.trim().split(/\s+/)[0]||'Usuário';
  return <p className={className}>Bem-vindo de volta, <strong>{firstName}</strong></p>;
}
