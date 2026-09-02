'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/nav';
import { ToolOverlay } from '@/components/tool-overlay';
import { ToolOverlayProvider } from '@/components/tool-overlay-context';

const SIDEBAR_KEY='octa-sidebar-collapsed';
const excluded=(path:string)=>path==='/'||path.startsWith('/login')||path.startsWith('/reset-password')||path.startsWith('/auth')||path.startsWith('/admin')||path.startsWith('/room/');

export function GlobalLegacySidebar(){
  const pathname=usePathname();
  const[active,setActive]=useState(false);
  const[collapsed,setCollapsed]=useState(false);

  useEffect(()=>{
    const sync=()=>{
      const hasSharedShell=Boolean(document.querySelector('.octa-page .octa-sidebar'));
      setActive(!excluded(pathname)&&!hasSharedShell);
      try{setCollapsed(localStorage.getItem(SIDEBAR_KEY)==='1')}catch{}
    };
    const timer=window.setTimeout(sync,0);
    window.addEventListener('octa-preferences-updated',sync);
    return()=>{window.clearTimeout(timer);window.removeEventListener('octa-preferences-updated',sync)};
  },[pathname]);

  useEffect(()=>{
    document.documentElement.classList.toggle('octa-global-sidebar-active',active);
    document.documentElement.classList.toggle('octa-global-sidebar-collapsed',active&&collapsed);
    return()=>{
      document.documentElement.classList.remove('octa-global-sidebar-active');
      document.documentElement.classList.remove('octa-global-sidebar-collapsed');
    };
  },[active,collapsed]);

  if(!active)return null;
  const toggle=()=>setCollapsed(value=>{const next=!value;try{localStorage.setItem(SIDEBAR_KEY,next?'1':'0')}catch{}return next});

  return <ToolOverlayProvider>
    <div className="octa-global-sidebar-host"><DashboardSidebar collapsed={collapsed} onToggle={toggle}/></div>
    <ToolOverlay/>
    <style jsx global>{`
      @media (min-width:1280px){
        .octa-global-sidebar-host .octa-sidebar{position:fixed!important;inset:0 auto 0 0!important;height:100dvh!important;width:250px!important;z-index:2147482000!important;border-radius:0!important;display:flex!important}
        .octa-global-sidebar-host .octa-sidebar.is-collapsed{width:82px!important}
        html.octa-global-sidebar-active body>main:not(.octa-page){margin-left:250px!important;width:calc(100% - 250px)!important;max-width:none!important}
        html.octa-global-sidebar-active.octa-global-sidebar-collapsed body>main:not(.octa-page){margin-left:82px!important;width:calc(100% - 82px)!important}
        html.octa-global-sidebar-active body>main:has(>.recordings-workspace)>aside:first-child{display:none!important}
        html.octa-global-sidebar-active body>main:has(>.recordings-workspace){display:block!important}
      }
    `}</style>
  </ToolOverlayProvider>;
}
