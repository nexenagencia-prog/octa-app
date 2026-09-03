'use client';
import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, ImagePlus, Mic, MicOff, RefreshCcw } from 'lucide-react';
import { applyMeetingMediaState, createMeetingMediaConstraints, meetingMediaErrorMessage, stopMeetingMedia } from '@/lib/meeting-media';

type Props={
 title:string;
 cameraEnabled:boolean;
 micEnabled:boolean;
 photoUrl:string|null;
 fallbackPhotoUrl?:string|null;
 onCameraChange:(enabled:boolean)=>void;
 onMicChange:(enabled:boolean)=>void;
 onPhotoChange:(url:string|null)=>void;
 onJoin:()=>void;
};

export function MeetingPrejoin({title,cameraEnabled,micEnabled,photoUrl,fallbackPhotoUrl,onCameraChange,onMicChange,onPhotoChange,onJoin}:Props){
 const videoRef=useRef<HTMLVideoElement>(null);
 const streamRef=useRef<MediaStream|null>(null);
 const fileRef=useRef<HTMLInputElement>(null);
 const[status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
 const[error,setError]=useState('');
 const currentPhoto=photoUrl||fallbackPhotoUrl||null;
 const photoActionLabel=currentPhoto?'Alterar foto':'Adicionar foto';

 const start=async(forceCamera?:boolean)=>{
  setStatus('loading');setError('');
  stopMeetingMedia(streamRef.current);streamRef.current=null;
  if(!navigator.mediaDevices?.getUserMedia){setStatus('error');setError('Seu navegador não oferece acesso seguro à câmera. Use uma versão atualizada do Safari, Chrome ou Edge.');return false}
  try{
   const stream=await navigator.mediaDevices.getUserMedia(createMeetingMediaConstraints());
   streamRef.current=stream;applyMeetingMediaState(stream,{cameraEnabled:forceCamera??cameraEnabled,micEnabled});
   if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play().catch(()=>undefined)}
   setStatus('ready');return true;
  }catch(err){setStatus('error');setError(meetingMediaErrorMessage(err));return false}
 };

 useEffect(()=>{void start();return()=>stopMeetingMedia(streamRef.current)},[]);
 useEffect(()=>{if(streamRef.current)applyMeetingMediaState(streamRef.current,{cameraEnabled,micEnabled})},[cameraEnabled,micEnabled]);

 const choosePhoto=(file?:File)=>{
  if(!file||!file.type.startsWith('image/'))return;
  const next=URL.createObjectURL(file);
  onPhotoChange(next);onCameraChange(false);
 };
 const openPhotoPicker=()=>fileRef.current?.click();
 const testCamera=async()=>{onCameraChange(true);await start(true)};
 const enterWithCamera=async()=>{
  onCameraChange(true);
  if(status!=='ready'&&!(await start(true)))return;
  onJoin();
 };
 const enterWithoutCamera=()=>{onCameraChange(false);onJoin()};

 return <main className="min-h-[100dvh] bg-[#070707] px-4 py-6 text-white md:px-8">
  <div className="mx-auto grid min-h-[calc(100dvh-48px)] max-w-[1180px] items-center gap-8 lg:grid-cols-[minmax(320px,430px)_1fr]">
   <section className="mx-auto w-full max-w-[430px]"><div className="relative w-full overflow-hidden rounded-[34px] border border-white/10 bg-[#141414] shadow-[0_34px_100px_rgba(0,0,0,.55)]" style={{aspectRatio:'9/16'}}>
    <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${cameraEnabled&&status==='ready'?'opacity-100':'opacity-0'}`}/>
    {(!cameraEnabled||status!=='ready')&&<div className="absolute inset-0 bg-[#111]">{currentPhoto?<img src={currentPhoto} alt="Foto para câmera desligada" className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center px-8 text-center text-sm text-white/45">Sua foto aparecerá aqui quando a câmera estiver desligada.</div>}<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"/>{!cameraEnabled&&<button type="button" onClick={openPhotoPicker} aria-label={photoActionLabel} className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl">{photoActionLabel}</button>}</div>}
    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-semibold tracking-[.12em] text-white/70 backdrop-blur-xl">PRÉVIA 9:16</div>
    {status==='loading'&&<div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/45 p-3 text-xs text-white/65 backdrop-blur-xl">Ativando câmera e microfone…</div>}
    {status==='error'&&<div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/70 p-3 text-xs leading-5 text-white/75 backdrop-blur-xl"><p>{error}</p><button onClick={()=>void testCamera()} className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-semibold text-black"><RefreshCcw size={13}/> Tentar novamente</button></div>}
   </div></section>
   <section className="mx-auto w-full max-w-[590px]"><div className="text-[11px] font-semibold uppercase tracking-[.18em] text-white/35">Antes de entrar</div><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] md:text-5xl">{title}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-white/50">Veja sua imagem antes de entrar. A câmera do Mac ou computador continua captando na proporção original e a OCTA mostra somente o recorte vertical 9:16, sem esticar, achatar ou deformar.</p>
    <div className="mt-8 grid gap-3 sm:grid-cols-2"><button onClick={()=>onMicChange(!micEnabled)} className={`flex items-center justify-between rounded-[22px] border p-4 text-left ${micEnabled?'border-white/10 bg-white/[.06]':'border-rose-400/20 bg-rose-500/10'}`}><span><b className="block text-sm">Microfone</b><small className="mt-1 block text-white/45">{micEnabled?'Ligado':'Mutado'}</small></span>{micEnabled?<Mic size={19}/>:<MicOff size={19}/>}</button><button onClick={()=>onCameraChange(!cameraEnabled)} className={`flex items-center justify-between rounded-[22px] border p-4 text-left ${cameraEnabled?'border-white/10 bg-white/[.06]':'border-rose-400/20 bg-rose-500/10'}`}><span><b className="block text-sm">Câmera</b><small className="mt-1 block text-white/45">{cameraEnabled?'Ligada':'Oculta'}</small></span>{cameraEnabled?<Camera size={19}/>:<CameraOff size={19}/>}</button></div>
    <button type="button" onClick={()=>void testCamera()} className="mt-3 flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/[.04] p-4 text-left transition hover:bg-white/[.07]"><span><b className="block text-sm">Testar câmera</b><small className="mt-1 block text-white/45">Ative a câmera e confira seu enquadramento vertical antes de entrar.</small></span><Camera size={19}/></button>
    <input ref={fileRef} className="hidden" type="file" accept="image/*" onChange={event=>choosePhoto(event.target.files?.[0])}/><button type="button" aria-label={photoActionLabel} onClick={openPhotoPicker} className="mt-3 flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/[.04] p-4 text-left transition hover:bg-white/[.07]"><span><b className="block text-sm">{photoActionLabel}</b><small className="mt-1 block text-white/45">A foto é escolhida pelo usuário e aparece quando a câmera estiver oculta. Ideal: retrato 9:16, sempre com recorte proporcional.</small></span><ImagePlus size={19}/></button>
    <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>void enterWithCamera()} className="rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:scale-[1.01] active:scale-[.99]"><span className="inline-flex items-center gap-2"><Camera size={17}/> Entrar com câmera</span></button><button type="button" onClick={enterWithoutCamera} className="rounded-full border border-white/12 bg-white/[.05] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[.09]"><span className="inline-flex items-center gap-2"><CameraOff size={17}/> Entrar sem câmera</span></button></div><p className="mt-3 text-center text-[11px] text-white/30">Microfone, câmera e foto podem ser alterados novamente durante a reunião.</p>
   </section>
  </div>
 </main>
}
