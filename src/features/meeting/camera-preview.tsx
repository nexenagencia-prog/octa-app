'use client';
import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { applySkinEnhancement, filterCss, isSmartSkinFilter } from '@/lib/video-filters';

export function CameraPreview({enabled,filterId,intensity,onProcessedTrack,className=''}:{enabled:boolean;filterId:string;intensity:number;onProcessedTrack?:(track:MediaStreamTrack|null)=>void;className?:string}){
  const videoRef=useRef<HTMLVideoElement|null>(null),canvasRef=useRef<HTMLCanvasElement|null>(null),streamRef=useRef<MediaStream|null>(null),raf=useRef<number|null>(null),filterRef=useRef(filterId),intensityRef=useRef(intensity),lastFrame=useRef(0);
  const [error,setError]=useState(''),[devices,setDevices]=useState<MediaDeviceInfo[]>([]),[cameraIndex,setCameraIndex]=useState(0);

  useEffect(()=>{filterRef.current=filterId;intensityRef.current=intensity},[filterId,intensity]);

  useEffect(()=>{
    let alive=true;
    const cleanup=()=>{if(raf.current)cancelAnimationFrame(raf.current);raf.current=null;streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;const c=canvasRef.current;if(c)delete c.dataset.trackReady;onProcessedTrack?.(null)};
    async function start(){
      if(!enabled){cleanup();return}
      try{
        setError('');
        const all=await navigator.mediaDevices.enumerateDevices().catch(()=>[] as MediaDeviceInfo[]);
        const cams=all.filter(d=>d.kind==='videoinput');if(alive)setDevices(cams);
        const deviceId=cams[cameraIndex]?.deviceId;
        const stream=await navigator.mediaDevices.getUserMedia({video:deviceId?{deviceId:{exact:deviceId},width:{ideal:720},height:{ideal:1280},facingMode:'user'}:{width:{ideal:720},height:{ideal:1280},facingMode:'user'},audio:false});
        if(!alive){stream.getTracks().forEach(t=>t.stop());return}
        streamRef.current=stream;
        const video=videoRef.current;if(!video)return;
        video.srcObject=stream;await video.play().catch(()=>{});draw();
      }catch(e){if(alive){setError(e instanceof Error?e.message:'Não foi possível acessar a câmera.');onProcessedTrack?.(null)}}
    }
    function draw(now=performance.now()){
      const video=videoRef.current,canvas=canvasRef.current;if(!video||!canvas||!enabled)return;
      if(now-lastFrame.current<41){raf.current=requestAnimationFrame(draw);return}lastFrame.current=now;
      const w=360,h=640;if(canvas.width!==w){canvas.width=w;canvas.height=h}
      const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return;
      ctx.save();ctx.translate(w,0);ctx.scale(-1,1);const activeFilter=filterRef.current,activeIntensity=intensityRef.current;ctx.filter=isSmartSkinFilter(activeFilter)?'none':filterCss(activeFilter,activeIntensity);ctx.drawImage(video,0,0,w,h);ctx.restore();
      if(isSmartSkinFilter(activeFilter)){
        const image=ctx.getImageData(0,0,w,h);applySkinEnhancement(image.data,w,h,activeIntensity,activeFilter);ctx.putImageData(image,0,0);
      }
      if(!canvas.dataset.trackReady && 'captureStream' in canvas){
        const processed=(canvas as HTMLCanvasElement & {captureStream:(fps?:number)=>MediaStream}).captureStream(24).getVideoTracks()[0]??null;
        if(processed){canvas.dataset.trackReady='1';onProcessedTrack?.(processed)}
      }
      raf.current=requestAnimationFrame(draw);
    }
    void start();
    return()=>{alive=false;cleanup()};
  },[enabled,cameraIndex,onProcessedTrack]);

  return <div className={`relative overflow-hidden bg-[#06101a] ${className}`}>
    <video ref={videoRef} playsInline muted className="absolute size-px opacity-0 pointer-events-none"/>
    <canvas ref={canvasRef} className={`h-full w-full object-cover transition ${enabled?'opacity-100':'opacity-0'}`}/>
    {!enabled&&<div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,rgba(20,126,151,.16),transparent_35%),#06101a] text-center"><div><CameraOff className="mx-auto text-white/30"/><p className="mt-3 text-sm text-white/60">Câmera desligada</p></div></div>}
    {error&&<div className="absolute inset-0 grid place-items-center bg-[#07111b] p-6 text-center"><div><Camera className="mx-auto text-rose-300"/><p className="mt-3 text-xs leading-5 text-rose-200">{error}</p></div></div>}
    {enabled&&devices.length>1&&<button onClick={()=>setCameraIndex(i=>(i+1)%devices.length)} className="absolute bottom-3 right-3 flex h-9 items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 text-[10px] text-white/75 backdrop-blur-xl"><RefreshCw size={13}/> Trocar câmera</button>}
  </div>;
}
