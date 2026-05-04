export async function getCached<T>(
  kv: KVNamespace,
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await kv.get(key, 'json');
  if (cached !== null) return cached as T;
  const fresh = await fetcher();
  await kv.put(key, JSON.stringify(fresh), { expirationTtl: ttlSeconds });
  return fresh;
}
