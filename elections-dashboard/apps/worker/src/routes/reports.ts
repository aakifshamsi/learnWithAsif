import { Hono } from 'hono';
import type { Env } from '../types';
import { cfAccessAuth } from '../lib/auth';
import { sha256 } from '../lib/hash';

export const reportsRouter = new Hono<{ Bindings: Env }>();

reportsRouter.get('/', async (c) => {
  const state = c.req.query('state');
  const bindings: string[] = [];
  let query = `SELECT id, text, lat, lng, constituency_id, sentiment, created_at
               FROM citizen_reports WHERE 1=1`;

  if (state) {
    query += ` AND constituency_id LIKE ?`;
    bindings.push(`${state}-%`);
  }
  query += ` ORDER BY created_at DESC LIMIT 50`;

  const result = await c.env.DB.prepare(query).bind(...bindings).all();
  return c.json(result.results);
});

reportsRouter.post('/', cfAccessAuth, async (c) => {
  let body: { text?: string; constituencyId?: string; lat?: number; lng?: number };
  const contentType = c.req.header('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await c.req.formData();
    body = {
      text: formData.get('text') as string | undefined,
      constituencyId: formData.get('constituencyId') as string | undefined,
      lat: formData.get('lat') ? parseFloat(formData.get('lat') as string) : undefined,
      lng: formData.get('lng') ? parseFloat(formData.get('lng') as string) : undefined,
    };

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return c.json({ error: 'Image too large (max 5MB)' }, 400);
      }
      const r2Key = `reports/${crypto.randomUUID()}.${imageFile.name.split('.').pop() ?? 'jpg'}`;
      await c.env.REPORTS_BUCKET.put(r2Key, imageFile.stream(), {
        httpMetadata: { contentType: imageFile.type },
      });
      (body as Record<string, unknown>)['r2Key'] = r2Key;
    }
  } else {
    body = await c.req.json();
  }

  if (!body.text || body.text.length < 10) {
    return c.json({ error: 'Report text must be at least 10 characters' }, 400);
  }

  let sentiment = 'NEUTRAL';
  try {
    const aiResult = await c.env.AI.run('@cf/huggingface/distilbert-sst-2-int8', {
      text: body.text,
    }) as { label: string; score: number }[];
    sentiment = aiResult[0]?.label ?? 'NEUTRAL';
  } catch {
    // Non-fatal: store report without sentiment
  }

  const reportId = crypto.randomUUID();
  const r2Key = (body as Record<string, unknown>)['r2Key'] as string | undefined ?? null;

  await c.env.DB.prepare(`
    INSERT INTO citizen_reports (id, text, r2_key, lat, lng, constituency_id, sentiment)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    reportId,
    body.text,
    r2Key,
    body.lat ?? null,
    body.lng ?? null,
    body.constituencyId ?? null,
    sentiment
  ).run();

  return c.json({ success: true, reportId, sentiment }, 201);
});
