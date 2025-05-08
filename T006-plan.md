# T006 Plan: Create and export `applyCopyrightText` function in `scripts.ts`

## Task Overview

Create a function that applies the copyright text to the DOM, using the previously created `getCopyrightText` function, and replace the existing inline implementation.

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

## Implementation Approach

1. Create a function `applyCopyrightText(): void` that:

   - Gets the copyright element from the DOM
   - Uses `getCopyrightText(new Date().getFullYear())` to generate the copyright text
   - Updates the element's innerHTML if it exists

2. Export this function so it can be used in tests

3. Replace the existing inline implementation with a call to `applyCopyrightText()`

## Implementation Details

- The function will be placed in `scripts.ts`
- The function will be responsible for:
  - Finding the copyright DOM element
  - Setting its innerHTML using the `getCopyrightText` function
  - Handling the case where the element doesn't exist
- The existing inline DOM manipulation code will be removed
- The function will be called directly at the script's top level

## Testing

- No tests are required for this task as T007 will handle testing
- Verify the TypeScript compiler accepts the new function with `npx tsc --noEmit`
- Manually verify the copyright text appears correctly in the browser

## Done-when

- The `applyCopyrightText` function is implemented and exported from `scripts.ts`
- The existing inline copyright update logic is replaced with a call to this function
- The copyright text in `index.html` is correctly updated when viewed in a browser
