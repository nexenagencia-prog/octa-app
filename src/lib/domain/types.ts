export type OperationStatus='idle'|'saving'|'saved'|'syncing'|'offline'|'error';
export type OperationResult<T>={data:T|null;error:string|null;status:OperationStatus};
export type Meeting={id:string;slug:string;title:string;owner_id:string;status:'scheduled'|'live'|'ended';scheduled_at:string|null;created_at:string};
export type AgendaEvent={id:string;owner_id:string;room_id:string|null;title:string;starts_at:string;ends_at:string|null};
export type Contact={id:string;owner_id:string;contact_user_id:string|null;name:string;email:string|null;avatar_url:string|null};


export type DomainOperationState='idle'|'saving'|'saved'|'syncing'|'offline'|'error';
export const domainOperationState=(status:DomainOperationState,message?:string)=>({status,message:message??null,at:new Date().toISOString()});

export type OctaDomainEventName='meeting.created'|'meeting.ended'|'recording.ready'|'transcript.ready'|'action.created'|'notification.created';
export type OctaDomainEvent<T=unknown>={name:OctaDomainEventName;payload:T;at:string};
const OCTA_DOMAIN_EVENT='octa:domain-event';
export function publishDomainEvent<T>(name:OctaDomainEventName,payload:T){
  const event:OctaDomainEvent<T>={name,payload,at:new Date().toISOString()};
  if(typeof window!=='undefined') window.dispatchEvent(new CustomEvent(OCTA_DOMAIN_EVENT,{detail:event}));
  return event;
}
export function subscribeDomainEvents(listener:(event:OctaDomainEvent)=>void){
  if(typeof window==='undefined') return ()=>{};
  const handler=(e:Event)=>listener((e as CustomEvent<OctaDomainEvent>).detail);
  window.addEventListener(OCTA_DOMAIN_EVENT,handler);
  return ()=>window.removeEventListener(OCTA_DOMAIN_EVENT,handler);
}
