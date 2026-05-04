import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env } from './types';
import { feedRouter } from './routes/feed';
import { trendsRouter } from './routes/trends';
import { predictionsRouter } from './routes/predictions';
import { votesRouter } from './routes/votes';
import { epicRouter } from './routes/epic';
import { reportsRouter } from './routes/reports';
import { aiRouter } from './routes/ai';
import { wsRouter } from './routes/ws';
import { ingestECIFeed } from './lib/eci';

export { ElectionRoom } from './durable/ElectionRoom';

const app = new Hono<{ Bindings: Env }>();

app.use('*', logger());
app.use('/api/*', cors({
  origin: (origin) => {
    const allowed = ['https://elections-dashboard.pages.dev', 'http://localhost:5173'];
    return allowed.includes(origin) ? origin : null;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Cf-Access-Jwt-Assertion'],
}));

app.get('/health', (c) => c.json({ status: 'ok', ts: new Date().toISOString() }));

app.route('/api/feed', feedRouter);
app.route('/api/trends', trendsRouter);
app.route('/api/predictions', predictionsRouter);
app.route('/api/votes', votesRouter);
app.route('/api/validate-epic', epicRouter);
app.route('/api/reports', reportsRouter);
app.route('/api/ai', aiRouter);
app.route('/ws', wsRouter);

export default {
  fetch: app.fetch,

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(ingestECIFeed(env));
  },
};
