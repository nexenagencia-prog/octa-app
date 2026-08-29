'use client';
import { FloatingNotesCard } from '@/features/notes/floating-notes-card';
export function NotesPanel({roomSlug,meetingTitle,onClose}:{roomSlug:string;meetingTitle?:string;onClose:()=>void}){return <FloatingNotesCard roomSlug={roomSlug} meetingTitle={meetingTitle} onClose={onClose}/>}
