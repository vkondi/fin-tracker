# Engineering Learnings & Architecture Retrospective

A synthesized record of technical decisions, architectural patterns, trade-offs, and operational insights gathered while building and scaling **FINTRAKR**.

---

## 1. State Architecture & React Concurrency

- **Hierarchical Dependency Injection over Monolithic State:**  
  Splitting application state into a clear chain (`RootContext` → `FinContext`) enforces single-responsibility boundaries and eliminates circular dependencies. `FinContext` explicitly consumes `userId` and `setLoader` from `RootContext`, establishing a predictable initialization order without polluting global state with unrelated UI concerns.

- **Authoritative Consistency over Optimistic UI:**  
  For financial tracking applications, data precision must always take precedence over perceived latency. The system intentionally avoids optimistic state mutations; every write operation performs a server mutation followed by a fresh database re-fetch. This guarantees that aggregations, absolute returns, and percentage returns reflect authoritative server state and eliminates edge-case rollback bugs.

- **Non-Reactive State Caching with `useRef`:**  
  Assigning stable, dynamic color assignments across family members/owners is handled via `useRef<Map<string, string>>()`. Storing visual mappings in a ref rather than in component state maintains color consistency across re-renders without triggering cascading render cycles.

- **Fine-Grained Memoization Cascades:**  
  Aggregations are split across chained, dependency-isolated `useMemo` hooks (e.g., `totalInvested` → `totalAbsReturn` → `totalAbsReturnPercentage`). This fine-grained structure ensures React only recalculates affected metrics when relevant slices of state change, preventing expensive portfolio-wide recalculations on minor UI interactions.

---

## 2. Database Engineering & Serverless Postgres

- **Idempotent Snapshot Upserts:**  
  Historical monthly snapshots utilize a database-level composite unique constraint `UNIQUE(user_id, snapshot_date)` paired with `INSERT ... ON CONFLICT (user_id, snapshot_date) DO UPDATE SET`. This guarantees that automated cron jobs, manual trigger requests, and administrative backfill scripts can safely re-run without producing duplicate records.

- **Time-Drift Resistance via Database Triggers:**  
  Relying on client-side timestamps introduces clock-skew and timezone discrepancies across multi-device usage. Automated `BEFORE UPDATE` database triggers maintain `updated_date` centrally, ensuring all modification audits remain consistent regardless of the client system's local clock.

- **Serverless Connection Pool Management:**  
  Instantiating a shared PostgreSQL `Pool` across API routes rather than opening per-request client connections significantly reduces overhead and guards against connection pool exhaustion in serverless environments.

- **Strict Schema-to-Domain Mapping Boundaries:**  
  The system enforces strict type boundaries between database storage schemas (`snake_case`, e.g., `FinanceRecordType`) and application domain state (`camelCase`, e.g., `FinanceFormDataType`). Explicit mapping transforms data at API edges, preventing accidental attribute leakage or runtime property misses.

---

## 3. Security, RBAC & Defense-in-Depth

- **Confidential RBAC with Zero Client Exposure:**  
  Role-based feature gating (e.g., manual snapshot execution) is strictly resolved on the server by cross-referencing user IDs and verified OAuth emails against environment variables (`AUTHORIZED_SNAPSHOT_USER_IDS`, `AUTHORIZED_SNAPSHOT_EMAILS`) with zero hardcoded defaults. The client receives only a boolean capability flag (`canTriggerSnapshot`), ensuring authorized user lists and admin credentials never leak into client JavaScript bundles.

- **Two-Layer Defense-in-Depth Authentication:**  
  Authentication combines edge middleware with client-side route guards. The Next.js edge middleware evaluates session cookie presence for rapid edge rejection, while `ProtectedRoute` manages graceful client redirects and preserves `callbackUrl` for seamless re-authentication.

- **Automated Cron Request Verification:**  
  Background scheduled jobs (`/api/cron/snapshot`) are guarded via standard `Bearer` token authentication (`CRON_SECRET`). Comparing incoming request authorization headers against configured secrets ensures external schedulers (such as Vercel Cron) trigger automated snapshots securely while blocking unauthorized public invocations.

---

## 4. Data Visualization & Responsive Charting

- **Recharts Mobile Collision Overrides:**  
  In SVG charting libraries like Recharts, `<XAxis>` defaults to `interval="preserveEnd"`, which applies conservative text-width heuristics to drop ticks on mobile screens (causing 10 out of 12 month labels to disappear). Explicitly specifying `interval={0}` combined with tailored mobile font sizes and padding guarantees that all 12 monthly data points remain legible across small viewports.

- **Scalable Temporal Filtering via Dropdowns:**  
  While horizontal tab buttons work for 2–3 periods, multi-year portfolios quickly overflow card headers as history accumulates. Replacing horizontal button tabs with an accessible, compact `<select>` dropdown (`timeline-year-select`) effortlessly scales to decades of historical snapshots without breaking dashboard layouts.

---

## 5. Testing Philosophy & Developer Ergonomics

- **Accessible, Semantic Assertions:**  
  Tests strictly avoid implementation-dependent `data-testid` assertions in favor of accessible queries (`getByRole`, `getByLabelText`, `getByText`). This ensures test suites validate actual user-facing behavior and accessibility trees rather than internal DOM structures.

- **Integration Hook Harnesses:**  
  Custom React hooks and Context providers are tested using `@testing-library/react`'s `renderHook()` wrapped inside real provider hierarchies (`<FinProvider>`, `<RootProvider>`). This catches real-world propagation and lifecycle issues that shallow unit mocks miss.

- **Automated Local Gatekeeping:**  
  Pre-commit automation via Husky and `lint-staged` executes type checking (`tsc --noEmit`), linting (`eslint`), and formatting before commits are finalized, ensuring that defective code is caught immediately on local machines before reaching remote CI pipelines.

---

## 6. Architectural Retrospective & Future Roadmap

- **Atomic Multi-Table Transactions:**  
  While current single-table mutations are reliable, future composite flows (e.g., user account registration coupled with initial default portfolio provisioning) should be wrapped in explicit `BEGIN ... COMMIT` database transactions to guarantee atomicity.

- **Runtime Boundary Schema Validation (Zod):**  
  Introducing Zod validation at Next.js API boundaries will provide runtime type verification and structured error messages, preventing malformed requests from reaching database queries.

- **HTTP Integration Test Suite:**  
  Expanding the test suite with dedicated API route integration tests (using `supertest` or native `fetch` against ephemeral test databases) will test SQL query correctness and HTTP response contracts independently of the UI layer.
