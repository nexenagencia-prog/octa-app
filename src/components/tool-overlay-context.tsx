'use client';
import { createContext, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type SyntheticEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type ToolOverlayName = 'calculator' | 'filters' | 'notes' | 'whiteboard' | null;
type ToolOverlayContextValue = { tool: ToolOverlayName; openTool:(tool:Exclude<ToolOverlayName,null>)=>void; closeTool:()=>void };
const ToolOverlayContext = createContext<ToolOverlayContextValue | null>(null);

export function ToolOverlayProvider({children}:{children:React.ReactNode}){
  const [tool,setTool]=useState<ToolOverlayName>(null);
  const pathname=usePathname();
  const router=useRouter();
  const lastPath=useRef('/');

  useEffect(()=>{
    if(pathname!=='/lousa'){
      lastPath.current=pathname||'/';
      return;
    }
    setTool('whiteboard');
    router.replace(lastPath.current||'/');
  },[pathname,router]);

  const interceptWhiteboard=useCallback((event:SyntheticEvent)=>{
    const target=event.target as Element|null;
    const trigger=target?.closest('a[href="/lousa"],[data-octa-whiteboard-tool="1"]');
    if(!trigger)return;
    event.preventDefault();
    event.stopPropagation();
    setTool('whiteboard');
  },[]);

  const interceptWhiteboardKey=useCallback((event:ReactKeyboardEvent)=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const target=event.target as Element|null;
    if(!target?.closest('a[href="/lousa"],[data-octa-whiteboard-tool="1"]'))return;
    interceptWhiteboard(event);
  },[interceptWhiteboard]);

  const value=useMemo(()=>({tool,openTool:(next:Exclude<ToolOverlayName,null>)=>setTool(next),closeTool:()=>setTool(null)}),[tool]);
  return <ToolOverlayContext.Provider value={value}><div style={{display:'contents'}} onClickCapture={interceptWhiteboard} onAuxClickCapture={interceptWhiteboard} onKeyDownCapture={interceptWhiteboardKey}>{children}</div></ToolOverlayContext.Provider>;
}
export function useToolOverlay(){const value=useContext(ToolOverlayContext);if(!value) throw new Error('useToolOverlay must be used inside ToolOverlayProvider');return value;}
