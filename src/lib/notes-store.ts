export type SavedNote={id:string;title:string;subject:string;content:string;format?:'plain'|'html';roomSlug?:string;meetingTitle?:string;createdAt:string;updatedAt:string};
const KEY='octa-saved-notes-v2';
function storage(){return typeof window==='undefined'?null:window.localStorage}
export function notePlainText(note:Pick<SavedNote,'content'|'format'>){
  if(note.format!=='html')return note.content;
  return note.content.replace(/<br\s*\/?>/gi,'\n').replace(/<\/p>|<\/div>|<\/li>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
}
export function listNotes():SavedNote[]{
  try{
    const current=JSON.parse(storage()?.getItem(KEY)??'[]') as SavedNote[];
    if(current.length)return current;
    const legacy=JSON.parse(storage()?.getItem('octa-saved-notes-v1')??'[]') as Array<Omit<SavedNote,'subject'>>;
    return legacy.map(note=>({...note,subject:note.meetingTitle??'',format:'plain'}));
  }catch{return []}
}
function write(notes:SavedNote[]){try{storage()?.setItem(KEY,JSON.stringify(notes))}catch{}return notes}
export function saveNote(input:{id?:string;title:string;subject:string;content:string;format?:'plain'|'html';roomSlug?:string;meetingTitle?:string}){
  const now=new Date().toISOString();const notes=listNotes();const existing=input.id?notes.find(n=>n.id===input.id):undefined;
  const note:SavedNote={id:existing?.id??`note-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,title:input.title.trim()||'Anotação sem título',subject:input.subject.trim(),content:input.content.trim(),format:input.format??existing?.format??'plain',roomSlug:input.roomSlug,meetingTitle:input.meetingTitle,createdAt:existing?.createdAt??now,updatedAt:now};
  write([note,...notes.filter(n=>n.id!==note.id)]);return note;
}
export function deleteNote(id:string){return write(listNotes().filter(n=>n.id!==id))}
export function searchNotes(query:string){const q=query.trim().toLowerCase();if(!q)return listNotes();return listNotes().filter(n=>`${n.title} ${n.subject} ${notePlainText(n)} ${n.meetingTitle??''}`.toLowerCase().includes(q))}
