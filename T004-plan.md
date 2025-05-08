# T004 Plan: Update ES target version to ES2020 in tsconfig.json

## Task Overview

Update the ECMAScript target version in tsconfig.json from ES2018 to ES2020 to ensure the project uses more modern JavaScript features.

## Current Implementation

The tsconfig.json file currently has:

```json
{
  "compilerOptions": {
    "target": "es2018"
    // other settings...
  }
}
```

## Implementation Approach

1. Change the `compilerOptions.target` value in `tsconfig.json` from `es2018` to `ES2020`
2. Verify the project still compiles successfully
3. Perform basic smoke testing to ensure the application still works correctly in target browsers

## Implementation Details

- Simple change to a single configuration value
- ES2020 includes features like:
  - Optional chaining (?.)
  - Nullish coalescing operator (??)
  - BigInt
  - Promise.allSettled
  - String.prototype.matchAll
  - globalThis

## Testing

1. Compile the project with `npx tsc --noEmit` to ensure there are no TypeScript errors
2. Run test suite with `npm test` to verify all tests still pass
3. Open the application in a browser to ensure it works correctly

## Done-when

1. `compilerOptions.target` in `tsconfig.json` is set to `ES2020`
2. Project builds successfully (`npx tsc --noEmit` passes)
3. Tests pass (`npm test` passes)
4. Application functions correctly in a browser
