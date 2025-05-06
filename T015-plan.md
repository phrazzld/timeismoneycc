# T015 - Test CI failure modes and merge blocking

## Task Details

- **Task:** Test ci failure modes and merge blocking
- **Context:** PLAN.md - Step 7: Verify Workflow Functionality; Testing Strategy; Success Criteria
- **Action:**
  1. On a test PR, introduce separate commits each causing a failure in one gate: lint error, type error, failing test, coverage drop, high-severity dependency (if feasible).
  2. For each commit, verify the corresponding CI job fails and the PR status check indicates failure, blocking merge (assuming branch protection rules are/will be active).
  3. Fix all errors in a final commit and verify all CI jobs pass and the PR is mergeable.

## Implementation Plan

1. Document a test plan for introducing and verifying different failure modes
2. Include examples of how each failure can be introduced and fixed
3. Document how to verify that each failure appropriately blocks the PR
4. Note that branch protection rules must be configured in GitHub settings for the blocking aspect to work

## Key Considerations

- We won't actually create the test PR as part of this task - this will be a document that can be followed after committing our changes
- Branch protection rules must be configured separately (as noted in the clarifications)
- Each quality gate should block merges when it fails
- The CI workflow should provide clear feedback on what caused the failure
