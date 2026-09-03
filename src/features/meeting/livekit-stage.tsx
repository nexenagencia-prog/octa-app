'use client';
import { LiveKitRoom, RoomAudioRenderer, VideoTrack, useRoomContext, useTracks } from '@livekit/components-react';
import { LocalTrack, RoomEvent, Track } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import { liveKitUrl } from '@/lib/livekit/config';

type WhiteboardShareDetail={active:boolean;track?:MediaStreamTrack};
type MeetingChatEvent={id:string;roomId:string;userId:string;userName:string;body:string;createdAt:string};
type StageProps={room:string;identity:string;name:string;micEnabled?:boolean;cameraEnabled?:boolean;photoUrl?:string|null;fallbackPhotoUrl?:string|null;onActiveSpeaker?:(identity:string|null)=>void};

function CameraStage({cameraEnabled,photoUrl,fallbackPhotoUrl}:{cameraEnabled:boolean;photoUrl?:string|null;fallbackPhotoUrl?:string|null}){
 const tracks=useTracks([Track.Source.ScreenShare,Track.Source.Camera]);
 const shared=tracks.find(t=>t.publication?.source===Track.Source.ScreenShare&&t.publication?.isSubscribed&&!t.publication?.isMuted);
 const camera=tracks.find(t=>t.publication?.source===Track.Source.Camera&&t.publication?.isSubscribed&&!t.publication?.isMuted)??tracks.find(t=>t.publication?.source===Track.Source.Camera);
 const visible=shared??(cameraEnabled?camera:undefined);
 if(!visible){const image=photoUrl||fallbackPhotoUrl;return <div className="relative grid size-full place-items-center overflow-hidden bg-[#11100f] text-sm text-white/35">{image?<img src={image} alt="Câmera desligada" className="size-full object-cover"/>:'Câmera desligada'}</div>}
 return <VideoTrack trackRef={visible} className={`size-full ${shared?'object-contain bg-[#11100f]':'object-cover'}`} style={shared?undefined:{transform:'scaleX(-1)'}}/>;
}

function RoomBridge({micEnabled,cameraEnabled,onActiveSpeaker}:{micEnabled:boolean;cameraEnabled:boolean;onActiveSpeaker?:(identity:string|null)=>void}){
 const room=useRoomContext();const sharedTrack=useRef<LocalTrack|null>(null);
 useEffect(()=>{void room.localParticipant.setMicrophoneEnabled(micEnabled).catch(()=>undefined)},[micEnabled,room]);
 useEffect(()=>{void room.localParticipant.setCameraEnabled(cameraEnabled).catch(()=>undefined)},[cameraEnabled,room]);
 useEffect(()=>{
  if(!onActiveSpeaker)return;
  const handler=(speakers:Array<{identity:string}>)=>onActiveSpeaker(speakers[0]?.identity??null);
  room.on(RoomEvent.ActiveSpeakersChanged,handler);
  return()=>{room.off(RoomEvent.ActiveSpeakersChanged,handler)};
 },[onActiveSpeaker,room]);
 useEffect(()=>{
  const handler=async(event:Event)=>{
   const detail=(event as CustomEvent<WhiteboardShareDetail>).detail;
   if(detail.active&&detail.track){
    if(sharedTrack.current){await room.localParticipant.unpublishTrack(sharedTrack.current);sharedTrack.current.stop();sharedTrack.current=null}
    const publication=await room.localParticipant.publishTrack(detail.track,{source:Track.Source.ScreenShare,name:'OCTA Lousa'});
    sharedTrack.current=publication.track??null;
    return;
   }
   if(sharedTrack.current){await room.localParticipant.unpublishTrack(sharedTrack.current);sharedTrack.current.stop();sharedTrack.current=null}
  };
  window.addEventListener('octa-whiteboard-share',handler);
  return()=>{window.removeEventListener('octa-whiteboard-share',handler);if(sharedTrack.current){void room.localParticipant.unpublishTrack(sharedTrack.current);sharedTrack.current.stop();sharedTrack.current=null}};
 },[room]);
 useEffect(()=>{
  const send=(event:Event)=>{const detail=(event as CustomEvent<MeetingChatEvent>).detail;if(!detail)return;const payload=new TextEncoder().encode(JSON.stringify(detail));void room.localParticipant.publishData(payload,{reliable:true,topic:'octa-chat'}).catch(()=>undefined)};
  const receive=(payload:Uint8Array,participant?:{identity?:string;name?:string},_kind?:unknown,topic?:string)=>{if(topic!=='octa-chat')return;try{const parsed=JSON.parse(new TextDecoder().decode(payload)) as MeetingChatEvent;window.dispatchEvent(new CustomEvent('octa-chat-message',{detail:{...parsed,userId:participant?.identity||parsed.userId,userName:participant?.name||parsed.userName}}))}catch{}};
  window.addEventListener('octa-chat-send',send);room.on(RoomEvent.DataReceived,receive as never);
  return()=>{window.removeEventListener('octa-chat-send',send);room.off(RoomEvent.DataReceived,receive as never)};
 },[room]);
 return null;
}

export function LiveKitStage({room,identity,name,micEnabled=true,cameraEnabled=true,photoUrl,fallbackPhotoUrl,onActiveSpeaker}:StageProps){
 const [token,setToken]=useState<string|null>(null); const [error,setError]=useState('');
 useEffect(()=>{let alive=true; fetch(`/api/livekit/token?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(identity)}&name=${encodeURIComponent(name)}`).then(async r=>{if(!r.ok)throw new Error(await r.text()); return r.json()}).then(d=>alive&&setToken(d.token)).catch(e=>alive&&setError(e.message)); return()=>{alive=false}},[room,identity,name]);
 if(error) return <div className="grid size-full place-items-center bg-[#111217] p-6 text-center text-xs text-rose-300">LiveKit: {error}</div>;
 if(!token) return <div className="grid size-full place-items-center bg-[#111217] text-xs text-white/35">Conectando vídeo seguro…</div>;
 return <LiveKitRoom token={token} serverUrl={liveKitUrl} connect audio={micEnabled} video={cameraEnabled} className="size-full"><CameraStage cameraEnabled={cameraEnabled} photoUrl={photoUrl} fallbackPhotoUrl={fallbackPhotoUrl}/><RoomBridge micEnabled={micEnabled} cameraEnabled={cameraEnabled} onActiveSpeaker={onActiveSpeaker}/><RoomAudioRenderer/></LiveKitRoom>
}
