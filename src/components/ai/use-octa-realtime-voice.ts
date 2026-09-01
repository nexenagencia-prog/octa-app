'use client';
import { useCallback,useRef,useState } from 'react';

export type OctaVoiceState='idle'|'connecting'|'listening'|'speaking'|'error';

export function useOctaRealtimeVoice(){
 const[state,setState]=useState<OctaVoiceState>('idle');
 const[error,setError]=useState<string|null>(null);
 const pcRef=useRef<RTCPeerConnection|null>(null);const dcRef=useRef<RTCDataChannel|null>(null);const streamRef=useRef<MediaStream|null>(null);const audioRef=useRef<HTMLAudioElement|null>(null);
 const stop=useCallback(()=>{streamRef.current?.getTracks().forEach(track=>track.stop());streamRef.current=null;dcRef.current?.close();dcRef.current=null;pcRef.current?.close();pcRef.current=null;if(audioRef.current){audioRef.current.pause();audioRef.current.srcObject=null;audioRef.current=null}setState('idle');setError(null)},[]);
 const start=useCallback(async()=>{if(state!=='idle'&&state!=='error')return;setState('connecting');setError(null);try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});streamRef.current=stream;
  const pc=new RTCPeerConnection();pcRef.current=pc;stream.getTracks().forEach(track=>pc.addTrack(track,stream));
  const audio=new Audio();audio.autoplay=true;audioRef.current=audio;pc.ontrack=(event)=>{audio.srcObject=event.streams[0];void audio.play().catch(()=>{})};
  pc.onconnectionstatechange=()=>{if(pc.connectionState==='failed'||pc.connectionState==='disconnected'){setError('A voz da OCTA AI não conseguiu conectar. O chat por texto continua disponível.');setState('error')}};
  const dc=pc.createDataChannel('oai-events');dcRef.current=dc;dc.onopen=()=>setState('listening');dc.onmessage=(event)=>{try{const data=JSON.parse(event.data);const type=String(data.type||'');if(type.includes('response.audio')||type.includes('output_audio'))setState('speaking');if(type==='response.done'||type.includes('input_audio_buffer.speech_started'))setState('listening')}catch{}};
  const offer=await pc.createOffer();await pc.setLocalDescription(offer);const response=await fetch('/api/ai/realtime/session',{method:'POST',headers:{'Content-Type':'application/sdp'},body:offer.sdp||''});if(!response.ok)throw new Error('realtime');const answer=await response.text();await pc.setRemoteDescription({type:'answer',sdp:answer});
 }catch(err){streamRef.current?.getTracks().forEach(track=>track.stop());streamRef.current=null;pcRef.current?.close();pcRef.current=null;const denied=err instanceof DOMException&&(err.name==='NotAllowedError'||err.name==='PermissionDeniedError');setError(denied?'Microfone não autorizado. Você ainda pode conversar por texto.':'A voz da OCTA AI não conseguiu conectar. O chat por texto continua disponível.');setState('error')}},[state]);
 return{state,error,start,stop,active:state==='connecting'||state==='listening'||state==='speaking'};
}
