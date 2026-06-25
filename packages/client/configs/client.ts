/// <reference types="vite/client" />

export const clientConfig = {
  apiBaseUrl: import.meta.env.VITE_API_URL ?? '/api',
} as const;
