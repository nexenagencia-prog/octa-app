'use client';

import { useEffect, useState } from 'react';
import { currentUser, demoParticipants } from '@/lib/demo/data';
import { MeetingPrejoin } from './meeting-prejoin';
import { InstantMeetingClient } from './instant-meeting-client';
import { MeetingStrategicAI } from './meeting-strategic-ai';

export function MeetingClient({slug,title}:{slug:string;title:string}){
 const[camera,setCamera]=useState(true);
 const[mic,setMic]=useState(true);
 const[joined,setJoined]=useState(false);
 const[photoUrl,setPhotoUrl]=useState<string|null>(null);
 useEffect(()=>()=>{if(photoUrl?.startsWith('blob:'))URL.revokeObjectURL(photoUrl)},[photoUrl]);
 if(!joined)return <MeetingPrejoin title={title} cameraEnabled={camera} micEnabled={mic} photoUrl={photoUrl} fallbackPhotoUrl={currentUser.avatarUrl} onCameraChange={setCamera} onMicChange={setMic} onPhotoChange={setPhotoUrl} onJoin={()=>setJoined(true)}/>;
 const participants=demoParticipants.map(person=>({id:person.id,name:person.displayName}));
 return <>
  <InstantMeetingClient slug={slug} title={title} initialCameraEnabled={camera} initialMicEnabled={mic} photoUrl={photoUrl} fallbackPhotoUrl={currentUser.avatarUrl}/>
  <MeetingStrategicAI slug={slug} title={title} participants={participants}/>
 </>;
}
