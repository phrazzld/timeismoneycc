# Time Is Money

A Chrome extension for converting prices to time worked (and the reverse).

✧ Gives you perspective on what things cost in terms of your time.

## Features

- Dynamically calculates how long you need to work to afford something
- Works with multiple currencies and pay frequencies
- Simple but powerful conversion tool

## Local Development Setup

### Prerequisites

- Node.js (v14+)
- npm (v6+)

### Installation

1. Clone the repository

```bash
git clone https://github.com/phaedrus/timeismoneycc.git
cd timeismoneycc
```

2. Install dependencies

```bash
npm install
```

3. Install pre-commit hooks

```bash
npm run pre-commit:install-hooks
```

### Development Commands

- Run tests: `npm test`
- Run linting: `npm run lint`
- Format code: `npm run format`
- Run TypeScript check: `npm run typecheck`

### Git Hooks

This project uses pre-commit and post-commit hooks:

#### Pre-commit hooks:

- Format code with Prettier
- Run ESLint and Stylelint with --fix options
- Run TypeScript type checking
- Run tests
- Prevent commit of sensitive data and large files

#### Post-commit hooks:

- Run `glance ./` asynchronously to analyze the project
- Check if documentation needs updating based on changed files

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
