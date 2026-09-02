'use client';
import { useEffect, useState } from 'react';
import { DashboardSidebar, MobileNav, TopNav } from '@/components/nav';
import { ToolOverlayProvider } from '@/components/tool-overlay-context';
import { ToolOverlay } from '@/components/tool-overlay';
import { GlobalScreenshotButton } from '@/components/global-screenshot-button';

const STORAGE_KEY = 'octa-sidebar-collapsed';

export function AppShell({children,showTopNav=true}:{children:React.ReactNode;showTopNav?:boolean}){
  const [collapsed,setCollapsed]=useState(false);const [compact,setCompact]=useState(false);
  useEffect(()=>{const sync=()=>{try{setCollapsed(localStorage.getItem(STORAGE_KEY)==='1');setCompact(localStorage.getItem('octa-compact-mode')==='1')}catch{}};sync();window.addEventListener('octa-preferences-updated',sync);return()=>window.removeEventListener('octa-preferences-updated',sync)},[]);
  const toggle=()=>setCollapsed(value=>{const next=!value;try{localStorage.setItem(STORAGE_KEY,next?'1':'0')}catch{}return next});
  return <ToolOverlayProvider><main className={`octa-page ${collapsed?'sidebar-collapsed':''} ${compact?'is-compact':''}`}>
    <DashboardSidebar collapsed={collapsed} onToggle={toggle}/>
    <div className="octa-main">{showTopNav&&<TopNav/>}<div className="octa-app-body">{children}</div></div>
    <MobileNav/>
    <GlobalScreenshotButton/>
    <style jsx global>{`
      @media (min-width:1280px){
        .octa-page{padding:0!important;gap:0!important;}
        .octa-sidebar{position:fixed!important;inset:0 auto 0 0!important;height:100dvh!important;width:250px!important;flex-basis:250px!important;border-radius:0!important;z-index:60!important;}
        .octa-sidebar.is-collapsed{width:82px!important;flex-basis:82px!important;}
        .octa-main{margin-left:250px!important;padding:0 26px 24px 28px!important;transition:margin-left .28s ease!important;}
        .sidebar-collapsed .octa-main{margin-left:82px!important;}
        .octa-page:has(.agenda-reference-page) .octa-main{padding:0!important;}
        .octa-page:has(.agenda-reference-page) .octa-app-body{overflow:hidden!important;}
      }
    `}</style>
  </main><ToolOverlay/></ToolOverlayProvider>;
}
