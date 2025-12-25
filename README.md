# FINTRAKR

[![CI](https://github.com/vkondi/fin-tracker/workflows/CI/badge.svg)](https://github.com/vkondi/fin-tracker/actions?query=workflow%3ACI)
[![Coverage](https://img.shields.io/badge/coverage-85.13%25-brightgreen)](https://github.com/vkondi/fin-tracker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/deploy-vercel-000000?logo=vercel)](https://vercel.com/vishwajeet-kondi/fintrakr)

FINTRAKR is a modern, multi-user financial portfolio tracker built with Next.js. It helps families and groups track, analyze, and manage investments across platforms with real-time analytics, secure authentication, and a user-friendly dashboard.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vkondi/fin-tracker.git
   cd fin-tracker
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file in the root directory. See [Environment Variables](#environment-variables) for the minimal set required for local development.
4. **Run the development server:**
   ```bash
   yarn dev
   ```
   This runs `next dev --turbopack` on port `3000`. On Windows the script attempts to open your default browser automatically; on other platforms open `http://localhost:3000` manually.

5. **Database & migrations (local development)**
   The app will attempt to connect to the database specified by `DATABASE_URL` and run migrations automatically on server start (see `src/app/api/migration.ts`). If you use Neon or other hosted Postgres, note the client is configured with `ssl.rejectUnauthorized=false` to support Neon. Ensure `DATABASE_URL` points to a writable Postgres instance before starting the server.

---

## Features
- Secure user authentication (Google OAuth, next-auth)
- Responsive dashboard for mobile and desktop
- Real-time portfolio analytics and charts
- Member-wise and category-wise investment tracking
- Add, edit, and delete investments with instant calculations
- Accessible UI (WCAG, keyboard, screen reader friendly)
- Toast notifications for user actions
- Modern, clean design with Tailwind CSS

---

## Environment Variables
Set these in your `.env.local` (only the ones your setup needs):

- `DATABASE_URL` — Postgres connection string used by the app (required for running migrations).
- `NEXTAUTH_URL` — e.g., `http://localhost:3000`
- `NEXTAUTH_SECRET` — secret used by next-auth
- `NEXTAUTH_DEBUG` — optional; set to `true` for verbose next-auth logs
- `GOOGLE_ID`, `GOOGLE_SECRET` — for Google OAuth (set OAuth callback/redirect to `http://localhost:3000/api/auth/callback/google`)
- `CLOUDFLARE_WEB_ANALYTICS_TOKEN` — optional; if present Cloudflare Web Analytics will be enabled in production

> Note: The previous README listed multiple Postgres-related env var names; this repo primarily uses `DATABASE_URL` as the connection string (see `src/app/api/database.ts`).

---

## Scripts
- `yarn dev` — Run the development server (`next dev --turbopack`) on port `3000`.
- `yarn build` — Build for production.
- `yarn start` — Start the production server.
- `yarn check-types` — Run TypeScript type checking (`tsc --noEmit`).
- `yarn lint` — Run ESLint for code quality (includes accessibility checks).
- `yarn test` — Run tests in watch mode (Vitest).
- `yarn test:run` — Run tests once (`vitest run`).
- `yarn test:coverage` — Run tests with coverage report (`vitest run --coverage`). Coverage output is available in the project's `coverage/` directory.

**Pre-commit hooks:** This repository uses Husky + lint-staged to run `eslint --fix` on staged `.ts`/`.tsx` files before commits.

---

## Technologies Used
- [Next.js](https://nextjs.org)
- [next-auth](https://next-auth.js.org)
- [PostgreSQL](https://www.postgresql.org)
- [Tailwind CSS](https://tailwindcss.com)
- React Context API
- [react-toastify](https://fkhadra.github.io/react-toastify)
- [Recharts](https://recharts.org)
- [clsx](https://github.com/lukeed/clsx)
- [react-icons](https://react-icons.github.io/react-icons/)
- [react-responsive](https://github.com/yocontra/react-responsive)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) (for accessibility)

---

## Project structure
A quick map to important folders:

- `src/app` — Next.js app routes and pages
- `src/components` — React UI components and tests
- `src/context` — React context providers (e.g., `FinContext`, `RootContext`)
- `src/lib` — reusable libs (e.g., `authOptions`)
- `src/app/api` — server API routes (database, auth, migrations)
- `src/utils` — constants and utility functions
- `coverage/` — test coverage report (generated by `yarn test:coverage`)

---

## Deployment
Deploy easily on [Vercel](https://vercel.com):
1. Push your code to GitHub.
2. Connect your repo to Vercel.
3. Set environment variables in the Vercel dashboard.
4. Deploy!

**Continuous Integration (GitHub Actions)**  
- **Trigger:** Pull requests to `main`/`master` (`.github/workflows/ci.yml`)  
- **Runs:** TypeScript checks, ESLint, unit tests with coverage (Vitest), uploads coverage to Codecov, and `yarn build`  
- **Purpose:** Validate PRs before merge; configure Vercel to auto-deploy from `main` or add a deployment job to the workflow to run GitHub-native deployments.  
- **Notes:** Codecov uploads for public repositories typically work without an upload token; add `CODECOV_TOKEN` as a secret only if your setup requires it.

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

The `docs/` directory contains additional documentation:
- [Test Cases Guidelines](docs/test-cases-guidelines.md)

---

## Troubleshooting
- **DB connection errors:** verify `DATABASE_URL` is reachable and has correct credentials; for Neon/Postgres ensure SSL options are compatible.
- **OAuth issues:** verify your Google OAuth credentials and set the redirect URI to `http://localhost:3000/api/auth/callback/google`.
- **Port conflicts:** change `PORT` or stop the process using port 3000.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
