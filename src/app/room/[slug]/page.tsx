import { MeetingClient } from '@/features/meeting/meeting-client';
import { demoMeetings } from '@/lib/demo/data';

export default async function RoomPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params; const m=demoMeetings.find(x=>x.slug===slug); return <MeetingClient slug={slug} title={m?.title ?? 'Reunião OKTA'}/>}
