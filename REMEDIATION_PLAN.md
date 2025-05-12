# Remediation Plan – Sprint 1

## Executive Summary

This plan addresses critical architectural and security vulnerabilities identified in the code review of the `refactor/data-driven-shift-example` branch. Our highest priorities are eliminating global mutable state to restore testability, fully decoupling state logic from DOM operations, and hardening against XSS vulnerabilities. The implementation follows a progressive approach that enables incremental improvements while maintaining application stability and maximizing future maintainability and security.

## Strike List

| Seq | CR‑ID | Title                                     | Effort | Owner    |
| --- | ----- | ----------------------------------------- | ------ | -------- |
| 1   | cr-01 | Remove Exported Mutable State             | s      | Frontend |
| 2   | cr-04 | Ensure Test State Isolation               | s      | Frontend |
| 3   | cr-02 | Decouple Core Logic from DOM              | m      | Frontend |
| 4   | cr-03 | Add URL Validation to Prevent XSS         | s      | Frontend |
| 5   | cr-05 | Implement Structured Logging for Errors   | s      | Frontend |
| 6   | cr-06 | Remove Deprecated `findCurrentStateIndex` | xs     | Frontend |
| 7   | cr-07 | Simplify DOM API for `applyState`         | s      | Frontend |
| 8   | cr-08 | Validate Product URLs Before Assignment   | xs     | Frontend |
| 9   | cr-09 | Remove Unnecessary Exports                | xs     | Frontend |
| 10  | cr-10 | Add More Pure Logic Tests                 | s      | Frontend |
| 11  | cr-11 | Refactor Implementation-Dependent Tests   | s      | Frontend |

## Detailed Remedies

### cr-01 Remove Exported Mutable State

- **Problem:** `currentDisplayStateIndex` is exported as a mutable variable, creating global state pollution.
- **Impact:** Hidden coupling, unpredictable application state, difficult debugging, and non-deterministic tests.
- **Chosen Fix:** Encapsulate state in module scope by removing the `export`. Expose state transitions via controlled functions and provide a test-only reset mechanism.
- **Steps:**
  1. Remove `export` from `let currentDisplayStateIndex = 0;` in `scripts.ts`.
  2. Create an internal function for getting the current state index: `function _getCurrentStateIndex(): number { return currentDisplayStateIndex; }`
  3. Update `shiftExample` and any other internal consumers to use the internal variable.
  4. Add a non-exported, test-only function: `/** @internal */ export function _resetStateForTesting(): void { currentDisplayStateIndex = 0; }`
- **Done‑When:**
  - `currentDisplayStateIndex` is not exposed as a public export
  - State is managed internally within the module
  - Tests can reliably reset state via a dedicated function

### cr-04 Ensure Test State Isolation

- **Problem:** Tests using `shiftExample` and other stateful functions interfere with each other due to shared mutable state.
- **Impact:** Non-deterministic, flaky tests that are unreliable and hinder CI/CD processes.
- **Chosen Fix:** Use the test-only reset mechanism created in `cr-01` within test setup to ensure each test runs with a clean, predictable state.
- **Steps:**
  1. Import `_resetStateForTesting()` into `tests/scripts.test.ts`.
  2. In relevant test suites (those interacting with state cycling), add:
     ```typescript
     beforeEach(() => {
       _resetStateForTesting();
     });
     ```
  3. Verify tests pass consistently regardless of execution order.
- **Done‑When:** All tests involving state transitions are isolated and test runs are deterministic.

### cr-02 Decouple Core Logic from DOM

- **Problem:** State transition logic is mixed with DOM operations in `shiftExample`.
- **Impact:** Poor testability, high coupling, difficult to reuse, violation of separation of concerns.
- **Chosen Fix:** Extract pure state machine logic into separate functions that don't depend on DOM elements.
- **Steps:**

  1. Create a pure function to determine the next state and return it:
     ```typescript
     function getNextState(): CurrencyState {
       const nextIndex = calculateNextStateIndex(currentDisplayStateIndex, currencyStates.length);
       currentDisplayStateIndex = nextIndex;
       return currencyStates[nextIndex];
     }
     ```
  2. Refactor `shiftExample` to orchestrate:

     ```typescript
     export function shiftExample(): void {
       // Get DOM elements
       const elements = getRequiredDOMElements();
       if (!elements) return;

       // Compute next state (pure logic)
       const nextState = getNextState();

       // Apply state to DOM
       applyState(nextState, elements.container);
     }
     ```

  3. Ensure pure logic functions have complete test coverage.

- **Done‑When:** Core state transition logic functions have no DOM dependency and have complete test coverage.

### cr-03 Add URL Validation to Prevent XSS

- **Problem:** No validation for URLs in `applyState` when creating anchor elements.
- **Impact:** Potential XSS vulnerability if data becomes user-influenced, allowing `javascript:` URLs.
- **Chosen Fix:** Implement explicit URL validation for any `href` assignments.
- **Steps:**
  1. Create a utility function to validate URLs:
     ```typescript
     function isValidHttpUrl(url: string): boolean {
       try {
         const parsed = new URL(url);
         return parsed.protocol === 'http:' || parsed.protocol === 'https:';
       } catch {
         return false;
       }
     }
     ```
  2. Modify `applyState` to validate URLs before assignment:
     ```typescript
     if (isValidHttpUrl(state.productUrl)) {
       productLink.href = state.productUrl;
     } else {
       productLink.href = '#';
       console.error(`Invalid URL skipped: ${state.productUrl}`);
     }
     ```
  3. Add validation logic documentation and add comments that current data source is trusted.
- **Done‑When:** All URL assignments pass through validation before DOM assignment and tests cover invalid URLs.

### cr-05 Implement Structured Logging for Errors

- **Problem:** Throws errors without structured logging for operational events.
- **Impact:** Missing context for debugging and violates logging standards in Development Philosophy.
- **Chosen Fix:** Add structured logging before throwing errors or implement a basic logger if none exists.
- **Steps:**

  1. Create a minimal structured logger module if one doesn't exist:

     ```typescript
     export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
     export interface LogContext {
       [key: string]: any;
       component?: string;
       correlationId?: string;
     }

     export function log(level: LogLevel, message: string, context?: LogContext): void {
       const timestamp = new Date().toISOString();
       const logEntry = {
         timestamp,
         level,
         message,
         ...context,
       };
       console[level](JSON.stringify(logEntry));
     }
     ```

  2. Update error handling in `shiftExample` and other functions:
     ```typescript
     if (!elements) {
       log('error', 'Required DOM elements not found', {
         component: 'shiftExample',
         requiredElements: ['currency-code', 'currency-symbol', '...'],
       });
       throw new Error('Initialization failed: One or more required DOM elements not found');
     }
     ```

- **Done‑When:** All error paths log structured error events before throwing.

### cr-06 Remove Deprecated `findCurrentStateIndex`

- **Problem:** `findCurrentStateIndex` is deprecated but still present.
- **Impact:** Increases maintenance burden and creates confusion for developers.
- **Chosen Fix:** Remove the deprecated function and all usages/tests for it.
- **Steps:**
  1. Remove the `findCurrentStateIndex` function from `scripts.ts`.
  2. Update or remove tests that specifically test this function.
  3. Update any remaining code that might be calling it (should be none after other refactoring).
- **Done‑When:** No deprecated code remains in the codebase.

### cr-07 Simplify DOM API for `applyState`

- **Problem:** `applyState` requires too many individual DOM element parameters.
- **Impact:** Brittle API, hard to maintain and extend, easy to misuse.
- **Chosen Fix:** Refactor to accept a single container element and query children internally.
- **Steps:**

  1. Update `applyState` signature to take a container element:

     ```typescript
     export function applyState(state: CurrencyState, container: HTMLElement): void {
       const currencyCode = container.querySelector('#currency-code');
       const currencySymbol = container.querySelector('#currency-symbol');
       // etc...

       if (!currencyCode || !currencySymbol /* etc... */) {
         log('error', 'Required child elements not found in container', {
           component: 'applyState',
           containerId: container.id,
         });
         throw new Error('Container missing required child elements');
       }

       // Update elements as before
     }
     ```

  2. Update callers in `shiftExample` and tests to use new API.

- **Done‑When:** `applyState` accepts a single container reference instead of multiple element parameters.

### cr-08 Validate Product URLs Before Assignment

- **Problem:** No validation specifically for product URLs before assignment to `href` attributes.
- **Impact:** Potential security risk if data ever becomes dynamic.
- **Chosen Fix:** Validate URLs using the helper from cr-03.
- **Steps:**
  1. Ensure the `isValidHttpUrl` helper function from cr-03 is used.
  2. Apply validation before all URL assignments in the code.
  3. Document data source trust assumptions.
- **Done‑When:** All URLs are validated before DOM assignment.

### cr-09 Remove Unnecessary Exports

- **Problem:** Utility functions and constants exported without external need.
- **Impact:** Leaks internal API, increases surface area for misuse.
- **Chosen Fix:** Export only what is part of the public API.
- **Steps:**
  1. Review all exports in `scripts.ts`.
  2. Remove `export` keyword from internal implementation details like:
     - `isElementText` (if only used internally)
     - `EXAMPLE_CYCLE_INTERVAL_MS` (if only used internally)
     - Any other utilities not needed externally
  3. Update imports/callers in tests if needed.
- **Done‑When:** Exports match the intended public API and no unnecessary exports remain.

### cr-10 Add More Pure Logic Tests

- **Problem:** Tests rely heavily on DOM simulation; pure logic insufficiently tested.
- **Impact:** Slower, flakier tests; weak coverage of core business logic.
- **Chosen Fix:** Add focused unit tests for all pure functions extracted from DOM logic.
- **Steps:**
  1. Create a separate test suite for pure logic functions.
  2. Write specific tests for:
     - `calculateNextStateIndex`
     - `getNextState` (or similar function from cr-02)
     - URL validation function `isValidHttpUrl`
  3. Ensure these tests don't require JSDOM or DOM context.
- **Done‑When:** Pure logic functions have dedicated tests with complete coverage.

### cr-11 Refactor Implementation-Dependent Tests

- **Problem:** Some tests depend too heavily on implementation details rather than behavior.
- **Impact:** Brittle tests that break with implementation changes.
- **Chosen Fix:** Update tests to focus on observable behavior rather than internal details.
- **Steps:**

  1. Review state transition tests.
  2. Focus assertions on results rather than mechanisms:

     ```typescript
     // Instead of checking internal index:
     test('cycles through currency states', () => {
       // Initial state check
       expect(document.getElementById('currency-code').textContent).toBe('USD');

       // Call function multiple times and verify observable changes
       shiftExample();
       expect(document.getElementById('currency-code').textContent).toBe('USD'); // Second state

       shiftExample();
       expect(document.getElementById('currency-code').textContent).toBe('GBP'); // Third state

       // etc...
     });
     ```

  3. Remove or update tests tied directly to implementation details.

- **Done‑When:** Tests validate public behavior, not internal implementation.

## Standards Alignment

All the remedies proposed align with the core Development Philosophy:

- **Simplicity & Modularity:** Removes complexity (global state, brittle APIs) and increases modularity.
- **Testability is Paramount:** Pure logic extracted, DOM separated, tests made reliable and isolated.
- **Explicitness & Maintainability:** Type safety, immutability, no deprecated code, clearer contracts.
- **Security:** XSS/URL validation, no user input risks, logging for auditing and monitoring.

## Validation Checklist

Before considering these changes complete, we will verify:

- ✅ All automated tests pass (unit, integration, DOM)
- ✅ TypeScript strict mode checks pass (no errors)
- ✅ No new ESLint/Prettier warnings
- ✅ Manual verification of URL validation logic
- ✅ Structured logs present with required context fields on all errors
- ✅ No exports of internal implementation details
