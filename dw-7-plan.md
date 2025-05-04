# Enhance pre-commit hooks with automated formatting (dw-7)

## Task Description

Enhance pre-commit hooks to automatically format code before committing, ensuring consistent code style without manual intervention.

## Implementation Plan

1. **Review Current Setup**

   - We already have prettier-fix hook configured but need to ensure it runs automatically before other hooks

2. **Modify Pre-commit Config**

   - Update the execution order of hooks in `.pre-commit-config.yaml`
   - Move the prettier-fix hook to run before other formatting checks
   - Configure it to automatically stage changes

3. **Add Fix Options to ESLint and Stylelint**

   - Update npm scripts to include --fix options for linters
   - Ensure they can be run automatically

4. **Update Documentation**
   - Document the automated formatting workflow

## Acceptance Criteria

- Pre-commit hooks should automatically format code before committing
- Developers should not need to manually run formatters
- All code should pass linting checks after automatic formatting
- The process should be documented in CONTRIBUTING.md
