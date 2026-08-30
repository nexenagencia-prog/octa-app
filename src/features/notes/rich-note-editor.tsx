'use client';
import { useEffect, useRef } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, List, ListOrdered, Underline } from 'lucide-react';

export function RichNoteEditor({value,onChange,compact=false}:{value:string;onChange:(value:string)=>void;compact?:boolean}){
  const ref=useRef<HTMLDivElement|null>(null);
  useEffect(()=>{if(ref.current&&ref.current.innerHTML!==value)ref.current.innerHTML=value},[value]);
  const command=(cmd:string,arg?:string)=>{ref.current?.focus();document.execCommand(cmd,false,arg);onChange(ref.current?.innerHTML??'')};
  const insert=(text:string)=>{ref.current?.focus();document.execCommand('insertText',false,text);onChange(ref.current?.innerHTML??'')};
  return <div className={`octa-rich-note ${compact?'is-compact':''}`}>
    <div className="octa-rich-toolbar" role="toolbar" aria-label="Formatação da anotação">
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>command('bold')} title="Negrito"><Bold size={15}/></button>
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>command('italic')} title="Itálico"><Italic size={15}/></button>
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>command('underline')} title="Sublinhado"><Underline size={15}/></button>
      <span className="octa-rich-divider"/>
      <label className="octa-rich-size"><span>Tamanho</span><select aria-label="Tamanho da fonte" defaultValue="3" onChange={e=>command('fontSize',e.target.value)}><option value="2">12</option><option value="3">14</option><option value="4">18</option><option value="5">24</option><option value="6">32</option></select></label>
      <span className="octa-rich-divider"/>
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>command('insertUnorderedList')} title="Marcadores"><List size={15}/></button>
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>command('insertOrderedList')} title="Lista numerada"><ListOrdered size={15}/></button>
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>command('justifyLeft')} title="Alinhar à esquerda"><AlignLeft size={15}/></button>
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>command('justifyCenter')} title="Centralizar"><AlignCenter size={15}/></button>
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>command('justifyRight')} title="Alinhar à direita"><AlignRight size={15}/></button>
      <span className="octa-rich-divider"/>
      {['• ','✓ ','→ ','★ '].map(symbol=><button key={symbol} type="button" className="octa-symbol-button" onMouseDown={e=>e.preventDefault()} onClick={()=>insert(symbol)} title={`Inserir ${symbol.trim()}`}>{symbol.trim()}</button>)}
    </div>
    <div ref={ref} contentEditable suppressContentEditableWarning onInput={()=>onChange(ref.current?.innerHTML??'')} onPaste={e=>{e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))}} className="octa-rich-editor" data-placeholder="Escreva sua anotação..."/>
    <div className="octa-rich-resize-hint">Arraste a borda inferior para aumentar a área de escrita.</div>
  </div>;
}
