import { config } from '../configs/registry.js';

type ApiOptions = RequestInit & {
  path: string;
};

export async function apiFetch<T>({ path, ...init }: ApiOptions): Promise<T> {
  const base = config.api.baseUrl.replace(/\/$/, '');
  const url = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
