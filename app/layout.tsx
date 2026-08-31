import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OCTA — Reuniões inteligentes',
  description: 'Reuniões, agenda, contatos e gravações em uma única experiência.'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
