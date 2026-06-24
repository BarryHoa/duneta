# Packages

```text
packages/server  →  @tenora/server   (Hono API framework)
packages/client  →  @tenora/client   (React Router web framework)
```

| Package | Dùng trong | Không dùng trong |
|---------|------------|------------------|
| `@tenora/server` | `app/api` | `app/web` |
| `@tenora/client` | `app/web` | `app/api` |

## Tài liệu

- [`@tenora/server`](../docs/packages/server.md)
- [`@tenora/client`](../docs/packages/client.md)
- [Kiến trúc](../docs/architecture.md)

## Build

```bash
pnpm --filter @tenora/server build
pnpm --filter @tenora/client build
```
