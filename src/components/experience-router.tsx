'use client';
import { useEffect, useState } from 'react';
import { ExperienceVersion, getExperienceVersion } from '@/lib/experience-version';

export function ExperienceRouter({v1,v2}:{v1:React.ReactNode;v2:React.ReactNode}) {
  const [version,setVersion]=useState<ExperienceVersion>('v1');
  useEffect(()=>{ getExperienceVersion().then(setVersion).catch(()=>setVersion('v1')); },[]);
  return version === 'v2' ? <>{v2}</> : <>{v1}</>;
}
