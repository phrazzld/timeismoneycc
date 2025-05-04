# Time Is Money

[![CI](https://github.com/phaedrus/timeismoneycc/actions/workflows/ci.yml/badge.svg)](https://github.com/phaedrus/timeismoneycc/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/phaedrus/timeismoneycc/branch/master/graph/badge.svg)](https://codecov.io/gh/phaedrus/timeismoneycc)

A Chrome extension that automatically converts prices online into hours of work, helping you make mindful purchasing decisions.

![Time Is Money Icon](images/icon.png)

## Features

- **Automatic Price Conversion**: Automatically converts online prices to equivalent work hours based on your income
- **Multiple Currencies**: Supports multiple currencies including USD, GBP, EUR, and MXN
- **Customizable Income**: Set your income amount (hourly or yearly) to personalize calculations
- **Unobtrusive Design**: Cleanly displays work-time equivalent alongside original prices
- **Privacy-Focused**: All calculations happen locally on your browser - no data is sent to any server

## Installation

1. Visit the [Chrome Web Store page](https://chrome.google.com/webstore/detail/time-is-money/ooppbnomdcjmoepangldchpmjhkeendl)
2. Click "Add to Chrome"
3. Configure your income and currency in the extension settings

## Usage

Once installed, the extension works automatically:

1. Browse to any website with prices
2. The extension will detect prices and display the equivalent work hours
3. Make more informed purchasing decisions based on your personal "time cost"

Example:

```
Original: $445.00
With Time Is Money: $445.00 (61h 23m)
```

## Development Setup

### Prerequisites

- A modern web browser (preferably Chrome)
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development

1. Clone this repository:

   ```bash
   git clone https://github.com/phaedrus/timeismoneycc.git
   cd timeismoneycc
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   This will automatically install pre-commit hooks.

3. Run tests:

   ```bash
   npm test
   ```

4. Lint code:

   ```bash
   npm run lint
   npm run lint:css
   ```

5. Pre-commit hooks:
   The project uses pre-commit hooks to ensure code quality and security. These run automatically when you commit changes and include:

   - Linting JavaScript and CSS
   - Running tests
   - Checking for trailing whitespace and file formatting
   - Preventing large file commits (>500KB)
   - Detecting and preventing sensitive data commits:
     - API keys
     - Private keys
     - AWS credentials
     - Passwords and tokens
     - Other sensitive patterns
   - Enforcing code quality:
     - Case conflict detection
     - Proper script shebangs
     - Python syntax checking
     - Symlink validation
   - Preventing binary file commits (except allowed images)

6. Open Chrome and navigate to `chrome://extensions/`

7. Enable "Developer mode" in the top-right corner

8. Click "Load unpacked" and select the cloned repository folder

9. Make changes to the code and reload the extension to test

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## Contact

Phaedrus Raznikov - [phaedrus.io](https://www.phaedrus.io)

Chrome Web Store: [Time Is Money](https://chrome.google.com/webstore/detail/time-is-money/ooppbnomdcjmoepangldchpmjhkeendl)
