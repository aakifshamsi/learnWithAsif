import { Hono } from 'hono';
import type { Env } from '../types';
import { cfAccessAuth } from '../lib/auth';
import { validateEPIC } from '../lib/epic';

export const epicRouter = new Hono<{ Bindings: Env }>();

epicRouter.use('*', cfAccessAuth);

epicRouter.post('/', async (c) => {
  const body = await c.req.json<{ epicNumber: string; constituencyId: string }>();

  if (!body.epicNumber || !body.constituencyId) {
    return c.json({ error: 'epicNumber and constituencyId are required' }, 400);
  }

  const result = await validateEPIC(body.epicNumber, body.constituencyId);
  // Return only valid/invalid — never expose voter name
  return c.json({ valid: result.valid, errorMessage: result.errorMessage });
});
