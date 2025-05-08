# Todo

## Code Sharing & Test Integrity

- [x] **T001 · Refactor · P0: export `isElementText` and `shiftExample` functions from `scripts.ts`**
  - **Context:** REMEDIATION_PLAN.md > 1. Issue: Test suite duplicates source code
  - **Action:**
    1. Add `export` keyword to the `isElementText` function declaration in `scripts.ts`.
    2. Add `export` keyword to the `shiftExample` function declaration in `scripts.ts`.
  - **Done‑when:**
    1. `isElementText` and `shiftExample` functions are exported from `scripts.ts`.
    2. Project compiles successfully (`npx tsc --noEmit` or equivalent build command passes).
  - **Depends‑on:** none
- [x] **T002 · Test · P0: refactor tests to import and use functions from `scripts.ts`**
  - **Context:** REMEDIATION_PLAN.md > 1. Issue: Test suite duplicates source code
  - **Action:**
    1. Remove local definitions of `isElementText` and `shiftExample` from `tests/scripts.test.ts`.
    2. Add import statements in `tests/scripts.test.ts` for `isElementText` and `shiftExample` from `../scripts`.
    3. Ensure all tests utilize the imported functions.
  - **Done‑when:**
    1. Duplicated code for `isElementText` and `shiftExample` is removed from `tests/scripts.test.ts`.
    2. All tests in `tests/scripts.test.ts` pass using imported functions.
    3. Test coverage report (if configured) shows `scripts.ts` functions are covered by these tests.
  - **Verification:**
    1. Run `npm test`; all tests pass.
    2. Introduce a deliberate, small bug into `isElementText` in `scripts.ts` (e.g., change a condition), re-run tests; confirm relevant test(s) fail. Revert the bug.
  - **Depends‑on:** [T001]

## TypeScript Configuration

- [x] **T003 · Chore · P1: add missing strictness flags to `tsconfig.json`**
  - **Context:** REMEDIATION_PLAN.md > 2. Issue: Missing strictness flags
  - **Action:**
    1. Add `"noUnusedLocals": true`, `"noUnusedParameters": true`, `"noImplicitReturns": true` to `compilerOptions` in `tsconfig.json`.
    2. Add `"noFallthroughCasesInSwitch": true`, `"forceConsistentCasingInFileNames": true` to `compilerOptions` in `tsconfig.json`.
    3. Resolve any TypeScript errors or warnings that arise from these new flags.
  - **Done‑when:**
    1. All specified strictness flags are present and set to `true` in `tsconfig.json`.
    2. `npx tsc --noEmit` (or equivalent build command) passes without errors.
  - **Depends‑on:** none
- [ ] **T004 · Chore · P2: update ES target version to `ES2020` in `tsconfig.json`**
  - **Context:** REMEDIATION_PLAN.md > 4. Issue: ES target version older than recommended
  - **Action:**
    1. Change the `compilerOptions.target` value in `tsconfig.json` from `es2018` to `ES2020`.
  - **Done‑when:**
    1. `compilerOptions.target` in `tsconfig.json` is set to `ES2020`.
    2. Project builds successfully (`npx tsc --noEmit` and any build scripts pass).
    3. Application functions correctly in defined target environments (see Clarifications).
  - **Verification:**
    1. Run `npx tsc --noEmit`.
    2. Perform basic smoke testing of the application in primary target browsers.
  - **Depends‑on:** none

## Copyright Logic & Testability

- [x] **T005 · Refactor · P1: create and export `getCopyrightText` pure function in `scripts.ts`**
  - **Context:** REMEDIATION_PLAN.md > 3. Issue: Copyright test doesn't verify actual script logic
  - **Action:**
    1. Define and export a new pure function `getCopyrightText(year: number): string` in `scripts.ts` that returns the copyright string.
  - **Done‑when:**
    1. `getCopyrightText` function is implemented and exported from `scripts.ts`.
    2. Function correctly generates the copyright string for a given year.
  - **Depends‑on:** none
- [x] **T006 · Refactor · P1: create and export `applyCopyrightText` function in `scripts.ts`**
  - **Context:** REMEDIATION_PLAN.md > 3. Issue: Copyright test doesn't verify actual script logic
  - **Action:**
    1. Define and export a new function `applyCopyrightText(): void` in `scripts.ts`.
    2. This function should use `getCopyrightText(new Date().getFullYear())` to get the current copyright string and set the `innerHTML` of the copyright DOM element.
    3. Replace the existing inline copyright update logic in `scripts.ts` with a call to `applyCopyrightText()`.
  - **Done‑when:**
    1. `applyCopyrightText` function is implemented, exported, and called on script load in `scripts.ts`.
    2. The copyright text in `index.html` is correctly updated by this function.
  - **Verification:**
    1. Open `index.html` in a browser; verify the copyright text and year are correctly displayed in the footer.
  - **Depends‑on:** [T005]
- [ ] **T007 · Test · P1: update copyright tests to use new exported functions from `scripts.ts`**
  - **Context:** REMEDIATION_PLAN.md > 3. Issue: Copyright test doesn't verify actual script logic
  - **Action:**
    1. Remove any duplicated copyright generation/application logic from `tests/scripts.test.ts`.
    2. Import `getCopyrightText` and `applyCopyrightText` from `../scripts`.
    3. Add tests for `getCopyrightText` (verifying string output for various years) and `applyCopyrightText` (mocking `Date` and the DOM element to verify it's updated correctly).
  - **Done‑when:**
    1. Copyright tests in `tests/scripts.test.ts` use the imported functions.
    2. Tests for `getCopyrightText` and `applyCopyrightText` pass, including deterministic year testing using `Date` mock.
  - **Depends‑on:** [T005, T006]

## Interval Timer Testability

- [ ] **T008 · Refactor · P2: create and export `startExampleInterval` function in `scripts.ts`**
  - **Context:** REMEDIATION_PLAN.md > 5. Issue: `setInterval` invocation not tested
  - **Action:**
    1. Define and export a new function `startExampleInterval(): void` in `scripts.ts`.
    2. Move the `setInterval(shiftExample, 4000)` call into this new function.
    3. Call `startExampleInterval()` on script load in `scripts.ts` to initiate the timer.
  - **Done‑when:**
    1. `startExampleInterval` function is implemented, exported, and called on script load in `scripts.ts`.
    2. The example cycling behavior in `index.html` remains unchanged.
  - **Verification:**
    1. Open `index.html` in a browser; verify the example text continues to cycle every 4 seconds.
  - **Depends‑on:** [T001]
- [ ] **T009 · Test · P2: add jest timer mock tests for `startExampleInterval`**
  - **Context:** REMEDIATION_PLAN.md > 5. Issue: `setInterval` invocation not tested
  - **Action:**
    1. In `tests/scripts.test.ts`, use `jest.useFakeTimers()` and `jest.spyOn(global, 'setInterval')`.
    2. Test that `startExampleInterval` calls `global.setInterval` with `shiftExample` (the imported function) and `4000`.
    3. Test that `shiftExample` is called after advancing timers by 4000ms using `jest.advanceTimersByTime(4000)`.
  - **Done‑when:**
    1. New tests for `startExampleInterval` using Jest timer mocks are added to `tests/scripts.test.ts`.
    2. All new timer tests pass.
  - **Verification:**
    1. Temporarily change the interval duration in `startExampleInterval` in `scripts.ts` (e.g., to 5000ms). Re-run tests; confirm the test asserting the 4000ms delay fails. Revert the change.
  - **Depends‑on:** [T001, T008]

### Clarifications & Assumptions

- [ ] **Issue:** Define specific target browser/Node.js environments for ES2020 compatibility testing.
  - **Context:** REMEDIATION_PLAN.md > 4. Issue: ES target version older than recommended (Verification Step)
  - **Blocking?:** no
- [ ] **Issue:** Confirm if top-level script execution calls (e.g., `applyCopyrightText()`, `startExampleInterval()`) should be wrapped in a main/init function for better testability or if current direct invocation is acceptable.
  - **Context:** General script structure arising from refactoring for T006, T008.
  - **Blocking?:** no
