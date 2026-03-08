const BASE_URL = 'https://api.clashroyale.com/v1';

export type ClanMember = {
  tag: string;
  name: string;
  role: string;
  trophies: number;
};

export type WarEntry = {
  id: string;
  date: string;
  label: string;
  scoresByMemberTag: Record<string, number>;
};

type CurrentRiverRace = {
  sectionIndex?: number;
  clan?: {
    participants?: Array<{
      tag: string;
      fame?: number;
      repairPoints?: number;
    }>;
  };
};

type RiverRaceLog = {
  items?: Array<{
    createdDate?: string;
    seasonId?: number;
    sectionIndex?: number;
    standings?: Array<{
      clan?: {
        tag?: string;
        participants?: Array<{
          tag: string;
          fame?: number;
          repairPoints?: number;
        }>;
      };
    }>;
  }>;
};

type ClanResponse = {
  memberList?: Array<{
    tag: string;
    name: string;
    role: string;
    trophies: number;
  }>;
};

function getToken() {
  const token = process.env.CLASH_ROYALE_API_TOKEN;
  if (!token) {
    throw new Error('La variable CLASH_ROYALE_API_TOKEN est manquante.');
  }
  return token;
}

function normalizeClanTag(tag: string) {
  return `%23${tag.replace(/^#/, '')}`;
}

async function crFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    // Revalidate periodically to keep data reasonably fresh in production.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API Clash Royale ${res.status}: ${message}`);
  }

  return (await res.json()) as T;
}

function participantScore(participant: { fame?: number; repairPoints?: number }) {
  return (participant.fame ?? 0) + (participant.repairPoints ?? 0);
}

function parseApiDate(value?: string) {
  if (!value) return null;

  const compact = value.trim();
  if (/^\d{8}T\d{6}\.\d{3}Z$/.test(compact)) {
    const normalized = compact.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\.\d{3}Z$/,
      '$1-$2-$3T$4:$5:$6.000Z',
    );
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(compact);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildCurrentRaceEntry(current: CurrentRiverRace): WarEntry {
  const scoresByMemberTag: Record<string, number> = {};

  for (const participant of current.clan?.participants ?? []) {
    scoresByMemberTag[participant.tag] = participantScore(participant);
  }

  const section = current.sectionIndex ?? 0;

  return {
    id: `current-${section}`,
    date: new Date().toISOString(),
    label: `River Race actuelle (Semaine ${section + 1})`,
    scoresByMemberTag,
  };
}

function buildHistoricalEntries(log: RiverRaceLog, clanTag: string): WarEntry[] {
  const normalizedClanTag = `#${clanTag.replace(/^#/, '')}`.toUpperCase();

  return (log.items ?? [])
    .map((item) => {
      const ourStanding = item.standings?.find(
        (standing) => standing.clan?.tag?.toUpperCase() === normalizedClanTag,
      );

      if (!ourStanding?.clan?.participants) {
        return null;
      }

      const scoresByMemberTag: Record<string, number> = {};
      for (const participant of ourStanding.clan.participants) {
        scoresByMemberTag[participant.tag] = participantScore(participant);
      }

      const parsedDate = parseApiDate(item.createdDate) ?? new Date();
      const section = item.sectionIndex ?? 0;
      const season = item.seasonId ?? 0;

      return {
        id: `season-${season}-week-${section}`,
        date: parsedDate.toISOString(),
        label: `Historique S${season} - Semaine ${section + 1}`,
        scoresByMemberTag,
      };
    })
    .filter((entry): entry is WarEntry => Boolean(entry));
}

export async function getDashboardData(rawClanTag = process.env.CLAN_TAG ?? 'Q8ULRC') {
  const clanTag = rawClanTag.replace(/^#/, '');
  const encodedClanTag = normalizeClanTag(clanTag);

  const [clanData, currentRace, raceLog] = await Promise.all([
    crFetch<ClanResponse>(`/clans/${encodedClanTag}`),
    crFetch<CurrentRiverRace>(`/clans/${encodedClanTag}/currentriverrace`),
    crFetch<RiverRaceLog>(`/clans/${encodedClanTag}/riverracelog?limit=20`),
  ]);

  const members: ClanMember[] = (clanData.memberList ?? []).map((member) => ({
    tag: member.tag,
    name: member.name,
    role: member.role,
    trophies: member.trophies,
  }));

  const warEntries = [buildCurrentRaceEntry(currentRace), ...buildHistoricalEntries(raceLog, clanTag)].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return {
    clanName: '300 partiates',
    clanTag: `#${clanTag}`,
    members,
    warEntries,
  };
}
