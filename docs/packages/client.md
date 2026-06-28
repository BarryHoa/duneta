# `@duneta/client`

Framework React Router web — layered frontend lib.

## Layers

```text
@duneta/client/ui        → Duneta* components (design system)
@duneta/client/runtime   → Image, Script, apiFetch, ThemeProvider
@duneta/client/router    → Link hooks, meta, dynamic import
@duneta/client/core        → cn, constants
@duneta/client/validators  → Zod schema factories (string, number, auth, …)
@duneta/client/configs   → duneta.client.config.ts (Vite / sync)
starter/                 → default routers + layouts (sync only, not imported)
```

## UI (`@duneta/client/ui`)

HeroUI v3 wrappers as `Duneta*`:

```tsx
import { DunetaButton, DunetaCard } from '@duneta/client/ui';
import { DunetaTabs } from '@duneta/client/ui/DunetaTabs';
```

Source lives in `packages/client/components/` (compiled to `dist/components/`).

## Runtime (`@duneta/client/runtime`)

```tsx
import { DunetaImage, DunetaScript, apiFetch, ThemeProvider } from '@duneta/client/runtime';
```

| Export | Mô tả |
|--------|------|
| `DunetaImage` | Responsive image + optimization loader (`/duneta/image`) |
| `DunetaScript` | Third-party scripts (`afterInteractive` / `lazyOnload`) |
| `apiFetch` | Same-origin `/api` fetch |
| `ThemeProvider` | Dark/light theme |

## Router (`@duneta/client/router`)

```tsx
import { DunetaLink } from '@duneta/client/ui';
import { defineMeta, createDynamicComponent, useRouter } from '@duneta/client/router';
```

| Export | Mô tả |
|--------|------|
| `defineMeta` / `createPageMeta` | React Router meta |
| `createDynamicComponent` | Lazy import + fallback |
| `useRouter`, `usePathname`, … | Navigation hooks |

## Core (`@duneta/client/core`)

```ts
import { cn, IMAGE_OPTIMIZATION_PATH } from '@duneta/client/core';
```

## Validators (`@duneta/client/validators`)

Zod schema factories — import all or by category:

```text
validators/
  types/       → FieldMessageOptions, PasswordSchemaOptions, …
  string/      → base, email, identity, web, search
  number/      → integer, pagination
  auth/        → password, otp, passwordsMatch, acceptedTerms
  scalar/      → boolean, uuid, date
```

```ts
import { z } from 'zod';
import {
  displayNameSchema,
  emailSchema,
  passwordSchema,
  passwordsMatch,
} from '@duneta/client/validators';

// Or granular imports:
import { emailSchema } from '@duneta/client/validators/string';
import { passwordSchema, passwordsMatch } from '@duneta/client/validators/auth';

const signupSchema = z
  .object({
    name: displayNameSchema({ label: 'Full name', max: 80 }),
    email: emailSchema({ message: 'Email không hợp lệ' }),
    password: passwordSchema({ min: 10, strong: true }),
    confirmPassword: z.string(),
  })
  .superRefine(passwordsMatch({ message: 'Mật khẩu không khớp' }));
```

## Config

| Path | Nội dung |
|------|----------|
| `@duneta/client/configs` | Web config |
| `@duneta/client/configs/vite` | `createDunetaViteConfig` |
| `@duneta/client/themes/globals.css` | Tailwind + HeroUI entry |

## Starter (not a public import)

`starter/routers` + `starter/layouts` — merged into `app/.router-runtime/` by `duneta sync`.
