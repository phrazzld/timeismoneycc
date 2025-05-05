# BACKLOG

This backlog outlines planned work, balancing immediate technical foundations and development philosophy alignment with longer-term feature development, UI/UX enhancements, and strategic goals.

## High Priority

### Core Infrastructure & CI/CD

- **Enhancement**: **Implement Core CI Pipeline with Quality Gates**

  - **Complexity**: Medium
  - **Rationale**: Ensures code quality, prevents regressions, enforces standards (linting, type checking, tests, security), and aligns with the mandatory Automation Everywhere philosophy. Critical for stable development.
  - **Expected Outcome**: GitHub Actions workflow validating every PR/push. Failing builds block merges based on lint errors, type errors, test failures, low coverage, or critical/high security vulnerabilities.
  - **Dependencies**: None

- **Enhancement**: **Configure Strict TypeScript Build & Remove Legacy JS**

  - **Complexity**: Medium
  - **Rationale**: Eliminates technical debt (`scripts.js`), enforces type safety across the entire codebase, and ensures alignment with the mandatory Language Strictness philosophy.
  - **Expected Outcome**: `scripts.js` removed. All frontend code is TypeScript, compiled via `tsc` or bundler. `tsconfig.json` enforces strict settings (`"strict": true`). Build process is clean and reliable.
  - **Dependencies**: None

- **Enhancement**: **Integrate Security Vulnerability Scanning in CI**
  - **Complexity**: Simple
  - **Rationale**: Proactively prevents introduction of known vulnerabilities via dependencies, aligning with Security Considerations and protecting users/system.
  - **Expected Outcome**: CI pipeline fails if `npm audit` (or equivalent) detects high or critical vulnerabilities, providing immediate feedback.
  - **Dependencies**: Core CI Pipeline

### Testing & Quality Assurance

- **Refactor**: **Isolate Core Logic from DOM Manipulation for Testability**

  - **Complexity**: Medium
  - **Rationale**: Addresses poor testability by applying Separation of Concerns. Enables reliable unit testing of core state/calculation logic, aligning with Design for Testability. Critical prerequisite for meaningful coverage.
  - **Expected Outcome**: Core business logic (e.g., within `shiftExample`) extracted into pure, testable functions, decoupled from DOM interactions.
  - **Dependencies**: None

- **Enhancement**: **Migrate Testing Framework from Jest to Vitest**

  - **Complexity**: Medium
  - **Rationale**: Improves developer experience and CI performance with faster test execution and better ESM/TypeScript integration, aligning with the goal of fast feedback loops.
  - **Expected Outcome**: All unit tests migrated to Vitest. Test execution times reduced. CI pipeline updated to use Vitest.
  - **Dependencies**: None

- **Enhancement**: **Establish Foundational Unit Test Coverage for Core Logic**
  - **Complexity**: Medium
  - **Rationale**: Verifies correctness of refactored core logic, prevents regressions, and builds confidence. Aligns with Testing Strategy requiring minimum coverage.
  - **Expected Outcome**: Unit tests written for the extracted pure functions, achieving initial high coverage (e.g., 90%+) for this critical logic. Overall project coverage increases.
  - **Dependencies**: Isolate Core Logic, Migrate Testing Framework

### User Experience (UX/UI) & Core Value

- **Feature**: **Define Compelling Visual Design Language & High-Conversion Strategy**

  - **Complexity**: Medium
  - **Rationale**: Establishes the aesthetic direction and user flow strategy required to meet the business goal of a "visually stunning" and "high conversion" application. Provides foundation for UI implementation.
  - **Expected Outcome**: Documented style guide (colors, typography, spacing, tone) and a UX strategy outlining key user flows and conversion optimization tactics for the redesign.
  - **Dependencies**: None

- **Enhancement**: **Implement Foundational Atomic Design Structure & Storybook**
  - **Complexity**: Medium
  - **Rationale**: Sets up the component architecture (Atomic Design) and development environment (Storybook) mandated by the Frontend Philosophy. Essential for building a scalable and maintainable UI system for the redesign.
  - **Expected Outcome**: Project structure includes `src/components/{atoms,molecules,...}`. Storybook is configured to develop and document components in isolation.
  - **Dependencies**: Define Compelling Visual Design Language (provides input for initial atoms)

## Medium Priority

### Architecture & Code Quality

- **Refactor**: **Organize Codebase by Feature/Domain**

  - **Complexity**: Medium
  - **Rationale**: Improves modularity, maintainability, and developer understanding by grouping related code together, aligning with Architecture Guidelines (Package by Feature).
  - **Expected Outcome**: `src/` directory reorganized into feature-based folders (e.g., `src/calculator/`, `src/landing/`, `src/core/`), reducing coupling and improving navigation.
  - **Dependencies**: None

- **Enhancement**: **Implement Structured Logging Utility**
  - **Complexity**: Medium
  - **Rationale**: Replaces inconsistent `console.log` calls with a standardized logging approach (JSON format), enabling effective monitoring, debugging, and observability as per Logging Strategy.
  - **Expected Outcome**: Centralized logging utility implemented. Logs are structured JSON including level, timestamp, message, and optional context. Minimal `console.log` usage remains.
  - **Dependencies**: None

### Build, CI/CD, & Operations

- **Enhancement**: **Set Up Automated Dependency Updates (Dependabot/Renovate)**

  - **Complexity**: Simple
  - **Rationale**: Reduces manual effort, keeps dependencies current, and mitigates security risks proactively, aligning with Disciplined Dependency Management and Automation Everywhere.
  - **Expected Outcome**: Dependabot or Renovate configured to automatically create PRs for dependency updates, validated by the CI pipeline.
  - **Dependencies**: Core CI Pipeline

- **Enhancement**: **Implement Automated Changelog Generation**
  - **Complexity**: Simple
  - **Rationale**: Ensures consistent release notes, supports Semantic Versioning, and improves communication by automating changelog creation based on Conventional Commits.
  - **Expected Outcome**: `CHANGELOG.md` automatically generated and updated as part of the release process integrated into CI/CD. Requires enforcement of Conventional Commits.
  - **Dependencies**: Core CI Pipeline, Conventional Commit Enforcement (via linting/hooks)

### UI/UX & Design System

- **Feature**: **Implement High-Conversion UI Redesign based on Strategy**

  - **Complexity**: Complex
  - **Rationale**: Directly addresses the core business goal by implementing the visual design and UX strategy defined earlier, focusing on optimizing key user actions (e.g., downloads).
  - **Expected Outcome**: Key pages/flows redesigned and implemented using the new design language and atomic components. Measurable improvement in conversion rates via analytics or A/B testing.
  - **Dependencies**: Define Compelling Visual Design Language, Implement Foundational Atomic Design Structure & Storybook

- **Enhancement**: **Develop Core Atomic Components in Storybook**
  - **Complexity**: Medium
  - **Rationale**: Builds the reusable UI building blocks (buttons, inputs, text styles, etc.) defined by the design language within the Storybook environment, enabling the UI redesign.
  - **Expected Outcome**: Library of core Atom and Molecule components built, tested, and documented in Storybook, ready for use in Organisms and Pages.
  - **Dependencies**: Implement Foundational Atomic Design Structure & Storybook

### Testing & Quality Assurance

- **Enhancement**: **Enforce Test Coverage Thresholds in CI**
  - **Complexity**: Simple
  - **Rationale**: Ensures minimum quality standards are maintained over time by failing builds if coverage drops below defined levels (e.g., 85% overall), aligning with Test Coverage Enforcement philosophy.
  - **Expected Outcome**: CI pipeline includes a coverage check step that enforces configured thresholds.
  - **Dependencies**: Establish Foundational Unit Test Coverage

## Low Priority

### Architecture & Code Quality

- **Refactor**: **Standardize CSS Styling Approach (e.g., Tailwind CSS or BEM)**
  - **Complexity**: Medium
  - **Rationale**: Improves CSS maintainability, consistency, and scalability. Replaces ad-hoc styling or aligns legacy styles (BEM) with a chosen modern approach (like utility-first Tailwind, often paired with design systems).
  - **Expected Outcome**: Consistent application of the chosen styling methodology (e.g., Tailwind utilities configured with design tokens, or strict BEM). Legacy/inconsistent styles refactored.
  - **Dependencies**: Develop Core Atomic Components (styling applied here)

### Operational Excellence & Observability

- **Enhancement**: **Implement Basic Performance Monitoring (Frontend)**
  - **Complexity**: Simple
  - **Rationale**: Provides initial visibility into user-perceived performance (e.g., Core Web Vitals), enabling identification of major bottlenecks. Aligns with Observability goals.
  - **Expected Outcome**: Basic Real User Monitoring (RUM) or integration with an analytics tool to capture key frontend performance metrics.
  - **Dependencies**: Structured Logging (potentially for sending metrics)

### Documentation & Developer Experience

- **Fix**: **Align Development Philosophy Documentation with Reality**
  - **Complexity**: Simple
  - **Rationale**: Ensures documentation accurately reflects the chosen technologies (e.g., Vitest instead of Jest), tools, and practices, reducing confusion for developers.
  - **Expected Outcome**: `DEVELOPMENT_PHILOSOPHY*.md` files updated to match the current stack and decisions made (testing framework, component library, state management choices, etc.).
  - **Dependencies**: Key technical decisions finalized (Testing Framework, UI Library, etc.)

## Future Considerations

### Innovation & Research

- **Research**: **Explore Advanced Conversion Optimization Techniques (e.g., A/B Testing Tools, Heatmaps)**

  - **Complexity**: Medium
  - **Rationale**: Investigates tools and methods for data-driven optimization beyond the initial redesign, enabling continuous improvement of business goals.
  - **Expected Outcome**: Evaluation report on suitable A/B testing frameworks, analytics tools (heatmaps, session replay), and strategies for ongoing conversion optimization.

- **Research**: **Investigate Novel UI Features or Interactions**

  - **Complexity**: Medium
  - **Rationale**: Explores creative ways to enhance user delight or engagement (e.g., micro-animations, interactive elements) beyond core functionality.
  - **Expected Outcome**: Prototypes or feasibility studies for innovative UI concepts.

- **Research**: **Evaluate WebAssembly (WASM) for Performance-Critical Calculations**
  - **Complexity**: Complex
  - **Rationale**: Explores potential performance gains for complex calculations, should they become a bottleneck in the future.
  - **Expected Outcome**: Feasibility report and potential benchmarks comparing JS vs WASM for specific calculation logic.

### Operational Excellence

- **Enhancement**: **Implement End-to-End (E2E) Testing for Critical Flows**

  - **Complexity**: Complex
  - **Rationale**: Provides highest confidence by testing user journeys through the deployed application, verifying integration of all parts. Mandatory per Testing Strategy for critical flows.
  - **Expected Outcome**: E2E test suite (using Cypress or Playwright) covering key user scenarios (e.g., successful download flow), integrated into CI/CD (potentially run less frequently).

- **Enhancement**: **Integrate Error Tracking Platform (e.g., Sentry)**
  - **Complexity**: Medium
  - **Rationale**: Provides real-time visibility into production errors, enabling faster detection and resolution of issues impacting users.
  - **Expected Outcome**: Errors are automatically reported to Sentry (or similar) with context from structured logs.

### Feature Expansion

- **Feature**: **Implement Internationalization (i18n)**

  - **Complexity**: Complex
  - **Rationale**: Expands the application's reach to a global audience by supporting multiple languages and locales.
  - **Expected Outcome**: Framework for managing translations implemented. User-facing text extracted. Language selection mechanism available.

- **Enhancement**: **Achieve Full Accessibility (WCAG 2.1 AA) Compliance**
  - **Complexity**: Complex
  - **Rationale**: Ensures the application is usable by everyone, including users with disabilities. Aligns with best practices and legal requirements.
  - **Expected Outcome**: Application audited against WCAG 2.1 AA standards. Issues remediated. Automated accessibility checks integrated into CI/Storybook.
