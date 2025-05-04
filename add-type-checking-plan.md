# Plan for Adding Type Checking to Pre-commit Hooks

## Overview

This plan outlines the steps for adding TypeScript and type checking to the Time Is Money Chrome extension project, and integrating it with the pre-commit hooks to ensure type safety in all commits.

## Current State Analysis

- The project currently uses plain JavaScript (scripts.js)
- ESLint is used for linting JavaScript
- Pre-commit hooks are configured using the pre-commit framework
- No TypeScript or type checking is in place yet

## Implementation Steps

### 1. Install TypeScript and Related Dependencies

- Install TypeScript as a dev dependency
- Install @typescript-eslint/parser and @typescript-eslint/eslint-plugin for ESLint integration
- Install ts-jest for TypeScript support in Jest tests

### 2. Create TypeScript Configuration

- Create tsconfig.json with strict type checking enabled (per DEVELOPMENT_PHILOSOPHY.md)
- Configure compiler options:
  - Target ES2018 or higher for browser compatibility
  - Enable strict mode for maximum type safety
  - Configure source and output directories

### 3. Convert Existing JavaScript to TypeScript

- Rename scripts.js to scripts.ts
- Add type annotations to existing code
- Fix any type errors that arise during conversion

### 4. Update Jest Configuration for TypeScript

- Modify jest.config.js to support TypeScript files
- Update test files to use TypeScript

### 5. Update ESLint Configuration for TypeScript

- Modify ESLint configuration to support TypeScript
- Add TypeScript-specific rules

### 6. Add Type Checking to Pre-commit Hooks

- Create a TypeScript checking script in package.json
- Add type checking to .pre-commit-config.yaml or package.json pre-commit hooks

### 7. Documentation Updates

- Update README.md to mention TypeScript usage
- Update CONTRIBUTING.md with TypeScript guidelines

## Implementation Details

### TypeScript Configuration (tsconfig.json)

We'll create a tsconfig.json with strict settings as specified in the development philosophy:

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "outDir": "dist",
    "baseUrl": ".",
    "lib": ["dom", "dom.iterable", "esnext"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Pre-commit Hook Configuration

We'll add TypeScript type checking to the pre-commit hooks by adding a new check in the .pre-commit-config.yaml file.

### Package.json Updates

We'll add a new script to run TypeScript compilation check:

```json
"scripts": {
  "typecheck": "tsc --noEmit"
}
```

And update the pre-commit configuration to include this check.

## Testing

- Verify that TypeScript compilation works correctly with the existing code
- Ensure that pre-commit hooks correctly run type checking
- Test type checking with both valid and invalid type usage to confirm it's working correctly

## Rollout

1. Implement all changes in a development branch
2. Test thoroughly to ensure all existing functionality works correctly
3. Submit a PR with the changes
4. After review, merge to master
