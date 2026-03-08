'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ClanMember, WarEntry } from '@/lib/clashRoyale';

type DashboardProps = {
  clanName: string;
  clanTag: string;
  members: ClanMember[];
  warEntries: WarEntry[];
};

type FilterRange = 'current' | '7d' | '30d' | 'all';

export default function Dashboard({ clanName, clanTag, members, warEntries }: DashboardProps) {
  const [query, setQuery] = useState('');
  const [range, setRange] = useState<FilterRange>('current');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : preferredDark;
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  function toggleDarkMode() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  }

  const lowerQuery = query.trim().toLowerCase();

  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        if (!lowerQuery) return true;
        return member.name.toLowerCase().includes(lowerQuery) || member.tag.toLowerCase().includes(lowerQuery);
      })
      .sort((a, b) => b.trophies - a.trophies);
  }, [members, lowerQuery]);

  const filteredWarEntries = useMemo(() => {
    if (range === 'current') {
      const current = warEntries.find((entry) => entry.id.startsWith('current-'));
      return current ? [current] : [];
    }

    if (range === 'all') return warEntries;

    const now = new Date();
    const threshold = new Date(now);
    threshold.setDate(now.getDate() - (range === '7d' ? 7 : 30));

    return warEntries.filter((entry) => new Date(entry.date) >= threshold);
  }, [range, warEntries]);

  const warScoresByMember = useMemo(() => {
    const scores = new Map<string, number>();

    for (const entry of filteredWarEntries) {
      for (const [tag, score] of Object.entries(entry.scoresByMemberTag)) {
        scores.set(tag, (scores.get(tag) ?? 0) + score);
      }
    }

    return scores;
  }, [filteredWarEntries]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 p-4 dark:from-slate-950 dark:to-slate-900 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-brand-600 dark:text-brand-200">{clanName}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">Clan Tag: {clanTag}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Rechercher par nom ou tag..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 md:w-72"
              />

              <button
                onClick={toggleDarkMode}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
              >
                {darkMode ? 'Mode clair' : 'Mode sombre'}
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 md:p-6">
          <h2 className="mb-4 text-xl font-semibold">Liste des membres</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  <th className="pb-3">Nom</th>
                  <th className="pb-3">Tag</th>
                  <th className="pb-3">Rang</th>
                  <th className="pb-3 text-right">Trophées</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.tag} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 font-medium">{member.name}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{member.tag}</td>
                    <td className="py-3">{member.role}</td>
                    <td className="py-3 text-right tabular-nums">{member.trophies}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 md:p-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold">Guerre de Clans (River Race)</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setRange('current')}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  range === 'current'
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                Guerre en cours
              </button>
              <button
                onClick={() => setRange('7d')}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  range === '7d' ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                1 semaine
              </button>
              <button
                onClick={() => setRange('30d')}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  range === '30d' ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                1 mois
              </button>
              <button
                onClick={() => setRange('all')}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  range === 'all' ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                Historique complet
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  <th className="pb-3">Membre</th>
                  <th className="pb-3">Tag</th>
                  <th className="pb-3 text-right">Score guerre (médailles)</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers
                  .map((member) => ({
                    ...member,
                    warScore: warScoresByMember.get(member.tag) ?? 0,
                  }))
                  .sort((a, b) => b.warScore - a.warScore)
                  .map((member) => (
                    <tr key={`war-${member.tag}`} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 font-medium">{member.name}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{member.tag}</td>
                      <td className="py-3 text-right tabular-nums">{member.warScore}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {filteredWarEntries.length} cycle(s) de River Race pris en compte pour le filtre sélectionné.
          </div>
        </section>
      </div>
    </main>
  );
}
