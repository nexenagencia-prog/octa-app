'use client';
import { LiveKitRoom, RoomAudioRenderer, VideoTrack, useParticipants, useRoomContext, useTracks } from '@livekit/components-react';
import { RoomEvent, Track } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import { liveKitUrl } from '@/lib/livekit/config';

function CameraStage({selectedName,fallbackName,fallbackAvatarUrl}:{selectedName?:string;fallbackName:string;fallbackAvatarUrl?:string}){
 const tracks=useTracks([Track.Source.Camera]);
 const selected=selectedName?tracks.find(t=>t.participant?.name===selectedName||t.participant?.identity===selectedName):undefined;
 const camera=selected ?? tracks.find(t=>t.publication?.isSubscribed && !t.publication?.isMuted) ?? tracks[0];
 const paused=!camera||camera.publication?.isMuted;
 if(paused) return <div className="relative grid size-full place-items-center overflow-hidden bg-gradient-to-b from-[#131b24] to-[#08090c]">{fallbackAvatarUrl?<img src={fallbackAvatarUrl} alt={fallbackName} className="absolute inset-0 size-full object-cover opacity-70 blur-[1px]"/>:null}<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/15"/><div className="relative z-10 text-center"><div className="mx-auto grid size-20 place-items-center rounded-full border border-white/15 bg-black/25 text-xl font-semibold text-white">{fallbackName.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()}</div><p className="mt-4 text-xs text-white/70">Câmera pausada</p></div></div>;
 return <VideoTrack trackRef={camera} className="size-full object-cover"/>;
}
function MediaSync({screenShare,cameraEnabled,microphoneEnabled,processedTrack,chatEnabled,whiteboardVisible,onError}:{screenShare:boolean;cameraEnabled:boolean;microphoneEnabled:boolean;processedTrack?:MediaStreamTrack|null;chatEnabled:boolean;whiteboardVisible:boolean;onError?:(message:string)=>void}){
 const room=useRoomContext();const published=useRef<MediaStreamTrack|null>(null);
 useEffect(()=>{let active=true;room.localParticipant.setScreenShareEnabled(screenShare).catch(error=>{if(active)onError?.(error instanceof Error?error.message:'Não foi possível compartilhar a tela')});return()=>{active=false}},[room,screenShare,onError]);
 useEffect(()=>{room.localParticipant.setMicrophoneEnabled(microphoneEnabled).catch(()=>{})},[room,microphoneEnabled]);
 useEffect(()=>{let alive=true;async function sync(){try{if(processedTrack){processedTrack.enabled=cameraEnabled;if(published.current!==processedTrack){if(published.current)await room.localParticipant.unpublishTrack(published.current).catch(()=>{});await room.localParticipant.publishTrack(processedTrack,{source:Track.Source.Camera,name:'OCTA Smart Camera'});if(alive)published.current=processedTrack}}else await room.localParticipant.setCameraEnabled(cameraEnabled)}catch(error){if(alive)onError?.(error instanceof Error?error.message:'Não foi possível ativar a câmera')}}void sync();return()=>{alive=false}},[room,processedTrack,cameraEnabled,onError]);
 useEffect(()=>{const payload=new TextEncoder().encode(JSON.stringify({type:'octa-host-controls',chatEnabled,whiteboardVisible}));room.localParticipant.publishData(payload,{reliable:true,topic:'octa-controls'}).catch(()=>{})},[room,chatEnabled,whiteboardVisible]);
 useEffect(()=>()=>{if(published.current)void room.localParticipant.unpublishTrack(published.current).catch(()=>{})},[room]);return null;
}
function ParticipantSync({onChange}:{onChange?:(names:string[])=>void}){const participants=useParticipants();useEffect(()=>{onChange?.(participants.map(p=>p.name||p.identity))},[participants,onChange]);return null}
function RemoteControlSync({onRemoteControls}:{onRemoteControls?:(controls:{chatEnabled?:boolean;whiteboardVisible?:boolean})=>void}){const room=useRoomContext();useEffect(()=>{const handler=(payload:Uint8Array,_participant:unknown,_kind:unknown,topic?:string)=>{if(topic!=='octa-controls')return;try{const data=JSON.parse(new TextDecoder().decode(payload));if(data?.type==='octa-host-controls')onRemoteControls?.({chatEnabled:data.chatEnabled,whiteboardVisible:data.whiteboardVisible})}catch{}};room.on(RoomEvent.DataReceived,handler as never);return()=>{room.off(RoomEvent.DataReceived,handler as never)}},[room,onRemoteControls]);return null}

export function LiveKitStage({room,identity,name,screenShare=false,cameraEnabled=true,microphoneEnabled=true,processedTrack=null,selectedName,fallbackName=name,fallbackAvatarUrl,chatEnabled=true,whiteboardVisible=false,onScreenShareError,onParticipantsChange,onRemoteControls}:{room:string;identity:string;name:string;screenShare?:boolean;cameraEnabled?:boolean;microphoneEnabled?:boolean;processedTrack?:MediaStreamTrack|null;selectedName?:string;fallbackName?:string;fallbackAvatarUrl?:string;chatEnabled?:boolean;whiteboardVisible?:boolean;onScreenShareError?:(message:string)=>void;onParticipantsChange?:(names:string[])=>void;onRemoteControls?:(controls:{chatEnabled?:boolean;whiteboardVisible?:boolean})=>void}){
 const [token,setToken]=useState<string|null>(null); const [error,setError]=useState('');
 useEffect(()=>{let alive=true; fetch(`/api/livekit/token?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(identity)}&name=${encodeURIComponent(name)}`).then(async r=>{if(!r.ok)throw new Error(await r.text()); return r.json()}).then(d=>alive&&setToken(d.token)).catch(e=>alive&&setError(e.message)); return()=>{alive=false}},[room,identity,name]);
 if(error) return <div className="grid size-full place-items-center bg-[#111217] p-6 text-center text-xs text-rose-300">LiveKit: {error}</div>;
 if(!token) return <div className="grid size-full place-items-center bg-[#111217] text-xs text-white/35">Conectando vídeo seguro…</div>;
 return <LiveKitRoom token={token} serverUrl={liveKitUrl} connect audio={false} video={false} className="size-full"><MediaSync screenShare={screenShare} cameraEnabled={cameraEnabled} microphoneEnabled={microphoneEnabled} processedTrack={processedTrack} chatEnabled={chatEnabled} whiteboardVisible={whiteboardVisible} onError={onScreenShareError}/><ParticipantSync onChange={onParticipantsChange}/><RemoteControlSync onRemoteControls={onRemoteControls}/><CameraStage selectedName={selectedName} fallbackName={fallbackName} fallbackAvatarUrl={fallbackAvatarUrl}/><RoomAudioRenderer/></LiveKitRoom>;
}
