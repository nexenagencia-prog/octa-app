import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(request: NextRequest){
  const room=request.nextUrl.searchParams.get('room');
  const requestedIdentity=request.nextUrl.searchParams.get('identity');
  const requestedName=request.nextUrl.searchParams.get('name') ?? requestedIdentity;
  if(!room) return new NextResponse('room is required',{status:400});

  let identity=requestedIdentity;
  let name=requestedName;
  const supabase=await supabaseServer();
  if(supabase){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return new NextResponse('Authentication required',{status:401});
    identity=user.id;
    name=(user.user_metadata?.full_name as string | undefined) ?? user.email ?? 'OKTA user';
  }
  if(!identity) return new NextResponse('identity is required in demo mode',{status:400});

  const apiKey=process.env.LIVEKIT_API_KEY;
  const apiSecret=process.env.LIVEKIT_API_SECRET;
  if(!apiKey||!apiSecret) return new NextResponse('LiveKit server credentials are not configured',{status:503});
  const token=new AccessToken(apiKey,apiSecret,{identity,name:name??undefined,ttl:'30m'});
  token.addGrant({roomJoin:true,room,canPublish:true,canSubscribe:true,canPublishData:true});
  return NextResponse.json({token:await token.toJwt()});
}
