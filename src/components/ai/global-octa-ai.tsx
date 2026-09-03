'use client';
import {useEffect} from 'react';
import {OctaSkillCoach} from './octa-skill-coach';

export function GlobalOctaAI(){
  useEffect(()=>{fetch('/api/profile').then(r=>r.ok?r.json():null).then(data=>{const p=data?.profile;if(!p?.displayName)return;try{localStorage.setItem('octa-profile-name',p.displayName);localStorage.setItem('octa-profile-headline',p.headline||'');localStorage.setItem('octa-profile-company',p.company||'')}catch{}window.dispatchEvent(new CustomEvent('octa-profile:updated',{detail:{name:p.displayName,headline:p.headline,company:p.company}}))}).catch(()=>{})},[]);
  return <OctaSkillCoach/>;
}
