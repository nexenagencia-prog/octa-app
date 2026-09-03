'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ToolOverlayName = 'calculator' | 'filters' | 'notes' | 'whiteboard' | null;
type ToolOverlayContextValue = { tool: ToolOverlayName; openTool:(tool:Exclude<ToolOverlayName,null>)=>void; closeTool:()=>void };
const ToolOverlayContext = createContext<ToolOverlayContextValue | null>(null);

export function ToolOverlayProvider({children}:{children:React.ReactNode}){
  const [tool,setTool]=useState<ToolOverlayName>(null);
  useEffect(()=>{
    const normalizeWhiteboardLinks=()=>{
      document.querySelectorAll<HTMLAnchorElement>('a[href="/lousa"]').forEach(link=>{
        link.dataset.octaWhiteboardTool='1';
        link.removeAttribute('href');
        link.setAttribute('role','button');
        link.tabIndex=0;
        link.setAttribute('aria-label','Abrir lousa flutuante');
      });
    };
    normalizeWhiteboardLinks();
    const observer=new MutationObserver(normalizeWhiteboardLinks);
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
    const openWhiteboard=(event:Event)=>{
      const target=event.target as Element|null;
      const trigger=target?.closest('[data-octa-whiteboard-tool="1"],a[href="/lousa"]');
      if(!trigger)return;
      event.preventDefault();
      event.stopPropagation();
      setTool('whiteboard');
    };
    const openWhiteboardByKey=(event:KeyboardEvent)=>{
      if(event.key!=='Enter'&&event.key!==' ')return;
      const target=event.target as Element|null;
      if(!target?.closest('[data-octa-whiteboard-tool="1"]'))return;
      openWhiteboard(event);
    };
    document.addEventListener('click',openWhiteboard,true);
    document.addEventListener('keydown',openWhiteboardByKey,true);
    return()=>{
      observer.disconnect();
      document.removeEventListener('click',openWhiteboard,true);
      document.removeEventListener('keydown',openWhiteboardByKey,true);
    };
  },[]);
  const value=useMemo(()=>({tool,openTool:(next:Exclude<ToolOverlayName,null>)=>setTool(next),closeTool:()=>setTool(null)}),[tool]);
  return <ToolOverlayContext.Provider value={value}>{children}</ToolOverlayContext.Provider>;
}
export function useToolOverlay(){const value=useContext(ToolOverlayContext);if(!value) throw new Error('useToolOverlay must be used inside ToolOverlayProvider');return value;}
