# BACKLOG

This backlog outlines planned work for the "timeismoneycc" project. It balances immediate foundational needs, adherence to our Development Philosophy, and long-term strategic goals, focusing on delivering a high-quality, maintainable, and "visually stunning, high-conversion application."

## High Priority

### Core Platform & Developer Experience

- **[Enhancement]**: **Implement Pre-commit Hooks for Automated Formatting and Linting**

  - **Complexity**: Simple
  - **Rationale**: Enforces Coding Standards (Formatting with Prettier, Linting with ESLint) automatically before code enters the repository. Improves code consistency, catches errors early, and streamlines developer workflow, aligning with "Automation Everywhere."
  - **Expected Outcome**: Pre-commit hooks (e.g., using Husky and lint-staged) automatically run Prettier and ESLint on staged files. Commits failing these checks are blocked.
  - **Dependencies**: None

- **[Enhancement]**: **Standardize Branch Naming Convention & Update Documentation**
  - **Complexity**: Simple
  - **Rationale**: Improves clarity and consistency in development workflows and documentation, aligning with "Explicit is Better than Implicit." Addresses inconsistencies noted in CI configuration (`master`) vs. documentation (`main`).
  - **Expected Outcome**: All project documentation (README.md, PLAN.md, etc.) and CI/CD configurations consistently use a single main branch name (e.g., `main`).
  - **Dependencies**: None

### Architecture & Technical Excellence

- **[Refactor]**: **Isolate Core Application Logic from DOM Manipulation**

  - **Complexity**: Medium
  - **Rationale**: Critical for "Design for Testability" and "Separation of Concerns." Decouples business logic (e.g., calculator functions within `scripts.ts`) from UI rendering, enabling robust unit testing and easier maintenance.
  - **Expected Outcome**: Core business logic extracted into pure, testable TypeScript functions or modules, independent of DOM elements. These functions can be unit-tested without a browser environment.
  - **Dependencies**: None

- **[Completed]**: **Refactor `shiftExample` to be Data-Driven**
  - **Complexity**: Medium
  - **Rationale**: Reduces verbosity and improves maintainability of the `shiftExample` function by adopting a data-driven structure over extensive conditionals. Contributes to code quality, Simplicity, and Code Size Optimization.
  - **Expected Outcome**: `shiftExample` logic is refactored to use a configuration map or array of state objects, leading to reduced lines of code, simpler logic, and easier extensibility.
  - **Dependencies**: Isolate Core Application Logic from DOM Manipulation (Note: This dependency was partially addressed as we focused on restructuring the function but did not fully decouple from DOM manipulation)

### Product Definition & User Value

- **[Feature]**: **Define Compelling Visual Design Language & High-Conversion UX Strategy**

  - **Complexity**: Medium
  - **Rationale**: Directly supports the project's purpose of being "visually stunning" and achieving "high conversion." Lays the strategic groundwork for UI/UX development, ensuring business goals are met.
  - **Expected Outcome**: A documented style guide (colors, typography, spacing, iconography, tone of voice) and a UX strategy document outlining key user flows, conversion funnels, and A/B testing hypotheses for the application.
  - **Dependencies**: None

- **[Enhancement]**: **Implement Foundational Atomic Design Structure & Storybook**
  - **Complexity**: Medium
  - **Rationale**: Adopts "Atomic Design" and "Storybook-First Development" as mandated by the Frontend Development Philosophy. Enables systematic, isolated component development, fostering reusability, testability, and a living design system.
  - **Expected Outcome**: Project structure includes `src/components/{atoms,molecules,organisms}`. Storybook is configured, allowing components to be developed, viewed, and documented in isolation.
  - **Dependencies**: Define Compelling Visual Design Language

### Testing & Quality Assurance

- **[Enhancement]**: **Migrate Testing Framework from Jest to Vitest**

  - **Complexity**: Medium
  - **Rationale**: Improves developer experience and CI performance with faster test execution and native ESM/TypeScript support, aligning with the goal of "Fast Feedback Loops" from the Testing Strategy.
  - **Expected Outcome**: All existing unit tests migrated to Vitest. Test execution times demonstrably reduced. CI pipeline updated to use Vitest for test execution.
  - **Dependencies**: None

- **[Enhancement]**: **Establish Foundational Unit Test Coverage for Core Logic**
  - **Complexity**: Medium
  - **Rationale**: Verifies correctness of refactored core logic, prevents regressions, and builds confidence. Aligns with "Testing Strategy" requiring minimum coverage for critical components.
  - **Expected Outcome**: Comprehensive unit tests written for the extracted pure functions (from "Isolate Core Application Logic"), achieving >90% coverage for this logic. Test coverage reported in CI.
  - **Dependencies**: Isolate Core Application Logic from DOM Manipulation, Migrate Testing Framework from Jest to Vitest

### Build, CI/CD & Operational Excellence

- **[Enhancement]**: **Integrate Security Vulnerability Scanning in CI (Blocking)**

  - **Complexity**: Simple
  - **Rationale**: Fulfills "Security Considerations" by proactively identifying vulnerabilities in dependencies. Aligns with CI/CD "Mandatory Stages" and the philosophy of failing builds on critical/high severity vulnerabilities.
  - **Expected Outcome**: CI pipeline automatically runs `npm audit --audit-level=high` (or equivalent) and fails the build if new high or critical severity vulnerabilities are detected. Existing vulnerabilities addressed.
  - **Dependencies**: Core CI Pipeline Setup

- **[Enhancement]**: **Use `npm ci` for Reproducible Builds in CI Workflow**

  - **Complexity**: Simple
  - **Rationale**: `npm ci` provides faster, more reliable, and strictly reproducible builds compared to `npm install` in CI environments, as per best practices and "Reproducible Builds" philosophy.
  - **Expected Outcome**: CI workflow updated to use `npm ci` for installing dependencies. `package-lock.json` is consistently maintained and used.
  - **Dependencies**: Core CI Pipeline Setup

- **[Enhancement]**: **Make HTML Validation Blocking in CI**

  - **Complexity**: Simple
  - **Rationale**: Enforces markup quality by treating HTML validation errors as build failures, aligning with the principle of failing on any linting/validation error.
  - **Expected Outcome**: CI workflow step for HTML validation is configured to fail the build upon detecting errors, once initial validation issues are resolved.
  - **Dependencies**: Core CI Pipeline Setup

- **[Enhancement]**: **Implement Comprehensive Build-Time Asset Minification**
  - **Complexity**: Medium
  - **Rationale**: Reduces production bundle sizes for HTML, CSS, and JavaScript, leading to faster load times and improved user experience. Aligns with Code Size Optimization goals.
  - **Expected Outcome**: Build process includes steps for minifying HTML, CSS, and JS assets. Measurable reduction (e.g., HTML 10-25%, CSS 15-30%, JS 20-50%) in asset sizes.
  - **Dependencies**: Configure Strict TypeScript Build

## Medium Priority

### Architecture & Code Quality

- **[Refactor]**: **Organize Codebase by Feature/Domain (Package-by-Feature)**

  - **Complexity**: Medium
  - **Rationale**: Improves "Modularity" and maintainability by structuring code around business capabilities, as per "Package/Module Structure: Organize by Feature, Not Type."
  - **Expected Outcome**: `src/` directory is reorganized into feature-based folders (e.g., `src/calculator/`, `src/shared/`, `src/core/`). Reduced coupling between features and improved code navigation.
  - **Dependencies**: Configure Strict TypeScript Build

- **[Enhancement]**: **Implement Structured Logging Utility (e.g., Pino, Winston)**

  - **Complexity**: Medium
  - **Rationale**: Adopts "Structured Logging is Mandatory" from the Logging Strategy. Replaces `console.log` with a robust logger outputting JSON, enabling effective monitoring, filtering, and analysis.
  - **Expected Outcome**: A chosen structured logging library is integrated. Application logs are in JSON format, including standard fields like timestamp, level, message, and `correlation_id` where applicable. `console.log` usage is minimized.
  - **Dependencies**: None

- **[Refactor]**: **Adopt Utility-First CSS Framework (e.g., Tailwind CSS) & Remove Bootstrap 3**
  - **Complexity**: Complex
  - **Rationale**: Modernizes styling approach, enforces design consistency via design tokens, and significantly reduces CSS bundle size by purging unused styles (replacing large Bootstrap 3). Aligns with Frontend Philosophy (Tailwind CSS) and Code Size Optimization.
  - **Expected Outcome**: Bootstrap 3 CSS is removed. Tailwind CSS is integrated and configured. All new and refactored components use Tailwind utilities. Final CSS bundle size drastically reduced (e.g., >80%).
  - **Dependencies**: Develop Core Atomic Components in Storybook (components will use new styling)

### Product Definition & User Value

- **[Enhancement]**: **Develop Core Atomic Components (Atoms & Molecules) in Storybook**

  - **Complexity**: Medium
  - **Rationale**: Builds the foundational UI elements (buttons, inputs, typography, etc.) based on the defined Visual Design Language, following "Atomic Design" and "Storybook-First" principles.
  - **Expected Outcome**: A library of reusable, well-tested, and documented Atom and Molecule components built in Storybook. Components adhere to accessibility best practices.
  - **Dependencies**: Implement Foundational Atomic Design Structure & Storybook, Define Compelling Visual Design Language

- **[Feature]**: **Implement High-Conversion UI Redesign for Key Application Flows**
  - **Complexity**: Complex
  - **Rationale**: Delivers on the core business goal of a "visually stunning" and "high conversion" application by implementing the new design and UX strategy using the developed atomic components.
  - **Expected Outcome**: Key application pages/flows (e.g., calculator interface, landing/conversion page) are redesigned and implemented. Initial analytics set up to track conversion metrics.
  - **Dependencies**: Develop Core Atomic Components in Storybook, Define Compelling Visual Design Language & High-Conversion UX Strategy

### Build, CI/CD & Operational Excellence

- **[Enhancement]**: **Enforce Test Coverage Thresholds in CI**

  - **Complexity**: Simple
  - **Rationale**: Ensures adherence to "Test Coverage Enforcement" by failing builds if coverage drops below defined targets (e.g., 80% overall, 95% for core logic).
  - **Expected Outcome**: CI pipeline includes a coverage check step (e.g., using Vitest's coverage reporting) that enforces configured thresholds.
  - **Dependencies**: Establish Foundational Unit Test Coverage for Core Logic, Expand Test Coverage Scope in Configuration

- **[Enhancement]**: **Expand Test Coverage Scope in Configuration**

  - **Complexity**: Simple
  - **Rationale**: Adjusts test coverage configuration (e.g., Vitest `collectCoverageFrom`) to accurately reflect the growing TypeScript codebase beyond initially targeted files, for meaningful coverage metrics.
  - **Expected Outcome**: Test coverage configuration in `vitest.config.ts` (or equivalent) includes all relevant source files (e.g., `src/**/*.ts`).
  - **Dependencies**: Migrate Testing Framework from Jest to Vitest

- **[Enhancement]**: **Set Up Automated Dependency Updates (Dependabot/Renovate)**

  - **Complexity**: Simple
  - **Rationale**: Aligns with "Disciplined Dependency Management" and "Automation Everywhere." Reduces manual effort, keeps dependencies current, and mitigates security risks.
  - **Expected Outcome**: Dependabot or Renovate Bot is configured to automatically create PRs for dependency updates, which are then validated by the CI pipeline.
  - **Dependencies**: Integrate Security Vulnerability Scanning in CI (Blocking)

- **[Enhancement]**: **Implement Conventional Commits and Automated Changelog Generation**
  - **Complexity**: Medium
  - **Rationale**: Mandates "Conventional Commits" for standardized commit messages, enabling "Automated Version Bumping and Changelog Generation." Improves release process and communication.
  - **Expected Outcome**: Commit messages are linted to enforce Conventional Commits format (via pre-commit hooks and CI). `CHANGELOG.md` is automatically generated and updated as part of an automated or semi-automated release process.
  - **Dependencies**: Pre-commit Hooks for Automated Formatting and Linting, Core CI Pipeline Setup

### Code Quality & Optimization

- **[Enhancement]**: **Identify and Remove Unused/Dead Code in TypeScript**

  - **Complexity**: Medium
  - **Rationale**: Reduces final bundle size and improves codebase maintainability by removing unused functions, variables, and imports. Aligns with Simplicity and Code Size Optimization.
  - **Expected Outcome**: Codebase scanned using tools like `ts-prune` or ESLint rules. Unused code identified and removed, leading to a smaller, cleaner codebase (e.g., 5-15% JS bundle reduction).
  - **Dependencies**: Configure Strict TypeScript Build

- **[Enhancement]**: **Optimize Image Assets for Web Delivery**
  - **Complexity**: Simple
  - **Rationale**: Reduces page weight by compressing images (e.g., `images/icon.png`), resizing to appropriate dimensions, and using optimal formats (e.g., WebP). Improves load times and user experience.
  - **Expected Outcome**: Image assets optimized, resulting in significant file size reduction (e.g., 10-70%) with no perceptible loss in quality.
  - **Dependencies**: None

## Low Priority

### Code Quality & Minor Optimizations

- **[Enhancement]**: **Audit and Remove Unused `devDependencies`**

  - **Complexity**: Simple
  - **Rationale**: Improves project hygiene, reduces `node_modules` size, and speeds up installation times (especially in CI). Contributes to a leaner development environment.
  - **Expected Outcome**: Unnecessary `devDependencies` removed from `package.json`. Faster CI setup times.
  - **Dependencies**: None

- **[Refactor]**: **Review and Refine Code Comments for Clarity and Conciseness**

  - **Complexity**: Simple
  - **Rationale**: Aligns with "Document Decisions, Not Mechanics." Ensures comments explain the _why_ for non-obvious code, removing redundant or "what" comments.
  - **Expected Outcome**: Code comments are more impactful, focusing on rationale and complex logic. Redundant comments are removed.
  - **Dependencies**: None

- **[Refactor]**: **Consolidate Repeated DOM Element Selections**

  - **Complexity**: Simple
  - **Rationale**: Reduces code repetition by caching DOM selections, minimizing LOC and potentially improving minor performance aspects.
  - **Expected Outcome**: Repeated `document.getElementById()` calls for the same elements are refactored to use cached variables. Minor LOC reduction.
  - **Dependencies**: Isolate Core Application Logic from DOM Manipulation

- **[Refactor]**: **Consolidate or Inline Single-Use Helper Functions**
  - **Complexity**: Simple
  - **Rationale**: Reduces abstraction overhead by inlining simple, single-use functions where appropriate, potentially minimizing LOC and simplifying code flow.
  - **Expected Outcome**: Minor LOC reduction, simpler code flow in specific areas.
  - **Dependencies**: None

### Documentation & Consistency

- **[Fix]**: **Resolve `CI-TEST-PLAN.md` Reference in README.md**

  - **Complexity**: Simple
  - **Rationale**: Corrects or removes reference to non-existent `CI-TEST-PLAN.md` in `README.md` for clarity and accuracy of documentation.
  - **Expected Outcome**: `README.md` updated to remove or clarify the reference, or the `CI-TEST-PLAN.md` file is added if deemed relevant.
  - **Dependencies**: None

- **[Enhancement]**: **Update `TODO.md` for Accuracy with CI Implementation**
  - **Complexity**: Simple
  - **Rationale**: Ensures `TODO.md` accurately reflects the actual CI implementation and decisions made, maintaining documentation integrity.
  - **Expected Outcome**: `TODO.md` reviewed and updated to align with the implemented `ci.yml`, documenting any intentional deviations or completed tasks accurately.
  - **Dependencies**: None

### Operational Excellence & Observability

- **[Enhancement]**: **Implement Basic Frontend Performance Monitoring (Core Web Vitals)**
  - **Complexity**: Simple
  - **Rationale**: Provides initial visibility into "Observability" for user-perceived performance. Allows identification of major bottlenecks and tracks Core Web Vitals (LCP, FID, CLS).
  - **Expected Outcome**: A lightweight analytics tool or browser API integration is set up to capture and report Core Web Vitals for the application.
  - **Dependencies**: Implement High-Conversion UI Redesign for Key Application Flows (to have a deployed app to monitor)

## Future Considerations

### Innovation & Research

- **[Research]**: **Explore Advanced Conversion Optimization Techniques (A/B Testing, Heatmaps)**

  - **Complexity**: Medium
  - **Rationale**: Investigates data-driven optimization tools and methodologies for continuous improvement of business goals (conversion rates) post-initial redesign.
  - **Expected Outcome**: Evaluation report on suitable A/B testing frameworks, heatmap tools, session replay analytics, and strategies for ongoing conversion optimization.

- **[Research]**: **Investigate Novel UI Features or Interactions (e.g., Micro-animations)**

  - **Complexity**: Medium
  - **Rationale**: Explores creative enhancements to boost user engagement and delight beyond core functionality, potentially creating competitive differentiation.
  - **Expected Outcome**: Prototypes or feasibility studies for innovative UI concepts that align with the brand and user experience goals.

- **[Research]**: **Evaluate WebAssembly (WASM) for Performance-Critical Calculations**
  - **Complexity**: Complex
  - **Rationale**: Assesses potential performance gains for complex client-side calculations if they become bottlenecks, particularly for a productivity application.
  - **Expected Outcome**: Feasibility report and benchmarks comparing JavaScript vs. WASM for specific, identified calculation-intensive logic.

### Operational Excellence & Scalability

- **[Enhancement]**: **Implement End-to-End (E2E) Testing for Critical Flows**

  - **Complexity**: Complex
  - **Rationale**: Ensures confidence in user journeys through the deployed application, verifying integration of all components. Mandatory for critical flows per Testing Strategy.
  - **Expected Outcome**: E2E test suite (e.g., using Cypress or Playwright) covering key user scenarios, integrated into CI/CD (potentially run on a schedule or pre-production).

- **[Enhancement]**: **Integrate Error Tracking Platform (e.g., Sentry)**
  - **Complexity**: Medium
  - **Rationale**: Provides real-time visibility into production errors, enabling faster detection, diagnosis, and resolution of issues impacting users.
  - **Expected Outcome**: Frontend errors are automatically reported to an error tracking platform with relevant context (e.g., from structured logs, user agent, release version).

### Feature Expansion & Market Reach

- **[Feature]**: **Implement Internationalization (i18n)**

  - **Complexity**: Complex
  - **Rationale**: Expands the application's reach to a global audience by supporting multiple languages and locales, potentially increasing user adoption and market share.
  - **Expected Outcome**: A robust i18n framework implemented. User-facing text extracted into resource files. Language selection mechanism available to users.

- **[Enhancement]**: **Achieve Full Accessibility (WCAG 2.1 AA) Compliance**
  - **Complexity**: Complex
  - **Rationale**: Ensures the application is usable by all users, including those with disabilities. Aligns with ethical best practices, legal requirements, and can expand user base.
  - **Expected Outcome**: Application audited and remediated for WCAG 2.1 AA standards. Automated accessibility checks integrated into CI/Storybook. Accessibility statement published.

## Code Size Optimization

### Critical

- **[Size Optimization]**: **Remove Legacy `scripts.js` File After Full TypeScript Migration**

  - **Complexity**: Simple
  - **Rationale**: The `scripts.js` file is a legacy JavaScript version of `scripts.ts`. Once the TypeScript version is fully functional and adopted (as per "Configure Strict TypeScript Build & Remove Legacy JS"), this file becomes pure duplication, increasing codebase size and maintenance overhead.
  - **Expected Outcome**: Removal of `scripts.js` (approx. 50-100 LOC reduction). Reduces final bundle size by eliminating a redundant asset. Simplifies codebase and build configuration.
  - **Dependencies**: Configure Strict TypeScript Build & Remove Legacy JS

- **[Size Optimization]**: **Replace Bootstrap 3 CSS with a Purged Utility-First CSS Framework (e.g., Tailwind CSS)**
  - **Complexity**: Complex
  - **Rationale**: Bootstrap 3 is a large CSS framework (~150KB uncompressed) and likely includes many unused styles for a simple application/extension. Migrating to a utility-first framework like Tailwind CSS with its JIT/purging capabilities will drastically reduce the final CSS bundle size to only what is used. This aligns with the goal to "Standardize CSS Styling Approach".
  - **Expected Outcome**: Significant reduction in delivered CSS size (potentially >80% reduction, e.g., from ~150KB to <30KB). Faster style rendering. Modernized styling approach.
  - **Dependencies**: Adopt Utility-First CSS Framework (e.g., Tailwind CSS) & Remove Bootstrap 3

### High

- **[Size Optimization]**: **Implement Comprehensive Build-Time Asset Minification**
  - **Complexity**: Medium
  - **Rationale**: Minification of HTML, CSS, and JavaScript assets (compiled from TypeScript) removes unnecessary characters (whitespace, comments, shortening variable names) without altering functionality, leading to significant file size reductions for production deployments.
  - **Expected Outcome**: 10-25% reduction in HTML size, 15-30% reduction in CSS size, 20-50% reduction in JavaScript bundle size. Faster application load times.
  - **Dependencies**: Configure Strict TypeScript Build & Remove All Legacy JavaScript
