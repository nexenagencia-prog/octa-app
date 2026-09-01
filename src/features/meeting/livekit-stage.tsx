'use client';
import { LiveKitRoom, RoomAudioRenderer, VideoTrack, useRoomContext, useTracks } from '@livekit/components-react';
import { RoomEvent, Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import { liveKitUrl } from '@/lib/livekit/config';

function CameraStage(){
 const tracks=useTracks([Track.Source.Camera]);
 const camera=tracks.find(t=>t.publication?.isSubscribed && !t.publication?.isMuted) ?? tracks[0];
 if(!camera) return <div className="grid size-full place-items-center bg-gradient-to-b from-[#201c2c] to-[#08090c] text-sm text-white/35">Câmera pronta para conectar</div>;
 return <VideoTrack trackRef={camera} className="size-full object-cover"/>;
}

function ActiveSpeakerBridge({onActiveSpeaker}:{onActiveSpeaker?:(identity:string|null)=>void}){
 const room=useRoomContext();
 useEffect(()=>{
  if(!onActiveSpeaker)return;
  const handler=(speakers:Array<{identity:string}>)=>onActiveSpeaker(speakers[0]?.identity??null);
  room.on(RoomEvent.ActiveSpeakersChanged,handler);
  return()=>{room.off(RoomEvent.ActiveSpeakersChanged,handler)};
 },[onActiveSpeaker,room]);
 return null;
}

export function LiveKitStage({room,identity,name,onActiveSpeaker}:{room:string;identity:string;name:string;onActiveSpeaker?:(identity:string|null)=>void}){
 const [token,setToken]=useState<string|null>(null); const [error,setError]=useState('');
 useEffect(()=>{let alive=true; fetch(`/api/livekit/token?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(identity)}&name=${encodeURIComponent(name)}`).then(async r=>{if(!r.ok)throw new Error(await r.text()); return r.json()}).then(d=>alive&&setToken(d.token)).catch(e=>alive&&setError(e.message)); return()=>{alive=false}},[room,identity,name]);
 if(error) return <div className="grid size-full place-items-center bg-[#111217] p-6 text-center text-xs text-rose-300">LiveKit: {error}</div>;
 if(!token) return <div className="grid size-full place-items-center bg-[#111217] text-xs text-white/35">Conectando vídeo seguro…</div>;
 return <LiveKitRoom token={token} serverUrl={liveKitUrl} connect audio video className="size-full"><CameraStage/><ActiveSpeakerBridge onActiveSpeaker={onActiveSpeaker}/><RoomAudioRenderer/></LiveKitRoom>
}
