'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ToolOverlayName = 'calculator' | 'filters' | 'notes' | 'whiteboard' | null;
type ToolOverlayContextValue = { tool: ToolOverlayName; openTool:(tool:Exclude<ToolOverlayName,null>)=>void; closeTool:()=>void };
const ToolOverlayContext = createContext<ToolOverlayContextValue | null>(null);

export function ToolOverlayProvider({children}:{children:React.ReactNode}){
  const [tool,setTool]=useState<ToolOverlayName>(null);
  useEffect(()=>{
    const openWhiteboard=(event:MouseEvent)=>{
      const target=event.target as Element|null;
      const link=target?.closest('a[href="/lousa"]');
      if(!link)return;
      event.preventDefault();
      event.stopPropagation();
      setTool('whiteboard');
    };
    document.addEventListener('click',openWhiteboard,true);
    return()=>document.removeEventListener('click',openWhiteboard,true);
  },[]);
  const value=useMemo(()=>({tool,openTool:(next:Exclude<ToolOverlayName,null>)=>setTool(next),closeTool:()=>setTool(null)}),[tool]);
  return <ToolOverlayContext.Provider value={value}>{children}</ToolOverlayContext.Provider>;
}
export function useToolOverlay(){const value=useContext(ToolOverlayContext);if(!value) throw new Error('useToolOverlay must be used inside ToolOverlayProvider');return value;}
