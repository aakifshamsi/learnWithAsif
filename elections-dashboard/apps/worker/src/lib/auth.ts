import type { MiddlewareHandler } from 'hono';
import type { Env } from '../types';

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
    .padEnd(str.length + (4 - str.length % 4) % 4, '=');
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

export const cfAccessAuth: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const token = c.req.header('Cf-Access-Jwt-Assertion');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);

  const teamDomain = c.env.CF_ACCESS_TEAM_DOMAIN;
  if (!teamDomain) return c.json({ error: 'Auth not configured' }, 500);

  try {
    const certsResp = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
    if (!certsResp.ok) return c.json({ error: 'Cannot verify token' }, 502);

    const certs = await certsResp.json() as { keys: JsonWebKey[] };
    const [headerB64, payloadB64, sigB64] = token.split('.');

    for (const jwk of certs.keys) {
      try {
        const key = await crypto.subtle.importKey(
          'jwk', jwk,
          { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
          false, ['verify']
        );
        const signingInput = `${headerB64}.${payloadB64}`;
        const valid = await crypto.subtle.verify(
          'RSASSA-PKCS1-v1_5', key,
          base64UrlDecode(sigB64),
          new TextEncoder().encode(signingInput)
        );
        if (valid) {
          const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
          c.set('user' as never, payload);
          return next();
        }
      } catch {
        continue;
      }
    }
    return c.json({ error: 'Invalid token' }, 401);
  } catch {
    return c.json({ error: 'Auth error' }, 500);
  }
};
