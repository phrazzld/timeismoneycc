# T009 · Refactor · P1: Update `index.html` to reference compiled `dist/scripts.js`

## Task Description

- Modify the `<script>` tag in `index.html` to reference `dist/scripts.js` instead of the legacy JavaScript file
- Verify that the compiled JavaScript loads correctly in the browser

## Implementation Approach

1. Check the current script reference in `index.html`
2. Update the `<script>` tag to reference `dist/scripts.js`
3. Update TODO.md to mark T009 as completed
4. Verification can be done by loading `index.html` in a browser and checking for script loading errors in the console (this will be done manually after the PR is merged)

## Success Criteria

- The `<script>` tag in `index.html` correctly references `dist/scripts.js`
