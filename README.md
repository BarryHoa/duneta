# Tenora

Tenora is a portable TypeScript toolkit: a React Router web shell, a Hono API, and two public packages that can be installed in any project.

```bash
pnpm create tenora my-app
cd my-app
pnpm install
pnpm dev
```

The generated project has only two applications:

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
pnpm --filter create-tenora pack
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

On a VPS, proxy `/api` to the Hono service when the API runs separately. Set `TENORA_API_URL` when the browser must call an external API origin.

Router groups inherit middleware from every parent. For example, the included `/api/con/:id` route executes `x`, then `y`, then `z`.

Copy `.env.example` to `.env` before using database-backed features.
