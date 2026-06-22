# Shared packages

Only two packages exist:

```text
packages/backend  → @tenora/server
packages/frontend → @tenora/client
```

`@tenora/server` is only for Hono/server code. `@tenora/client` is only for Next.js/browser-safe code. Do not import `@tenora/server` from `apps/web`.
