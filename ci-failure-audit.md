# CI Failure Audit

## PR Details
- PR: [#6 - Setup GitHub Actions CI pipeline](https://github.com/phrazzld/timeismoneycc/pull/6)
- Commit: bae962a (latest commit to the PR)
- Branch: feat/github-actions-ci

## Failure Summary
The CI workflow failed in the "Validate HTML" step. This step uses the Cyb3r-Jak3/html5validator-action@v7.2.0 action to validate the HTML files in the repository.

## Identified HTML Issues
After examining the index.html file, I've identified several HTML5 validation issues:

1. **Missing alt attribute on image**: 
   ```html
   <img id="brand-image" src="images/icon.png">
   ```
   The `alt` attribute is required for accessibility.

2. **Unclosed span tag**: 
   ```html
   <span id="pay-frequency">hourly</span></span>
   ```
   There appears to be an extra closing `</span>` tag.

3. **Meta tag spacing issue**: 
   Line 9 has a meta tag immediately followed by a link tag without proper spacing:
   ```html
   <meta name="author" content="phaedrus"> <link rel="stylesheet" href="...">
   ```

4. **Improper nesting in footer**: 
   The footer element has Bootstrap grid classes directly applied to it, which may not be valid:
   ```html
   <footer id="site-info" class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
   ```

## Recommended Fixes

1. **Add alt attribute to image**:
   ```html
   <img id="brand-image" src="images/icon.png" alt="Time Is Money logo">
   ```

2. **Fix span tag closure**:
   Review and correct the span nesting in the income display section.

3. **Fix meta tag spacing**:
   Move the link tag to a new line:
   ```html
   <meta name="author" content="phaedrus">
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
   ```

4. **Fix footer structure**:
   Wrap the footer content in a div with the Bootstrap classes:
   ```html
   <footer>
     <div id="site-info" class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
       <hr>
       <p id="copyright"></p>
     </div>
   </footer>
   ```

## Action Plan
1. Create a fix branch from the current PR branch
2. Implement the HTML fixes listed above
3. Configure the HTML validator in CI to better match project needs:
   - Consider adding options to customize error checking
   - Add error details to the CI output 
4. Create a PR with these fixes and merge to the CI setup branch
5. Enhance the project with HTML linting as part of pre-commit hooks