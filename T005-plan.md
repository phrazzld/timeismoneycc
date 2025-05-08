# T005 Plan: Create and export `getCopyrightText` pure function in `scripts.ts`

## Task Overview

Create a pure function that generates the copyright text based on a given year, separate from DOM manipulation.

## Current Implementation

Currently, the copyright text is generated and the DOM is updated in a single block:

```typescript
// Set copyright year in footer
const copyrightElement = document.getElementById('copyright');
if (copyrightElement) {
  copyrightElement.innerHTML =
    'Copyright \u00A9 ' +
    new Date().getFullYear() +
    ' <a href="https://www.phaedrus.io" target="_blank">Phaedrus</a>';
}
```

The test file duplicates this text generation logic with its own implementation.

## Implementation Approach

1. Create a pure function `getCopyrightText(year: number): string` that takes a year parameter and returns the formatted copyright string.
2. Export this function so it can be used in tests.
3. Keep the existing implementation for now (to be replaced in T006).

## Implementation Details

- The function will be placed in `scripts.ts`
- The function will not include any DOM manipulation
- The function will take a single parameter `year` of type `number`
- The function will return the formatted copyright string including the HTML anchor tag

## Testing

- No tests are required for this task as T007 will handle testing of this function
- Verify the TypeScript compiler accepts the new function with `npx tsc --noEmit`

## Done-when

- The `getCopyrightText` function is implemented and exported from `scripts.ts`
- The function correctly generates the copyright string for a given year
