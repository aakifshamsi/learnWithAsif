import { Hono } from 'hono';
import type { Env } from '../types';
import { cfAccessAuth } from '../lib/auth';
import { validateEPIC } from '../lib/epic';
import { sha256 } from '../lib/hash';

export const votesRouter = new Hono<{ Bindings: Env }>();

votesRouter.use('*', cfAccessAuth);

votesRouter.post('/', async (c) => {
  const body = await c.req.json<{ epicNumber: string; constituencyId: string; party: string }>();

  if (!body.epicNumber || !body.constituencyId || !body.party) {
    return c.json({ error: 'epicNumber, constituencyId, and party are required' }, 400);
  }

  const epicResult = await validateEPIC(body.epicNumber, body.constituencyId);
  if (!epicResult.valid) {
    return c.json({ error: epicResult.errorMessage }, 422);
  }

  const epicHash = await sha256(body.epicNumber);

  const existing = await c.env.DB.prepare(
    'SELECT id FROM recorded_votes WHERE epic_hash = ?'
  ).bind(epicHash).first();

  if (existing) {
    return c.json({ error: 'This EPIC number has already been used to record a vote' }, 409);
  }

  const constituency = await c.env.DB.prepare(
    'SELECT id FROM constituencies WHERE id = ?'
  ).bind(body.constituencyId).first();

  if (!constituency) {
    return c.json({ error: 'Invalid constituency ID' }, 400);
  }

  const voteId = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO recorded_votes (id, epic_hash, constituency_id, party) VALUES (?, ?, ?, ?)'
  ).bind(voteId, epicHash, body.constituencyId, body.party).run();

  return c.json({ success: true, voteId }, 201);
});

votesRouter.get('/tally/:constituencyId', async (c) => {
  const id = c.req.param('constituencyId');
  const result = await c.env.DB.prepare(`
    SELECT party, COUNT(*) as votes
    FROM recorded_votes
    WHERE constituency_id = ?
    GROUP BY party
    ORDER BY votes DESC
  `).bind(id).all();
  return c.json(result.results);
});
