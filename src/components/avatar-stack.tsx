import Image from 'next/image';
import { demoParticipants } from '@/lib/demo/data';

export function AvatarStack({ ids, max = 4 }: { ids: string[]; max?: number }) {
  const people = ids.map(id => demoParticipants.find(p => p.id === id)).filter(Boolean).slice(0,max);
  return <div className="flex -space-x-2">{people.map((p) => p?.avatarUrl ? <Image key={p.id} src={p.avatarUrl} alt={p.displayName} width={34} height={34} className="size-8 rounded-full border-2 border-[#111216] object-cover"/> : null)}{ids.length > max && <div className="grid size-8 place-items-center rounded-full border-2 border-[#111216] bg-white/10 text-[10px]">+{ids.length-max}</div>}</div>;
}
