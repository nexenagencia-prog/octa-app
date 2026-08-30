import type { Metadata } from 'next';
import './globals.css';
import { CmsRuntime } from '@/components/cms-runtime';

export const metadata: Metadata = {
  title: 'OKTA — Presence Platform',
  description: 'Vertical-first intelligent videoconferencing.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CmsRuntime/>{children}</body></html>;
}
