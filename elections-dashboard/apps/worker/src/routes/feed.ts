import { Hono } from 'hono';
import type { Env } from '../types';
import { getCached } from '../lib/cache';

export const feedRouter = new Hono<{ Bindings: Env }>();

feedRouter.get('/', async (c) => {
  const state = c.req.query('state');

  const data = await getCached(c.env.CACHE, `feed:${state ?? 'all'}`, 15, async () => {
    let query = `
      SELECT s.constituency_id, s.captured_at, s.leading_party, s.lead_margin,
             s.total_votes_counted, s.percent_counted, s.raw_json,
             co.name, co.state
      FROM eci_snapshots s
      INNER JOIN constituencies co ON co.id = s.constituency_id
      WHERE s.captured_at = (
        SELECT MAX(s2.captured_at) FROM eci_snapshots s2
        WHERE s2.constituency_id = s.constituency_id
      )`;
    const bindings: string[] = [];
    if (state) {
      query += ` AND co.state = ?`;
      bindings.push(state);
    }
    query += ` ORDER BY co.state, co.name`;
    const result = await c.env.DB.prepare(query).bind(...bindings).all();
    return result.results;
  });

  return c.json(data);
});

feedRouter.get('/states', async (c) => {
  const data = await getCached(c.env.CACHE, 'feed:states', 30, async () => {
    const result = await c.env.DB.prepare(`
      SELECT co.state,
             COUNT(*) as total_constituencies,
             SUM(CASE WHEN s.leading_party IS NOT NULL THEN 1 ELSE 0 END) as reporting,
             AVG(s.percent_counted) as avg_pct_counted
      FROM constituencies co
      LEFT JOIN eci_snapshots s ON s.constituency_id = co.id
        AND s.captured_at = (
          SELECT MAX(s2.captured_at) FROM eci_snapshots s2
          WHERE s2.constituency_id = co.id
        )
      GROUP BY co.state
      ORDER BY co.state
    `).all();
    return result.results;
  });
  return c.json(data);
});
