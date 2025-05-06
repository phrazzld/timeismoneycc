# Todo

## CI Pipeline Setup

- [x] **T001 · Chore · P1: create ci workflow file**
  - **Context:** PLAN.md - Step 1: Create GitHub Actions Workflow File
  - **Action:**
    1. Create the `.github/workflows/` directory.
    2. Create the `ci.yml` file within the directory.
  - **Done‑when:**
    1. `ci.yml` file exists in the specified path.
  - **Depends‑on:** none
- [x] **T002 · Chore · P1: configure ci workflow triggers**
  - **Context:** PLAN.md - Step 1: Create GitHub Actions Workflow File
  - **Action:**
    1. Define the workflow `name`.
    2. Configure `on` triggers for pull requests targeting `main` and pushes to `main` in `ci.yml`.
  - **Done‑when:**
    1. Workflow triggers execute on pull request creation/update to `main`.
    2. Workflow triggers execute on push to `main`.
  - **Verification:**
    1. Open a draft PR targeting `main` -> Verify workflow run starts.
    2. Push a commit to `main` (if direct pushes allowed) -> Verify workflow run starts.
  - **Depends‑on:** [T001]
- [x] **T003 · Chore · P1: configure node.js setup in ci workflow**
  - **Context:** PLAN.md - Step 2: Setup Job Configuration
  - **Action:**
    1. Define a basic job structure (e.g., `build-and-test`) within `ci.yml` running on `ubuntu-latest`.
    2. Add steps to checkout code (`actions/checkout@v4`).
    3. Add step to set up Node.js using `actions/setup-node@v4` with the latest LTS version.
  - **Done‑when:**
    1. CI job successfully checks out code and sets up the specified Node.js LTS version.
  - **Verification:**
    1. Check CI logs confirm the correct Node.js version is installed.
  - **Depends‑on:** [T002]
- [x] **T004 · Chore · P1: configure dependency caching in ci workflow**
  - **Context:** PLAN.md - Step 2: Setup Job Configuration; Risk: Pipeline too slow
  - **Action:**
    1. Add caching step using `actions/cache@v4` for npm dependencies (`~/.npm`) keyed by `package-lock.json`.
    2. Place caching step _before_ the dependency installation step.
  - **Done‑when:**
    1. CI logs indicate cache hit or miss for npm dependencies.
    2. Subsequent runs with unchanged `package-lock.json` show faster dependency setup due to cache hit.
  - **Depends‑on:** [T003]
- [x] **T005 · Chore · P1: add dependency installation step in ci workflow**
  - **Context:** PLAN.md - Step 2: Setup Job Configuration
  - **Action:**
    1. Add step to install dependencies using `npm ci`.
  - **Done‑when:**
    1. CI job successfully installs dependencies using `npm ci`.
  - **Verification:**
    1. Check CI logs confirm `npm ci` completed without errors.
  - **Depends‑on:** [T004]

## Quality Gates

- [x] **T006 · Test · P1: add linting step to ci workflow**
  - **Context:** PLAN.md - Step 3: Implement Linting Job
  - **Action:**
    1. Add step to run `npm run lint`.
    2. Add step to run `npm run format:check`.
    3. Ensure the job fails if either script exits with a non-zero code.
  - **Done‑when:**
    1. CI job runs ESLint and Prettier checks.
    2. CI job fails correctly if linting or formatting errors are present.
  - **Verification:**
    1. Introduce a temporary lint/format error -> Verify CI job fails.
    2. Fix the error -> Verify CI job passes.
  - **Depends‑on:** [T005]
- [x] **T007 · Test · P1: add typescript type checking step to ci workflow**
  - **Context:** PLAN.md - Step 4: Implement TypeScript Check Job
  - **Action:**
    1. Add step to run `npm run typecheck`.
    2. Ensure the job fails if `tsc` reports type errors.
  - **Done‑when:**
    1. CI job runs TypeScript compiler check (`tsc --noEmit`).
    2. CI job fails correctly if type errors are found.
  - **Verification:**
    1. Introduce a temporary type error -> Verify CI job fails.
    2. Fix the error -> Verify CI job passes.
  - **Depends‑on:** [T005]
- [x] **T008 · Chore · P2: assess current test coverage**
  - **Context:** PLAN.md - Risk: Test coverage thresholds too high for legacy code; Step 5: Configure Jest coverage thresholds
  - **Action:**
    1. Run `npm test -- --coverage` locally or in a test CI run.
    2. Analyze the generated coverage report to determine current overall coverage percentage (lines).
    3. Document the current coverage percentage in the commit or PR for T009.
  - **Done‑when:**
    1. Current overall line coverage percentage is determined and documented.
  - **Depends‑on:** [T005]
- [x] **T009 · Chore · P1: configure initial jest coverage thresholds**
  - **Context:** PLAN.md - Step 5: Configure Jest coverage thresholds; Risk: Test coverage thresholds too high for legacy code
  - **Action:**
    1. Update `jest.config.js` `coverageThreshold.global.lines` (or other appropriate metrics) to a realistic initial value (e.g., current coverage determined in T008, or minimum 85% if current coverage allows).
    2. Document the rationale for the chosen initial threshold.
  - **Done‑when:**
    1. `jest.config.js` is updated with an initial, achievable global coverage threshold.
  - **Depends‑on:** [T008]
- [x] **T010 · Test · P1: add jest testing step with coverage enforcement to ci workflow**
  - **Context:** PLAN.md - Step 5: Implement Testing Job
  - **Action:**
    1. Add step to run `npm test -- --coverage`.
    2. Ensure the step fails if Jest tests fail OR if coverage drops below the threshold defined in `jest.config.js`.
  - **Done‑when:**
    1. CI job runs Jest tests and checks coverage against configured thresholds.
    2. CI job fails correctly if any tests fail or coverage thresholds are not met.
  - **Verification:**
    1. Introduce a temporary failing test -> Verify CI job fails.
    2. Temporarily lower coverage below threshold -> Verify CI job fails.
    3. Fix issues -> Verify CI job passes.
  - **Depends‑on:** [T005, T009]
- [x] **T011 · Chore · P2: upload jest coverage report artifact**
  - **Context:** PLAN.md - Step 5: Implement Testing Job (Upload report)
  - **Action:**
    1. Add a step after the test run using `actions/upload-artifact@v4`.
    2. Configure it to upload the coverage report directory (e.g., `./coverage/`).
    3. Name the artifact clearly (e.g., `coverage-report`).
  - **Done‑when:**
    1. Coverage report is successfully uploaded as a workflow artifact after the test step completes.
  - **Verification:**
    1. Check the completed workflow run page in GitHub Actions for the downloadable `coverage-report` artifact.
  - **Depends‑on:** [T010]
- [x] **T012 · Test · P1: add security scanning step to ci workflow**
  - **Context:** PLAN.md - Step 6: Implement Security Scanning Job
  - **Action:**
    1. Add step to run `npm audit --audit-level=high`.
    2. Ensure the step fails if `npm audit` finds high or critical vulnerabilities.
  - **Done‑when:**
    1. CI job runs npm audit check.
    2. CI job fails correctly if high or critical vulnerabilities are detected.
  - **Verification:**
    1. Temporarily add a known vulnerable dependency (if feasible/safe) -> Verify CI job fails.
    2. Remove dependency -> Verify CI job passes.
  - **Depends‑on:** [T005]

## Workflow Optimization & Verification

- [x] **T013 · Refactor · P2: configure ci jobs for parallel execution**
  - **Context:** PLAN.md - Risk: CI pipeline too slow; Implied by separate jobs in plan steps.
  - **Action:**
    1. Refactor `ci.yml` to define `lint`, `typecheck`, `test`, and `security` as separate jobs instead of steps within a single job.
    2. Ensure each job includes the necessary setup steps (checkout, Node.js setup, caching, install dependencies - potentially using a matrix or reusable workflow later).
    3. Ensure jobs run in parallel by default (no explicit `needs` dependency between them).
  - **Done‑when:**
    1. Lint, typecheck, test, and security checks run as independent, parallel jobs in the CI workflow.
    2. Overall CI execution time is potentially reduced compared to sequential steps.
  - **Verification:**
    1. Review the workflow visualization in GitHub Actions; confirm jobs run concurrently.
    2. Compare run time to previous sequential runs (if available).
  - **Depends‑on:** [T006, T007, T010, T012]
- [x] **T014 · Chore · P1: verify ci workflow permissions and end-to-end execution**
  - **Context:** PLAN.md - Step 7: Verify Workflow Functionality; Risk: CI workflow permissions issues
  - **Action:**
    1. Ensure the `ci.yml` workflow has appropriate minimal `permissions` set (e.g., `contents: read`, `pull-requests: read`, `actions: read`). Adjust if artifact upload/checks require more.
    2. Create a test branch and open a draft PR targeting `main` with code passing all quality gates.
    3. Verify the complete CI workflow triggers and all parallel jobs complete successfully.
  - **Done‑when:**
    1. Workflow permissions are explicitly defined in `ci.yml`.
    2. Workflow triggers and runs successfully with all parallel jobs passing on a clean PR.
  - **Depends‑on:** [T013]
- [x] **T015 · Test · P1: test ci failure modes and merge blocking**
  - **Context:** PLAN.md - Step 7: Verify Workflow Functionality; Testing Strategy; Success Criteria
  - **Action:**
    1. On a test PR, introduce separate commits each causing a failure in one gate: lint error, type error, failing test, coverage drop, high-severity dependency (if feasible).
    2. For each commit, verify the corresponding CI job fails and the PR status check indicates failure, blocking merge (assuming branch protection rules are/will be active).
    3. Fix all errors in a final commit and verify all CI jobs pass and the PR is mergeable.
  - **Done‑when:**
    1. All quality gates (lint, typecheck, test failure, coverage, security) are confirmed to correctly fail the CI run when issues are present.
    2. Failing CI runs correctly block PR merges (requires branch protection rule setup - see Clarification).
  - **Verification:**
    1. Open test PR.
    2. Push commit with lint error -> Check CI fails on lint job, PR blocked.
    3. Push commit with type error -> Check CI fails on typecheck job, PR blocked.
    4. Push commit with failing test -> Check CI fails on test job, PR blocked.
    5. Push commit reducing coverage -> Check CI fails on test job, PR blocked.
    6. Push commit with high-sev dependency (if feasible) -> Check CI fails on security job, PR blocked.
    7. Push fixes -> Check CI passes, PR mergeable.
  - **Depends‑on:** [T014]
- [x] **T016 · Chore · P2: document ci workflow in readme**
  - **Context:** PLAN.md - Success Criteria #4
  - **Action:**
    1. Add a section to `README.md` explaining the CI pipeline.
    2. Describe the quality gates enforced (lint, types, tests, coverage, security).
    3. Briefly mention how to troubleshoot common failures.
  - **Done‑when:**
    1. `README.md` contains a clear and concise description of the CI workflow and its checks.
  - **Depends‑on:** [T015]

## Clarifications & Assumptions

- [x] **Issue:** Assumption: Existing npm scripts (`lint`, `format:check`, `typecheck`, `test`) function correctly locally.
  - **Context:** PLAN.md - Steps 3, 4, 5 require these scripts.
  - **Blocking?:** no (But CI job failures related to script execution will need investigation).
  - **Clarification:** The required npm scripts exist in package.json and should function correctly locally. However, note that the `lint` script (`eslint scripts.ts`) has a narrow scope, only targeting `scripts.ts`. It does not cover the legacy `scripts.js` or other potential source files. Consider using a broader script (like the existing `lint:all`) in the CI pipeline for more comprehensive checks as the codebase grows. The `typecheck` script and `format:check` script have appropriate scope.
- [x] **Issue:** Assumption: `jest.config.js` exists and is configured for basic test execution and coverage report generation (XML or lcov).
  - **Context:** PLAN.md - Step 5 requires Jest and coverage. T009/T010 modify it.
  - **Blocking?:** no (But T008/T009/T010 would fail if not present/functional).
  - **Clarification:** `jest.config.js` is properly configured for basic test execution and lcov coverage reporting. However, there are two critical limitations: 1) `collectCoverageFrom: ['scripts.{js,ts}']` is highly restrictive, only measuring coverage for these two specific files. As the codebase is refactored, this pattern must be updated to accurately reflect coverage. 2) The configuration currently lacks coverage thresholds, which will need to be added in T009.
- [x] **Issue:** Plan mentions a 95% coverage target for "core logic" but doesn't define it; Jest global thresholds are simpler initially.
  - **Context:** PLAN.md - Step 5: Configure Jest coverage thresholds.
  - **Blocking?:** no (T009 implements global threshold; core logic can be future enhancement).
  - **Clarification:** Starting with a simpler global threshold is the recommended approach. The current code structure mixes UI interaction and logic, making it difficult to define "core logic" paths before refactoring. Set an initial global threshold in `jest.config.js`, potentially based on the current actual coverage level to prevent immediate failures. Once the "Isolate Core Logic" refactor is completed, update the configuration to add higher path-specific thresholds for core modules.
- [x] **Issue:** Verification step T015 assumes branch protection rules are configured to require status checks to pass before merging.
  - **Context:** PLAN.md - Success Criteria #2 (Workflow blocks merges).
  - **Blocking?:** no (But the "blocking" aspect cannot be fully verified without branch protection rules).
  - **Clarification:** Branch protection rules must be configured manually in the GitHub repository settings to ensure failing CI checks block merges. This requires: 1) Navigating to the repository's Settings > Branches page, 2) Adding or editing a rule for the main branch, 3) Enabling "Require status checks to pass before merging", 4) Selecting the exact names of the mandatory jobs defined in the CI workflow file, 5) Optionally enabling "Require branches to be up to date before merging", and 6) Saving the rule. This must be done after the CI workflow is operational.
