'use client';
import { LiveKitRoom, RoomAudioRenderer, VideoTrack, useRoomContext, useTracks } from '@livekit/components-react';
import { LocalTrack, RoomEvent, Track } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import { liveKitUrl } from '@/lib/livekit/config';

type WhiteboardShareDetail={active:boolean;track?:MediaStreamTrack};

function CameraStage(){
 const tracks=useTracks([Track.Source.ScreenShare,Track.Source.Camera]);
 const shared=tracks.find(t=>t.publication?.source===Track.Source.ScreenShare&&t.publication?.isSubscribed&&!t.publication?.isMuted);
 const camera=tracks.find(t=>t.publication?.source===Track.Source.Camera&&t.publication?.isSubscribed&&!t.publication?.isMuted)??tracks.find(t=>t.publication?.source===Track.Source.Camera);
 const visible=shared??camera;
 if(!visible) return <div className="grid size-full place-items-center bg-gradient-to-b from-[#201c2c] to-[#08090c] text-sm text-white/35">Câmera pronta para conectar</div>;
 return <VideoTrack trackRef={visible} className={`size-full ${shared?'object-contain bg-[#11100f]':'object-cover'}`}/>;
}

function RoomBridge({onActiveSpeaker}:{onActiveSpeaker?:(identity:string|null)=>void}){
 const room=useRoomContext();const sharedTrack=useRef<LocalTrack|null>(null);
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
 return null;
}

export function LiveKitStage({room,identity,name,onActiveSpeaker}:{room:string;identity:string;name:string;onActiveSpeaker?:(identity:string|null)=>void}){
 const [token,setToken]=useState<string|null>(null); const [error,setError]=useState('');
 useEffect(()=>{let alive=true; fetch(`/api/livekit/token?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(identity)}&name=${encodeURIComponent(name)}`).then(async r=>{if(!r.ok)throw new Error(await r.text()); return r.json()}).then(d=>alive&&setToken(d.token)).catch(e=>alive&&setError(e.message)); return()=>{alive=false}},[room,identity,name]);
 if(error) return <div className="grid size-full place-items-center bg-[#111217] p-6 text-center text-xs text-rose-300">LiveKit: {error}</div>;
 if(!token) return <div className="grid size-full place-items-center bg-[#111217] text-xs text-white/35">Conectando vídeo seguro…</div>;
 return <LiveKitRoom token={token} serverUrl={liveKitUrl} connect audio video className="size-full"><CameraStage/><RoomBridge onActiveSpeaker={onActiveSpeaker}/><RoomAudioRenderer/></LiveKitRoom>
}
