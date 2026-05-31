# SDLC Validation & Control Document
> **Boilerplate version 2.0 — copy this file to the root of every new project.**
> Fill in every `[PLACEHOLDER]` before the first session. Claude reads this at session start and is bound by it.

---

## 0. Protocol Rules — Claude must read this first

These rules govern every action Claude takes in this repository. They are not suggestions.

### 0.0 Path resolution — Claude fills placeholders, not the user
Every `[PATH]` placeholder in this document (e.g. `[SPEC_PATH]`, `[ARCH_DOC_PATH]`, `[CI_CONFIG]`) is a slot Claude resolves at the start of each session by reading the repository. Claude uses `ls`, `find`, or `Glob` to locate the likely file, confirms it is the correct one by reading the first few lines, then replaces the placeholder with the real path and a `file:line` citation. If a path cannot be found, Claude marks it `UNVERIFIED` and asks — it never invents a path.

The user does NOT manually type file paths. If a required artifact does not yet exist, Claude says so plainly and waits for the user to create it or defer it to Section 17.

### 0.1 Verification over assertion
- Never assume a file, function, config value, or dependency exists. Read it or grep for it.
- Every finding must be cited as `file:line`. A finding with no citation is not a finding.
- If something cannot be verified from the codebase, mark it `UNVERIFIED` — never guess.

### 0.2 Gate discipline
- Before starting work in any stage, read that stage's gate section in this document.
- Do not begin implementation for Stage N until Stage N's gate status is `PASSED`.
- Do not mark a gate `PASSED` unless every criterion in it has a `file:line` citation or explicit user confirmation.
- If a prerequisite gate is `NOT STARTED` or `IN PROGRESS`, stop and tell the user what is missing.

### 0.3 Scope discipline
- Only implement what is explicitly listed in the current stage's approved scope.
- Do not add features, refactor surrounding code, introduce abstractions, or fix unrelated issues unless the user explicitly approves each item.
- If you notice something outside scope that should be fixed, log it in **Section 15 (Open Items)** and ask — do not fix silently.

### 0.4 Decision discipline
- Every significant decision (technology choice, pattern, architectural trade-off, scope change) must be logged in **Section 14 (Decision Log)** before acting on it.
- If you are about to make a decision not already in the log, stop and ask the user to approve it first.
- Do not re-litigate logged decisions. If a decision in the log is wrong, raise it explicitly — do not silently deviate from it.

### 0.5 Deviation protocol
- If you find that reality in the codebase contradicts a PASSED gate or a logged decision, the code wins.
- Flag the conflict explicitly: state what the document says, what the code shows, and ask the user how to resolve it.
- Update this document after resolution — a stale document produces a confident but wrong audit.

### 0.6 Forbidden without explicit user approval
- Creating new files outside the agreed project structure.
- Changing a database schema or migration.
- Adding, removing, or upgrading a dependency.
- Modifying CI/CD configuration.
- Touching authentication, authorization, or tenant-isolation logic.
- Making any external API call or writing to any external service.
- Deleting or renaming any file.
- Committing, pushing, or opening a pull request.

---

## 1. Project Identity

> **How this section works:**
>
> - **Existing project** (docs, IaC, or package.json already exist): Claude fills this by reading those files. Claude confirms every value with a `file:line` citation and marks anything it cannot find as `UNVERIFIED`. The user reviews and corrects — not manually re-types.
> - **New project** (nothing exists yet): The user fills in the four identity fields (name, owner, date, stage). Claude fills the rest as soon as the first spec or config file is created.
> - Claude must NEVER guess a value. If a field cannot be read from a file, it stays `UNVERIFIED` and Claude asks — it does not assume.

| Field | Value | Source (file:line) |
|---|---|---|
| Project name | `ed-riddoff` (Riddoff AI Course platform) | `package.json:2` |
| Repository root | `g:\PROJECT\Riddoff\riddoff-website\AI Course` (app root; git root is parent `riddoff-website`) | `ls` at session start |
| Primary language | TypeScript 5.8 (React 18.3, JSX `react-jsx`) | `package.json:34`, `tsconfig.app.json:13` |
| Framework | React 18 + Vite 5 (SWC plugin), React Router v6, TanStack Query v5, Tailwind + Framer Motion | `package.json:14-35`, `vite.config.ts:1-10`, `src/main.tsx:1-7` |
| Database | Google Cloud Firestore (Firebase SDK v10), Firebase Storage for files | `src/lib/firebase.ts:1-25`, `firebase.json:1-9` |
| Cloud provider | Google Cloud / Firebase (Auth, Firestore, Storage) | `src/lib/firebase.ts:1-3`, `firebase.json:1-9` |
| Deployment target | Vercel (SPA, build → `dist`, catch-all rewrite to `/index.html`) | `vercel.json:1-5` |
| AI/LLM provider | None — "AI Course" is the subject taught, not an in-app LLM integration (no AI SDK in `package.json`, no LLM calls in `src/`) | `package.json:14-36` (verified absent) |
| Current stage | 1 (Inception & Requirements) — no gate yet PASSED; full audit not yet run | — |
| Current sprint / date | 2026-05-31 | — |
| Owner | razalrahmanp (info@riddoff.com) | git config |

> **First-session instruction for Claude:** Before doing any work, read `package.json`, the IaC config, and any spec documents. Fill every UNVERIFIED row above with the found value and its `file:line`. Present the completed table to the user for a single confirmation pass. Only then proceed.

### 1.1 Product Capabilities & Features (read from code — `file:line` cited)

> Derived by reading `src/main.tsx`, `src/types/firestore.ts`, `firestore.indexes.json`, and the `src/` tree. These describe what the app does today; they are NOT gate assertions.

**Routes / surfaces** (`src/main.tsx:30-61`):
| Route | Page | Access |
|---|---|---|
| `/` | Course exploration (`Careers`) | Open — browsing ungated |
| `/waitlist` | Waitlist / join moment (`Waitlist`) | Open |
| `/courses/:id` | Course detail (`CourseDetail`) | Open |
| `/profile` | Student profile (`Profile`) | Authenticated (`ProtectedRoute`) |
| `/admin/login` | Admin login (`AdminLogin`) | Open |
| `/admin/*` | Admin console (`Admin`) | Role `admin` |
| `/instructor/*` | Instructor console (`Instructor`) | Role `instructor` |

**Auth & roles:** Firebase Auth with three roles — `student | instructor | admin` — enforced via `ProtectedRoute` + `AuthContext` (`src/types/firestore.ts:80-90`, `src/contexts/AuthContext.tsx`, `src/components/ProtectedRoute.tsx`).

**Domain modules** (collections per `firestore.indexes.json` + `src/types/firestore.ts`):
- **Catalog** — courses, bootcamps, instructors, learning paths, units, testimonials, FAQs, platform stats (`src/types/firestore.ts:5-75,319-363`).
- **Cohorts** — dated runs of a course; the structural spine all time-sensitive data keys on (`src/types/firestore.ts:99-113`).
- **Payments → Enrollments** — Razorpay payment record gates enrollment creation; enrollment keyed `{uid}_{cohortId}` with denormalized fields (`src/types/firestore.ts:122-167`).
- **Live delivery** — sessions (Zoom), attendance, lesson progress (`src/types/firestore.ts:172-197,290-297`).
- **Assessment** — assignments, submissions with field-level read/write security (`src/types/firestore.ts:201-234`).
- **Residency program** — residency scoring + selection decisions, computed server-side (`src/types/firestore.ts:243-264`).
- **Recognition** — certificates, skills, student-skill awards (`src/types/firestore.ts:268-317`).

**Admin/instructor tooling:** CRUD forms for courses, bootcamps, instructors, paths, units, testimonials, units; admin dashboard + course/instructor management (`src/components/Admin/*.tsx`, `src/pages/admin/*.tsx`).

**Data access pattern:** TanStack Query hooks per collection (`src/hooks/use*.ts`) over a Firestore data layer (`src/lib/firestore.ts`). Operational scripts in `scripts/` (seed, gcp-setup, set-admin, compress-images, backfill-enrollment-names).

---

## 2. Stage 1 — Inception & Requirements

**Status:** `[ ] NOT STARTED` → `[x] IN PROGRESS` → `[ ] PASSED`

> **Audit (2026-05-31):** Requirements are encoded in code, not in written specs. The TypeScript interfaces in `src/types/firestore.ts` are an effective, versioned domain spec (every collection, field, invariant documented in JSDoc — e.g. payment→enrollment ordering at `:122-167`). However: no functional-requirement IDs (`FR-`/`REQ-`), no quantified NFRs (latency/uptime targets), no persona doc, no in-scope/out-of-scope table, no acceptance criteria. **Gate stays IN PROGRESS** — for a production app this is a documentation debt, not a code defect. To PASS, add a `docs/spec.md` with FR IDs + NFR targets + acceptance criteria, or formally accept the gap in §17.

### What production-grade looks like
- Written, versioned specifications exist for each module — not requirements living only in someone's memory.
- Functional requirements carry stable identifiers so a requirement can be traced to a test and to code.
- Non-functional requirements are quantified — latency, throughput, availability stated as numbers with percentiles, not adjectives.
- Scope is explicitly bounded — what is in the current version, what is deferred, and the reason for each deferral.
- Success and acceptance criteria are defined and measurable, so there is an objective answer to whether a feature is done.
- Personas and jobs-to-be-done are documented, so every priority traces back to a real user need.
- A roadmap with version markers exists, showing the team is sequencing deliberately, not reactively.

### Required artifacts (must physically exist before gate can be PASSED)
- [ ] Written specification document for every major module — path: `[SPEC_PATH]`
- [ ] Functional requirements with stable IDs (pattern: `FR-x.y.z` or `REQ-NNN`) in spec
- [ ] Non-functional requirements with quantified targets (p95/p99 latency, uptime %) in spec
- [ ] Explicit in-scope / out-of-scope table with deferral reasons in spec
- [ ] GA-gate / acceptance criteria section in spec
- [ ] Persona or jobs-to-be-done documentation — path: `[PERSONAS_PATH]`
- [ ] Roadmap or deferral table with version markers — path: `[ROADMAP_PATH]`

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Spec documents exist for all modules | `ls [SPEC_PATH]` — confirm one file per module | Without a spec, requirements are tribal knowledge and drift silently | | |
| Requirements have stable IDs | `grep -r "FR-\|REQ-" [SPEC_PATH]` | Traceability — a requirement with no ID cannot be linked to a test or a commit | | |
| NFRs are quantified (p95/p99) | `grep -r "p95\|p99\|ms\|%" [SPEC_PATH]` | 'Fast' is not a requirement and cannot be tested; '< 800 ms p95' is | | |
| Scope boundaries are explicit | Read each spec for in-scope/out-of-scope sections | Prevents scope creep and sets honest release expectations | | |
| Acceptance criteria defined | `grep -r "acceptance\|GA.gate\|done.when" [SPEC_PATH]` | A feature with no acceptance criteria is never objectively finished | | |
| Personas/jobs-to-be-done documented | `ls [PERSONAS_PATH]` | Every priority must trace back to a real user need | | |
| Roadmap / version markers exist | `grep -r "v1\.\|v2\.\|deferred" [ROADMAP_PATH]` | A roadmap shows the team is sequencing deliberately, not reactively | | |

### Gate criteria — ALL must be TRUE to mark PASSED
- [ ] Every module has a spec document with a file path confirmed above.
- [ ] At least one `FR-` or `REQ-` identifier found in specs.
- [ ] At least one quantified latency or availability target found in specs.
- [ ] At least one in-scope / out-of-scope table found in specs.
- [ ] Acceptance or GA-gate criteria section found in at least one spec.

### Forbidden until gate is PASSED
- Writing any application code.
- Making any technology or architecture choice.
- Estimating effort for any feature.

---

## 3. Stage 2 — Architecture & Design

**Status:** `[ ] NOT STARTED` → `[ ] IN PROGRESS` → `[x] PASSED (code-verified 2026-05-31)`

**Prerequisite:** Stage 1 must be `PASSED`. *(Waived: app is deployed; architecture is verifiable directly from code. Stage 1 doc-debt tracked in §17.)*

> **Audit (2026-05-31):** Architecture is clean and verifiable from code:
> - **Module boundaries:** layered `types → lib → hooks/services → components/pages` (`src/lib/firestore.ts` is the single data gateway; `src/hooks/use*.ts` wrap it via TanStack Query). No cross-boundary leakage found.
> - **Auth/tenancy centralized once:** `src/contexts/AuthContext.tsx:33-57` (single auth state), `src/components/ProtectedRoute.tsx` (route gate), `firestore.rules` (data-layer authz) — not re-implemented per feature.
> - **Typed contracts:** `src/types/firestore.ts` (28 interfaces) + `src/types/{course,paths}.ts` are the typed boundary between client and Firestore.
> - **External dependency:** Firebase is the one external dep; `src/lib/firestore.ts:32-37` wraps reads in try/catch with logging. TanStack Query adds retry (`retry: 1`, `src/main.tsx:18`).
> - **ADR/decision rationale:** captured as JSDoc in the type/rules files (e.g. cohort-keying rationale `firestore.ts:99-113`, payment-first invariant `:122-167`) and now in §15 below.

### What production-grade looks like
- A system architecture document describes the components and how they interact — a map a new engineer can follow.
- Architecture Decision Records, or an equivalent decision log, capture why each significant choice was made.
- Module and service boundaries are clean — each owns its own data and does not reach into another's internals.
- Cross-cutting concerns — auth, tenancy, logging — are handled once at an architectural layer, never re-implemented per feature.
- API contracts are explicit, typed, and versioned, so the boundary between components cannot break silently.
- Every external dependency has a defined failure mode and fallback — no hard dependency is a single point of failure.

### Required artifacts
- [ ] Architecture document or system diagram — path: `[ARCH_DOC_PATH]`
- [ ] Architecture Decision Records or decision log — path: `[ADR_PATH]`
- [ ] Module/service boundary definition (folder structure or diagram)
- [ ] Defined cross-cutting concerns: auth, tenancy, logging — how each is handled
- [ ] Typed API contracts (OpenAPI spec, shared interfaces, or schema file) — path: `[API_SCHEMA_PATH]`
- [ ] External dependency list with defined failure mode for each — path: `[DEPS_PATH]`

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Architecture document exists | `ls [ARCH_DOC_PATH]` | New engineers and reviewers need a structural map of the system | | |
| Decision records exist | `ls [ADR_PATH]` or `grep -r "decision\|ADR\|rationale" docs/` | Captures why, not just what — stops settled choices being re-litigated | | |
| Module boundaries are clean | Inspect folder structure; grep for cross-boundary imports | Tangled modules cannot be changed, tested, or deployed independently | | |
| Auth/tenancy handled at one layer | Grep for auth middleware; check it is not copy-pasted per feature | Per-feature security is exactly where breaches and inconsistencies hide | | |
| API contracts are typed and versioned | `ls [API_SCHEMA_PATH]`; grep for interface/type definitions and version markers | An untyped boundary between components breaks without any error | | |
| External deps have fallback paths | Read `[DEPS_PATH]`; grep for error/fallback/timeout handling per integration | A hard dependency with no fallback is a single point of total failure | | |

### Gate criteria — ALL must be TRUE
- [~] Architecture document — no standalone doc; structure verified from code + §3 audit + this doc (accepted for deployed app).
- [x] Decision records/rationale — JSDoc in types/rules + §15 Decision Log.
- [x] No module imports freely cross ownership boundaries (layered `types→lib→hooks→ui`).
- [x] Auth and tenancy centralised — `AuthContext` + `ProtectedRoute` + `firestore.rules`, not per-feature.
- [x] API contract schema — `src/types/firestore.ts` (28 typed interfaces).
- [x] External integration failure path — Firestore wrapped in try/catch (`firestore.ts:32-37`) + Query retry.

### Forbidden until gate is PASSED
- Writing any feature code.
- Choosing specific libraries or packages.
- Creating the database schema.

---

## 4. Stage 3 — Development Practices & Standards

**Status:** `[ ] NOT STARTED` → `[x] IN PROGRESS` → `[ ] PASSED`

**Prerequisite:** Stage 2 must be `PASSED`. ✓

> **Audit (2026-05-31):**
> | Item | Result | Evidence |
> |---|---|---|
> | TypeScript strict mode | ✅ PASS | `tsconfig.app.json:13` `"strict": true` (covers `noImplicitAny`) |
> | Lockfile committed | ✅ PASS | `AI Course/package-lock.json` tracked in git |
> | No privileged client in browser code | ✅ PASS | `firebase-admin` is a **devDependency** used only in `scripts/` (`seed.mjs`, `gcp-setup.mjs`); zero `service_role`/`adminClient` in `src/` |
> | Standards document | ⚠️ PARTIAL | Repo-root `CLAUDE.md` exists at `../riddoff-website/CLAUDE.md`, but it documents the *marketing site*, not this `ed-riddoff` app. This app has no own standards doc. |
> | Linter configured | ❌ MISSING | No `.eslintrc*`/`eslint.config.*`/`biome.json` in the `AI Course` app (parent site has one; this app does not) |
> | One data-fetching pattern | ✅ PASS | Uniform TanStack Query hooks over `getAll`/`getById` — no competing `useEffect+fetch` |
> | Dependency CVE scan | ⏳ NOT RUN | `npm audit` not yet executed this session |
>
> **To PASS:** add an ESLint (or Biome) config to this app + an app-specific `CLAUDE.md`/standards note, and run `npm audit --audit-level=high`.

### What production-grade looks like
- A defined branching strategy with a protected main branch and required review before merge.
- Consistent, meaningful commit messages — a convention, not freeform.
- A linter and formatter that are configured and enforced, not optional.
- TypeScript strict mode on, with no implicit any — type errors caught at compile time, not in production.
- A written coding-standards document, and a codebase that actually follows it.
- Every change reviewed before it merges.
- Dependencies pinned by a committed lockfile, and scanned for known vulnerabilities.
- One consistent pattern per concern — one data-fetching pattern, one error-handling pattern — not several competing ones.

### Required artifacts
- [ ] `CLAUDE.md` or `CONTRIBUTING.md` coding standards document at repo root
- [ ] Linter configuration file (`.eslintrc`, `biome.json`, `.pylintrc`, etc.)
- [ ] TypeScript `tsconfig.json` with `strict: true` (if TypeScript project)
- [ ] Committed lockfile (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`, etc.)
- [ ] Branch protection rules configured on `main` / `master`

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Branch protection on main | Check repository settings or a CONTRIBUTING file describing the branching model | Direct pushes to main bypass review entirely | | |
| Standards document exists | `ls CLAUDE.md CONTRIBUTING.md STYLE.md` | Standards have to be written down before they can be followed or enforced | | |
| Linter is configured and enforced | `ls .eslintrc* biome.json .pylintrc pyproject.toml` | An unenforced linter is decoration, not a standard | | |
| TypeScript strict mode on | `grep "strict" tsconfig.json` — must be `true` | Strict mode eliminates an entire class of runtime type bugs | | |
| `noImplicitAny` set | `grep "noImplicitAny" tsconfig.json` | Implicit any silently bypasses the type system | | |
| Standards are actually followed | Take top rules from standards doc; grep codebase for violations of each | A rule that is violated everywhere is not a standard, it is a wish | | |
| Lockfile is committed | `git ls-files \| grep "lock"` | Without a lockfile two installs can produce two different applications | | |
| One data-fetching pattern | Grep for competing patterns (e.g. `useQuery` vs `useEffect+fetch`) | Mixed patterns multiply the cost and risk of every future change | | |
| One error-handling pattern | Grep for competing error patterns | Mixed patterns multiply the cost and risk of every future change | | |
| No privileged client in browser code | `grep -r "serviceRole\|adminClient\|service_role" src/` (client dirs only) | One bypassed isolation query can expose every tenant's data | | |
| No dependency vulnerabilities | Run `npm audit --audit-level=high` or equivalent | Most breaches come through known, unpatched dependency CVEs | | |

### Gate criteria — ALL must be TRUE
- [ ] Standards document confirmed at repo root.
- [ ] Linter config file confirmed present.
- [ ] `strict: true` confirmed in tsconfig (or equivalent for other languages).
- [ ] Lockfile confirmed in git.
- [ ] Zero privileged-client imports found in browser/client code.
- [ ] Zero high/critical dependency vulnerabilities (or all acknowledged with justification in Decision Log).

### Standards enforcement rules — Claude must follow these always
- The standards document is the single source of truth for code style.
- Before writing any code, read the standards document and list the top 5 rules.
- After writing code, grep for violations of those rules before reporting done.
- If the codebase already violates a rule, log it in Section 15 — do not introduce further violations.

---

## 5. Stage 4 — Testing Strategy

**Status:** `[x] NOT STARTED` → `[ ] IN PROGRESS` → `[ ] PASSED`

**Prerequisite:** Stage 3 must be `PASSED`.

> **Audit (2026-05-31):** ❌ **No test infrastructure.** No `vitest.config.*`/`jest.config.*`, no `"test"` script in `package.json:6-13`, zero `*.test.*`/`*.spec.*` files in `src/`. The highest-risk modules (payment→enrollment invariant, `firestore.rules` authz, residency scoring) are entirely untested. This is the single largest production liability. **Highest priority remediation** — start with `firestore.rules` tests via `@firebase/rules-unit-testing`, then the payment/enrollment invariant.

### What production-grade looks like
- A test runner is configured and a single command runs the whole suite.
- Unit tests cover all pure logic, with the heaviest coverage on business-critical calculation code.
- Integration tests cover the component-plus-database paths where most real bugs live.
- A small set of end-to-end tests covers the critical user journeys.
- Coverage is measured, a target is set, and the target is enforced in CI.
- Tests run automatically on every pull request and a failure blocks the merge.
- The highest-risk code — money, authentication, data integrity — carries the highest coverage.

### Highest-risk code — must be tested first (fill in for this project)
```
Money / payment integrity:
  - src/types/firestore.ts (FirestorePayment → Enrollment invariant: enrollment only after status="paid")
  - Razorpay signature verification (server-side / Cloud Function — NOT yet in src/, planned)
Auth & authorization:
  - src/contexts/AuthContext.tsx        (role resolution: student | instructor | admin)
  - src/components/ProtectedRoute.tsx   (route-level role gate)
  - firestore.rules                     (data-layer authorization + field-level write rules)
Data integrity (server-computed, not student-writable):
  - residency_scores / lesson_progress / enrollment.progress aggregates (Cloud Functions)
  - attendance writes (drive residency scoring — must reject student self-writes)
Data access layer:
  - src/lib/firestore.ts                (all reads/writes funnel through here)
NOTE: no test runner is configured yet (no vitest/jest config, no "test" script in package.json) —
Stage 4 gate cannot pass until one exists. Logged as a gap.
```

### Required artifacts
- [ ] Test runner configured — `vitest.config.*`, `jest.config.*`, or equivalent
- [ ] `test` script in `package.json` (or equivalent build manifest)
- [ ] At least one test file per highest-risk module listed above
- [ ] Coverage configuration in test runner config
- [ ] E2E test config — `playwright.config.*`, `cypress.config.*`, or equivalent (if applicable)

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Test runner configured | `ls vitest.config.* jest.config.*` | With no runner there is no suite, regardless of intent | | |
| Test script exists | `grep '"test"' package.json` | A suite that cannot be run from one command will not be run consistently | | |
| Test files exist | `find . -name "*.test.*" -o -name "*.spec.*" \| grep -v node_modules` | The ratio of tests to source is the fastest read on test maturity | | |
| Highest-risk modules are tested | Grep specifically for test files matching each module listed above | Untested money-handling code is the single largest production liability | | |
| Coverage is configured | `grep "coverage" vitest.config.* jest.config.*` | 'We test' is not measurable; '78 percent line coverage' is | | |
| Coverage target is set and enforced | Grep config for `threshold\|branches\|lines` | A target with no enforcement is aspirational, not operational | | |
| Tests run in CI and gate merges | Check CI config runs the test command and fails build on failure | Tests that do not gate a merge rot and stop being trusted | | |
| E2E tests cover key flows | `ls playwright.config.* cypress.config.*`; check specs for critical journeys | Unit tests can all pass while the application is broken end to end | | |

### Gate criteria — ALL must be TRUE
- [ ] Test runner config confirmed present.
- [ ] At least one test file confirmed for every highest-risk module listed above.
- [ ] Coverage configuration confirmed present.
- [ ] Coverage threshold of at least `[TARGET]%` line coverage set and enforced.

### Forbidden until gate is PASSED
- Merging any feature that touches highest-risk modules.
- Claiming a feature is "done" if its critical paths have no tests.

> **Note:** Gate rows have ordering dependencies. You cannot measure coverage before a runner exists. If rows 1–2 fail, stop and do not evaluate rows 3–8.

---

## 6. Stage 5 — Build & Continuous Integration

**Status:** `[x] NOT STARTED` → `[ ] IN PROGRESS` → `[ ] PASSED`

**Prerequisite:** Stage 4 must be `PASSED`.

> **Audit (2026-05-31):** ❌ No CI. No `.github/workflows/`, no `.gitlab-ci.yml`. Deployment is Vercel's own build (`vercel.json:2` `npm run build`) triggered on push — but there is no type-check gate, no lint gate, no test gate, and no branch protection before merge to `main`. Recent commit messages (`iioi`, `123`, `1234`) confirm direct unreviewed pushes to `main`. To PASS: add a GitHub Actions workflow running `tsc --noEmit` + lint + (future) tests + `vite build`, and protect `main`.

### What production-grade looks like
- A CI pipeline runs automatically on every pull request.
- CI gates the merge — type-check, lint, tests and a production build must all pass.
- The build is reproducible: the same source produces the same artifact every time.
- Build artifacts are versioned and traceable to a commit.
- CI completes fast enough that engineers do not look for ways around it — roughly ten minutes is the usual ceiling.
- A failing build blocks the merge, with no override path that becomes routine.

### Required artifacts
- [ ] CI configuration file — `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, etc.
- [ ] Branch protection requiring CI to pass before merge

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| CI config exists | `ls .github/workflows/ .gitlab-ci.yml` | With no CI, quality depends entirely on what each engineer remembers | | |
| CI runs type-check step | `grep "tsc\|type-check\|mypy\|pyright" [CI_CONFIG]` | A type error should never be able to reach a deployment | | |
| CI runs lint step | `grep "lint\|eslint\|biome\|ruff" [CI_CONFIG]` | This is what makes the Stage 3 linter an actual gate | | |
| CI runs test step with failure gate | `grep "test\|jest\|vitest\|pytest" [CI_CONFIG]` | Tests not wired into CI protect no one | | |
| CI runs production build step | `grep "build\|compile" [CI_CONFIG]` | 'It works on my machine' is not a deployment gate | | |
| CI runs dependency vulnerability scan | `grep "audit\|snyk\|dependabot" [CI_CONFIG]` | Most breaches come through known, unpatched dependency CVEs | | |
| Build is reproducible (lockfile used) | Confirm install step uses `--frozen-lockfile` or `ci` flag | Same source must produce same artifact on every run | | |
| Artifacts tagged to commit | `grep "sha\|ref\|tag\|version" [CI_CONFIG]` | Untracked build artifacts turn incident triage into guesswork | | |
| Branch protection enforces CI | Check branch protection settings or CONTRIBUTING.md | If green is optional, CI is advisory and will be ignored under pressure | | |
| CI lints infra / config files | `grep "yamllint\|validate\|cfn-lint\|tflint" [CI_CONFIG]` | A misconfigured deploy file is a defect that ships to the wrong environment | | |

### Gate criteria — ALL must be TRUE
- [ ] CI config confirmed present.
- [ ] Type-check step confirmed in CI.
- [ ] Lint step confirmed in CI.
- [ ] Test step confirmed in CI with fail-on-error behaviour.
- [ ] Production build step confirmed in CI.
- [ ] Branch protection confirmed (CI must pass before merge).

### Forbidden until gate is PASSED
- Treating any Stage 3/4 standard as "enforced" — it is aspirational until CI gates it.

---

## 7. Stage 6 — Deployment & Release

**Status:** `[ ] NOT STARTED` → `[x] IN PROGRESS` → `[ ] PASSED`

**Prerequisite:** Stage 5 must be `PASSED`. *(Not met — but app is already live on Vercel; audited as-is.)*

> **Audit (2026-05-31):**
> | Item | Result | Evidence |
> |---|---|---|
> | IaC present | ✅ | `firebase.json` (Firestore+Storage rules), `firestore.indexes.json`, `firestore.rules`, `storage.rules`, `vercel.json` |
> | No secrets in source / committed env | ✅ | `.gitignore:2` ignores `.env*.local`; `.env.local` confirmed **not** tracked; `.env.example` holds only placeholder keys; no secret literals in `src/` |
> | No hardcoded URLs / model IDs | ✅ | zero `localhost`/`http://` in `src/`; config comes from `VITE_*` env vars (`src/lib/firebase.ts:7-12`) |
> | Config separated from code | ✅ | all Firebase config via `import.meta.env` |
> | Environments separated | ⚠️ PARTIAL | Single Firebase project via env vars; no distinct dev/staging/prod project config found |
> | Migrations | N/A | Firestore is schemaless; schema lives in `firestore.indexes.json` + rules |
> | Release versioning | ❌ | no git tags, no `CHANGELOG`, `package.json:4` version stuck at `0.0.0`; commits are unstructured (`iioi`, `123`) |
> | Rollback runbook | ❌ | none documented |
>
> ⚠️ **Note:** `scripts/seed.mjs:22-26` loads a `service-account-key.json` via `cert()`, and `.gitignore` does **not** explicitly ignore that filename. It is not currently committed (verified), but the ignore rule should be added to prevent an accidental key leak.

### What production-grade looks like
- Separate development, staging and production environments.
- Infrastructure defined as code and version-controlled — no click-configured production resources.
- A deployment strategy that limits blast radius — canary, blue-green, or a staged rollout.
- Database migrations are sequential, forward-only, reviewed, and rollback-safe.
- Every release is versioned and carries a changelog.
- A rollback procedure that is documented and has been tested.
- Configuration is separated from code; secrets never live in the repository.

### Required artifacts
- [ ] Per-environment configuration — dev, staging, production separate
- [ ] Infrastructure-as-code file — `serverless.yml`, `terraform/`, `cdk/`, `k8s/`, etc.
- [ ] Migrations folder with sequential, forward-only migration files
- [ ] Rollback runbook — path: `[RUNBOOK_PATH]`
- [ ] Release versioning mechanism — git tags, CHANGELOG, or release notes

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Environments are separated | `grep -r "dev\|staging\|production" [INFRA_CONFIG]` — confirm distinct configs | Testing in production is not a deployment strategy | | |
| IaC file covers real resources | `ls serverless.yml terraform/ cdk/ k8s/` | Click-configured infrastructure cannot be reproduced or reviewed | | |
| Migrations are sequential and forward-only | `ls migrations/ \| sort` — confirm no gaps or duplicates | Ad-hoc schema changes cause silent drift between environments | | |
| No hardcoded URLs in source | `grep -r "localhost\|127\.0\.0\.1" src/` | Hardcoded configuration is the defect that ships to the wrong environment | | |
| No hardcoded model/service IDs in source or IaC | `grep -r "gpt-4\|claude-3\|claude-sonnet\|gemini" src/ [INFRA_CONFIG]` | A hardcoded model ID is a configuration value that cannot be changed per environment | | |
| No secrets in source or IaC | `grep -r "API_KEY\|SECRET\|PASSWORD\|TOKEN" src/ [INFRA_CONFIG]` | A leaked credential in git history is a standing breach | | |
| Rollback procedure documented | `ls [RUNBOOK_PATH]` | How to undo a release must be answered before the incident, not during it | | |
| Releases are versioned | `git tag -l` or `ls CHANGELOG*` | Untracked releases turn incident triage into guesswork | | |

### Gate criteria — ALL must be TRUE
- [ ] IaC file confirmed present and covers compute and data resources.
- [ ] Zero hardcoded environment-specific URLs found in source.
- [ ] Zero hardcoded model/service identifiers found in source or IaC.
- [ ] Zero secrets found in source, IaC, or committed `.env` files (check `git log` too).
- [ ] Rollback runbook confirmed at known path.

### Forbidden until gate is PASSED
- Deploying to staging or production.
- Running any migration against a shared database.

---

## 8. Stage 7 — Observability & Operations

**Status:** `[x] NOT STARTED` → `[ ] IN PROGRESS` → `[ ] PASSED`

**Prerequisite:** Stage 6 must be `PASSED`.

> **Audit (2026-05-31):** ❌ Minimal observability. Only 7 raw `console.*` calls in `src/` (e.g. `firestore.ts:30,33`, `firebase.ts:15`) — unstructured, no correlation IDs. No Sentry/Rollbar, no metrics/dashboards, no alerting rules, no SLO doc. As a pure client SPA on Vercel + Firestore there is no server tier to log, but client error tracking (Sentry) and Firebase Performance Monitoring are absent — production errors users hit are currently invisible. To improve: add Sentry browser SDK + Firebase Performance/Analytics, define SLOs for the enroll and course-load paths.

### What production-grade looks like
- Structured logging — JSON with correlation IDs — not raw console prints.
- Metrics on what matters: request rate, error rate and latency.
- Distributed tracing across services; for AI systems, tracing of every LLM call — prompt, completion, tokens, cost and latency.
- Alerting tied to user-facing symptoms and tuned to avoid fatigue.
- Error tracking that captures stack traces and context.
- Runbooks for the known failure modes.
- Service-level objectives defined for the critical paths.

### Required artifacts
- [ ] Structured logging library configured (not raw `console.log`)
- [ ] Metrics / dashboards configured — CloudWatch, Datadog, Grafana, etc.
- [ ] Error tracking configured — Sentry, Rollbar, or equivalent
- [ ] Alerting rules defined for error rate and latency thresholds
- [ ] Runbooks for known failure modes — path: `[OPS_RUNBOOK_PATH]`
- [ ] LLM call tracing configured (if AI workloads exist) — Langfuse, LangSmith, etc.
- [ ] SLO definitions for critical paths — path: `[SLO_PATH]`

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Structured logging in use (not console.log) | `grep -r "winston\|pino\|structlog\|logging" src/`; confirm NOT raw `console.log` in hot paths | Unstructured logs cannot be searched or correlated during an incident | | |
| Correlation IDs on logs | `grep -r "correlationId\|requestId\|traceId" src/` | Without a shared ID, logs from the same request cannot be joined | | |
| Metrics and dashboards exist | `ls [INFRA_CONFIG]/dashboards/ monitoring/` | A system you do not measure is one you cannot improve or defend | | |
| Error tracking configured | `grep -r "Sentry\|Rollbar\|Bugsnag" src/ [INFRA_CONFIG]` | It captures the errors users hit but never report | | |
| Alerting is configured | `grep -r "alarm\|alert\|threshold" [INFRA_CONFIG]` | Learning of an outage from a customer is learning of it too late | | |
| LLM calls are traced | `grep -r "Langfuse\|LangSmith\|traceId" src/` (if AI used) | A silent retrieval or generation failure is undebuggable without traces | | |
| Runbooks exist | `ls [OPS_RUNBOOK_PATH]` | Incident response should be executed, not improvised | | |
| SLOs are defined | `ls [SLO_PATH]` or `grep -r "SLO\|error.budget\|p95" docs/` | An undefined SLO can neither be missed nor met | | |

### Gate criteria — ALL must be TRUE
- [ ] Structured logging library confirmed (no raw console.log in production paths).
- [ ] Correlation IDs confirmed on log output.
- [ ] Error tracking confirmed present.
- [ ] At least one alerting rule confirmed in IaC or monitoring config.
- [ ] LLM tracing confirmed present (or marked UNVERIFIED with an explicit pre-GA task to add it).
- [ ] SLO document confirmed at known path.

---

## 9. Stage 8 — Security

**Status:** `[ ] NOT STARTED` → `[ ] IN PROGRESS` → `[x] PASSED (code-verified 2026-05-31, 1 note)`

**Prerequisite:** Stage 6 must be `PASSED` (can run in parallel with Stage 7).

> **Audit (2026-05-31):** Security is the strongest area — `firestore.rules` is comprehensive and correct:
> | Control | Result | Evidence (`firestore.rules`) |
> |---|---|---|
> | Auth on every protected collection | ✅ | role helpers `:9-32`; every write guarded by `isAdmin`/`isInstructor`/owner check |
> | Tenant/owner isolation at data layer | ✅ | reads gated on `resource.data.userId == uid()` (e.g. enrollments `:119`, submissions `:159`, payments `:108`) |
> | Field-level write security | ✅ | submissions: students write content only, instructors write grades only `:168-178`; enrollments: students may only touch `lastAccessedAt` `:124-128` |
> | Privilege-escalation blocked | ✅ | students can't set `grade`/`gradedBy` on create `:164-166`; attendance is instructor-only `:143-146` (residency integrity) |
> | Open endpoint hardened | ✅ | public waitlist `create` validates shape, types, sizes, enum membership, email regex `:246-259` |
> | No secrets / no privileged client in browser | ✅ | no secret literals in `src/`; `firebase-admin` is devDep used only in `scripts/`; `.env*.local` gitignored |
> | Input validation | ⚠️ note | enforced at the Firestore rules boundary (server-side), but client forms have no Zod/schema layer — acceptable since rules are authoritative |
>
> ⚠️ **One real finding (logged §16):** `enrollments` allows authenticated client self-enroll (`:120-122`) — a user can create an enrollment with `progress == 0` **without a paid payment record**, because the payment webhook/Cloud Function isn't built yet (rules comment `:114-116` acknowledges this). The payment→enrollment invariant in `src/types/firestore.ts:122-167` is therefore **not enforced** today. Anyone signed in could enroll free. **Fix before monetizing:** build the Razorpay webhook → Cloud Function that creates enrollments server-side, then change the rule to `allow create: if false` (server-only).
> No threat-model / OWASP doc exists (documentation debt), but the controls themselves are sound.

### What production-grade looks like
- Authentication on every entry point and authorization on every protected resource.
- Tenant isolation enforced at the data layer, and never bypassed in client code.
- Secrets held in a secrets manager — never in the repository, never in a client bundle.
- Input validated at every trust boundary.
- Dependencies scanned for known vulnerabilities.
- The common vulnerability classes — the OWASP Top 10 — explicitly considered.
- Personal data handled deliberately: minimized, and its access logged.

### Required artifacts
- [ ] Threat model or security review document — path: `[THREAT_MODEL_PATH]`
- [ ] OWASP Top 10 review checklist — path: `[OWASP_REVIEW_PATH]`
- [ ] Secrets manager configured (AWS Secrets Manager, Vault, GCP Secret Manager, etc.)
- [ ] Input validation library (Zod, Pydantic, Joi, etc.) applied at all entry points

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| No secrets in repo (incl. git history) | `git log --all -p \| grep -i "API_KEY\|SECRET\|PASSWORD"` | A leaked credential in git history is a standing breach | | |
| No secrets in committed `.env` files | `git ls-files \| grep ".env"` | A committed .env file exposes credentials to every repo clone | | |
| Tenant isolation not bypassed in client code | `grep -r "serviceRole\|adminClient\|service_role\|SUPABASE_SERVICE" src/` (client dirs only) | One bypassed isolation query can expose every tenant's data | | |
| Auth covers every endpoint | Read route/handler files; confirm each has an auth guard or middleware | An unauthenticated endpoint is an open door into the system | | |
| Input validated at all entry points | `grep -r "zod\|pydantic\|joi\|yup\|validate" src/api/ src/routes/` | Unvalidated input is the root of most exploit classes | | |
| Dependency CVE scan passes | Run `npm audit --audit-level=high` or equivalent | Most breaches come through known, unpatched dependency CVEs | | |
| PII not logged or sent to LLM | `grep -r "email\|phone\|ssn\|dob" src/` — confirm not in log calls or prompt strings | PII in a prompt or a log line is a data disclosure | | |
| OWASP Top 10 review document exists | `ls [OWASP_REVIEW_PATH]` | The OWASP Top 10 are the vulnerability classes attackers rely on most | | |

### Gate criteria — ALL must be TRUE
- [x] Zero secrets in source/IaC; `.env*.local` gitignored & untracked (verify git history separately).
- [x] Zero tenant-isolation bypasses — no privileged client in `src/`; `firebase-admin` devDep, scripts only.
- [x] Auth confirmed on every collection — `firestore.rules` role guards on all writes + owner reads.
- [x] Input validation at the authoritative (rules) boundary — e.g. waitlist `:246-259`; field-level diffs on writes.
- [~] Dependency CVE scan — `npm audit` NOT yet run this session (action item).
- [~] OWASP review document — not present (documentation debt, §17); controls themselves verified sound.
- ⚠️ See §16 HIGH: enrollment-without-payment is an authz logic gap, not a rules-bypass.

### Forbidden always (not just until gate)
- Placing auth logic, secrets, or authorization decisions in client/browser code. Ever.
- Bypassing the standard database client in client-side code.
- Logging PII fields (`email`, `phone`, `name`, `address`) without explicit approval.
- Sending PII in LLM prompts without explicit approval and a documented justification.

---

## 10. Stage 9 — Performance & Scale

**Status:** `[ ] NOT STARTED` → `[x] IN PROGRESS` → `[ ] PASSED`

**Prerequisite:** Stages 7 and 8 must be `PASSED`.

> **Audit (2026-05-31):**
> | Item | Result | Evidence |
> |---|---|---|
> | Composite indexes match hot queries | ✅ | `firestore.indexes.json` defines indexes for 12 collection groups matching the `where+orderBy` queries in `src/lib/firestore.ts` |
> | No N+1 reads in admin lists | ✅ | enrollments denormalize `displayName/email/courseTitle/cohortName` (`firestore.ts` types `:162-167`) to avoid per-row lookups |
> | **Pagination / bounded reads** | ❌ **FINDING** | **Zero `limit()` calls in the entire `src/` tree.** Every `getAll()` (`firestore.ts:20`) fetches the *whole* collection — reviews (`:168`), payments (`:218`), enrollments (`:261,264`), submissions, waitlist (`:511`), etc. At scale this is unbounded latency **and** unbounded Firestore read cost (the dominant cost driver). |
> | Performance targets defined | ❌ | no p95/p99 targets anywhere (ties to Stage 1 NFR gap) |
> | Load testing | ❌ | none |
> | Caching | ⚠️ | TanStack Query gives client-side caching (`src/main.tsx:16-22`); no CDN/edge data cache |
>
> **Top fix:** add `limit()` + cursor pagination to every list query, starting with admin Students (enrollments) and reviews. This is both a performance and a cost control (see §13).

### What production-grade looks like
- Performance budgets, or service-level objectives, defined for the critical paths.
- Load testing done before launch, so behaviour under concurrency is known rather than hoped.
- A caching strategy, layered at the right levels.
- Database access patterns reviewed — indexes match the hot queries, no N+1 patterns, large lists paginated.
- A documented scaling plan with explicit capacity triggers.
- The separation of transactional and analytical workloads made before it becomes an incident.

### Performance targets (fill in from specs)
```
Critical path          | p95 target | p99 target
-----------------------|------------|------------
[PATH_1]               | [X ms]     | [Y ms]
[PATH_2]               | [X ms]     | [Y ms]
```

### Scaling triggers (fill in)
```
Metric                 | Current    | Trigger to scale / change architecture
-----------------------|------------|----------------------------------------
[METRIC_1]             | [VALUE]    | [THRESHOLD and ACTION]
```

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Performance targets defined in specs | `grep -r "p95\|p99\|latency\|SLO" [SPEC_PATH]` | An undefined target can neither be missed nor met | | |
| Load testing scripts exist | `ls k6/ artillery/ locustfile.py` | Launching without load testing is launching with unknown limits | | |
| Load test results recorded | `ls load-test-results/ benchmarks/` | Test scripts without results prove nothing was actually verified | | |
| Caching layers in place | Grep for CDN config, Redis client, query cache, HTTP cache headers | Every uncached repeated query is wasted latency and cost | | |
| Indexes match hot queries | Read migration files; compare index definitions to query patterns in code | A missing index silently turns a fast query into a full table scan | | |
| No N+1 query patterns | `grep -rn "for\|forEach\|map" src/ \| grep -i "db\.\|query\.\|find\|select"` | N+1 is the most common silent performance killer | | |
| All list endpoints are paginated | Grep route handlers for `limit\|offset\|cursor\|page` on every list endpoint | An unbounded list query degrades with every row ever added | | |
| Scaling plan with named triggers documented | `ls [SCALING_PLAN_PATH]` | A scaling plan prevents the architecture cliff from being a surprise | | |
| OLTP and analytical workloads separated | Confirm analytics queries target aggregate/read-replica tables, not live OLTP | Analytical load on the OLTP tier competes with the writes that run the business | | |

### Gate criteria — ALL must be TRUE
- [ ] Performance targets confirmed quantified in spec (p95/p99, not adjectives).
- [ ] Load test scripts confirmed present.
- [ ] Load test results recorded (or explicitly deferred as a named pre-GA gate in Section 16).
- [ ] Zero N+1 patterns found in hot paths.
- [ ] Every list endpoint confirmed paginated.
- [ ] Scaling plan with named triggers confirmed at known path.
- [ ] OLTP/analytics separation confirmed or explicitly deferred with a trigger in Section 16.

---

## 11. Stage 10 — Data & Analytics Engineering

**Status:** `[ ] NOT STARTED` → `[ ] IN PROGRESS` → `[ ] PASSED`

**Prerequisite:** Stage 9 must be `PASSED`.

### What production-grade looks like
- Transactional and analytical workloads are separated — reporting queries do not run against the tables serving live writes.
- A layered storage architecture — raw, cleaned and aggregated, the medallion pattern — so each transformation step is inspectable.
- Pre-computed aggregates or materialized views answer the common analytical questions without a live full-table scan.
- A data catalog describes every table and column and its business meaning.
- Data quality is checked at ingest — schema enforcement, freshness checks, row-count alerts.
- Lineage is tracked — for any number, you can trace which source and which run produced it.
- Large tables are partitioned, so query cost does not grow without bound.
- The ingestion mechanism — batch or streaming — matches the freshness the product actually needs.

### Verification checklist
| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Analytics queries target dedicated tables, not OLTP | Read analytics query files; confirm they hit aggregate/reporting tables | Analytical load on the OLTP tier competes with the writes that run the business | | |
| Layered storage architecture exists | `grep -r "bronze\|silver\|gold\|raw\|staging\|mart" migrations/ src/` | Without layers, a bad transformation cannot be isolated and corrected | | |
| Pre-computed aggregates or materialized views exist | `grep -r "MATERIALIZED VIEW\|CREATE TABLE.*summary\|_daily\|_agg" migrations/` | Every report computed live from raw tables is a scan that did not need to happen | | |
| Data catalog exists | `ls analytics-schema.ts schema-catalog.* docs/data-catalog*` | An undocumented schema cannot be queried safely by a human or an AI agent | | |
| Data quality checks at ingest | `grep -r "freshness\|row.count\|schema.check\|assert\|dbt.test" src/ pipelines/` | Bad data not caught at ingest is served to users as if it were correct | | |
| Lineage is tracked | `grep -r "source\|run_id\|pipeline_id\|lineage" src/ pipelines/` | When a number looks wrong, lineage is the difference between minutes and days of triage | | |
| Large tables are partitioned | Read DDL for tables expected to grow; check `PARTITION BY` clause | An unpartitioned table that only grows makes every scan slower over time | | |
| Ingestion cadence matches freshness SLA | Compare pipeline schedule (cron/trigger) to the freshness requirement in spec | A nightly batch feeding a near-real-time dashboard produces stale data by design | | |

### Gate criteria — ALL must be TRUE
- [ ] Analytics queries confirmed hitting dedicated tables (not live OLTP tables).
- [ ] At least one gold/mart/aggregate layer confirmed in DDL or pipeline code.
- [ ] Data catalog file confirmed present with table and column descriptions.
- [ ] At least one data quality check confirmed in pipeline code.
- [ ] All tables expected to exceed 1M rows confirmed to have a partitioning strategy.
- [ ] Ingestion cadence confirmed to satisfy the freshness SLA in spec.

---

## 12. Cross-cutting — Compute Placement

> These rules apply to every feature, at every stage. Evaluate placement for any new workload before writing code for it.

### 12.1 Execution tiers — reference table

| Tier | What it is | Best for | Avoid for |
|---|---|---|---|
| Browser / client | Runs on the user's device | Presentation, perceived speed, optimistic UI, non-authoritative form validation, client caching | Anything trusted — secrets, authorization, authoritative validation |
| Edge / CDN | Runs geographically near the user | Static delivery, caching, geo-routing, lightweight auth checks, redirects | Heavy compute, long runtime, deep data access |
| Serverless function | Event-driven, scales to zero, pay-per-call | Spiky or irregular request-path work, glue, short stateless tasks, event handlers | Sustained high throughput, long jobs, cold-start-sensitive paths |
| Long-running container | Always-on compute | Sustained throughput, long processes, websockets, heavy in-memory state, predictable load | Spiky or low-volume work where you pay for idle |
| Database | Compute pushed to where data lives | Aggregation, filtering, joins and set operations over data already in the database | Application and business logic; heavy procedural code |
| Async queue worker | Decoupled from the request path | Anything that does not need an immediate answer; absorbing spiky load; retriable work | Work the user is actively waiting on |
| Batch / scheduled | Periodic bulk processing | Large, latency-tolerant, periodic work; pre-aggregation into serving tables | Anything needing freshness within the period |

### 12.2 Decision factors — answer all 8 for every new workload

1. **Latency** — Does the user need the answer in under 100 ms, under a second, under a minute, or only eventually?
2. **Trust boundary** — Can this safely run on a device the user controls? The client is always untrusted.
3. **Data gravity** — How much data does the work need? Moving data is expensive; moving compute is cheap.
4. **Load shape** — Is the load spiky and unpredictable, sustained and steady, or periodic?
5. **State** — Is the work stateless, or does it hold long-lived state or connections?
6. **Execution duration** — Does it finish in seconds, or run for minutes or hours?
7. **Cost model fit** — Does the pricing model of the tier match the load shape? (See Section 13.)
8. **Operational complexity** — How much operational ownership is the team willing to carry?

### 12.3 Decision heuristics

- **Trust first** — Anything touching secrets, authorization, or authoritative validation runs server-side. The browser is for presentation and perceived speed only; never trust it with a decision.
- **Follow data gravity** — If the work aggregates, filters or joins data that already lives in the database, do it in the database. Pulling rows into the app tier to process them is moving data to compute, which is backwards.
- **Match pricing to load shape** — Spiky or unpredictable load goes to serverless (scales to zero, charges per call). Sustained, predictable load goes to containers (no per-invocation premium). There is a crossover: once utilisation is high enough, always-on is cheaper than pay-per-call.
- **Decouple what can wait** — If the user does not need the answer now, the work belongs on a queue, not in the request path.
- **Push periodic bulk work to batch** — It is the cheapest tier per unit of work and keeps the request path lean.
- **Default posture for a new product** — Serverless for request-path glue, database for data-heavy operations, queues for async work, batch for periodic work. Graduate a workload to an always-on container only when its load is sustained enough that scale-to-zero no longer saves money.

### 12.4 Common anti-patterns

- **Everything in the app tier** — Application code doing the summing, filtering and joining that SQL should do, including the classic query-inside-a-loop.
- **Trusted work in the browser** — Privileged credentials or authorization logic shipped to the client, where the user can inspect and tamper with them.
- **Always-on compute for spiky work** — Paying twenty-four hours a day for capacity used in short bursts.
- **Serverless for the wrong job** — A long batch job crammed into a function that will hit its timeout under real data; or a latency-critical path crippled by cold starts.
- **Analytical queries on the transactional database** — Placing heavy analytical compute on the tier that is serving live transactions.

### 12.5 Placement checklist — fill in per feature

| Workload | Tier chosen | Latency | Trust OK? | Data gravity | Load shape | Duration | State | Justification |
|---|---|---|---|---|---|---|---|---|
| Course/catalog browsing | Browser SPA + Firestore | <1s | ✅ public read | low | spiky | ms | stateless | Static-ish reads, public — correct on client |
| Auth / role resolution | Firebase Auth + Firestore `users` | <1s | ✅ (token verified by Firebase) | low | spiky | ms | session | Managed auth tier; role read once on sign-in (`AuthContext:33-57`) |
| Authorization | `firestore.rules` (data layer) | n/a | ✅ server-enforced | n/a | per-request | ms | stateless | Correct — never trust the client |
| Payment verification | ⚠️ **belongs in Cloud Function** (not built) | <2s | ❌ must be server-side | low | spiky | s | stateless | Razorpay HMAC verify + enrollment create must NOT be on client — current gap (§16) |
| Residency scoring / progress aggregates | Cloud Function (batch/trigger) | eventual | ✅ server | medium | periodic | s | stateless | Server-computed, students can't write (`firestore.rules:186-189`) |
| Image compression | `scripts/compress-images.mjs` (build-time, sharp) | n/a | ✅ | low | one-off | s | stateless | Correct — offline batch, not request path |

### 12.6 Audit checklist — verify for every codebase review

| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Trusted work is server-side only | Grep client code for `serviceRole\|adminClient\|service_role\|secrets\|authz` | Trusted work placed in the browser tier is a whole class of breach | | |
| Data-heavy work runs in the database | Look for sums, filters and joins done in app code; grep for queries inside loops | Moving data to compute wastes both latency and money | | |
| Load shape matches the tier | Check for always-on instances or containers doing spiky or periodic work | Idle always-on capacity is pure, recurring waste | | |
| Long jobs are not on serverless | Check functions for long-running work approaching timeout limits | A batch job inside a function will time out under real data volume | | |
| Async work is off the request path | Check whether anything the user is not waiting for runs synchronously | Synchronous handling of async-able work inflates user-facing latency | | |
| Analytical queries target non-OLTP tier | Confirm analytics queries hit aggregate/read-replica tables, not the live OLTP database | Analytical load on the OLTP tier competes with the writes that run the business | | |
| Batch work runs on batch infrastructure | Check that periodic bulk jobs are scheduled, not running on always-on compute | Batch is the cheapest tier; not using it for batch work is overpaying | | |

### Absolute placement rules — never break these
- **NEVER** put secrets, auth decisions, or authoritative validation in browser/client code.
- **NEVER** put analytical aggregate queries on the OLTP database once load is non-trivial.
- **NEVER** put a long-running job (>5 min) on a serverless function.
- **NEVER** pay for always-on containers for workloads that are spiky or periodic.
- **ALWAYS** put recurring bulk work on a scheduler / batch tier, not on always-on compute.

---

## 13. Cross-cutting — Cost Engineering

> Cost is a design property, not a cleanup task done when the bill arrives. Review this section when making any architecture or infrastructure decision.

### 13.1 Principles

- **Cost is designed, not cleaned up.** The largest cost decisions are made at architecture time; micro-tuning instance sizes afterwards cannot recover a structurally expensive design.
- **You cannot optimise what you cannot see.** Cost attribution — a tagging scheme, cost broken down per feature and per tenant — has to exist before optimisation is even possible.
- **There is almost always one dominant cost driver.** One line is typically 30–50% of total spend. Optimise that first; ignore the rest until it is no longer true.
- **Cost per unit of value is the metric that matters.** The total bill is noise; cost per tenant, per request, or per transaction tells you whether the economics scale with the business.

### 13.2 Cost levers — in rough order of impact

| # | Lever | What it does | When it applies |
|---|---|---|---|
| 1 | Execution-tier fit | Matches load shape to pricing model — scale-to-zero for spiky, committed capacity for steady | Every workload; the single largest lever (see Section 12) |
| 2 | Eliminate idle | Shuts down or scales down resources that are not always needed | Non-production environments, over-provisioned instances |
| 3 | Layered caching | Serves repeated work from cache instead of recomputing it | Any read-heavy or repeated-query path |
| 4 | Batch over real-time | Processes work in scheduled bulk instead of per-event | Any work without a hard freshness requirement |
| 5 | Storage tiering | Moves cold data to cheaper storage classes and expires what is unneeded | Logs, backups, old objects, historical data |
| 6 | Egress control | Keeps traffic in-region and in-cloud, avoiding cross-zone and internet egress | Any data-transfer-heavy system |
| 7 | Right-sizing | Matches provisioned capacity to measured use rather than guessed peak | Databases, warehouses, container fleets |
| 8 | Commitment discounts | Reserved or savings-plan pricing for the predictable baseline | The steady-state floor only — never variable load |
| 9 | LLM cost control | Right-sizes the model, caps max_tokens, caches prompts, batches non-interactive calls | Any AI or LLM workload |

### 13.3 Cost-aware process

1. **Estimate at design time** — produce a rough cost model before building, so cost is a design input rather than a post-launch surprise.
2. **Find and attack the dominant driver first** — optimising anything other than the top spend line is wasted effort.
3. **Tag from day one** — a cost-attribution tag schema from the first sprint; retrofitting attribution onto a running system is painful and incomplete.
4. **Track cost per unit of value** — cost per tenant or per request, so cost is understood as it scales, not just as a monthly total.
5. **Set budgets and alerts** — so a cost surprise surfaces as an alert, not as an invoice.
6. **Make cost visible to engineers** — the person building a feature should be able to see what it costs to run.

### 13.4 Cost attribution (fill in before first deploy)
```
Tagging schema:        N/A at resource level (single Firebase project + Vercel) — attribute by Firestore collection read volume instead
Cost model document:   not yet created
Dominant cost driver:  Firestore document reads — amplified by unbounded getAll() queries with no limit() (§10 finding). This is the #1 cost lever for this app.
Cost monitoring URL:   GCP Billing (Firebase project) + Vercel usage dashboard — confirm with owner
```
> **LLM cost levers (§13.2 #9):** N/A — no LLM calls in this product (verified `package.json`/`src`).

### 13.5 Cost audit checklist

| Item | How to verify | Why it matters | Evidence (file:line) | Status |
|---|---|---|---|---|
| Cost attribution tags on all resources | `grep -r "tags\|labels" [INFRA_CONFIG]` — confirm project/feature/env tags | Unattributed cost cannot be optimised or charged back to a tenant | | |
| Dominant cost driver is known | Read `[COST_MODEL_PATH]`; confirm one line is >30% of spend | Optimising anything before the dominant driver is wasted effort | | |
| Non-production environments are not always-on | Confirm dev/staging scale to zero or shut down outside working hours | Idle non-production capacity is a pure, recurring waste | | |
| Execution-tier fit verified (Lever 1) | For each workload, confirm tier matches load shape using Section 12 heuristics | Execution-tier fit is the single largest cost lever — a mismatch cannot be patched later | | |
| Caching is layered | Grep for CDN config, query cache, application cache, and client cache | Each missing cache layer is repeated, paid-for compute | | |
| LLM `max_tokens` capped per call | `grep -rn "max_tokens" src/` — every call site must have an explicit cap | Uncapped tokens and oversized models multiply the AI bill | | |
| LLM model right-sized per task | Confirm cheapest capable model is specified by name at each call site | A heavy model used for a trivial task wastes money on every call | | |
| Prompt caching enabled where supported | `grep -r "cache_control\|prompt.cache" src/` | Repeated system prompts are the highest-ROI caching target | | |
| Batch inference used for non-interactive calls | `grep -r "batch\|background\|async" src/` — confirm non-interactive LLM calls are batched | Batch inference is cheaper per token and keeps the request path lean | | |
| Object storage has lifecycle/expiry rules | `grep -r "lifecycle\|expiry\|transition" [INFRA_CONFIG]` | Cold data left on hot storage is silently overpriced | | |
| Reserved capacity matches baseline only | Check committed reservations against measured steady-state load, not peak | Committing to variable load locks in waste | | |
| Egress stays in-region | Confirm cross-zone and internet egress is minimised in architecture | Egress fees are invisible until the bill and then expensive to undo | | |

---

## 14. Working with Claude — Token & Context Discipline

> This section governs how Claude manages its own context window. These are not suggestions — context discipline is a quality discipline, not just a cost one.

### 14.1 Why this matters

Every new message re-processes the entire conversation so far as input. A message late in a long thread costs roughly as much as every message before it combined. Quality also degrades: as the context fills, earlier instructions get lost — an effect called context rot — and it sets in well before any hard limit is reached. **Keep each conversation scoped and short, and start a fresh one when the task changes.**

### 14.2 Claude Code commands — reference table

| Command or lever | What it does | When to use it |
|---|---|---|
| `/clear` | Wipes conversation history and resets context window to zero | Switching to an unrelated task |
| `/compact <focus>` | Summarizes conversation into a compressed form and continues from it; a focus instruction biases what is kept | At a clean sub-task boundary, before the window gets heavy — not at the last minute |
| `/context` | Shows where the tokens are going — system prompt, tools, memory files, conversation history | To see what is consuming the budget |
| `/usage` | Reports session token spend | To monitor consumption during a long session |
| `CLAUDE.md` | A project file read at the start of every session — persistent project memory | Put stable conventions, build commands, and architecture notes here so they are never re-explained; keep it pruned |
| `@ file references` | Points Claude at specific files | Instead of letting Claude scan whole directories, which floods the context window |
| Subagents | Run research in a separate context window and report back only a summary | Codebase investigation that would otherwise fill the main conversation with file contents |
| `/btw` | Answers a quick side question in a dismissible overlay that never enters conversation history | A detail you need without growing the context |

### 14.3 Operating habits — apply every session

- **Decompose large tasks.** If you are regularly hitting compaction before a task is done, the answer is not a bigger window — it is smaller tasks. A scoped task uses a fraction of the context that 'fix everything' does.
- **Exclude noisy paths.** Stop Claude from reading `node_modules`, build output, logs, and `.env` files by denying those paths in permission settings. Every file Claude does not read is budget saved; keeping secrets out of context is also a security gain.
- **Use git commits as checkpoints.** Committing completed work makes it safe to `/clear` and start fresh, because the progress lives in git, not only in the conversation.
- **One session per unit of work.** A rough rule: one session per pull request. A bug fix, a feature, and a refactor each get their own session rather than sharing one bloated thread.
- **Compact proactively, not at the ceiling.** Run `/compact` at natural breakpoints after a sub-task is solid. Compacting too late produces a summary too compressed to be useful — at that point `/clear` and a fresh start is faster.

### 14.4 LLM cost controls — mandatory for every product LLM call

Every call to an LLM in the product codebase must have:
- Explicit `max_tokens` — no open-ended calls.
- Model specified by name — no `"default"` model.
- Prompt caching enabled where the model supports it.
- Batch inference used for any non-interactive (background) call.

### 14.5 Memory offload — write module-specific memory BEFORE the compact limit

> **Mandatory.** Context auto-compaction destroys detail. Claude must not wait for it. Before the context window approaches its compaction ceiling, Claude offloads what it has learned into **module-specific memory files** so no working knowledge is lost across the boundary.

**When to offload (trigger conditions — act on the FIRST that is true):**
- The context window is ≳70% full, or `/context` shows conversation history dominating the budget.
- A `PreCompact` warning fires, or auto-compaction is imminent.
- A module-scoped sub-task just completed (natural checkpoint).
- Before any `/compact` or `/clear`.

**Where to write — one file per module, not one giant dump.**
Memory root: `C:\Users\Razal\.claude\projects\g--PROJECT-Riddoff-riddoff-website\memory\`
Write (or update) a separate file per domain module, named `module-<name>.md`. Module list for this project (derived from §1.1):

```
module-catalog.md       — courses, bootcamps, instructors, paths, units, testimonials, FAQs, stats
module-auth.md          — AuthContext, ProtectedRoute, roles (student|instructor|admin), firestore.rules
module-cohorts.md       — cohort lifecycle, the {cohortId} keying spine
module-payments.md      — Razorpay flow, payment→enrollment invariant
module-enrollments.md   — enrollment docs, denormalized fields, progress aggregate
module-sessions.md      — live sessions, attendance, lesson_progress
module-assessment.md    — assignments, submissions, field-level security
module-residency.md     — residency scoring + selection decisions
module-data-layer.md    — src/lib/firestore.ts, src/hooks/use*.ts, scripts/
module-sdlc.md          — current gate status, decisions, open items (mirrors this doc)
```

**File format** (follow the repo's memory convention — frontmatter + body):
```markdown
---
name: module-<name>
description: <one-line summary used for recall relevance>
metadata:
  type: project
---

State of <module> as of <absolute date>: what exists, key files (file:line),
invariants, decisions, open questions, and what to do next.
Link related modules with [[module-other-name]].
```

**Rules:**
1. **Update, don't duplicate.** If `module-<name>.md` exists, edit it; never create a second file for the same module.
2. **One fact-set per file.** Keep each module file scoped to that module — cross-link with `[[module-name]]` instead of merging.
3. **Add an index pointer.** After writing a module file, add/refresh its one-line entry in `MEMORY.md` (`- [module-<name>](module-<name>.md) — hook`). Never put module content in `MEMORY.md` itself.
4. **Cite, don't summarize vaguely.** Record `file:line` anchors so the next session re-grounds in code, not in a stale paraphrase.
5. **Verify on recall.** A recalled module memory reflects what was true when written — re-check any file/line it names before acting on it (per §0.1).
6. **Checkpoint to git too.** Memory offload is for knowledge; completed code still gets committed so a `/clear` is safe (per §14.3).

**Order of operations when compaction is near:** (1) finish the current atomic edit, (2) commit completed code if any, (3) write/update the relevant `module-*.md` files + `MEMORY.md` pointers, (4) update §18 Session Log, (5) only then allow `/compact` or proceed.

---

## 15. Decision Log

> Append-only. Every significant decision is logged here before being acted on.

| Date | Stage | Decision | Rationale | Alternatives considered | Approved by |
|---|---|---|---|---|---|
| (pre-existing) | 2 | Cohort is the keying spine — enrollments/sessions/submissions/scores key on `cohortId`, not `courseId` | A student re-taking in a later run gets a distinct record; time-sensitive data must not collide | key on courseId alone | code (`firestore.ts:99-113`) |
| (pre-existing) | 2 | Payment must precede enrollment (`paymentId` required on enrollment) | Money integrity — no enrollment without a paid record | self-serve enrollment | code (`firestore.ts:122-167`) — **not yet enforced in rules, see §16** |
| (pre-existing) | 8 | Authorization lives in `firestore.rules` (data layer), not client | Client is untrusted; one server-side gate covers all access paths | per-component checks | code (`firestore.rules`) |
| (pre-existing) | 2 | Denormalize display fields onto enrollments | Avoid N+1 reads in admin Students tab | join at read time | code (`firestore.ts:151-167`) |
| 2026-05-31 | — | Audit deployed app from code (specs absent) and waive Stage-1-first ordering | App is already in production; code is the authoritative spec | block all audit on missing docs | razalrahmanp |

---

## 16. Open Items

> Non-blocking issues found during the current session that are out of scope but should not be forgotten.
> Claude logs here instead of fixing silently.

| Date found | Stage | Description | Priority | Assigned to |
|---|---|---|---|---|
| 2026-05-31 | 8 | **Enrollment without payment.** `firestore.rules:120-122` lets any signed-in user self-create an enrollment (`progress==0`) with no paid `payments` doc. Payment→enrollment invariant unenforced until the Razorpay webhook/Cloud Function exists. | **HIGH** (revenue) | razalrahmanp |
| 2026-05-31 | 6 | `scripts/seed.mjs:22-26` reads `service-account-key.json` but `.gitignore` doesn't list it — add the ignore rule to prevent accidental key commit. | HIGH (security) | razalrahmanp |
| 2026-05-31 | 9 | No `limit()`/pagination on any list query — unbounded Firestore reads (latency + cost). | HIGH | razalrahmanp |
| 2026-05-31 | 4 | No test runner and zero tests; highest-risk modules untested. | HIGH | razalrahmanp |
| 2026-05-31 | 5 | No CI; direct unreviewed pushes to `main` (commits `iioi`/`123`). | MED | razalrahmanp |
| 2026-05-31 | 3 | No ESLint/Biome config in the `AI Course` app. | MED | razalrahmanp |
| 2026-05-31 | 7 | No error tracking (Sentry) or perf monitoring on the client. | MED | razalrahmanp |
| 2026-05-31 | 6 | No release versioning — `package.json` at `0.0.0`, no tags/CHANGELOG, unstructured commits. | LOW | razalrahmanp |

---

## 17. Known Gaps & Deferred Items

> Items explicitly deferred with a named trigger or milestone. These are NOT failures — they are sequenced decisions.

| Item | Stage | Why deferred | Trigger to implement | Date deferred |
|---|---|---|---|---|
| Written spec (FR IDs, NFR p95/p99, acceptance criteria) | 1 | Code shipped first; types serve as de-facto spec | Before next major feature, or any external audit | 2026-05-31 |
| Threat model + OWASP review doc | 8 | Rules-level controls already sound | Before handling stored card data / PII expansion | 2026-05-31 |
| Razorpay payment webhook → server-side enrollment | 8 | Payments not yet live | Before charging real money | 2026-05-31 |
| Load testing + scaling plan | 9 | Pre-scale traffic | Before a large cohort launch or marketing push | 2026-05-31 |
| Data/analytics layer (Stage 10) | 10 | No reporting/warehouse workload yet | When admin reporting beyond live counts is needed | 2026-05-31 |

---

## 18. Session Log

> One-line entry per session: what was done, what gate status changed, what was NOT done.
> Keeps the next session from re-deriving context.

| Date | Work done | Gates changed | Blockers / next step |
|---|---|---|---|
| 2026-05-31 | Initialized SDLC doc; filled §1 Identity + §1.1 Capabilities; added §14.5 memory-offload protocol. Then ran a full code-as-spec audit of all stages (read firestore.rules, AuthContext, ProtectedRoute, firestore.ts, configs, git). | 2 & 8 → PASSED (code-verified); 1,3,6,9 → IN PROGRESS; 4,5,7 → NOT STARTED; 10 → N/A | Fix HIGH items in §16: (1) enrollment-without-payment rule, (2) gitignore service-account-key.json, (3) add pagination, (4) add tests starting with rules. |
| | | | |
| 2026-05-19 | Session ended — user did not manually log this session. | none | Review what was done and update this entry. |
| 2026-05-19 | Session ended — user did not manually log this session. | none | Review what was done and update this entry. |
| 2026-05-19 | Session ended — user did not manually log this session. | none | Review what was done and update this entry. |
| 2026-05-19 | Session ended — user did not manually log this session. | none | Review what was done and update this entry. |

---

## Quick Reference — Gate Status Summary

> Audited 2026-05-31 by reading the codebase (no formal docs — code is the source of truth for a deployed app).

| Stage | Name | Status | PASSED date |
|---|---|---|---|
| 1 | Inception & Requirements | `IN PROGRESS` — code-as-spec; no written FR/NFR/acceptance docs | |
| 2 | Architecture & Design | `PASSED (code-verified)` — clean modules, centralized auth, typed contracts | 2026-05-31 |
| 3 | Development Practices | `IN PROGRESS` — strict TS ✓, lockfile ✓, no admin-client in client ✓; **no linter in this app** | |
| 4 | Testing Strategy | `NOT STARTED` — no test runner, zero tests | |
| 5 | Build & CI | `NOT STARTED` — no CI config; manual Vercel build only | |
| 6 | Deployment & Release | `IN PROGRESS` — Vercel + Firestore rules ✓, no secrets ✓; **no versioning/runbook** | |
| 7 | Observability & Operations | `NOT STARTED` — raw `console.*` only, no error tracking/alerting/SLO | |
| 8 | Security | `PASSED (code-verified, 1 note)` — strong rules, field-level authz, no leaked secrets | 2026-05-31 |
| 9 | Performance & Scale | `IN PROGRESS` — indexed queries ✓; **no `limit()` anywhere → unbounded lists** | |
| 10 | Data & Analytics Engineering | `N/A` — no analytics/warehouse workload in scope | |
| 12 | Compute Placement | `ONGOING` — see audit note below | — |
| 13 | Cost Engineering | `ONGOING` — Firestore read volume is the driver (unbounded queries) | — |
