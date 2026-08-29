import { currentUser } from '@/lib/demo/data';

export type EditableProfile={displayName:string;headline:string;avatarUrl:string};
const KEY='octa-profile-v1';
export const PROFILE_UPDATED_EVENT='octa-profile-updated';
export const defaultEditableProfile:EditableProfile={displayName:currentUser.displayName,headline:currentUser.headline??'',avatarUrl:currentUser.avatarUrl??''};

export function getProfile():EditableProfile{
  if(typeof window==='undefined') return defaultEditableProfile;
  try{const raw=localStorage.getItem(KEY); if(!raw) return defaultEditableProfile; return {...defaultEditableProfile,...JSON.parse(raw)};}catch{return defaultEditableProfile;}
}
export function saveProfile(profile:EditableProfile){
  if(typeof window==='undefined') return profile;
  try{localStorage.setItem(KEY,JSON.stringify(profile));window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT,{detail:profile}));}catch{}
  return profile;
}
