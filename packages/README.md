# Packages

```text
packages/server  →  @duneta/server   (Hono API framework)
packages/client  →  @duneta/client   (React Router web framework)
```

| Package | Dùng trong | Không dùng trong |
|---------|------------|------------------|
| `@duneta/server` | `app/api` | `app/web` |
| `@duneta/client` | `app/web` | `app/api` |

## Tài liệu

- [`@duneta/server`](../docs/packages/server.md)
- [`@duneta/client`](../docs/packages/client.md)
- [Kiến trúc](../docs/architecture.md)

## Build

```bash
pnpm --filter @duneta/server build
pnpm --filter @duneta/client build
```
