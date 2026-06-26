# Deploy — Cloudflare Workers

```text
your-domain.com/*
  app/worker.ts
    /api/*  → app/worker.ts (Hono)
    static  → env.ASSETS  (app/build/client)
    /*      → React Router SSR  (app/build/server)
```

## Commands

```bash
pnpm dev      # local :8787
pnpm build    # sync + build app/
pnpm deploy   # build + wrangler deploy
```

## wrangler.jsonc

```jsonc
{
  "name": "duneta",
  "main": "app/worker.ts",
  "assets": {
    "directory": "app/build/client",
    "binding": "ASSETS",
    "run_worker_first": true
  }
}
```

## Secrets

Local: `.dev.vars` (xem `.dev.vars.example`)

Production: `wrangler secret put AUTH_SECRET`, `DATABASE_URL`, …
