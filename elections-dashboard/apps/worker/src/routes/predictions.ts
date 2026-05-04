import { Hono } from 'hono';
import type { Env } from '../types';
import { runConstituencySimulation, aggregateNational } from '../lib/monteCarlo';
import { getCached } from '../lib/cache';
import { PARTY_TO_ALLIANCE } from '@elections/shared';

export const predictionsRouter = new Hono<{ Bindings: Env }>();

predictionsRouter.get('/', async (c) => {
  const data = await getCached(c.env.CACHE, 'predictions:national', 60, async () => {
    const result = await c.env.DB.prepare(`
      SELECT s.constituency_id, s.raw_json, s.percent_counted,
             s.leading_party, s.lead_margin, co.name, co.state
      FROM eci_snapshots s
      INNER JOIN constituencies co ON co.id = s.constituency_id
      WHERE s.captured_at = (
        SELECT MAX(s2.captured_at) FROM eci_snapshots s2
        WHERE s2.constituency_id = s.constituency_id
      )
    `).all();

    const rows = result.results as Record<string, unknown>[];
    const predictions = rows.map(row => {
      const tallies = JSON.parse(String(row['raw_json'] ?? '{}')) as Record<string, number>;
      const remaining = Math.max(0, 1 - Number(row['percent_counted'] ?? 0) / 100);
      return runConstituencySimulation(tallies, remaining, String(row['constituency_id']));
    });

    const conMeta = rows.map(row => ({
      id: String(row['constituency_id']),
      name: String(row['name'] ?? ''),
      state: String(row['state'] ?? ''),
      leadingParty: String(row['leading_party'] ?? ''),
      leadMargin: Number(row['lead_margin'] ?? 0),
    }));

    return aggregateNational(predictions, PARTY_TO_ALLIANCE, conMeta);
  });

  return c.json(data);
});

predictionsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  const data = await getCached(c.env.CACHE, `predictions:${id}`, 30, async () => {
    const row = await c.env.DB.prepare(`
      SELECT raw_json, percent_counted FROM eci_snapshots
      WHERE constituency_id = ?
      ORDER BY captured_at DESC LIMIT 1
    `).bind(id).first<{ raw_json: string; percent_counted: number }>();

    if (!row) return null;

    const tallies = JSON.parse(row.raw_json ?? '{}') as Record<string, number>;
    const remaining = Math.max(0, 1 - (row.percent_counted ?? 0) / 100);
    return runConstituencySimulation(tallies, remaining, id);
  });

  if (!data) return c.json({ error: 'No data for this constituency' }, 404);
  return c.json(data);
});
