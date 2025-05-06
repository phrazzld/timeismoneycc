# T013 - Configure CI jobs for parallel execution

## Task Details

- **Task:** Configure ci jobs for parallel execution
- **Context:** PLAN.md - Risk: CI pipeline too slow; Implied by separate jobs in plan steps.
- **Action:**
  1. Refactor `ci.yml` to define `lint`, `typecheck`, `test`, and `security` as separate jobs instead of steps within a single job.
  2. Ensure each job includes the necessary setup steps (checkout, Node.js setup, caching, install dependencies - potentially using a matrix or reusable workflow later).
  3. Ensure jobs run in parallel by default (no explicit `needs` dependency between them).

## Implementation Plan

1. Refactor the current single "validate" job into multiple parallel jobs:

   - lint (includes ESLint, CSS linting, and Prettier checks)
   - typecheck (TypeScript type checking)
   - test (Jest tests with coverage)
   - security (npm audit)

2. Ensure each job has the required setup steps:

   - Checkout code
   - Setup Node.js
   - Cache dependencies
   - Install dependencies

3. Keep the jobs independent (no needs dependencies) so they run in parallel

4. Maintain existing functionality while improving performance

## Key Considerations

- The HTML validation step doesn't fit neatly into any category - we'll keep it in the lint job
- Each job will need its own setup steps, which adds some duplication but allows for parallel execution
- This approach will potentially reduce overall CI execution time, especially as the codebase grows
- We're setting up the structure in a way that can be optimized further if needed with reusable workflows
