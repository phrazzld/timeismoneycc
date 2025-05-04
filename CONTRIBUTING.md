# Contributing to Time Is Money

Thank you for your interest in contributing to Time Is Money! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please report unacceptable behavior to the project maintainers.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Browser and extension version information

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

1. A clear, descriptive title
2. Detailed description of the proposed enhancement
3. An explanation of why this enhancement would be useful
4. Any examples of similar features in other extensions, if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch from `master` for your feature or bugfix
3. Make your changes following our coding standards
4. Add or update tests as necessary
5. Ensure all tests pass
6. Submit a pull request

## Development Workflow

### Branch Naming Conventions

Strictly follow these branch naming conventions (enforced by pre-push hooks):

- `feature/my-new-feature` or `feat/my-new-feature` for new features
- `bugfix/issue-description` for bug fixes
- `docs/update-X-documentation` for documentation updates
- `refactor/component-name` for code refactoring
- `test/add-X-tests` for adding or updating tests
- `chore/task-description` for routine tasks, maintenance
- `ci/pipeline-description` for CI configuration changes
- `build/build-system-update` for build system changes
- `perf/optimization-description` for performance improvements

All branch names must:

- Start with a valid type prefix followed by a slash
- Use only lowercase letters, numbers, and hyphens after the slash
- Be descriptive but concise

Examples of valid branch names:

- `feature/add-user-authentication`
- `bugfix/fix-memory-leak`
- `docs/update-api-docs`

Examples of invalid branch names:

- `new-feature` (missing type prefix)
- `Feature/add-login` (uppercase letters)
- `feature_add_login` (underscores instead of hyphens)
- `feature/` (missing description)

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. All commits **MUST** adhere to this format, which is enforced by pre-commit hooks. See [COMMITTING.md](docs/COMMITTING.md) for a detailed guide on creating proper commits. These commit messages are also used for automated versioning - see [VERSIONING.md](docs/VERSIONING.md) for details:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types (required)

- `feat`: A new feature that adds functionality
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

#### Scope (optional)

A scope provides additional contextual information:

- Scope is the part of the codebase affected, e.g. `api`, `ui`, `hooks`, etc.
- Scope must be lowercase
- Example: `feat(currency): add support for CAD currency`

#### Subject (required)

- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end
- Maximum 72 characters
- Describes what the commit does, not what it did

#### Body (optional)

- Explains the motivation for the changes
- Uses imperative, present tense
- Includes relevant background information
- Maximum 100 characters per line

#### Footer (optional)

- References related issues: `Fixes #123`, `Related to #456`
- Notes breaking changes: start with `BREAKING CHANGE:` followed by description
- Or mark with a `!` after the type/scope: `feat!:` or `feat(api)!:`

#### Examples

✅ Good:

```
feat(currency): add support for CAD currency

Implement automatic detection and conversion of Canadian dollars.
Update currency symbols and exchange rate API integration.

Closes #123
```

✅ Good with breaking change:

```
feat(api)!: change authentication endpoint response format

The authentication endpoint now returns a JWT token object
instead of a string for enhanced security and flexibility.

BREAKING CHANGE: Clients need to extract token from the object
```

❌ Bad:

```
Added Canadian dollars
```

❌ Bad:

```
fix: Fixed the currency bug.
```

A git commit template is provided in `docs/COMMIT_TEMPLATE.md` and is automatically loaded when committing. If you don't see the template when committing, run `git config --local commit.template docs/COMMIT_TEMPLATE.md` to set it up.

### Pull Request Process

1. Update documentation if necessary
2. Update the README.md with details of changes if applicable
3. The PR should work on Chrome and compatible browsers
4. PRs require review and approval before merging

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict type checking
- Avoid using `any` type - prefer specific types, interfaces, or `unknown`
- Explicitly define return types for functions
- Use ES6 features when appropriate
- Use interfaces to define object shapes and API contracts
- Use type guards for runtime type checking where needed
- Keep code modular and maintain single responsibility principle

### JavaScript

- Legacy JavaScript code should be gradually migrated to TypeScript
- Use ES6 features when appropriate
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single task

### File Length Guidelines

This project enforces specific file length limits to promote maintainability:

- Files exceeding 500 lines will trigger a warning
- Files exceeding 1000 lines will cause an error (commit blocked)
- Functions should not exceed 100 lines
- Test files have a higher threshold (warning at 800 lines)

These limits exclude blank lines and comments. If a file approaches these limits, consider:

- Breaking it into multiple smaller, focused files
- Extracting reusable components or utilities
- Refactoring to reduce complexity

### HTML/CSS

- Use semantic HTML elements
- Follow BEM methodology for CSS class naming
- Ensure all UI elements are accessible

### Testing

- Write tests for new features and bug fixes
- Ensure existing tests pass before submitting PRs
- Manual testing should verify functionality across different browsers

## Versioning

This project follows [Semantic Versioning](https://semver.org/) 2.0.0 and uses automated versioning based on conventional commits. For details on the versioning process, see [VERSIONING.md](docs/VERSIONING.md).

### Version Numbering

Versions follow the `MAJOR.MINOR.PATCH` format (e.g., `1.2.3`):

- **MAJOR**: Incompatible/breaking changes (from commits with `BREAKING CHANGE:` or `type!:` format)
- **MINOR**: New features that are backward-compatible (from `feat:` commits)
- **PATCH**: Bug fixes that are backward-compatible (from `fix:` commits)

### Creating Releases

To create a new release:

```bash
# First, ensure all changes are committed
# Then run the release command
npm run release

# Push both the commit and tag
git push --follow-tags origin master
```

For more details, read the [VERSIONING.md](docs/VERSIONING.md) documentation.

## Development Environment

### Automated Formatting and Linting

This project uses pre-commit hooks to automatically format and lint your code before committing:

1. **Formatting**: Prettier automatically formats your code when you commit
2. **Linting**: ESLint and Stylelint automatically fix issues when possible
3. **Type Checking**: TypeScript checks for type errors

The workflow is designed to require minimal manual intervention:

```bash
# Make your changes
git add .
git commit -m "feat: your feature description"
```

The pre-commit hooks will:

1. Format your code with Prettier
2. Check types with TypeScript
3. Fix linting issues with ESLint and Stylelint
4. Run tests to verify everything works

If you want to manually run these tools:

```bash
# Format code
npm run format

# Fix linting issues
npm run lint:fix:all

# Run type checking
npm run typecheck

# Run tests
npm run test
```

## Getting Help

If you need help with anything related to contributing, feel free to ask questions in:

1. Issues - Tag your issue with "question"
2. Pull Requests - Ask specific questions about implementation details

Thank you for contributing to Time Is Money!
