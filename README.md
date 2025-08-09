# Starter-Kit (Next.js 14 + Convex + Clerk)

A batteries-included template to bootstrap modern SaaS projects.

Features out of the box:

1. **Next.js (React 18 / App Router)** – Type-safe, server & client components, Tailwind CSS and ESLint/Prettier config.
2. **Convex** – Realtime database, TypeScript-generated backend functions, file storage and actions.
3. **Clerk** – Authentication (social + email) with webhook wired into Convex for user provisioning.
4. **Payments** – Stripe **and** Lemon Squeezy integrations with sample actions (checkout, cancel, sync).  Pick the one you prefer.
5. **File upload** – UploadThing configured for Convex storage.
6. **Feature-flag helper** (plain TypeScript enum).
7. **Analytics** – PostHog (client + server tracing) already wired.
8. **AI helpers** – Thin wrapper around Gemini 1.5, Claude 3, OpenAI (optional).
9. **Feedback module** – Convex collection + hook to collect in-app feedback.

Everything is optional – rip out what you don’t need.

---

## Quick start (new project)

```bash
# 1. Clone without history
npx degit <your-github>/<starter-kit> my-saas
cd my-saas

# 2. Install deps (uses pnpm by default, switch if you like)
pnpm i

# 3. Copy env template and fill in secrets
cp .env.example .env.local
# → generate new Convex & Clerk keys, Stripe etc.

# 4. Initialise a fresh Convex deployment
npx convex dev   # choose **Create new project**

# 5. Run locally
pnpm dev
```

### Why a new Convex deployment per SaaS?
Each Convex deployment owns its schema.  Re-using the same deployment across multiple apps means changing the schema for everyone.  Always create a fresh deployment when you start a new project.

---

## Environment variables
All configuration lives in `.env.local` (never commit secrets).  See `.env.example` for the full list.

| Category | Variable | Required | Notes |
| -------- | -------- | -------- | ----- |
| Convex   | `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL` | ✅ | Written by `npx convex dev` |
| Clerk    | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` | ✅ | Create new Clerk instance per project |
| Stripe   | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs | Optional | Only if you keep Stripe integration |
| Lemon Squeezy | `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_WEBHOOK_SECRET`, variant IDs | Optional | Likewise |
| PostHog  | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Optional | Remove PostHog provider if unused |
| AI keys  | `GEMINI_API_KEY`, `ANTHROPIC_API_KEY` | Optional |

The app refuses to start if required env vars are missing.

---

## Scripts

| Script | Purpose |
| ------ | ------- |
| `pnpm dev` | Next.js + Convex local dev with hot reload |
| `pnpm lint` / `pnpm format` | Code quality |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm deploy` | Vercel deploy helper (see `package.json`) |

---

## Convex migrations & seed data
Schema lives in `convex/schema.ts` – edit it, then run:

```bash
npx convex dev
```

Convex prompts to apply migrations.  Use `convex seed` (script provided) to insert test data – edit `scripts/seed.ts` first.

---

## Production checklist

1. Configure **Clerk** webhooks (events → `https://your-domain.com/api/clerk/webhook`) and set `CLERK_WEBHOOK_SECRET`.
2. Configure **Stripe** or **Lemon Squeezy** webhooks – see comments in `convex/stripe.ts` or `convex/lemonSqueezy`.
3. Set the same secrets on your deploy provider (Vercel, Netlify, Fly.io, etc.).
4. Make sure `NEXT_PUBLIC_CONVEX_URL` points to the production deployment (run `convex deploy` to create one).

---

## Folder layout (important bits)

```
convex/            ← backend functions, models, schema
src/app/           ← Next.js App Router pages
src/hooks/         ← React query / mutation helpers
src/providers/     ← Global React context providers (Clerk, PH, Convex)
src/lib/           ← Shared utilities (feature flags, AI wrappers)
```

---

## Removing things you don’t need

• Don’t want Lemon Squeezy?  Delete `convex/lemonSqueezy` folder and hooks that reference it.
• No PostHog?  Remove `src/providers/post-hog-provider.tsx` and the dependency.
• Using only Stripe?  Delete unused price/variant env vars.
• Not building AI features?  Remove `src/lib/ai/*` and related env vars.

Everything is kept in isolated modules so purging a feature is just removing its folder + a provider import.

---

## Roadmap / ideas

- [ ] Add seed script example for plans & subscriptions.
- [ ] Example SaaS domain model (Team / Project / Role-based access control).
- [ ] GitHub Actions CI (lint, type-check, Cypress smoke test).

Feel free to contribute!
