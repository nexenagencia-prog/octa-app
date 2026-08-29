import { PageShell } from '@/components/page-shell';
import { PrintPanel } from '@/components/browser-tools';
export default function Page(){return <PageShell title="Printar tela" kicker="Captura"><div className="grid h-full place-items-center"><PrintPanel/></div></PageShell>}
