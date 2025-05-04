module.exports = {
  // Define which commit types trigger version bump
  types: [
    // Major version bump for breaking changes
    { type: 'feat', section: 'Features', hidden: false },
    { type: 'fix', section: 'Bug Fixes', hidden: false },
    { type: 'perf', section: 'Performance Improvements', hidden: false },
    { type: 'revert', section: 'Reverts', hidden: false },
    { type: 'docs', section: 'Documentation', hidden: false },
    { type: 'style', section: 'Styles', hidden: false },
    { type: 'chore', section: 'Miscellaneous Chores', hidden: false },
    { type: 'refactor', section: 'Code Refactoring', hidden: false },
    { type: 'test', section: 'Tests', hidden: false },
    { type: 'build', section: 'Build System', hidden: false },
    { type: 'ci', section: 'Continuous Integration', hidden: false },
  ],

  // Configure version bump behavior
  releaseCommitMessageFormat: 'chore(release): {{currentTag}} [skip ci]',

  // Configure CHANGELOG.md formatting
  header: '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n',

  // Customize commits that trigger different version bumps
  // By default:
  // - fix: patch release
  // - feat: minor release
  // - feat with BREAKING CHANGE: major release

  // Skip version bump if commit message contains [skip release]
  issuePrefixes: ['#'],
  issueUrlFormat: '{{repository}}/issues/{{id}}',
  commitUrlFormat: '{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  userUrlFormat: '{{host}}/{{user}}',
};
