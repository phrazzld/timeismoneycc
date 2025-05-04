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

- `feature/my-new-feature` for new features
- `bugfix/issue-description` for bug fixes
- `docs/update-X-documentation` for documentation updates
- `refactor/component-name` for code refactoring

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. All commits **MUST** adhere to this format, which is enforced by pre-commit hooks:

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

A git commit template is available for assistance (automatically loaded when committing).

### Pull Request Process

1. Update documentation if necessary
2. Update the README.md with details of changes if applicable
3. The PR should work on Chrome and compatible browsers
4. PRs require review and approval before merging

## Coding Standards

### JavaScript

- Use ES6 features when appropriate
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single task

### HTML/CSS

- Use semantic HTML elements
- Follow BEM methodology for CSS class naming
- Ensure all UI elements are accessible

### Testing

- Write tests for new features and bug fixes
- Ensure existing tests pass before submitting PRs
- Manual testing should verify functionality across different browsers

## Getting Help

If you need help with anything related to contributing, feel free to ask questions in:

1. Issues - Tag your issue with "question"
2. Pull Requests - Ask specific questions about implementation details

Thank you for contributing to Time Is Money!
