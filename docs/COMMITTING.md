# Committing Code to Time Is Money

This guide provides step-by-step instructions for committing code to the Time Is Money project following our conventional commits standard.

## Setting Up

1. Ensure your local repository has the commit template configured:

```bash
git config --local commit.template docs/COMMIT_TEMPLATE.md
```

2. Make sure you have pre-commit hooks installed:

```bash
npm run pre-commit:install-hooks
```

## Commit Process

1. **Stage your changes:**

```bash
git add <files-to-commit>
```

2. **Create a commit with the conventional format:**

```bash
git commit
```

The template will appear in your editor. Fill it with:

```
<type>(<scope>): <short summary>

<body>

<footer>
```

For example:

```
feat(auth): implement login component

Add login form with validation and error handling.
Connect to authentication API endpoints.

Closes #42
```

3. **Push your changes:**

```bash
git push origin <branch-name>
```

## Type Reference

Choose the appropriate type for your commit:

- **feat**: A new feature for the user
- **fix**: A bug fix for the user
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes to the build system or dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

## Commit Message Do's and Don'ts

### Do's

- Keep the summary line under 72 characters
- Use imperative, present tense: "add" not "added" or "adds"
- Use lowercase for the type and scope
- Be specific about what changed
- Reference issues/tickets in the footer when applicable

### Don'ts

- End the summary line with a period
- Use past or continuous tense in the summary
- Include "and" in the summary (split into multiple commits instead)
- Assume the reviewer knows the problem context
- Leave the commit message empty or generic ("fix stuff")
