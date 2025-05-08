# T007 Plan: Update copyright tests to use new exported functions

## Task Overview

Update the copyright tests in `tests/scripts.test.ts` to use the newly exported `getCopyrightText` and `applyCopyrightText` functions from `scripts.ts`, rather than containing duplicate copyright generation logic.

## Current Implementation

Currently, the copyright test contains its own implementation of the copyright text generation:

```typescript
describe('copyright functionality', () => {
  test('copyright should contain current year when updated', () => {
    // Mock the current year
    const mockDate = new Date(2023, 0, 1);
    const realDate = Date;

    // Use a spy to mock Date
    global.Date = jest.fn(() => mockDate) as unknown as typeof Date;
    global.Date.UTC = realDate.UTC;
    global.Date.parse = realDate.parse;
    global.Date.now = realDate.now;

    const copyright = document.getElementById('copyright') as HTMLElement;

    // Simulate what the script would do
    copyright.innerHTML =
      'Copyright \u00A9 ' +
      new Date().getFullYear() +
      ' <a href="https://www.phaedrus.io" target="_blank">Phaedrus</a>';

    expect(copyright.innerHTML).toContain('2023');

    // Restore the original Date object
    global.Date = realDate;
  });
});
```

## Implementation Approach

1. Update the imports in `tests/scripts.test.ts` to include `getCopyrightText` and `applyCopyrightText` from `../scripts`
2. Remove the duplicate copyright generation logic
3. Add tests specifically for:
   - `getCopyrightText`: Testing it returns the correct formatted string for various years
   - `applyCopyrightText`: Testing it correctly updates the DOM element using a mocked Date object

## Implementation Details

1. Add `getCopyrightText` and `applyCopyrightText` to the imports
2. Replace the existing copyright test with multiple targeted tests:
   - Test for `getCopyrightText` that verifies the correct string is returned for specific years
   - Test for `applyCopyrightText` that mocks Date and verifies the DOM element is properly updated

## Testing

The entire task is about testing, so the implementation itself constitutes the tests. Key points:

- Test `getCopyrightText` without DOM dependencies (pure function)
- Test `applyCopyrightText` by mocking the Date object and verifying DOM interaction
- Ensure all tests pass with `npm test`

## Done-when

- All copyright tests in `tests/scripts.test.ts` use the imported functions
- Tests for `getCopyrightText` and `applyCopyrightText` pass
- No duplicate copyright generation logic exists in the test file
