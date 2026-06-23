# Packages

```text
packages/server  → @tenora/server
packages/client  → @tenora/client
```

`@tenora/server` is only for Hono/server code. `@tenora/client` ships browser-safe UI, default routes, and the `tenora-web` CLI. Do not import `@tenora/server` from `app/web`.
