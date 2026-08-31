'use client';
import { LiveKitRoom, RoomAudioRenderer, VideoTrack, useParticipants, useRoomContext, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import { liveKitUrl } from '@/lib/livekit/config';

function CameraStage(){
 const tracks=useTracks([Track.Source.Camera]);
 const camera=tracks.find(t=>t.publication?.isSubscribed && !t.publication?.isMuted) ?? tracks[0];
 if(!camera) return <div className="grid size-full place-items-center bg-gradient-to-b from-[#201c2c] to-[#08090c] text-sm text-white/35">Câmera pronta para conectar</div>;
 return <VideoTrack trackRef={camera} className="size-full object-cover"/>;
}
function MediaSync({screenShare,cameraEnabled,microphoneEnabled,processedTrack,onError}:{screenShare:boolean;cameraEnabled:boolean;microphoneEnabled:boolean;processedTrack?:MediaStreamTrack|null;onError?:(message:string)=>void}){
 const room=useRoomContext();const published=useRef<MediaStreamTrack|null>(null);
 useEffect(()=>{let active=true;room.localParticipant.setScreenShareEnabled(screenShare).catch(error=>{if(active)onError?.(error instanceof Error?error.message:'Não foi possível compartilhar a tela')});return()=>{active=false}},[room,screenShare,onError]);
 useEffect(()=>{room.localParticipant.setMicrophoneEnabled(microphoneEnabled).catch(()=>{})},[room,microphoneEnabled]);
 useEffect(()=>{let alive=true;
   async function sync(){
     try{
       if(processedTrack){
         processedTrack.enabled=cameraEnabled;
         if(published.current!==processedTrack){
           if(published.current)await room.localParticipant.unpublishTrack(published.current).catch(()=>{});
           await room.localParticipant.publishTrack(processedTrack,{source:Track.Source.Camera,name:'OCTA Smart Camera'});
           if(alive)published.current=processedTrack;
         }
       }else await room.localParticipant.setCameraEnabled(cameraEnabled);
     }catch(error){if(alive)onError?.(error instanceof Error?error.message:'Não foi possível ativar a câmera')}
   }
   void sync();return()=>{alive=false};
 },[room,processedTrack,cameraEnabled,onError]);
 useEffect(()=>()=>{if(published.current)void room.localParticipant.unpublishTrack(published.current).catch(()=>{})},[room]);
 return null;
}
function ParticipantSync({onChange}:{onChange?:(names:string[])=>void}){const participants=useParticipants();useEffect(()=>{onChange?.(participants.map(p=>p.name||p.identity))},[participants,onChange]);return null}

export function LiveKitStage({room,identity,name,screenShare=false,cameraEnabled=true,microphoneEnabled=true,processedTrack=null,onScreenShareError,onParticipantsChange}:{room:string;identity:string;name:string;screenShare?:boolean;cameraEnabled?:boolean;microphoneEnabled?:boolean;processedTrack?:MediaStreamTrack|null;onScreenShareError?:(message:string)=>void;onParticipantsChange?:(names:string[])=>void}){
 const [token,setToken]=useState<string|null>(null); const [error,setError]=useState('');
 useEffect(()=>{let alive=true; fetch(`/api/livekit/token?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(identity)}&name=${encodeURIComponent(name)}`).then(async r=>{if(!r.ok)throw new Error(await r.text()); return r.json()}).then(d=>alive&&setToken(d.token)).catch(e=>alive&&setError(e.message)); return()=>{alive=false}},[room,identity,name]);
 if(error) return <div className="grid size-full place-items-center bg-[#111217] p-6 text-center text-xs text-rose-300">LiveKit: {error}</div>;
 if(!token) return <div className="grid size-full place-items-center bg-[#111217] text-xs text-white/35">Conectando vídeo seguro…</div>;
 return <LiveKitRoom token={token} serverUrl={liveKitUrl} connect audio={false} video={false} className="size-full"><MediaSync screenShare={screenShare} cameraEnabled={cameraEnabled} microphoneEnabled={microphoneEnabled} processedTrack={processedTrack} onError={onScreenShareError}/><ParticipantSync onChange={onParticipantsChange}/><CameraStage/><RoomAudioRenderer/></LiveKitRoom>;
}
