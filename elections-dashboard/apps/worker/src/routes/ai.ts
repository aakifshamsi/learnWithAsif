import { Hono } from 'hono';
import type { Env } from '../types';

export const aiRouter = new Hono<{ Bindings: Env }>();

aiRouter.post('/summary', async (c) => {
  const body = await c.req.json<{
    constituencyId: string;
    name: string;
    state: string;
    leadingParty: string;
    leadMargin: number;
    percentCounted: number;
    trend?: 'rising' | 'falling' | 'stable';
  }>();

  const prompt = `You are an election analyst for India's General Elections. Summarize the following constituency data in 2-3 sentences. Be factual and neutral.

Constituency: ${body.name}, ${body.state}
Leading Party: ${body.leadingParty}
Lead Margin: ${body.leadMargin.toLocaleString()} votes
Votes Counted: ${body.percentCounted.toFixed(1)}%${body.trend ? `\nTrend: ${body.trend}` : ''}

Provide a brief, factual summary.`;

  try {
    const result = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      prompt,
      max_tokens: 150,
    }) as { response: string };

    return c.json({ summary: result.response?.trim() ?? '', constituencyId: body.constituencyId });
  } catch (e) {
    return c.json({ error: 'AI service unavailable', constituencyId: body.constituencyId }, 503);
  }
});
