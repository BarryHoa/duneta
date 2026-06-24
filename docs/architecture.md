# Kiến trúc

## Monorepo

```text
app/api   ──depends──▶  @tenora/server
app/web   ──depends──▶  @tenora/client

app/web KHÔNG import @tenora/server
```

Hai app shell mỏng: framework logic nằm trong `packages/`, bạn chỉ mở rộng qua config + hooks (`createRouter`, `providers`).

## Luồng boot API

```mermaid
flowchart TD
  A["defineServer()"] --> B["loadConfig"]
  B --> C["createDatabase + createAuth"]
  C --> D["registerFrameworkBindings\n+ providers app"]
  D --> E["createRouter\nrouters/index.ts"]
  E --> F["createTenoraApp"]
  F --> G["/api/*"]
```

### `defineServer` — hooks từ sync (app only)

| Hook           | Nguồn                                  | Nội dung             |
| -------------- | -------------------------------------- | -------------------- |
| `config`       | `tenora.config.ts`                     | App config           |
| `createRouter` | `.api-runtime/` → `routers/index.ts`   | Default + app routes |
| `providers`    | `.api-runtime/` → `providers/index.ts` | App DI only          |

Framework bindings (Health, Me, User controllers/repos) vẫn wire trong **boot** — không qua sync.

## Runtime

Entry file quyết định runtime — **không cần** `RUNTIME` env hay `runtime` trong `tenora.config.ts`:

| Entry            | Import                         | `runtime.target` (tự set) |
| ---------------- | ------------------------------ | ------------------------- |
| `server.ts`      | `@tenora/server/runtime/cloud` | `worker`                  |
| `server.node.ts` | `@tenora/server/runtime/node`  | `node`                    |

`defineServer` inject `runtime.target` lúc boot qua `bootstrapConfig()`.

Chi tiết: [Runtime](./api/runtime.md).

## Dependency injection

Không còn container infra chung. Chỉ 2 container domain:

| Container             | App đăng ký qua    | Framework boot              |
| --------------------- | ------------------ | --------------------------- |
| `ControllerContainer` | `providers` (sync) | `registerFrameworkBindings` |
| `RepositoryContainer` | `providers` (sync) | `registerFrameworkBindings` |

Infra (`db`, `auth`, `cache`) được boot một lần và inject thẳng vào Hono context — không qua DI container.

Chi tiết: [Providers](./api/providers.md).

## Request context (`BackendEnv`)

Mỗi request có sẵn trên `c`:

| Key                               | Kiểu                | Khi nào có          |
| --------------------------------- | ------------------- | ------------------- |
| `db`                              | Drizzle DB          | database enabled    |
| `auth`                            | Better Auth         | auth enabled        |
| `cache`                           | Cache               | cache enabled       |
| `controllers`                     | ControllerContainer | luôn                |
| `repositories`                    | RepositoryContainer | luôn                |
| `userId`                          | string              | sau auth middleware |
| `requestId`, `locale`, `timezone` | string              | core middleware     |

## Layer domain

```text
Route  →  Controller  →  Repository  →  Database (Drizzle)
```

- **Route**: `defineGroup` + `bindContainerController('UserController', 'index')`
- **Controller**: `extends BaseController` — HTTP, JSON, session helpers
- **Repository**: `extends BaseRepository` — truy vấn Drizzle

Không có Service layer mặc định — thêm khi app cần.

## Middleware pipeline

Thứ tự trong `createTenoraApp`:

1. CORS
2. Context defaults (requestId, locale, timezone)
3. Core (locale, timezone, request-id, security headers, auth session)
4. Rate limit (nếu bật)
5. CSRF (nếu bật)
6. Wire context (db, auth, cache, controllers, repositories)
7. App router (`/api/...`)

## Web architecture

```text
packages/client/routers/   # routes mặc định của framework
app/web/routers/           # routes của bạn
         ↓ sync (tenora-web)
.router-runtime/           # merged tại dev/build
```

Chi tiết: [Web overview](./web/overview.md).

## Package exports quan trọng

### `@tenora/server`

`configs`, `container`, `routers`, `http`, `repositories`, `auth`, `cache`, `cached`, `runtime/cloud`, `runtime/node`

### `@tenora/client`

`configs`, `config/vite`, `config/react-router`, `routers`, `providers`, `components`, `hooks/use-api`
