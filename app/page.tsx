import Dashboard from '@/components/dashboard';
import { getDashboardData } from '@/lib/clashRoyale';

export default async function Page() {
  const data = await getDashboardData();

  return (
    <Dashboard
      clanName={data.clanName}
      clanTag={data.clanTag}
      members={data.members}
      warEntries={data.warEntries}
    />
  );
}
