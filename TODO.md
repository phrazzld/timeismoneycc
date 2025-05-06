# TODO: Configure Strict TypeScript Build & Remove Legacy JavaScript

This document outlines the detailed task breakdown for implementing the "Configure Strict TypeScript Build & Remove All Legacy JavaScript" enhancement described in `PLAN.md`. Tasks are structured with clear dependencies and verification steps.

## Core Scripts TypeScript Migration

- [x] **T001 · Feature · P0: Configure strict TypeScript in `tsconfig.json`**

  - **Context:** PLAN.md > Detailed Build Steps > 2
  - **Action:**
    1. Modify `tsconfig.json` to set `"strict": true`.
    2. Ensure all specified strictness-related compiler options are enabled.
    3. Verify `"target"`, `"module"`, `"moduleResolution"`, `"outDir": "dist"`, and appropriate directory configuration.
  - **Done‑when:**
    1. `tsconfig.json` is updated with all required strictness options.
    2. `tsc --noEmit` (or `npm run typecheck`) completes without configuration errors.
  - **Depends‑on:** none

- [x] **T002 · Refactor · P0: Refactor `scripts.ts` for full type safety and strictness compliance**

  - **Context:** PLAN.md > Detailed Build Steps > 3; PLAN.md > Error & Edge‑Case Strategy
  - **Action:**
    1. Add explicit types for all variables, function parameters, and return values.
    2. Replace any `any` types with specific types or `unknown`.
    3. Implement robust `null` checks for all DOM element retrievals.
  - **Done‑when:**
    1. `scripts.ts` fully complies with the strict TypeScript settings.
    2. `npm run typecheck` passes without type errors.
    3. No `any` types remain in `scripts.ts` unless explicitly justified.
  - **Depends‑on:** [T001]

- [x] **T003 · Refactor · P1: Resolve all ESLint errors and warnings in `scripts.ts`**

  - **Context:** PLAN.md > Detailed Build Steps > 4
  - **Action:**
    1. Run `npm run lint` (and `npm run lint:fix` if available) on `scripts.ts`.
    2. Manually address all remaining ESLint issues.
  - **Done‑when:**
    1. `npm run lint` passes without any errors or warnings.
  - **Depends‑on:** [T002]

- [x] **T004 · Chore · P1: Update `package.json` scripts for TypeScript workflow**

  - **Context:** PLAN.md > Detailed Build Steps > 5
  - **Action:**
    1. Review and update scripts in `package.json` (e.g., `build`, `lint`, `typecheck`, `test`).
    2. Ensure scripts correctly reference `scripts.ts` and `dist/scripts.js`.
    3. Remove any references to the legacy `scripts.js` or `tests/scripts.test.js`.
  - **Done‑when:**
    1. `package.json` scripts are updated and functional for the TypeScript workflow.
  - **Depends‑on:** [T001]

- [ ] **T005 · Test · P0: Adapt and enhance `tests/scripts.test.ts` for strict TypeScript and edge cases**

  - **Context:** PLAN.md > Detailed Build Steps > 6; PLAN.md > Testing Strategy
  - **Action:**
    1. Refactor `tests/scripts.test.ts` to comply with strict TypeScript rules.
    2. Add/enhance tests covering edge cases (missing DOM elements, animation states, helper function logic).
    3. Utilize Jest's timer/date mocks for deterministic testing.
  - **Done‑when:**
    1. `tests/scripts.test.ts` is fully compliant with strict TypeScript.
    2. Test suite provides meaningful coverage for core logic and edge cases.
  - **Depends‑on:** [T002]

- [ ] **T006 · Test · P1: Ensure all tests pass in `tests/scripts.test.ts`**

  - **Context:** PLAN.md > Detailed Build Steps > 6
  - **Action:**
    1. Run `npm test`.
    2. Debug and fix any test failures.
  - **Done‑when:**
    1. `npm test` completes successfully with 0 failures.
    2. Test coverage meets or exceeds the existing project threshold.
  - **Depends‑on:** [T005]

- [ ] **T007 · Chore · P2: Remove legacy JavaScript test file `tests/scripts.test.js`**

  - **Context:** PLAN.md > Detailed Build Steps > 7
  - **Action:**
    1. Delete the `tests/scripts.test.js` file.
  - **Done‑when:**
    1. `tests/scripts.test.js` is deleted.
    2. `npm test` still runs correctly using only `tests/scripts.test.ts`.
  - **Depends‑on:** [T006]

- [ ] **T008 · Chore · P1: Build `scripts.ts` to `dist/scripts.js`**

  - **Context:** PLAN.md > Detailed Build Steps > 8
  - **Action:**
    1. Run `npm run build`.
  - **Done‑when:**
    1. The build process completes successfully.
    2. `dist/scripts.js` is generated from `scripts.ts`.
  - **Depends‑on:** [T003, T004]

- [ ] **T009 · Refactor · P1: Update `index.html` to reference compiled `dist/scripts.js`**

  - **Context:** PLAN.md > Detailed Build Steps > 9
  - **Action:**
    1. Modify the `<script>` tag in `index.html` to reference `dist/scripts.js`.
  - **Done‑when:**
    1. The `<script>` tag in `index.html` correctly references `dist/scripts.js`.
  - **Verification:**
    1. Open `index.html` in a browser.
    2. Verify `dist/scripts.js` is loaded (no 404 errors).
    3. Check the browser console for any script loading errors.
  - **Depends‑on:** [T008]

- [ ] **T010 · Chore · P2: Remove legacy `scripts.js` source file from project root**

  - **Context:** PLAN.md > Detailed Build Steps > 10
  - **Action:**
    1. Delete the `scripts.js` file from the project root.
  - **Done‑when:**
    1. The legacy `scripts.js` file is deleted.
    2. The application still builds and runs correctly.
  - **Depends‑on:** [T009]

- [ ] **T011 · Test · P0: Perform manual end-to-end verification of UI functionality**

  - **Context:** PLAN.md > Detailed Build Steps > 11; PLAN.md > Risk Matrix
  - **Action:**
    1. Load `index.html` in supported web browsers.
    2. Verify the currency/income example animation cycles correctly.
    3. Verify the copyright year is displayed correctly.
    4. Check the browser's developer console for any errors or warnings.
  - **Done‑when:**
    1. All UI functionalities are working correctly with `dist/scripts.js`.
    2. No functional regressions or new console errors are observed.
  - **Verification:**
    1. Observe the example animation for at least 3 full cycles.
    2. Confirm the copyright year matches the current year.
    3. Test error handling for edge cases if possible.
  - **Depends‑on:** [T009]

- [ ] **T012 · Chore · P2: Update `README.md` to reflect TypeScript-only build and usage**
  - **Context:** PLAN.md > Detailed Build Steps > 12
  - **Action:**
    1. Review `README.md` for any mentions of the legacy `scripts.js`.
    2. Update documentation to reflect the TypeScript-first workflow.
  - **Done‑when:**
    1. `README.md` accurately describes the current TypeScript-based project structure and workflow.
  - **Depends‑on:** [T010, T011]
