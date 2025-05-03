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

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Changes to the build process or auxiliary tools

Example: `feat(currency): add support for CAD currency`

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
