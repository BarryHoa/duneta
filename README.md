# Tenora

Tenora is a portable TypeScript toolkit: a Next.js web app, a Hono API, and two public packages that can be installed in any project.

```bash
pnpm create tenora my-app
cd my-app
pnpm install
pnpm dev
```

The generated project has only two applications:

```text
apps/api  # Hono API, powered by @tenora/server
apps/web  # Next.js app, powered by @tenora/client
```

## Packages

```bash
pnpm add @tenora/server
pnpm add @tenora/client
```

`@tenora/server` is server-only. `@tenora/client` is browser-safe and can be used from Next.js.

## Maintainers

Build the publishable packages before releasing them:

```bash
pnpm --filter @tenora/server build
pnpm --filter @tenora/client build
pnpm --filter create-tenora pack
```

## Start

```bash
npm run dev
```

The launcher uses the pnpm version pinned by the repository, installs dependencies on its first run, and starts Next.js plus the Node/VPS API.

## Choose an API runtime

The routes are defined once in `apps/api/routers/index.ts`. Choose exactly one entry point:

```bash
# VPS / Node (also the default for npm run dev)
pnpm --filter api dev

# Cloudflare Worker
npm run dev:cloudflare
```

The Cloudflare launcher starts both the Next.js UI and the Worker API. Do not run both API commands at the same time.

## Deploy the web app

The Next.js application can be deployed independently of the API. Run these commands from the repository root:

```bash
# Vercel (link the project to apps/web on first use)
pnpm --filter web deploy:vercel

# Cloudflare Workers, using the OpenNext adapter
pnpm --filter web deploy:cloudflare

# VPS: build once, then run behind a process manager/reverse proxy
pnpm --filter web build:vps
pnpm --filter web start:vps
```

The Cloudflare web Worker is named `tenora-web`; the API Worker remains `tenora-api`. Configure custom domains and production environment variables in the selected platform. On a VPS, set `PORT` before `start:vps` when the default port is unsuitable.

Router groups inherit middleware from every parent. For example, the included `/api/con/:id` route executes `x`, then `y`, then `z`.

Copy `.env.example` to `.env` before using database-backed features.
