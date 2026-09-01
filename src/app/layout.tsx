import type { Metadata } from 'next';
import './globals.css';
import './octa-refinements.css';
import './octa-black-silver-v2.css';
import './octa-reference-polish.css';
import { CmsRuntime } from '@/components/cms-runtime';

export const metadata: Metadata = {
  title: 'OCTA — Presence Platform',
  description: 'Vertical-first intelligent videoconferencing.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CmsRuntime/>{children}</body></html>;
}
