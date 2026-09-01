'use client';
import type { MeetingSkillAnalysis } from './skills-analysis';
const KEY='octa-meeting-skill-analyses-v1';
export const ANALYSIS_UPDATED_EVENT='octa-analysis-updated';
function read():MeetingSkillAnalysis[]{try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):[]}catch{return[]}}
export function listMeetingAnalyses(){return read().sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt))}
export function saveMeetingAnalysis(analysis:MeetingSkillAnalysis){const current=read();const next=[analysis,...current.filter(item=>item.meetingId!==analysis.meetingId)];try{localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new CustomEvent(ANALYSIS_UPDATED_EVENT,{detail:analysis}))}catch{}return analysis}
export function getMeetingAnalysis(meetingId:string){return read().find(item=>item.meetingId===meetingId)??null}
