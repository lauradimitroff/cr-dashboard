import Dashboard from '@/components/dashboard';
import { getDashboardData } from '@/lib/clashRoyale';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  try {
    const data = await getDashboardData();

    return (
      <Dashboard
        clanName={data.clanName}
        clanTag={data.clanTag}
        members={data.members}
        warEntries={data.warEntries}
      />
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';

    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
        <div className="w-full rounded-xl border border-red-200 bg-red-50 p-5 text-red-900">
          <h1 className="mb-2 text-lg font-semibold">Impossible de charger les donnees Clash Royale</h1>
          <p className="text-sm">{message}</p>
          <p className="mt-3 text-sm">
            La cause la plus probable est la whitelist IP du token API. Le token doit autoriser l&apos;IP
            sortante du serveur qui fait l&apos;appel.
          </p>
        </div>
      </main>
    );
  }
}
