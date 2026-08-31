import type { Metadata } from 'next';
import './globals.css';
import { RecoveryRedirect } from '@/components/recovery-redirect';
import { CmsRuntime } from '@/components/cms-runtime';
import { OctaAICoach } from '@/components/octa-ai-coach';

export const metadata: Metadata = {
  title: 'OCTA — Presence Platform',
  description: 'Vertical-first intelligent videoconferencing.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CmsRuntime/>{children}<OctaAICoach/></body></html>;
}
