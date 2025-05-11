# Todo

## scripts.ts – State Management

- [x] **T001 · refactor · P0: remove exported mutable state from scripts.ts**

  - **Context:** cr-01 Remove Exported Mutable State
  - **Action:**
    1. Remove `export` from `let currentDisplayStateIndex = 0;` in `scripts.ts`.
    2. Add internal getter `function _getCurrentStateIndex(): number { return currentDisplayStateIndex; }`
    3. Add test-only reset function: `/** @internal */ export function _resetStateForTesting(): void { currentDisplayStateIndex = 0; }`
  - **Done‑when:**
    1. `currentDisplayStateIndex` is not exported.
    2. State is managed internally within the module.
    3. Tests can reliably reset state via a dedicated function.
  - **Depends‑on:** none

- [x] **T002 · refactor · P1: update internal consumers to use internal state variable**
  - **Context:** cr-01 Remove Exported Mutable State
  - **Action:**
    1. Change all internal references to use the now-internal state variable or getter.
  - **Done‑when:**
    1. No code references a removed export.
  - **Depends‑on:** [T001]

## tests/scripts.test.ts – Test Isolation

- [x] **T003 · test · P0: use test-only reset function for state isolation in tests**
  - **Context:** cr-04 Ensure Test State Isolation
  - **Action:**
    1. Import `_resetStateForTesting()` in all relevant test files.
    2. Add `beforeEach(() => { _resetStateForTesting(); })` to test suites using state cycling.
  - **Done‑when:**
    1. Each test runs with a clean, predictable state.
    2. Test runs are deterministic regardless of execution order.
  - **Verification:**
    1. Run tests multiple times and ensure consistent results.
  - **Depends‑on:** [T001]

## scripts.ts – Core Logic Decoupling

- [x] **T004 · refactor · P0: extract pure core state machine logic from shiftExample**

  - **Context:** cr-02 Decouple Core Logic from DOM
  - **Action:**
    1. Create a pure function to determine the next state:
       ```typescript
       function getNextState(): CurrencyState {
         const nextIndex = calculateNextStateIndex(currentDisplayStateIndex, currencyStates.length);
         currentDisplayStateIndex = nextIndex;
         return currencyStates[nextIndex];
       }
       ```
    2. Ensure `currentDisplayStateIndex` is only mutated within pure logic boundaries.
  - **Done‑when:**
    1. Pure logic functions have no DOM dependency.
  - **Depends‑on:** [T001]

- [x] **T005 · refactor · P1: refactor shiftExample to orchestrate pure logic and DOM update**

  - **Context:** cr-02 Decouple Core Logic from DOM
  - **Action:**

    1. Update `shiftExample` to separate concerns:

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

  - **Done‑when:**
    1. `shiftExample` only wires together pure logic and DOM manipulation.
  - **Depends‑on:** [T004]

- [x] **T006 · test · P1: add unit tests for pure state logic**
  - **Context:** cr-02 Decouple Core Logic from DOM
  - **Action:**
    1. Write unit tests for new/extracted pure state functions.
  - **Done‑when:**
    1. 100% test coverage on pure logic.
  - **Depends‑on:** [T004]

## scripts.ts – Security: URL Validation

- [x] **T007 · feature · P0: implement isValidHttpUrl utility function**

  - **Context:** cr-03 Add URL Validation to Prevent XSS
  - **Action:**
    1. Add URL validation function:
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
  - **Done‑when:**
    1. Function exists and is unit-tested for both valid and invalid URLs.
  - **Depends‑on:** none

- [x] **T008 · refactor · P1: apply URL validation before assigning to href in applyState**

  - **Context:** cr-03 Add URL Validation to Prevent XSS / cr-08 Validate Product URLs Before Assignment
  - **Action:**
    1. Update `applyState` to validate URLs before assignment:
       ```typescript
       if (isValidHttpUrl(state.productUrl)) {
         productLink.href = state.productUrl;
       } else {
         productLink.href = '#';
         log('error', `Invalid URL skipped: ${state.productUrl}`, { component: 'applyState' });
       }
       ```
  - **Done‑when:**
    1. All DOM URL assignments are validated.
  - **Verification:**
    1. Manual: try to inject invalid URLs, ensure safe fallback and error logging.
  - **Depends‑on:** [T007], [T011]

- [x] **T009 · chore · P2: document URL validation and data trust assumptions**
  - **Context:** cr-03 Add URL Validation to Prevent XSS / cr-08 Validate Product URLs Before Assignment
  - **Action:**
    1. Add comments about data trust and validation logic.
  - **Done‑when:**
    1. Source code documents trust boundary and validation approach.
  - **Depends‑on:** [T008]

## scripts.ts – Logging

- [x] **T010 · feature · P0: implement minimal structured logger module**

  - **Context:** cr-05 Implement Structured Logging for Errors
  - **Action:**

    1. Create a logger module with the following interface:

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

  - **Done‑when:**
    1. Logger module is available and tested for correct output format.
  - **Verification:**
    1. Log entries include all required context fields.
  - **Depends‑on:** none

- [x] **T011 · refactor · P1: add structured logging to all error paths**
  - **Context:** cr-05 Implement Structured Logging for Errors
  - **Action:**
    1. Update error handling in functions to log before throwing:
       ```typescript
       if (!elements) {
         log('error', 'Required DOM elements not found', {
           component: 'shiftExample',
           requiredElements: ['currency-code', 'currency-symbol', '...'],
         });
         throw new Error('Initialization failed: One or more required DOM elements not found');
       }
       ```
  - **Done‑when:**
    1. All error paths log structured events before throwing.
  - **Verification:**
    1. Trigger errors manually and verify log output format.
  - **Depends‑on:** [T010]

## scripts.ts – API Simplification

- [x] **T012 · refactor · P1: refactor applyState to accept single container element**

  - **Context:** cr-07 Simplify DOM API for applyState
  - **Action:**

    1. Change `applyState` signature:

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

  - **Done‑when:**
    1. API accepts only a container element, not individual elements.
  - **Verification:**
    1. Tests and usage updated, errors handled correctly.
  - **Depends‑on:** [T011]

- [x] **T013 · refactor · P1: update all applyState callers to use container-based API**

  - **Context:** cr-07 Simplify DOM API for applyState
  - **Action:**
    1. Update all usages in `shiftExample` and tests.
  - **Done‑when:**
    1. No callers use old multi-parameter form.
  - **Depends‑on:** [T012]

- [x] **T014 · test · P2: verify error handling when child elements are missing**
  - **Context:** cr-07 Simplify DOM API for applyState
  - **Action:**
    1. Test that missing child elements in container triggers structured logging and throws.
  - **Done‑when:**
    1. Test covers error and log output for missing elements.
  - **Depends‑on:** [T012]

## scripts.ts – Dead Code Removal

- [ ] **T015 · chore · P2: remove deprecated findCurrentStateIndex function**
  - **Context:** cr-06 Remove Deprecated `findCurrentStateIndex`
  - **Action:**
    1. Delete the `findCurrentStateIndex` function from `scripts.ts`.
    2. Remove or update all references and related tests.
  - **Done‑when:**
    1. No deprecated code or related tests remain.
  - **Depends‑on:** none

## scripts.ts – Public API Hygiene

- [ ] **T016 · refactor · P2: remove unnecessary exports from scripts.ts**
  - **Context:** cr-09 Remove Unnecessary Exports
  - **Action:**
    1. Review all exports and remove `export` from internal utilities and constants.
    2. Update imports in tests as necessary.
  - **Done‑when:**
    1. Only public API is exported.
  - **Depends‑on:** none

## tests/scripts.test.ts – Pure Logic Testing

- [ ] **T017 · test · P0: add dedicated tests for pure logic functions**
  - **Context:** cr-10 Add More Pure Logic Tests
  - **Action:**
    1. Create test suite for pure functions (`calculateNextStateIndex`, `getNextState`, `isValidHttpUrl`).
    2. Ensure these tests don't depend on DOM environment.
  - **Done‑when:**
    1. All pure logic is tested in isolation.
  - **Verification:**
    1. Run tests with JSDOM disabled to confirm independence.
  - **Depends‑on:** [T004], [T007]

## tests/scripts.test.ts – Behavioral Testing

- [ ] **T018 · test · P1: refactor state transition tests to focus on observable behavior**

  - **Context:** cr-11 Refactor Implementation-Dependent Tests
  - **Action:**

    1. Update tests to check DOM/text output after calling `shiftExample`, not internal state:

       ```typescript
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

    2. Remove tests that check implementation details.

  - **Done‑when:**
    1. Tests pass by observing user-visible changes only.
  - **Verification:**
    1. Implementation can change without breaking tests.
  - **Depends‑on:** [T005]
