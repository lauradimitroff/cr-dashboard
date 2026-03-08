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
      <body>
        <div className="min-h-screen">
          {children}
          <footer className="border-t border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            Ce contenu n&apos;est pas affilié à, parrainé par ou spécifiquement approuvé par Supercell et
            Supercell n&apos;en est pas responsable. Pour plus d&apos;informations, consultez la Politique relative au
            contenu de fans de Supercell.
          </footer>
        </div>
      </body>
    </html>
  );
}
