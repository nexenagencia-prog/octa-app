'use client';
import { useEffect,useState } from 'react';
type ProfileUpdatedEvent=CustomEvent<{name?:string}>;
export function ProfileGreeting({className=''}:{className?:string}){
 const[name,setName]=useState('');
 useEffect(()=>{let active=true;const load=()=>fetch('/api/profile',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{if(active&&data?.profile?.displayName)setName(data.profile.displayName)}).catch(()=>{});const onUpdate=(event:Event)=>{const next=(event as ProfileUpdatedEvent).detail?.name?.trim();if(next)setName(next);else void load()};void load();window.addEventListener('octa-profile:updated',onUpdate);return()=>{active=false;window.removeEventListener('octa-profile:updated',onUpdate)}},[]);
 const firstName=name.trim().split(/\s+/)[0]||'Usuário';
 return <p className={className}>Bem-vindo de volta, <strong>{firstName}</strong></p>;
}
