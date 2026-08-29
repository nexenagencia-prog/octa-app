'use client';
import { useRouter } from 'next/navigation';
import { Radio } from 'lucide-react';
import { createMeetingSlug } from '@/lib/demo/helpers';

export function CreateMeetingButton(){
 const router=useRouter();
 return <button onClick={()=>router.push(`/room/${createMeetingSlug('reuniao')}`)} className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"><Radio size={16}/> Nova reunião</button>
}
