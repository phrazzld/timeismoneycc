# T012 - Add security scanning step to CI workflow

## Task Details

- **Task:** Add security scanning step to ci workflow
- **Context:** PLAN.md - Step 6: Implement Security Scanning Job
- **Action:**
  1. Add step to run `npm audit --audit-level=high`.
  2. Ensure the step fails if `npm audit` finds high or critical vulnerabilities.

## Implementation Plan

1. Add a new step to the CI workflow for security scanning
2. Use the `npm audit --audit-level=high` command to check for high/critical vulnerabilities
3. Ensure the command fails the workflow if vulnerabilities are found (this is default behavior)
4. Place the step in a logical order in the workflow (after dependencies are installed)

## Key Considerations

- The package.json file does include a `security-scan` script, but it's focused on git-secrets and doesn't use npm audit
- We should include a description in the step to make it clear what it's checking for
- This security scan will detect vulnerabilities in the package dependencies
