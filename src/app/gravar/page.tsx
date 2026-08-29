import { PageShell } from '@/components/page-shell';
import { RecorderPanel } from '@/components/browser-tools';
export default function Page(){return <PageShell title="Gravar" kicker="Captura local"><div className="grid h-full place-items-center"><RecorderPanel/></div></PageShell>}
