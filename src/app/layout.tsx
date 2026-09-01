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
import { CmsRuntime } from '@/components/cms-runtime';
import { OctaSkillCoach } from '@/components/ai/octa-skill-coach';

export const metadata: Metadata = {
  title: 'OCTA — Presence Platform',
  description: 'Vertical-first intelligent videoconferencing.',
};

// Keep global visual layers explicit so production builds include agenda and meeting-stage refinements.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CmsRuntime/>{children}<OctaSkillCoach/></body></html>;
}
