'use client';
import { createContext, useContext, useMemo, useState } from 'react';

export type ToolOverlayName = 'calculator' | 'filters' | 'notes' | null;
type ToolOverlayContextValue = { tool: ToolOverlayName; openTool:(tool:Exclude<ToolOverlayName,null>)=>void; closeTool:()=>void };
const ToolOverlayContext = createContext<ToolOverlayContextValue | null>(null);

export function ToolOverlayProvider({children}:{children:React.ReactNode}){
  const [tool,setTool]=useState<ToolOverlayName>(null);
  const value=useMemo(()=>({tool,openTool:(next:Exclude<ToolOverlayName,null>)=>setTool(next),closeTool:()=>setTool(null)}),[tool]);
  return <ToolOverlayContext.Provider value={value}>{children}</ToolOverlayContext.Provider>;
}
export function useToolOverlay(){const value=useContext(ToolOverlayContext);if(!value) throw new Error('useToolOverlay must be used inside ToolOverlayProvider');return value;}
