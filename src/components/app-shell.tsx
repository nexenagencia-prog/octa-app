'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardSidebar, MobileNav, TopNav } from '@/components/nav';
import { ToolOverlayProvider } from '@/components/tool-overlay-context';
import { ToolOverlay } from '@/components/tool-overlay';
import { GlobalScreenshotButton } from '@/components/global-screenshot-button';

const STORAGE_KEY = 'octa-sidebar-collapsed';

export function AppShell({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  const [collapsed,setCollapsed]=useState(false);const [compact,setCompact]=useState(false);
  useEffect(()=>{const sync=()=>{try{const saved=localStorage.getItem(STORAGE_KEY);setCollapsed(saved===null?false:saved==='1');setCompact(localStorage.getItem('octa-compact-mode')==='1')}catch{}};sync();window.addEventListener('octa-preferences-updated',sync);return()=>window.removeEventListener('octa-preferences-updated',sync)},[]);
  useEffect(()=>{if(window.location.pathname==='/'){const params=new URLSearchParams(window.location.search);const hash=new URLSearchParams(window.location.hash.replace(/^#/,''));if(params.has('code')||hash.get('type')==='recovery'){window.location.replace('/reset-password'+window.location.search+window.location.hash);}}},[]);
  const toggle=()=>setCollapsed(value=>{const next=!value;try{localStorage.setItem(STORAGE_KEY,next?'1':'0')}catch{}return next});
  return <ToolOverlayProvider><main className={`octa-page ${collapsed?'sidebar-collapsed':''} ${compact?'is-compact':''} ${pathname==='/'?'is-live-home':''}`}>
    <DashboardSidebar collapsed={collapsed} onToggle={toggle}/>
    <div className="octa-main"><TopNav/><div className="octa-app-body">{children}</div></div>
    <MobileNav/>
    {pathname!=='/'&&<GlobalScreenshotButton/>}
  </main>{pathname!=='/'&&<ToolOverlay/>}</ToolOverlayProvider>;
}
