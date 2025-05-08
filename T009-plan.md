# T009 Plan: Add Jest timer mock tests for `startExampleInterval`

## Task Overview

Add tests for the `startExampleInterval` function using Jest's timer mocks to verify both that it calls `setInterval` with the correct arguments and that it triggers the `shiftExample` function at the expected interval.

## Current Implementation

We've created and exported the `startExampleInterval` function:

```typescript
export function startExampleInterval(): void {
  setInterval(shiftExample, 4000);
}
```

But we need tests to ensure it works correctly.

## Implementation Approach

1. Add a new test suite for `startExampleInterval` in `tests/scripts.test.ts`
2. Use Jest's timer mocking capabilities to:
   - Verify `setInterval` is called with the correct arguments
   - Verify that `shiftExample` is called at the correct intervals

## Implementation Details

We'll need to:

1. Update imports in `tests/scripts.test.ts` to include `startExampleInterval`
2. Create a new describe block for the `startExampleInterval` tests
3. Use `jest.useFakeTimers()` to replace real timers with mock timers
4. Use `jest.spyOn(global, 'setInterval')` to spy on the `setInterval` function
5. Call `startExampleInterval()` and verify it calls `setInterval` with `shiftExample` and `4000`
6. Use `jest.advanceTimersByTime(4000)` to advance the fake timer and verify `shiftExample` is called
7. Restore the real timers with `jest.useRealTimers()` after tests

## Testing

1. Run the tests with `npm test` to verify they pass
2. Temporarily change the interval in `scripts.ts` from 4000 to another value (e.g., 5000)
3. Verify that the test asserting the 4000ms delay fails
4. Revert the change back to 4000ms

## Done-when

1. Tests for `startExampleInterval` using Jest timer mocks are added to `tests/scripts.test.ts`
2. All tests pass
3. The verification step (changing the interval value) confirms the tests are checking the correct behavior
