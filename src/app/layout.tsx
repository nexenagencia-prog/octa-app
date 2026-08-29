import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OKTA — Presence Platform',
  description: 'Vertical-first intelligent videoconferencing.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
