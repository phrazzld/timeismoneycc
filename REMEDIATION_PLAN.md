# Remediation Plan – Sprint 1

## Executive Summary

This plan outlines the critical remediation steps to address severe security vulnerabilities, architectural flaws, and coding standard violations identified in the `shiftExample` refactoring. We prioritize eliminating the XSS risk from HTML injection, then decoupling core state logic from the DOM to enhance testability and maintainability. Quick wins on TypeScript standards and backlog clarity will also be actioned to align with our Development Philosophy.

## Strike List

| Seq | CR‑ID | Title                                                                | Effort | Owner    |
| --- | ----- | -------------------------------------------------------------------- | ------ | -------- |
| 1   | cr‑01 | Eliminate HTML Injection & Decouple HTML from State                  | m      | Frontend |
| 2   | cr‑03 | Use Typed Interface for Window Augmentation (No `any`)               | xs     | Frontend |
| 3   | cr‑05 | Clarify/Reinstate "Strict TypeScript Build" Task in Backlog          | xs     | Lead/PM  |
| 4   | cr‑02 | Decouple State Logic from DOM (Addresses cr‑06, cr‑07)               | m      | Frontend |
| 5   | cr‑04 | Implement Structured Logging (or Throw Error) for Operational Events | s      | Frontend |
| 6   | cr‑08 | Add Pure Logic Unit Tests (Post cr‑02)                               | s      | Frontend |
| 7   | cr‑10 | Define Named Constant for Interval Magic Number                      | xs     | Frontend |
| 8   | cr‑09 | Correct TSDoc for `applyState` Parameters                            | xs     | Frontend |
| 9   | cr‑11 | Add Documentation for `currencyStates` Structure (Post cr‑01)        | xs     | Frontend |

## Detailed Remedies

### cr‑01 Eliminate HTML Injection & Decouple HTML from State

- **Problem:** `CurrencyState` stores raw HTML strings, and `applyState` uses `innerHTML` to render them, creating a direct XSS vulnerability and tightly coupling data with presentation.
- **Impact:** Severe security risk (XSS if data becomes dynamic), difficult maintenance, and prevents reusability of state logic.
- **Chosen Fix:** Refactor `CurrencyState` to store only raw data (e.g., `productName`, `productUrl`, `priceValue`). Modify `applyState` (or a new rendering function) to programmatically create DOM elements using `document.createElement`, `element.setAttribute`, and `element.textContent`, avoiding `innerHTML` for constructing complex structures from variables.
- **Steps:**
  1. Redefine the `CurrencyState` interface in `scripts.ts` to exclude HTML fields and include only raw data fields (e.g., `productName: string`, `productUrl: string`, `priceValue: number`, `priceCurrency: string`, `timeToEarn: string`).
  2. Update the `currencyStates` array in `scripts.ts` to conform to the new `CurrencyState` data structure.
  3. Refactor the `applyState` function in `scripts.ts` to accept the new `CurrencyState` data object.
  4. Inside `applyState`, use `document.createElement`, `element.setAttribute`, and `element.textContent` to build and update the necessary DOM elements. For links, create `<a>` elements and set their `href` and `textContent` properties.
- **Done‑When:** `innerHTML` is no longer used with variable data in `applyState`. `CurrencyState` contains only non-HTML data. The application functions correctly with the new rendering logic. XSS vulnerability related to `exampleProductHTML` and `examplePriceHTML` is confirmed mitigated.

### cr‑03 Use Typed Interface for Window Augmentation (No `any`)

- **Problem:** `(window as any).initializeApplication` violates the "any is FORBIDDEN" TypeScript standard.
- **Impact:** Bypasses TypeScript's type safety, potentially hiding type errors and reducing code clarity.
- **Chosen Fix:** Define a specific interface for the augmented `window` object and use a type assertion to that interface.
- **Steps:**
  1. Define an interface `AppWindow extends Window { initializeApplication?: () => void; }` in `scripts.ts`.
  2. Replace the `(window as any).initializeApplication` assignment with `(window as AppWindow).initializeApplication = initializeApplication;`.
- **Done‑When:** The `any` type assertion for `window` is removed. The code compiles successfully with TypeScript strict checks.

### cr‑05 Clarify/Reinstate "Strict TypeScript Build" Task in Backlog

- **Problem:** The removal of the "Configure Strict TypeScript Build & Remove All Legacy JavaScript" task from `BACKLOG.md` without explicit justification creates ambiguity.
- **Impact:** Obscures the project's commitment to full TypeScript strictness and legacy code elimination, violating Documentation Approach.
- **Chosen Fix:** Reinstate the backlog item or add a clear, dated note in `BACKLOG.md` or `PLAN.md` explaining the removal and current status/plan.
- **Steps:**
  1. Review the current status of TypeScript strictness and legacy JavaScript in the project.
  2. Based on the review, either:
     a. Reinstate the task in `BACKLOG.md` if objectives are not yet met.
     b. Add a dated note to `BACKLOG.md` or `PLAN.md` clarifying why it was removed (e.g., "Completed via PR #XYZ", "Superseded by tasks A, B, C", "Deferred due to Z, new ETA YYYY-MM-DD"). Include the current plan if it's still pending.
- **Done‑When:** `BACKLOG.md` accurately reflects the project's plan and progress towards full TypeScript strictness and legacy code elimination.

### cr‑02 Decouple State Logic from DOM (Addresses cr‑06, cr‑07)

- **Problem:** Core logic for identifying current state (`findCurrentStateIndex`) and applying next state (`applyState`) is deeply intertwined with direct DOM reads/writes. This also leads to fragile state identification (cr‑06) and implicit handling of unknown states (cr‑07).
- **Impact:** Reduced maintainability, poor testability for core logic, and violation of separation of concerns. State cycling can break with minor UI text changes.
- **Chosen Fix:** Maintain the application's current state (e.g., the index of the current `CurrencyState`) internally. `shiftExample` should determine the next state index based on this internal state. `findCurrentStateIndex` should be deprecated or refactored. The rendering logic (refactored `applyState`) should solely consume state data to update the DOM.
- **Steps:**
  1. Introduce a module-level variable in `scripts.ts` to store the current state index (e.g., `let currentDisplayStateIndex = 0;`).
  2. Refactor `shiftExample`:
     a. Calculate the `nextStateIndex` using `(currentDisplayStateIndex + 1) % currencyStates.length`.
     b. Update `currentDisplayStateIndex = nextStateIndex;`.
     c. Retrieve the `nextStateData` object from `currencyStates` using `currentDisplayStateIndex`.
     d. Pass `nextStateData` to the (refactored as per cr‑01) `applyState` function for DOM rendering.
  3. Deprecate `findCurrentStateIndex`. If it must be used temporarily, ensure it explicitly checks for `-1` and logs/handles this case (addresses cr‑07), and make comparisons more robust (e.g., trim whitespace, use `data-*` attributes - addresses cr‑06). The primary goal is its removal.
- **Done‑When:** Core state transition logic in `shiftExample` operates on an internal state index and does not read from the DOM to determine current/next state. `findCurrentStateIndex` is no longer essential for state cycling. Logic is testable in isolation.

### cr‑04 Implement Structured Logging (or Throw Error) for Operational Events

- **Problem:** `console.error` is used for operational logging (e.g., missing elements), violating the "Structured Logging is Mandatory" standard.
- **Impact:** Logs are difficult to parse, filter, and analyze in production, hindering debugging and monitoring.
- **Chosen Fix:** Integrate and use the planned structured logging utility. As a temporary measure if the utility is not yet available, this error should be thrown as an actual `Error` if the condition is unrecoverable.
- **Steps:**
  1. If the structured logging utility is available: Replace `console.error('One or more required elements not found');` with a structured log call, e.g., `logger.error({ message: 'One or more required elements not found', component: 'initializeApplication', requiredElements: ['el1', 'el2'] });`.
  2. If the utility is not available and the condition is unrecoverable for `initializeApplication`: Replace the `console.error` and `return;` with `throw new Error('Initialization failed: One or more required DOM elements not found. Check for elements: currency-code, currency-symbol, etc.');`.
- **Done‑When:** `console.error` is no longer used for this operational log. The event is logged via the structured logger or an `Error` is thrown.

### cr‑08 Add Pure Logic Unit Tests (Post cr‑02)

- **Problem:** Current tests for `shiftExample` and related functions are integration tests requiring `jsdom`, lacking focused unit tests for pure logic.
- **Impact:** Tests are slower, more brittle, and don't effectively test core state transition logic in isolation.
- **Chosen Fix:** Once core logic is decoupled from the DOM (per cr‑02), write unit tests for the pure state transition functions.
- **Steps:**
  1. After `cr‑02` is completed, identify or create the pure function(s) responsible for calculating the next state index (e.g., a helper function used by `shiftExample` or the logic within `shiftExample` if it becomes pure enough).
  2. In `tests/scripts.test.ts`, write unit tests for this logic. These tests should not require `jsdom`. For example, test that given a current index and a total number of states, the function returns the correct next index, including wrap-around logic.
- **Done‑When:** Unit tests exist for the core state transition logic. These tests pass and can run without a DOM environment.

### cr‑10 Define Named Constant for Interval Magic Number

- **Problem:** The `4000` in `setInterval(shiftExample, 4000)` is a magic number.
- **Impact:** Lacks context, reducing code clarity and maintainability.
- **Chosen Fix:** Define a named constant for the interval.
- **Steps:**
  1. At the top of `scripts.ts` (or an appropriate constants file), define `const EXAMPLE_CYCLE_INTERVAL_MS = 4000;`.
  2. Replace `setInterval(shiftExample, 4000)` with `setInterval(shiftExample, EXAMPLE_CYCLE_INTERVAL_MS);`.
- **Done‑When:** The magic number `4000` is replaced with the named constant.

### cr‑09 Correct TSDoc for `applyState` Parameters

- **Problem:** The TSDoc for `applyState` incorrectly lists `@param elements`, which is not a parameter.
- **Impact:** Slightly misleading documentation.
- **Chosen Fix:** Remove the incorrect `@param elements` line from the TSDoc.
- **Steps:**
  1. Edit the TSDoc block for the `applyState` function in `scripts.ts`.
  2. Remove the line: `@param elements - The DOM elements to update`.
- **Done‑When:** The TSDoc for `applyState` accurately reflects its parameters (especially after refactoring from cr‑01).

### cr‑11 Add Documentation for `currencyStates` Structure (Post cr‑01)

- **Problem:** Lack of documentation for the `CurrencyState` interface and `currencyStates` array structure and maintenance.
- **Impact:** Future maintainers lack guidance, especially after the refactor from cr‑01.
- **Chosen Fix:** Add TSDoc or block comments explaining the purpose of `CurrencyState`, the expected structure for each field, and any considerations when adding new states.
- **Steps:**
  1. After `cr‑01` is completed and `CurrencyState` is refactored to hold raw data:
     a. Add a TSDoc comment to the `CurrencyState` interface explaining its purpose and each of its data fields.
     b. Add a block comment above the `currencyStates` array definition explaining its role and how to add new currency example data, referencing the `CurrencyState` interface.
- **Done‑When:** Clear documentation exists for the `CurrencyState` interface and `currencyStates` data structure.

## Standards Alignment

- **Security:** `cr-01` directly addresses XSS vulnerabilities, adhering to "Security Considerations."
- **Modularity & Separation of Concerns:** `cr-01` and `cr-02` decouple data from presentation and logic from DOM manipulation.
- **Testability:** `cr-02` enables, and `cr-08` implements, unit tests for pure logic, aligning with "Design for Testability."
- **Coding Standards:** `cr-03` enforces "Leverage Types Diligently" by removing `any`. `cr-10` promotes "Self-Documenting Code."
- **Logging Strategy:** `cr-04` moves towards "Structured Logging is Mandatory."
- **Documentation Approach:** `cr-05` ensures "Clarity and Accuracy of Project Plans." `cr-09` and `cr-11` improve code documentation.
- **Simplicity First:** `cr-02` (by removing DOM reads for state), `cr-06`, and `cr-07` aim to make state management more robust and explicit.

## Validation Checklist

- [ ] All automated tests (unit and integration) pass.
- [ ] Static analysis (TypeScript compiler with strict flags, ESLint) reports no errors.
- [ ] Manual penetration testing of the `shiftExample` feature confirms no XSS vulnerabilities from state data.
- [ ] No new lint or audit warnings are introduced.
- [ ] `BACKLOG.md` is updated as per `cr-05`.
- [ ] Operational logs (for conditions like missing elements) are structured or errors are thrown appropriately.
