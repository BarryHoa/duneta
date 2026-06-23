# Tenora

Tenora is a portable TypeScript toolkit: a React Router web shell, a Hono API, and two public packages that can be installed in any project.

```bash
pnpm install
cp app/api/.env.example app/api/.env
cp app/web/.env.example app/web/.env
pnpm dev
```

The monorepo has two applications:

```text
app/api  # Hono API, powered by @tenora/server
app/web  # Thin React Router shell, powered by @tenora/client
```

## Packages

```bash
pnpm add @tenora/server
pnpm add @tenora/client
```

`@tenora/server` is server-only. `@tenora/client` ships the UI kit, routes, and React Router tooling.

## Maintainers

Build the publishable packages before releasing them:

```bash
pnpm --filter @tenora/server build
pnpm --filter @tenora/client build
```

## Start

```bash
npm run dev
```

The launcher uses the pnpm version pinned by the repository, installs dependencies on its first run, and starts the web shell plus the Node/VPS API.

## Choose an API runtime

The routes are defined once in `app/api/routers/index.ts`. Choose exactly one entry point:

```bash
# VPS / Node (also the default for npm run dev)
pnpm --filter api dev

# Cloudflare Worker
npm run dev:cloudflare
```

The Cloudflare launcher starts both the web UI and the Worker API. Do not run both API commands at the same time.

## Deploy the web app

The web shell can be deployed independently of the API. Run these commands from the repository root:

```bash
# VPS: build once, then run behind a process manager/reverse proxy
pnpm --filter web build:vps
pnpm --filter web start:vps
```

On a VPS, proxy `/api` to the Hono service when the API runs separately. Set `VITE_API_URL` in `app/web/.env` when the browser must call an external API origin.

Router groups inherit middleware from every parent. For example, the included `/api/con/:id` route executes `x`, then `y`, then `z`.

## Environment

Each app has its own `.env` (copy from `.env.example`):

```bash
cp app/api/.env.example app/api/.env
cp app/web/.env.example app/web/.env
```

| File | Variables |
|------|-----------|
| `app/api/.env` | `TENORA_API_PORT`, `DATABASE_URL` |
| `app/web/.env` | `TENORA_WEB_PORT`, `TENORA_API_PORT` (dev proxy), `VITE_API_URL` |
