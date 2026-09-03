'use client';
import { useEffect, useRef, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { applyMeetingMediaState, createMeetingMediaConstraints, meetingMediaErrorMessage, stopMeetingMedia } from '@/lib/meeting-media';

type Props={cameraEnabled:boolean;micEnabled:boolean;photoUrl:string|null;fallbackPhotoUrl?:string|null};
export function LocalCameraStage({cameraEnabled,micEnabled,photoUrl,fallbackPhotoUrl}:Props){
 const videoRef=useRef<HTMLVideoElement>(null);const streamRef=useRef<MediaStream|null>(null);const[status,setStatus]=useState<'loading'|'ready'|'error'>('loading');const[error,setError]=useState('');
 const currentPhoto=photoUrl||fallbackPhotoUrl||null;
 const start=async()=>{setStatus('loading');setError('');stopMeetingMedia(streamRef.current);streamRef.current=null;if(!navigator.mediaDevices?.getUserMedia){setStatus('error');setError('Seu navegador não oferece acesso seguro à câmera.');return}try{const stream=await navigator.mediaDevices.getUserMedia(createMeetingMediaConstraints());streamRef.current=stream;applyMeetingMediaState(stream,{cameraEnabled,micEnabled});if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play().catch(()=>undefined)}setStatus('ready')}catch(err){setStatus('error');setError(meetingMediaErrorMessage(err))}};
 useEffect(()=>{void start();return()=>stopMeetingMedia(streamRef.current)},[]);
 useEffect(()=>{if(streamRef.current)applyMeetingMediaState(streamRef.current,{cameraEnabled,micEnabled})},[cameraEnabled,micEnabled]);
 if(!cameraEnabled||status==='error')return <div className="relative size-full bg-[#111]">{currentPhoto?<img src={currentPhoto} alt="Foto com câmera desligada" className="size-full object-cover"/>:<div className="grid size-full place-items-center px-8 text-center text-sm text-white/40">Câmera desligada</div>}{status==='error'&&<div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/65 p-3 text-xs text-white/70 backdrop-blur-xl"><p>{error}</p><button onClick={()=>void start()} className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-semibold text-black"><RefreshCcw size={13}/> Tentar novamente</button></div>}</div>;
 return <div className="size-full bg-black"><video ref={videoRef} autoPlay playsInline muted className="size-full object-cover"/>{status==='loading'&&<div className="absolute inset-0 grid place-items-center bg-black/35 text-xs text-white/50">Ativando câmera…</div>}</div>;
}
