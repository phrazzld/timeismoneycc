# Plan: Configure Strict TypeScript Build & Remove Legacy JavaScript

## Chosen Approach (One‑liner)

Migrate fully to a strict TypeScript build for `scripts.ts`, remove the legacy `scripts.js`, and update all configurations, tests, and documentation accordingly, enforcing our development philosophy.

## Architecture Blueprint

- **Modules / Packages**

  - `scripts.ts`: The single source-of-truth TypeScript file containing the core logic for the popup's example conversion animation and basic DOM manipulation (e.g., copyright year).
  - `dist/scripts.js`: The compiled JavaScript output from `scripts.ts`, which will be referenced by `index.html`.
  - `tests/scripts.test.ts`: The Jest unit test file for `scripts.ts`.

- **Public Interfaces / Contracts**

  - `shiftExample(): void`: Function triggered by an interval to update the example UI elements. Interacts directly with DOM elements.
  - `is(element: HTMLElement | null, val: string): boolean`: Helper function to check the text content of a given DOM element.
  - **DOM Interaction Points (Implicit Contract):**
    - `document.getElementById('currency-code')`
    - `document.getElementById('currency-symbol')`
    - `document.getElementById('income-amount')`
    - `document.getElementById('pay-frequency')`
    - `document.getElementById('example-product')`
    - `document.getElementById('example-price')`
    - `document.getElementById('copyright')`

- **Data Flow Diagram**

  ```mermaid
  graph TD
      A[index.html Load] --> B(Browser DOM);
      B -- Triggers --> F[scripts.ts Initialization];
      F -- Sets interval --> G(setInterval);
      F -- Reads/Writes --> H[DOM: #copyright];

      G -- Every 4s triggers --> C(scripts.ts: shiftExample());
      C -- Reads --> D{DOM State (textContent of #currency-code, etc.)};
      D -- Determines next state --> C;
      C -- Writes --> E[DOM Update (textContent/innerHTML of example elements)];
      E --> B;
  ```

- **Error & Edge‑Case Strategy**
  - **Compile-time:** Strict TypeScript (`"strict": true` and related flags in `tsconfig.json`) will catch type errors, unhandled nulls/undefined, and other potential issues at build time. This is the primary error prevention strategy.
  - **Runtime DOM Elements:**
    - Explicit `null` checks (e.g., `if (element) {...}`) will be used for all elements retrieved via `document.getElementById` before attempting to access their properties or methods.
    - If essential elements for `shiftExample` are missing, a message will be logged to `console.error`, and the function will gracefully avoid further processing for that cycle, preventing runtime crashes.
  - **Other Runtime Errors:** This task does not introduce new complex runtime error handling logic beyond the existing `console.error` for missing elements. The focus is on leveraging TypeScript's static analysis.

## Detailed Build Steps

1. **Preparation & Branching:**
   - Ensure the current working directory is clean. ✅
   - Create a new feature branch (e.g., `refactor/strict-ts-scripts`). ✅
2. **Update `tsconfig.json` for Maximum Strictness:**
   - Modify `tsconfig.json` to enable `"strict": true`.
   - Ensure the following strictness-related compiler options are enabled, aligning with `DEVELOPMENT_PHILOSOPHY_APPENDIX_TYPESCRIPT.md#4-typescript-configuration-tsconfigjson`:
     - `"noImplicitAny": true` (implied by `strict`)
     - `"strictNullChecks": true` (implied by `strict`)
     - `"strictFunctionTypes": true` (implied by `strict`)
     - `"strictBindCallApply": true` (implied by `strict`)
     - `"strictPropertyInitialization": true` (implied by `strict`)
     - `"noImplicitThis": true` (implied by `strict`)
     - `"useUnknownInCatchVariables": true` (recommended for TS 4.4+)
     - `"alwaysStrict": true`
     - `"noUnusedLocals": true`
     - `"noUnusedParameters": true`
     - `"noImplicitReturns": true`
     - `"noFallthroughCasesInSwitch": true`
     - `"forceConsistentCasingInFileNames": true`
   - Verify `"target"`, `"module"`, `"moduleResolution"`, `"outDir": "dist"`, and appropriate directory configuration is set.
3. **Refactor `scripts.ts` for Type Safety & Strictness Compliance:**
   - Run `npm run typecheck` (or `tsc --noEmit`) to identify all TypeScript errors.
   - Systematically address each error:
     - Add explicit types for variables, function parameters, and return values where necessary.
     - Replace any `any` types with specific types or `unknown` (followed by appropriate type guards or assertions).
     - Implement robust `null` checks for all DOM element retrievals.
4. **Lint `scripts.ts`:**
   - Run `npm run lint` and `npm run lint:fix` (assuming ESLint with TypeScript ESLint plugin).
   - Fix all linting errors and warnings in `scripts.ts`.
5. **Update `package.json` Scripts:**
   - Verify/update `build`, `lint`, `typecheck`, `test`, and `collectCoverageFrom` scripts to reference the TypeScript file and its compiled output. Remove any references to the legacy `scripts.js`.
6. **Test Migration:**
   - Ensure `tests/scripts.test.ts` correctly targets `scripts.ts`.
   - Run `npm test`. All tests must pass.
7. **Remove Legacy JavaScript Test File:**
   - Delete `tests/scripts.test.js` as it's been replaced by the TypeScript version.
8. **Build the TypeScript File:**
   - Run `npm run build` to compile `scripts.ts` to `dist/scripts.js`.
9. **Update `index.html`:**
   - Modify the `<script>` tag in `index.html` to reference the compiled TypeScript output: `<script src="dist/scripts.js"></script>`.
10. **Remove Legacy JavaScript Source File:**
    - Delete the legacy `scripts.js` file in the project root.
11. **Manual End-to-End Testing:**
    - Load the application in a browser.
    - Verify all functionality related to `scripts.ts` works correctly.
12. **Documentation Updates:**
    - Update `README.md` to remove mentions of `scripts.js` and clarify the TypeScript workflow.

## Testing Strategy

- **Test Layers:**
  - **Unit Tests:** Primary focus. `tests/scripts.test.ts` will use Jest and `jsdom` to test the functions and logic.
- **What to Mock (and why):**
  - No internal collaborators will be mocked, adhering to the "minimal mocking" principle.
  - `setInterval` and `Date` may need to be mocked using Jest's timer and date mocks for deterministic testing of time-dependent behavior.
  - DOM interactions are tested against the `jsdom` environment.
- **Coverage Targets & Edge‑Case Notes:**
  - The project `jest.config.js` specifies a 0% coverage threshold currently.
  - Builds **MUST** continue to pass the current threshold.
  - **Edge Cases for Tests:**
    - Missing DOM elements (ensure graceful error logging and no crashes).
    - All states of the `shiftExample` animation.
    - Correctness of the `is()` helper function with various inputs.
    - Copyright year update logic across year boundaries.

## Risk Matrix

| Risk                                                                  | Severity | Mitigation                                                                   |
| :-------------------------------------------------------------------- | :------- | :--------------------------------------------------------------------------- |
| Functionality regression in UI after migrating to compiled TypeScript | CRITICAL | Thorough manual testing in browser. Ensure adequate test coverage.           |
| Build or CI pipeline failures due to path changes or `tsc` errors     | HIGH     | Update all relevant configuration files. Test build process locally.         |
| TypeScript strictness errors prove complex to fix                     | MEDIUM   | Address errors incrementally. Allocate sufficient time for refactoring.      |
| Test failures after refactor or migration                             | MEDIUM   | Carefully review test logic. Debug tests systematically.                     |
| Outdated documentation                                                | LOW      | Thoroughly review `README.md` and update all references to JavaScript files. |
