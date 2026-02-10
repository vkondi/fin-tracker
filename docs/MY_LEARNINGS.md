# My Learnings

**Last Updated:** February 10, 2025

## Technical Learnings

### Context Architecture

- I learned that splitting contexts into a **hierarchical dependency chain** (RootContext → FinContext) prevents circular dependencies while keeping concerns separated. FinContext explicitly depends on RootContext's `userId` and `setLoader`, creating an implicit initialization order that's clearer than flattening everything into global state.

- I discovered that using `useRef<Map<string, string>>()` for owner-to-color mappings prevents unnecessary re-renders while maintaining color stability across renders. This pattern is superior to `useState` for memoizing derived UI properties that don't need to trigger updates.

### State Management Patterns

- I realized that cascading `useMemo` hooks with precise dependencies outperforms a single expensive computation. By splitting aggregations (e.g., `totalInvested` → `totalAbsReturn` → `totalAbsReturnPercentage`), React only recomputes what changed, avoiding redundant calculations.

- I learned to avoid optimistic updates in financial applications—always re-fetch after mutations. The UX cost is acceptable when data accuracy and consistency outweigh perceived speed. This simplifies error handling and prevents stale state bugs.

### Database & API Design

- I discovered that database-level triggers for timestamp management eliminate client-side clock skew issues. The `BEFORE UPDATE` trigger pattern ensures `updated_date` is always accurate, regardless of client timezone or system time drift.

- I learned that serverless environments require **global initialization guards** (`let isInitialized = false`) to prevent race conditions during concurrent cold starts. Running migrations at module-load time (not per-request) is critical for database safety.

- I realized that `Pool` connection management in PostgreSQL is more efficient than creating clients per-request. The pool automatically handles connection lifecycle, preventing connection exhaustion in serverless environments.

### Authentication & Security

- I discovered that **two-layer authentication** (middleware + client wrapper) provides defense-in-depth: middleware blocks unauthorized API calls at the edge (fast, cookie-based), while client-side `ProtectedRoute` handles UX redirects with `callbackUrl` preservation.

- I learned that middleware checking cookie presence (`next-auth.session-token`) doesn't validate token authenticity—it's a fast gate, not full verification. NextAuth validates server-side, so this asymmetry is safe but must be understood.

- I realized that returning `null` during authentication redirects prevents flash-of-unauthenticated-content (FOUC). This is better than showing a loading spinner or partial UI.

### Type Safety & Code Quality

- I learned to maintain **explicit mapping layers** between database types (snake_case) and application types (camelCase). Separate `FinanceRecordType` vs `FinanceFormDataType` prevents accidental field mismatches and makes transformations explicit.

- I discovered that ESLint's `@typescript-eslint/no-explicit-any: "error"` combined with `eslint-plugin-jsx-a11y` catches accessibility and type safety issues pre-commit. The Husky hook running `check-types` + `lint-staged` ensures broken code never reaches CI.

### Testing Strategy

- I learned that testing hooks with `renderHook()` + provider wrappers is more realistic than isolated mocks. Wrapping in actual `<RootProvider>` catches integration issues that unit tests miss.

- I realized that mocking `fetch` globally (`vi.stubGlobal('fetch', ...)`) with `beforeEach` cleanup prevents test pollution. Resetting mocks per-test is mandatory when testing context methods that share the same mock surface.

## Architecture & Design Decisions

- I chose parameterized queries (`$1, $2`) for all database operations to prevent SQL injection. Using `RETURNING *` after INSERT/UPDATE confirms mutations server-side, eliminating client-side optimistic update complexity.

- I decided against optimistic updates in FinContext because financial data must be authoritative. Re-fetching from the database after every mutation guarantees consistency, even if it adds latency. This trade-off favors correctness over perceived performance.

- I learned that `ssl: { rejectUnauthorized: false }` is necessary for Neon database connections but should never be used for production-critical security. This is a pragmatic choice for hosted Postgres services with self-signed certificates.

## Code Quality & Maintainability

- I discovered that **prefix logging** (`console.log("[FinContext][addFinance] >> ...")`) makes debugging in production significantly easier. Consistent prefixes enable log filtering and pattern matching in observability tools.

- I learned that pre-commit hooks running `check-types` before `lint-staged` catch type errors early. TypeScript strict mode errors fail locally, preventing broken PRs from reaching CI.

- I realized that organizing API routes by resource (`/api/finance`, `/api/profile`) with sub-routes (`/api/finance/config`) creates a clear RESTful structure. This pattern scales better than flat route hierarchies.

## Tooling & Developer Experience

- I learned that Vitest's `globals: true` and `tsconfigPaths()` plugin eliminate import boilerplate. Combined with `jsdom` environment, tests run faster than Jest and require minimal configuration.

- I discovered that `next dev --turbopack` in the dev script significantly speeds up local development. The Windows-specific `start http://localhost:3000 &` auto-opens browsers, improving DX on that platform.

- I realized that `coverage.exclude` configuration should be comprehensive. Excluding `**/*.test.{ts,tsx}`, config files, and CSS prevents false coverage inflation.

## What I'd Do Differently Next Time

- I would add **API route tests** for the `/api/finance` endpoints. Currently, only context and component tests exist, leaving server-side logic untested. Integration tests with `msw` or `supertest` would catch database query bugs.

- I would implement **connection pool monitoring** (e.g., `pool.on('error')` handlers) to catch connection leaks in production. Silent pool exhaustion is difficult to debug without explicit logging.

- I would add **OpenAPI/Swagger documentation** for API routes. As the API surface grows, manually tracking request/response schemas becomes error-prone. Auto-generated docs from TypeScript types would reduce ambiguity.

- I would implement **request validation** using Zod or similar at API boundaries. Currently, malformed payloads could crash routes or cause database errors. Schema validation would provide better error messages and type safety.

- I would add **database transactions** for multi-step operations (e.g., user registration + initial configuration). Currently, partial failures could leave inconsistent state. Using `pool.connect()` + `BEGIN/COMMIT` would ensure atomicity.
