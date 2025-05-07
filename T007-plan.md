# T007 · Chore · P2: Remove legacy JavaScript test file `tests/scripts.test.js`

## Task Description

- Delete the `tests/scripts.test.js` file
- Verify that tests still run correctly using only the TypeScript test file

## Implementation Approach

1. First run the tests to confirm they work with both JS and TS test files
2. Delete the `tests/scripts.test.js` file
3. Run tests again to verify they still work without the JS test file
4. Update TODO.md to mark T007 as completed

## Success Criteria

- `tests/scripts.test.js` is deleted
- `npm test` completes successfully using only `tests/scripts.test.ts`
