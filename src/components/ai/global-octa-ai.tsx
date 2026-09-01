'use client';
import { usePathname } from 'next/navigation';
import { OctaSkillCoach } from './octa-skill-coach';

export function GlobalOctaAI(){
 const pathname=usePathname();
 if(pathname==='/skills')return null;
 return <OctaSkillCoach/>;
}
