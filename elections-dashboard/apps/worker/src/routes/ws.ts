import { Hono } from 'hono';
import type { Env } from '../types';

export const wsRouter = new Hono<{ Bindings: Env }>();

wsRouter.get('/national', async (c) => {
  if (c.req.header('Upgrade') !== 'websocket') {
    return c.json({ error: 'Expected WebSocket upgrade' }, 426);
  }
  const id = c.env.ELECTION_ROOM.idFromName('national');
  const room = c.env.ELECTION_ROOM.get(id);
  return room.fetch(c.req.raw);
});

wsRouter.get('/:constituencyId', async (c) => {
  if (c.req.header('Upgrade') !== 'websocket') {
    return c.json({ error: 'Expected WebSocket upgrade' }, 426);
  }
  const cid = c.req.param('constituencyId');
  const id = c.env.ELECTION_ROOM.idFromName(cid);
  const room = c.env.ELECTION_ROOM.get(id);
  return room.fetch(c.req.raw);
});
