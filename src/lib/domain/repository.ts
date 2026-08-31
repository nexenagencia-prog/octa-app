'use client';
import { supabaseBrowser } from '@/lib/supabase/client';
import type {AgendaEvent,Meeting,OperationResult} from './types';
const fail=<T>(error:string):OperationResult<T>=>({data:null,error,status:'error'});
export async function createMeeting(input:{title:string;scheduledAt?:string|null}):Promise<OperationResult<Meeting>>{
 const s=supabaseBrowser();if(!s)return fail('Supabase não configurado.');
 const {data:{user}}=await s.auth.getUser();if(!user)return fail('Usuário não autenticado.');
 const slug=`octa-${Date.now().toString(36)}-${crypto.randomUUID().slice(0,6)}`;
 const {data,error}=await s.from('rooms').insert({title:input.title,slug,owner_id:user.id,livekit_room_name:slug,scheduled_at:input.scheduledAt??null}).select().single();
 if(error)return fail(error.message);
 if(input.scheduledAt) await s.from('agenda_events').insert({owner_id:user.id,room_id:data.id,title:input.title,starts_at:input.scheduledAt});
 return {data:data as Meeting,error:null,status:'saved'};
}
export async function listAgendaEvents():Promise<OperationResult<AgendaEvent[]>>{
 const s=supabaseBrowser();if(!s)return fail('Supabase não configurado.');
 const {data,error}=await s.from('agenda_events').select('*').order('starts_at');
 return error?fail(error.message):{data:(data??[]) as AgendaEvent[],error:null,status:'saved'};
}
