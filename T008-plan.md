# T008 Plan: Create and export `startExampleInterval` function in `scripts.ts`

## Task Overview

Create a function to encapsulate the `setInterval` call that cycles through examples, making it more testable.

## Current Implementation

Currently, the timer is initialized directly at the top of the file:

```typescript
setInterval(shiftExample, 4000);
```

## Implementation Approach

1. Create a new function `startExampleInterval` that will encapsulate the setInterval call
2. Export this function so it can be tested
3. Replace the direct setInterval call with a call to the new function
4. Ensure the functionality remains the same

## Implementation Details

The new function will:

- Take no parameters
- Return void
- Call `setInterval(shiftExample, 4000)` internally
- Be called at the top level to maintain the same behavior

## Testing

- Manually verify the example still cycles every 4 seconds in the browser
- No unit tests are required for this ticket (they will be added in T009)

## Done-when

1. The `startExampleInterval` function is implemented and exported from `scripts.ts`
2. The direct setInterval call is replaced with a call to this function
3. The example cycling behavior in the browser remains unchanged
