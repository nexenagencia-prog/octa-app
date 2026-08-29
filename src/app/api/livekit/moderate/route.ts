import { RoomServiceClient } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request:NextRequest){
  const apiKey=process.env.LIVEKIT_API_KEY; const apiSecret=process.env.LIVEKIT_API_SECRET; const url=process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if(!apiKey||!apiSecret||!url) return new NextResponse('LiveKit is not configured',{status:503});
  const body=await request.json() as {room?:string;identity?:string;canPublish?:boolean};
  if(!body.room||!body.identity||typeof body.canPublish!=='boolean') return new NextResponse('Invalid request',{status:400});
  const service=new RoomServiceClient(url,apiKey,apiSecret);
  await service.updateParticipant(body.room,body.identity,undefined,{canSubscribe:true,canPublish:body.canPublish,canPublishData:true});
  return NextResponse.json({ok:true});
}
