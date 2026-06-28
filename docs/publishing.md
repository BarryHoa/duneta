# Publishing Duneta to npm

## Packages

| npm | Mô tả |
|-----|--------|
| `duneta` | CLI — `duneta dev`, `duneta build`, `duneta deploy` |
| `@duneta/client` | Web kit + Vite/React Router config |
| `@duneta/server` | Hono API framework |
| `create-duneta-app` | Scaffold project mới |

## User workflow (sau khi publish)

```bash
npx create-duneta-app my-app
cd my-app
npm run dev
```

```json
{
  "scripts": {
    "dev": "duneta dev",
    "build": "duneta build",
    "deploy": "duneta deploy"
  },
  "dependencies": {
    "duneta": "^0.1.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  }
}
```

## Publish từ monorepo

```bash
pnpm --filter @duneta/server run build
pnpm --filter @duneta/client run build
pnpm version:sync 0.1.0
pnpm --filter @duneta/server publish --access public
pnpm --filter @duneta/client publish --access public
pnpm --filter duneta publish --access public
pnpm --filter create-duneta-app publish --access public
```

Thứ tự: **server → client → duneta → create-duneta-app** (`duneta` phụ thuộc client/server).

## Monorepo dev

Repo gốc dùng `duneta` workspace CLI — dogfood giống user npm:

```bash
pnpm install
pnpm dev
```
