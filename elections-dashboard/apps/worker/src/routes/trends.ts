import { Hono } from 'hono';
import type { Env } from '../types';

export const trendsRouter = new Hono<{ Bindings: Env }>();

trendsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const limit = Math.min(parseInt(c.req.query('limit') ?? '200'), 500);

  const result = await c.env.DB.prepare(`
    SELECT captured_at, leading_party, lead_margin, total_votes_counted,
           percent_counted, raw_json
    FROM eci_snapshots
    WHERE constituency_id = ?
    ORDER BY captured_at DESC
    LIMIT ?
  `).bind(id, limit).all();

  if (!result.results.length) {
    return c.json({ error: 'Constituency not found or no data yet' }, 404);
  }

  return c.json(result.results.reverse());
});
