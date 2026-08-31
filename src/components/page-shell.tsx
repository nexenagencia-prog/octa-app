import { AppShell } from '@/components/app-shell';

export function PageShell({title,kicker,actions,children}:{title:string;kicker?:string;actions?:React.ReactNode;children:React.ReactNode}){
  return <AppShell><section className="octa-inner-page octa-hybrid-page octa-global-surface">
    <header className="octa-page-heading octa-hybrid-heading">
      <div><p className="octa-kicker">{kicker ?? 'OCTA'}</p><h1>{title}</h1></div>
      {actions&&<div className="octa-heading-actions flex items-center gap-2">{actions}</div>}
    </header>
    <div className="octa-inner-content">{children}</div>
  </section></AppShell>;
}
