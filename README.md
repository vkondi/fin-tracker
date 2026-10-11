# FINTRAKR

[![CI](https://github.com/vkondi/fin-tracker/workflows/CI/badge.svg)](https://github.com/vkondi/fin-tracker/actions?query=workflow%3ACI)
[![Coverage](https://img.shields.io/badge/coverage-85.13%25-brightgreen)](https://github.com/vkondi/fin-tracker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/deploy-vercel-000000?logo=vercel)](https://vercel.com/vishwajeet-kondi/fintrakr)

**FINTRAKR** is a modern, privacy-focused financial portfolio and wealth tracking platform built with Next.js. Engineered for individuals and families, it aggregates multi-platform investments into unified, real-time analytics with historical timeline snapshots, role-based access guardrails, and automated background tracking.

---

## Table of Contents

- [Core Capabilities](#core-capabilities)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts & Developer Workflows](#scripts--developer-workflows)
- [Project Structure](#project-structure)
- [Quality Assurance & Testing Standards](#quality-assurance--testing-standards)
- [Deployment](#deployment)
- [Documentation & Resources](#documentation--resources)
- [Let's Connect](#-lets-connect)
- [License](#license)

---

## Core Capabilities

- **Multi-Member Portfolio Tracking:** Manage and aggregate investments across family members, partners, or entities with dynamic color coding, platform breakdown, and instant returns calculation ($Abs\%$).
- **Financial Growth Timeline:** Interactive SVG trend charts visualizing historical invested capital vs. portfolio valuation across calendar years and macro annual trajectory.
- **Automated & On-Demand Snapshots:** Point-in-time wealth milestones captured automatically on monthly schedules or on-demand by authorized portfolio owners.
- **Privacy-First Security & RBAC:** Edge-protected routes, NextAuth OAuth 2.0 integration, and server-evaluated capability-based access control.

> 📖 *For technical deep-dives into database schemas, state management, RBAC enforcement, and background worker design, refer to the [Technical Architecture & System Design Guide](docs/ARCHITECTURE.md).*

---

## Tech Stack

- **Framework & Runtime:** [Next.js 16](https://nextjs.org) (App Router, Turbopack), React 19, TypeScript
- **Database:** [PostgreSQL](https://www.postgresql.org) via direct parameterized connection pool (`pg`)
- **Authentication:** [NextAuth.js](https://next-auth.js.org) (Google OAuth 2.0, JWT session strategy)
- **Visualization:** [Recharts](https://recharts.org) (SVG AreaChart & PieChart)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com) (Mobile-first utility design)
- **Testing & QA:** [Vitest](https://vitest.dev), React Testing Library, ESLint, Husky

> 📖 *For detailed system topology, database schemas, and data flow diagrams, refer to the [Technical Architecture & System Design Guide](docs/ARCHITECTURE.md).*

---

## Getting Started

### Prerequisites
- **Node.js** (v18.18+ or v20+ recommended)
- **Yarn** package manager (`corepack enable` or `npm install -g yarn`)
- **PostgreSQL** database (e.g. [Neon](https://neon.tech), Supabase, or local Postgres)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vkondi/fin-tracker.git
   cd fin-tracker
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Configure environment variables:**
   Create a `.env` (or `.env.local`) file in the project root:
   ```env
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-32-byte-secret
   GOOGLE_ID=your-google-oauth-client-id
   GOOGLE_SECRET=your-google-oauth-client-secret
   CRON_SECRET=your-cron-secret-token
   AUTHORIZED_SNAPSHOT_USER_IDS=1,2
   AUTHORIZED_SNAPSHOT_EMAILS=admin@example.com
   ```

4. **Start development server:**
   ```bash
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | **Yes** | Postgres connection string (supports Neon pooler endpoints). |
| `NEXTAUTH_URL` | **Yes** | Base application URL (e.g., `http://localhost:3000` locally). |
| `NEXTAUTH_SECRET` | **Yes** | Encryption secret for NextAuth session tokens. |
| `GOOGLE_ID` | **Yes** | Google OAuth client ID (authorized redirect: `/api/auth/callback/google`). |
| `GOOGLE_SECRET` | **Yes** | Google OAuth client secret. |
| `CRON_SECRET` | **Yes** | Bearer token to authorize scheduled snapshot cron jobs (`/api/cron/snapshot`). |
| `AUTHORIZED_SNAPSHOT_USER_IDS` | Optional | Comma-separated user IDs allowed to trigger snapshots manually (restricted if unset). |
| `AUTHORIZED_SNAPSHOT_EMAILS` | Optional | Comma-separated user emails allowed to trigger snapshots manually (restricted if unset). |
| `CLOUDFLARE_WEB_ANALYTICS_TOKEN` | Optional | Token for Cloudflare Web Analytics in production. |

---

## Scripts & Developer Workflows

| Script | Purpose |
|---|---|
| `yarn dev` | Launches Next.js dev server with Turbopack on port `3000`. |
| `yarn check-types` | Executes TypeScript strict type verification (`tsc --noEmit`). |
| `yarn lint` | Runs ESLint including `@typescript-eslint` and accessibility rules (`jsx-a11y`). |
| `yarn test:run` | Runs the Vitest test suite once. |
| `yarn test:coverage` | Generates a full test coverage report in `coverage/`. |
| `yarn test` | Runs Vitest in interactive watch mode. |
| `yarn qa` | **All-in-one quality gate:** Runs type-check + lint + test coverage sequentially. |
| `yarn build` | Creates an optimized Next.js production bundle. |
| `yarn start` | Boots the compiled Next.js production server. |

---

## Project Structure

```
fin-tracker/
├── docs/                        # Architecture, test guidelines, & learnings
│   ├── ARCHITECTURE.md          # Technical architecture & system design
│   ├── MY_LEARNINGS.md          # Architectural decisions & retrospective
│   ├── test-cases-guidelines.md # Semantic testing & accessibility standards
│   └── PROJECT_ESSENTIALS_CHECKLIST.md
├── src/
│   ├── app/                     # Next.js App Router (pages & server API routes)
│   │   ├── api/
│   │   │   ├── cron/snapshot/   # Automated Vercel cron snapshot handler
│   │   │   ├── finance/         # Investment records & historical snapshots
│   │   │   ├── auth/            # NextAuth session handlers
│   │   │   └── migration.ts     # Schema migration runner
│   │   ├── page.tsx             # Main dashboard page
│   │   └── layout.tsx           # Global root layout & providers
│   ├── components/              # Modular UI components & test files
│   │   ├── Dashboard/           # Dashboard views, charts, and FinancialTimeline
│   │   ├── TrackerTable/        # Investment data table, filters, and actions
│   │   └── wrappers/            # AuthProvider, ProtectedRoute, ContentWrapper
│   ├── context/                 # Context providers (RootContext, FinContext)
│   ├── services/                # Reusable business logic (snapshotService.ts)
│   └── utils/                   # Shared utilities, math helpers, and constants
├── .env.example                 # Template for environment variables
├── package.json                 # Project dependencies and script definitions
└── README.md                    # Primary project documentation
```

---

## Quality Assurance & Testing Standards

- **Strict Accessibility Assertions:** Tests adhere to [`docs/test-cases-guidelines.md`](docs/test-cases-guidelines.md), using accessible queries (`getByRole`, `getByLabelText`) with zero reliance on internal `data-testid` selectors.
- **Automated Pre-Commit Hooks:** Husky and `lint-staged` run `tsc --noEmit` and `eslint --fix` on every staged commit.
- **Coverage Target:** The test suite covers components, providers, services, and utility helpers with >85% code coverage.

---

## Deployment

### Vercel Deployment
1. Connect the GitHub repository to [Vercel](https://vercel.com).
2. Configure all environment variables listed in the [Environment Variables](#environment-variables) section.
3. Deploy! Vercel automatically configures the scheduled monthly cron job via [`vercel.json`](vercel.json).

### CI/CD Pipeline
Every pull request to `main` triggers GitHub Actions (`.github/workflows/ci.yml`):
- TypeScript verification (`tsc --noEmit`)
- ESLint quality and accessibility checks
- Vitest unit test suite with coverage report upload
- Next.js production bundle build verification

---

## Documentation & Resources

- [Technical Architecture & System Design](docs/ARCHITECTURE.md)
- [Engineering Learnings & Architecture Retrospective](docs/MY_LEARNINGS.md)
- [Test Cases Guidelines](docs/test-cases-guidelines.md)
- [Project Essentials Checklist](docs/PROJECT_ESSENTIALS_CHECKLIST.md)

---

## 📞 Let's Connect

If you want to swap ideas on tech stacks, developer tools, or market analytics, drop me a message! ☕

- ✉️ **Email:** [vkondi@gmail.com](mailto:vkondi@gmail.com)
- 💼 **LinkedIn:** [Vishwajeet Kondi](https://www.linkedin.com/in/vishwajeet-kondi)
- 🐙 **GitHub:** [@vkondi](https://github.com/vkondi)

<p align="center">
  <em>Crafted with chai, clean code, and AI ☕🤖</em>
</p>

---

## License

This project is licensed under the [MIT License](LICENSE).

