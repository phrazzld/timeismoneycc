# T011 - Upload Jest coverage report artifact

## Task Details

- **Task:** Upload jest coverage report artifact
- **Context:** PLAN.md - Step 5: Implement Testing Job (Upload report)
- **Action:**
  1. Add a step after the test run using `actions/upload-artifact@v4`.
  2. Configure it to upload the coverage report directory (e.g., `./coverage/`).
  3. Name the artifact clearly (e.g., `coverage-report`).

## Implementation Plan

1. Examine the existing workflow file to see if there's already a coverage report upload step
2. Update or add a step using the latest version of `actions/upload-artifact` (v4)
3. Configure it to upload the coverage directory and give it a clear name
4. Place it after the test step to ensure coverage reports are generated before uploading

## Key Considerations

- The coverage report is generated in the `./coverage/` directory as configured in jest.config.js
- There's already a step in the workflow using codecov/codecov-action@v3 for uploading coverage reports
- We'll update this to use GitHub's native artifact storage instead
- Using GitHub's artifact storage makes reports easily accessible in the GitHub Actions UI
