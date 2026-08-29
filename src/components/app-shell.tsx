'use client';
import { useEffect, useState } from 'react';
import { DashboardSidebar, MobileNav, TopNav } from '@/components/nav';
import { ToolOverlayProvider } from '@/components/tool-overlay-context';
import { ToolOverlay } from '@/components/tool-overlay';
import { GlobalScreenshotButton } from '@/components/global-screenshot-button';

const STORAGE_KEY = 'octa-sidebar-collapsed';

export function AppShell({children}:{children:React.ReactNode}){
  const [collapsed,setCollapsed]=useState(false);
  useEffect(()=>{try{setCollapsed(localStorage.getItem(STORAGE_KEY)==='1')}catch{}},[]);
  const toggle=()=>setCollapsed(value=>{const next=!value;try{localStorage.setItem(STORAGE_KEY,next?'1':'0')}catch{}return next});
  return <ToolOverlayProvider><main className={`octa-page ${collapsed?'sidebar-collapsed':''}`}>
    <DashboardSidebar collapsed={collapsed} onToggle={toggle}/>
    <div className="octa-main"><TopNav/><div className="octa-app-body">{children}</div></div>
    <MobileNav/>
    <GlobalScreenshotButton/>
  </main><ToolOverlay/></ToolOverlayProvider>;
}
