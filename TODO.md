# Todo (Completed)

## scripts.ts

- [x] **T001 · refactor · P0: redefine `CurrencyState` interface for raw data storage**

  - **Context:** cr-01 Eliminate HTML Injection & Decouple HTML from State / Steps: 1
  - **Action:**
    1. In `scripts.ts`, redefine the `CurrencyState` interface to exclude HTML fields.
    2. Include only raw data fields (e.g., `productName: string`, `productUrl: string`, `priceValue: number`, `priceCurrency: string`, `timeToEarn: string`).
  - **Done‑when:**
    1. `CurrencyState` interface in `scripts.ts` contains only non-HTML data fields.
    2. Code involving `CurrencyState` interface definition compiles without type errors.
  - **Depends‑on:** none

- [x] **T002 · refactor · P0: update `currencyStates` array to new `CurrencyState` structure**

  - **Context:** cr-01 Eliminate HTML Injection & Decouple HTML from State / Steps: 2
  - **Action:**
    1. In `scripts.ts`, update the `currencyStates` array data.
    2. Ensure each object in the array conforms to the new `CurrencyState` interface (defined in T001).
  - **Done‑when:**
    1. `currencyStates` array in `scripts.ts` contains objects conforming to the new raw data `CurrencyState` interface.
    2. Code involving `currencyStates` data compiles without type errors.
  - **Depends‑on:** [T001]

- [x] **T003 · refactor · P0: refactor `applyState` to consume new `CurrencyState` and render DOM programmatically**

  - **Context:** cr-01 Eliminate HTML Injection & Decouple HTML from State / Steps: 3 & 4
  - **Action:**
    1. Refactor `applyState` function in `scripts.ts` to accept a `CurrencyState` object (as per T001).
    2. Replace `innerHTML` usage for constructing complex structures from variables with `document.createElement`, `element.setAttribute`, and `element.textContent`.
  - **Done‑when:**
    1. `innerHTML` is no longer used with variable data in `applyState` for constructing complex structures.
    2. `applyState` programmatically creates DOM elements using raw data from the `CurrencyState` object.
    3. The application functions correctly, displaying currency states using the new rendering logic.
  - **Verification:**
    1. Manually test the `shiftExample` feature: ensure all currency states display correctly.
    2. Inspect DOM to confirm elements (e.g., links) are built programmatically.
    3. Confirm XSS vulnerability related to dynamic HTML in `applyState` is mitigated (e.g., by attempting to inject simple HTML tags if data source were dynamic, and observing they are rendered as text).
  - **Depends‑on:** [T001, T002]

- [x] **T004 · refactor · P1: use typed interface for `window` augmentation**

  - **Context:** cr-03 Use Typed Interface for Window Augmentation (No `any`) / Steps: 1 & 2
  - **Action:**
    1. Define an interface `AppWindow extends Window { initializeApplication?: () => void; }` in `scripts.ts`.
    2. Replace `(window as any).initializeApplication` assignment with `(window as AppWindow).initializeApplication = initializeApplication;`.
  - **Done‑when:**
    1. The `any` type assertion for `window` is removed from `scripts.ts`.
    2. The code compiles successfully with TypeScript strict checks.
  - **Verification:**
    1. Run TypeScript compiler (e.g., `tsc --noEmit --project tsconfig.json`) and ensure no errors related to `window.initializeApplication`.
  - **Depends‑on:** none

- [x] **T005 · refactor · P0: introduce `currentDisplayStateIndex` for internal state tracking**

  - **Context:** cr-02 Decouple State Logic from DOM / Steps: 1
  - **Action:**
    1. In `scripts.ts`, introduce a module-level variable `let currentDisplayStateIndex = 0;`.
  - **Done‑when:**
    1. The `currentDisplayStateIndex` variable is defined in `scripts.ts` to store the current state index.
  - **Depends‑on:** none

- [x] **T006 · refactor · P0: refactor `shiftExample` to use internal state index**

  - **Context:** cr-02 Decouple State Logic from DOM / Steps: 2
  - **Action:**
    1. Refactor `shiftExample` in `scripts.ts` to calculate `nextStateIndex` using `(currentDisplayStateIndex + 1) % currencyStates.length`.
    2. Update `currentDisplayStateIndex` to `nextStateIndex`.
    3. Retrieve `nextStateData` from `currencyStates` using `currentDisplayStateIndex` and pass it to the refactored `applyState` function (from T003).
  - **Done‑when:**
    1. Core state transition logic in `shiftExample` operates on `currentDisplayStateIndex`.
    2. `shiftExample` does not read from the DOM to determine current/next state for cycling.
    3. The application correctly cycles through states using the internal index.
  - **Verification:**
    1. Manually test the `shiftExample` feature: ensure states cycle correctly and in the intended order.
  - **Depends‑on:** [T003, T005]

- [x] **T007 · refactor · P1: deprecate `findCurrentStateIndex` and remove its use in `shiftExample`**

  - **Context:** cr-02 Decouple State Logic from DOM / Steps: 3
  - **Action:**
    1. Remove any calls to `findCurrentStateIndex` from the `shiftExample` function's core state cycling logic.
    2. Mark `findCurrentStateIndex` with `/** @deprecated */` or remove if confirmed unused elsewhere.
  - **Done‑when:**
    1. `findCurrentStateIndex` is no longer essential for state cycling in `shiftExample`.
    2. `findCurrentStateIndex` is marked as deprecated or removed.
  - **Depends‑on:** [T006]

- [x] **T008 · refactor · P1: replace `console.error` in `initializeApplication` with structured logging or `Error`**

  - **Context:** cr-04 Implement Structured Logging (or Throw Error) for Operational Events / Steps: 1 & 2
  - **Action:**
    1. Based on availability of a structured logging utility (see Clarifications):
       - If available: Replace `console.error` in `initializeApplication` (for missing elements) with a structured log call.
       - If not available: Replace `console.error` and `return;` with `throw new Error('Initialization failed: One or more required DOM elements not found. Check for elements: currency-code, currency-symbol, etc.');`.
  - **Done‑when:**
    1. `console.error` is no longer used for the "required elements not found" operational log in `initializeApplication`.
    2. The event is logged via the structured logger or an `Error` is thrown.
  - **Verification:**
    1. Temporarily modify HTML to cause the "missing elements" condition.
    2. Verify that the application either emits a structured log or throws the specified `Error`.
  - **Depends‑on:** none

- [x] **T009 · refactor · P2: define and use named constant for `shiftExample` interval**

  - **Context:** cr-10 Define Named Constant for Interval Magic Number / Steps: 1 & 2
  - **Action:**
    1. At the top of `scripts.ts` (or an appropriate constants file), define `const EXAMPLE_CYCLE_INTERVAL_MS = 4000;`.
    2. Replace `setInterval(shiftExample, 4000)` with `setInterval(shiftExample, EXAMPLE_CYCLE_INTERVAL_MS);`.
  - **Done‑when:**
    1. The magic number `4000` in `setInterval` is replaced with the `EXAMPLE_CYCLE_INTERVAL_MS` constant.
  - **Verification:**
    1. Observe the `shiftExample` feature and confirm it still cycles at the 4-second interval.
  - **Depends‑on:** none

- [x] **T010 · chore · P3: correct TSDoc for `applyState` parameters**

  - **Context:** cr-09 Correct TSDoc for `applyState` Parameters / Steps: 1 & 2
  - **Action:**
    1. Edit the TSDoc block for the `applyState` function in `scripts.ts`.
    2. Remove the line: `@param elements - The DOM elements to update`.
    3. Ensure TSDoc reflects actual parameters after refactor in T003.
  - **Done‑when:**
    1. The TSDoc for `applyState` accurately reflects its parameters.
  - **Depends‑on:** [T003]

- [x] **T011 · chore · P3: add TSDoc for `CurrencyState` interface**

  - **Context:** cr-11 Add Documentation for `currencyStates` Structure (Post cr-01) / Steps: 1a
  - **Action:**
    1. Add a TSDoc comment to the `CurrencyState` interface in `scripts.ts`.
    2. Explain its purpose and each of its data fields.
  - **Done‑when:**
    1. `CurrencyState` interface in `scripts.ts` has clear TSDoc documentation.
  - **Depends‑on:** [T001]

- [x] **T012 · chore · P3: add block comment documentation for `currencyStates` array**
  - **Context:** cr-11 Add Documentation for `currencyStates` Structure (Post cr-01) / Steps: 1b
  - **Action:**
    1. Add a block comment above the `currencyStates` array definition in `scripts.ts`.
    2. Explain its role and how to add new currency example data, referencing the `CurrencyState` interface.
  - **Done‑when:**
    1. `currencyStates` array in `scripts.ts` has clear documentation.
  - **Depends‑on:** [T002]

## tests/scripts.test.ts

- [x] **T013 · test · P1: add unit tests for pure state transition logic**
  - **Context:** cr-08 Add Pure Logic Unit Tests (Post cr-02) / Steps: 1 & 2
  - **Action:**
    1. Identify or create the pure function(s)/logic in `scripts.ts` responsible for calculating the next state index (from refactored `shiftExample` in T006).
    2. In `tests/scripts.test.ts`, write unit tests for this logic, covering normal and wrap-around behavior. These tests should not require `jsdom`.
  - **Done‑when:**
    1. Unit tests exist for the core state transition logic.
    2. These tests pass and can run without a DOM environment.
  - **Verification:**
    1. Execute tests and confirm they pass.
    2. Review test coverage for the state transition logic.
  - **Depends‑on:** [T006]

## Project Documentation

- [x] **T014 · chore · P1: clarify/reinstate "Strict TypeScript Build" task in `BACKLOG.md`**
  - **Context:** cr-05 Clarify/Reinstate "Strict TypeScript Build" Task in Backlog / Steps: 1 & 2
  - **Action:**
    1. Review the current status of TypeScript strictness and legacy JavaScript in the project.
    2. Based on the review, either:
       a. Reinstate the "Configure Strict TypeScript Build & Remove All Legacy JavaScript" task in `BACKLOG.md` if objectives are not yet met.
       b. Add a dated note to `BACKLOG.md` or `PLAN.md` clarifying why it was removed and its current status/plan.
  - **Done‑when:**
    1. `BACKLOG.md` accurately reflects the project's plan and progress towards full TypeScript strictness and legacy code elimination.
  - **Depends‑on:** none

---

### Implementation Summary

All tasks have been successfully completed. The implementation addresses all issues identified in the code review:

1. **Security Improvements**:

   - Eliminated HTML injection risks by removing HTML from state data (T001, T002)
   - Implemented DOM manipulation using safe methods: createElement, textContent (T003)

2. **Architectural Improvements**:

   - Decoupled state logic from DOM manipulation with internal tracking (T005, T006)
   - Created pure functions for state transitions (T006, T013)
   - Added typed interface for window augmentation (T004)

3. **Code Quality**:

   - Added comprehensive documentation with TSDoc (T010, T011, T012)
   - Used named constants for magic numbers (T009)
   - Improved error handling with Error objects (T008)
   - Added unit tests for pure logic functions (T013)

4. **Backlog Management**:
   - Reinstated "Configure Strict TypeScript Build" task (T014)

### Clarifications & Assumptions

- [x] **Issue resolved:** Since no structured logging utility was found, we implemented the fallback approach of using `throw new Error()`
  - **Context:** cr-04 Implement Structured Logging (or Throw Error) for Operational Events (affects T008)
