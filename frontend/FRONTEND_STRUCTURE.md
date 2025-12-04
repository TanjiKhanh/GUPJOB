```text
Where to put UI
- Create a single frontend app (or multiple frontend apps) at the repo root, e.g.:
  /frontend                <- main SPA or Next.js app (public site + app shell)
  /packages/shared         <- shared TypeScript packages (types, DTOs, UI components)
  /infra/frontend          <- deployment configs for frontend (cloud, CDN, CDN invalidation)

Why the UI lives here
- Decouples frontend lifecycle from microservices.
- Easy CI/CD (build -> upload static assets -> CDN).
- Easier to use frontend toolchain (Vite/Next/CRA), Storybook, and design system.
- Avoids mixing server code and client bundles in the same services/* directories.

Recommended frontend folder layout (example)
- frontend/
  - package.json
  - vite.config.ts (or next.config.js)
  - tsconfig.json
  - public/                # static files served by the dev server / CDN
  - src/
    - main.tsx / entry.tsx
    - App.tsx
    - pages/
      - Landing.tsx        # public marketing/hero
      - Roadmap.tsx        # public or protected roadmap page
      - Login.tsx
      - Register.tsx
      - Dashboard/
        - index.tsx        # entry for dashboard route
        - MentorDashboard.tsx
        - LearnerDashboard.tsx
    - components/
      - Header/
      - Footer/
      - ui/                # atomic UI components (Button, Card, Modal)
    - hooks/
      - useAuth.ts
      - useFetch.ts
    - context/
      - AuthProvider.tsx
    - services/
      - apiClient.ts       # central fetch/axios instance
      - auth.ts            # login/register calls
      - user.ts            # /user endpoints
    - styles/
      - globals.css
      - auth.css
    - assets/
      - images/
      - svgs/
    - utils/
    - i18n/
    - tests/
      - pages/
      - components/
    - storybook/           # optional Storybook integration
  - .env.example
  - Dockerfile (optional for SSR / preview)
  - README.md

Where each page lives
- Public marketing and landing: frontend/src/pages/Landing.tsx (no auth guard).
- Login & Register: frontend/src/pages/Login.tsx, Register.tsx (public).
- Protected app (dashboard, roadmap progress, mentor interface): frontend/src/pages/Dashboard/* — these are protected routes that require a logged-in user.
- Public read-only resources (public roadmaps, public profiles): can be in frontend pages but fetch from user-service public endpoints (no token required).

Auth & protected route handling
- Auth logic lives in the frontend (AuthProvider + useAuth) for client state.
- Store short-lived access token in memory and refresh tokens in secure HttpOnly cookie (recommended).
- Implement ProtectedRoute wrapper that checks auth state before rendering Dashboard pages.
- Frontend calls backend through API Gateway (e.g., /api/*). Use Vite proxy in dev to avoid CORS.

Shared types & contracts
- Keep shared DTOs and event schemas in packages/shared (a workspace package).
- Use types from packages/shared in both backend services and frontend to avoid contract drift.

Build & deployment
- Frontend build outputs static assets (dist/). Deploy to CDN/Static host (Vercel, Netlify, S3+CloudFront).
- CI pipeline
  - Lint & tests -> build -> upload to CDN (invalidate cache)
- For SSR (SEO, faster first paint), prefer Next.js and server hosting (Node or Vercel).

## 1. The Naming Convention
Format: [category]-[specific-name].[extension]

Prefixes:

icon- for small symbols/graphics.

img- or illustration- for larger pictures.

logo- for branding.

bg- for background images.

Dev UX
- Use Vite proxy or dev API gateway to forward /api to backend (example: /auth -> http://localhost:3000).
- Run frontend and backend independently during dev:
  - cd frontend && npm run dev
  - cd services/auth && npm run start:dev

Observability & security
- Do not embed secrets in frontend. Only public config (API base URL).
- Enforce rate limits and WAF on public endpoints.
- Use HTTPS and secure cookies for refresh tokens.
- Add Sentry/edge monitoring for client errors.

Testing & component work
- Add Storybook for component-driven development.
- Unit tests for hooks and components (Jest + React Testing Library).
- E2E tests for login -> dashboard flows (Playwright / Cypress).

Summary
- Yes: put all UI pages (roadmap, dashboard, login, register, public pages) under a dedicated frontend folder.
- Keep backend services strictly server-side; use API Gateway / well-documented APIs for communication.
- Use shared packages for types/contracts, and follow the protected-route + secure token flow for dashboard pages.
```