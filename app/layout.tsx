import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '300 partiates - Clan War Dashboard',
  description: 'Dashboard Clash Royale pour suivre les performances en Guerre de Clans.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
