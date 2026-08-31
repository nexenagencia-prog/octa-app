'use client';
import { useEffect } from 'react';

export function RecoveryRedirect(){
  useEffect(()=>{
    if(window.location.pathname==='/reset-password')return;
    const hash=new URLSearchParams(window.location.hash.replace(/^#/,''));
    const query=new URLSearchParams(window.location.search);
    const recovery=hash.get('type')==='recovery'||query.get('type')==='recovery';
    const hasRecoverySession=Boolean(hash.get('access_token')&&hash.get('refresh_token'));
    if(recovery||hasRecoverySession){
      window.location.replace(`/reset-password${window.location.search}${window.location.hash}`);
    }
  },[]);
  return null;
}
