# CI Workflow Test Plan

This document outlines the process for testing the CI workflow failure modes and verifying that they correctly block PRs when branch protection rules are configured.

## Prerequisites

1. The CI workflow must be implemented and committed to the `master` branch.
2. Branch protection rules must be configured in the GitHub repository settings:
   - Go to the repository on GitHub > Settings > Branches
   - Add a rule for the `master` branch
   - Enable "Require status checks to pass before merging"
   - Search for and select all CI job names (`lint`, `typecheck`, `test`, `security`)
   - Enable "Require branches to be up to date before merging" (recommended)
   - Save changes

## Test Process

Create a test branch and PR targeting `master`, then follow these steps to test each quality gate:

### 1. Test Linting Failure

**Introduce Error:**

```bash
# Create a branch for testing
git checkout -b test/ci-lint-failure
# Introduce a linting error (missing semicolon in TypeScript)
echo "const badVariable = 5" >> scripts.ts
git add scripts.ts
git commit -m "test: introduce lint error to verify CI failure"
git push origin test/ci-lint-failure
```

**Verify:**

- Create a PR from `test/ci-lint-failure` to `master`
- Verify the `lint` job fails in the CI workflow
- Verify the PR cannot be merged due to failing checks

**Fix:**

```bash
# Fix the linting error
echo "const goodVariable = 5;" >> scripts.ts
git add scripts.ts
git commit -m "fix: correct lint error"
git push origin test/ci-lint-failure
```

### 2. Test TypeScript Error

**Introduce Error:**

```bash
# Create a branch for testing
git checkout -b test/ci-typecheck-failure
# Introduce a type error
echo "const num: number = 'string';" >> scripts.ts
git add scripts.ts
git commit -m "test: introduce type error to verify CI failure"
git push origin test/ci-typecheck-failure
```

**Verify:**

- Create a PR from `test/ci-typecheck-failure` to `master`
- Verify the `typecheck` job fails in the CI workflow
- Verify the PR cannot be merged due to failing checks

**Fix:**

```bash
# Fix the type error
git checkout scripts.ts
echo "const num: number = 5;" >> scripts.ts
git add scripts.ts
git commit -m "fix: correct type error"
git push origin test/ci-typecheck-failure
```

### 3. Test Jest Failure

**Introduce Error:**

```bash
# Create a branch for testing
git checkout -b test/ci-test-failure
# Introduce a test failure by modifying scripts.js to break a test
# For example, change the copyright year function to return the wrong value
git add scripts.js
git commit -m "test: break a test to verify CI failure"
git push origin test/ci-test-failure
```

**Verify:**

- Create a PR from `test/ci-test-failure` to `master`
- Verify the `test` job fails in the CI workflow
- Verify the PR cannot be merged due to failing checks

**Fix:**

```bash
# Fix the test issue
git checkout scripts.js
git add scripts.js
git commit -m "fix: restore proper test functionality"
git push origin test/ci-test-failure
```

### 4. Test Security Scan Failure

**Note:** Introducing a high-severity vulnerability deliberately may not be practical. This step is optional and should be done with caution.

**Theoretical Approach:**

- You could temporarily add a known vulnerable package version to your `package.json`
- Alternatively, you could modify the workflow temporarily to treat lower-severity issues as high-severity

### 5. Test All Checks Passing

After fixing all the issues:

**Verify:**

- All CI jobs should pass on the final PR
- The PR should be mergeable (assuming all other PR requirements are met)
- Merge the PR to confirm that the workflow works end-to-end

## Clean Up

After testing, clean up all test branches:

```bash
git checkout master
git pull
git branch -D test/ci-lint-failure test/ci-typecheck-failure test/ci-test-failure
git push origin --delete test/ci-lint-failure test/ci-typecheck-failure test/ci-test-failure
```

## Troubleshooting

If any of the tests do not behave as expected:

1. Check the GitHub Actions logs for detailed error information
2. Verify that branch protection rules are properly configured
3. Ensure all workflow jobs have the correct names matching what's configured in branch protection
4. Check that you've pushed your changes to the correct branch
