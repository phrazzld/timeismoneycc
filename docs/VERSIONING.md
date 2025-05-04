# Semantic Versioning in Time Is Money

This project follows [Semantic Versioning](https://semver.org/) (SemVer) 2.0.0 standards for version numbering. This document explains how versioning works and how to manage releases.

## Semantic Versioning Format

Versions follow the format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`), where:

- **MAJOR**: Incremented for incompatible API changes or breaking changes
- **MINOR**: Incremented for backward-compatible new features
- **PATCH**: Incremented for backward-compatible bug fixes

## Automated Versioning

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) to automate versioning and changelog generation based on [Conventional Commits](https://www.conventionalcommits.org/).

### How Version Bumping Works

When you run a release command, the following happens automatically:

1. Commit messages since the last release are analyzed
2. The appropriate version number is bumped based on commit types:
   - `fix:` → Patch release (e.g., 1.0.0 → 1.0.1)
   - `feat:` → Minor release (e.g., 1.0.0 → 1.1.0)
   - `feat:` with a `BREAKING CHANGE:` footer or `!` after type/scope → Major release (e.g., 1.0.0 → 2.0.0)
3. A CHANGELOG.md file is updated with the changes
4. A version tag is created in git
5. A release commit is generated

## Release Commands

The following npm scripts are available for creating releases:

```bash
# Automatic version determination based on commits
npm run release

# Force a specific release type
npm run release:patch  # Bump patch version (1.0.0 -> 1.0.1)
npm run release:minor  # Bump minor version (1.0.0 -> 1.1.0)
npm run release:major  # Bump major version (1.0.0 -> 2.0.0)

# Preview what would happen (no changes made)
npm run release:dry-run
```

## Release Process

To create a new release:

1. Ensure all changes are committed with conventional commit messages
2. Ensure the repository is clean (no uncommitted changes)
3. Run a dry run to verify the version change and changelog:
   ```bash
   npm run release:dry-run
   ```
4. Create the actual release:
   ```bash
   npm run release
   ```
5. Push the changes and tag to the remote:
   ```bash
   git push --follow-tags origin master
   ```

## Commit Types and Version Impact

| Commit Type | Description              | Version Impact      |
| ----------- | ------------------------ | ------------------- |
| `fix:`      | Bug fixes                | Patch (0.0.x)       |
| `feat:`     | New features             | Minor (0.x.0)       |
| `perf:`     | Performance improvements | Patch (0.0.x)       |
| `docs:`     | Documentation only       | No version change\* |
| `style:`    | Code style changes       | No version change\* |
| `refactor:` | Code refactoring         | No version change\* |
| `test:`     | Adding/updating tests    | No version change\* |
| `build:`    | Build system changes     | No version change\* |
| `ci:`       | CI configuration changes | No version change\* |
| `chore:`    | Other changes            | No version change\* |

\* These commit types do not trigger a version bump by default, but will be included in the CHANGELOG.

## Breaking Changes

Breaking changes are indicated with a `!` after the type/scope or with a `BREAKING CHANGE:` in the commit footer:

```
feat!: change API behavior
```

or

```
feat: new feature

BREAKING CHANGE: This changes the API behavior
```

Both formats will trigger a major version bump.

## Tips for Effective Versioning

1. Always use conventional commit messages to ensure proper versioning
2. Use breaking changes sparingly - only when there's a significant incompatible change
3. Run `npm run release:dry-run` before actual releases to confirm the changes
4. Review the CHANGELOG.md after each release to ensure it correctly captures the changes
