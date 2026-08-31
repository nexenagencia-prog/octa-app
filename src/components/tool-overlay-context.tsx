'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ToolOverlayName = 'calculator' | 'filters' | 'notes' | null;
type ToolOverlayContextValue = { tool: ToolOverlayName; openTool:(tool:Exclude<ToolOverlayName,null>)=>void; closeTool:()=>void };
const ToolOverlayContext = createContext<ToolOverlayContextValue | null>(null);

export function ToolOverlayProvider({children}:{children:React.ReactNode}){
  const [tool,setTool]=useState<ToolOverlayName>(null);
  useEffect(()=>{const onOpen=(event:Event)=>{const next=(event as CustomEvent<Exclude<ToolOverlayName,null>>).detail;if(next==='calculator'||next==='filters'||next==='notes')setTool(next)};window.addEventListener('octa-open-tool',onOpen);return()=>window.removeEventListener('octa-open-tool',onOpen)},[]);
  const value=useMemo(()=>({tool,openTool:(next:Exclude<ToolOverlayName,null>)=>setTool(next),closeTool:()=>setTool(null)}),[tool]);
  return <ToolOverlayContext.Provider value={value}>{children}</ToolOverlayContext.Provider>;
}
export function useToolOverlay(){const value=useContext(ToolOverlayContext);if(!value) throw new Error('useToolOverlay must be used inside ToolOverlayProvider');return value;}
