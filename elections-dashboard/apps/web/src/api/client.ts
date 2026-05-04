const BASE = import.meta.env.VITE_API_URL ?? '';

export const api = {
  get: async <T>(path: string): Promise<T> => {
    const resp = await fetch(`${BASE}${path}`, { credentials: 'include' });
    if (!resp.ok) throw new Error(`API ${resp.status}: ${path}`);
    return resp.json() as Promise<T>;
  },

  post: async <T>(path: string, body: unknown): Promise<T> => {
    const resp = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error ?? `API ${resp.status}`);
    }
    return resp.json() as Promise<T>;
  },

  postForm: async <T>(path: string, formData: FormData): Promise<T> => {
    const resp = await fetch(`${BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error ?? `API ${resp.status}`);
    }
    return resp.json() as Promise<T>;
  },
};
