import type { Env } from '../types';

interface ParsedSnapshot {
  constituencyId: string;
  leadingParty: string;
  leadMargin: number;
  totalVotes: number;
  pctCounted: number;
  partyTallies: Record<string, number>;
}

const INGEST_THROTTLE_MS = 25_000;
const CACHE_KEY = 'eci:last_ingest';

export async function ingestECIFeed(env: Env): Promise<void> {
  const now = Date.now();

  const lastIngest = await env.CACHE.get(CACHE_KEY);
  if (lastIngest && now - parseInt(lastIngest) < INGEST_THROTTLE_MS) return;

  try {
    const resp = await fetch(env.ECI_FEED_URL, {
      headers: { 'User-Agent': 'ElectionsDashboard/1.0' },
      cf: { cacheTtl: 20 },
    } as RequestInit & { cf?: { cacheTtl?: number } });

    if (!resp.ok) {
      console.error(`ECI fetch failed: ${resp.status}`);
      return;
    }

    const contentType = resp.headers.get('content-type') ?? '';
    let snapshots: ParsedSnapshot[];

    if (contentType.includes('json')) {
      snapshots = parseECIJson(await resp.json());
    } else {
      snapshots = parseECIHtml(await resp.text());
    }

    if (snapshots.length === 0) return;

    const stmt = env.DB.prepare(`
      INSERT INTO eci_snapshots
        (constituency_id, leading_party, lead_margin, total_votes_counted, percent_counted, raw_json)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(constituency_id, captured_at) DO NOTHING
    `);

    const batch = snapshots.map(s =>
      stmt.bind(
        s.constituencyId,
        s.leadingParty,
        s.leadMargin,
        s.totalVotes,
        s.pctCounted,
        JSON.stringify(s.partyTallies)
      )
    );

    await env.DB.batch(batch);

    // Broadcast updates to Durable Object rooms
    const notifyPromises = snapshots.slice(0, 20).map(async s => {
      try {
        const id = env.ELECTION_ROOM.idFromName(s.constituencyId);
        const room = env.ELECTION_ROOM.get(id);
        await room.fetch('https://internal/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'snapshot_update', payload: s }),
        });
      } catch {
        // Non-fatal: room may not have active connections
      }
    });
    await Promise.allSettled(notifyPromises);

    await env.CACHE.put(CACHE_KEY, now.toString(), { expirationTtl: 60 });
  } catch (e) {
    console.error('ECI ingest error:', e);
  }
}

function parseECIJson(data: unknown): ParsedSnapshot[] {
  // ECI 2024 JSON format adapter
  const results = (data as Record<string, unknown[]>)?.constituencyResults ?? [];
  return (results as Record<string, unknown>[]).map(r => ({
    constituencyId: `${r['st_code']}-${String(r['ac_no']).padStart(2, '0')}`,
    leadingParty: String(r['leading_party'] ?? ''),
    leadMargin: Number(r['margin'] ?? 0),
    totalVotes: Number(r['total_votes'] ?? 0),
    pctCounted: Number(r['pct_counted'] ?? 0),
    partyTallies: (r['party_tallies'] as Record<string, number>) ?? {},
  }));
}

function parseECIHtml(_html: string): ParsedSnapshot[] {
  // HTML scraper placeholder — implement per live ECI page structure
  return [];
}
