import type { Metadata } from 'next';
import './globals.css';
import './octa-refinements.css';
import './octa-black-silver-v2.css';
import './octa-reference-polish.css';
import './octa-dark-icon-fixes.css';
import './octa-ai-coach.css';
import './octa-ai-global-voice.css';
import './octa-live-strategic-ai.css';
import './octa-agenda-stage.css';
import './meeting-chat-visibility.css';
import './octa-ui-polish-batch.css';
import { CmsRuntime } from '@/components/cms-runtime';
import { GlobalOctaAI } from '@/components/ai/global-octa-ai';
import { GlobalCalculatorOverlay } from '@/components/global-calculator-overlay';
import { GlobalLegacySidebar } from '@/components/global-legacy-sidebar';

export const metadata: Metadata = {
  title: 'OCTA — Presence Platform',
  description: 'Vertical-first intelligent videoconferencing.',
};

// Keep global visual layers explicit so production includes meeting-stage and chat visibility refinements.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CmsRuntime/>{children}<GlobalLegacySidebar/><GlobalCalculatorOverlay/><GlobalOctaAI/></body></html>;
}
