/// <reference types="vite/client" />

export const clientConfig = {
  apiBaseUrl: import.meta.env.TENORA_API_URL ?? '/api',
} as const;
