# Contributing to FINTRAKR

Thank you for your interest in contributing to FINTRAKR! 🎉

FINTRAKR is a modern, multi-user financial portfolio tracker built with Next.js. It helps families and groups track, analyze, and manage investments across platforms with real-time analytics, secure authentication, and a user-friendly dashboard. We welcome contributions that help improve the codebase, add new features, enhance the user experience, or fix bugs. Your contributions are valuable to making FINTRAKR better for everyone.

## 📋 Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)
- [Getting Help](#getting-help)

## 🤝 Ways to Contribute

### 🐛 Reporting Bugs

Found a bug? Please [open an issue](https://github.com/vkondi/fin-tracker/issues/new?template=bug_report.md) with:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs. actual behavior
- **Screenshots** if applicable
- **Browser and OS** information
- **Console errors** or logs

### 💡 Suggesting Features

Have an idea for a new feature? [Create a feature request](https://github.com/vkondi/fin-tracker/issues/new?template=feature_request.md) including:

- **Feature description** and use case
- **Mockups or examples** if possible
- **Why this would benefit FINTRAKR**

### 🛠️ Code Contributions

Ready to contribute code? Here's how:

1. **Fork** the repository
2. **Create a feature branch** from `master`
3. **Make your changes** following the guidelines below
4. **Test thoroughly** (see testing guidelines)
5. **Submit a pull request**

### 📖 Documentation Improvements

Help improve documentation by:

- Fixing typos or unclear explanations
- Adding code examples
- Improving setup instructions
- Creating tutorials or guides

### 🎨 Design Contributions

Suggestions for UI/UX improvements are welcome:

- Color scheme enhancements
- Layout improvements
- Accessibility improvements
- Mobile responsiveness fixes

## 🚀 Development Setup

### Prerequisites

- **Node.js** 18 or higher
- **Yarn** package manager (recommended)
- **PostgreSQL** database
- **Git** for version control

### Quick Start

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/fin-tracker.git
   cd fin-tracker
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file and configure database and authentication settings as described in the README.

4. **Start the development server**

   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
# Development
yarn dev              # Start development server

# Code Quality
yarn check-types      # Run TypeScript type checking
yarn lint             # Run ESLint

# Testing
yarn test             # Run tests in watch mode
yarn test:run         # Run tests once
yarn test:coverage    # Run tests with coverage report

# Build
yarn build            # Build for production
yarn start            # Start production server
```

### Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # Reusable UI components
├── context/          # React context providers
├── lib/              # Library functions and configurations
├── utils/            # Utility functions
├── middleware.ts     # Next.js middleware
└── ...

docs/                 # Documentation
public/               # Static assets
```

## 📏 Code Standards

### General Guidelines

- **TypeScript First**: All new code must be written in TypeScript
- **Functional Components**: Prefer functional components with hooks
- **Performance**: Optimize for performance and bundle size
- **Accessibility**: Ensure WCAG 2.1 AA compliance

### Code Style

- **ESLint**: Follow all ESLint rules (with jsx-a11y for accessibility)
- **Imports**: Group imports (React, third-party, local) with empty lines between groups

```typescript
// ✅ Good
import React from "react";
import { useState } from "react";

import clsx from "clsx";
import { FaIcon } from "react-icons/fa";

import { useFinContext } from "../context/FinContext";
import { formatCurrency } from "../utils/utility";

// ❌ Avoid
import React, { useState } from "react";
import clsx from "clsx";
import { FaIcon } from "react-icons/fa";
import { useFinContext } from "../context/FinContext";
import { formatCurrency } from "../utils/utility";
```

### Component Guidelines

#### **Mandatory**

- **Single Responsibility**: Each component should have one clear purpose
- **Default Props**: Use default parameters instead of defaultProps

#### **Good to Have**

- **Props Interface**: Define separate TypeScript interfaces for component props (currently used in ~50% of components)
- **Error Boundaries**: Consider error boundaries for complex components with async operations

```typescript
// ✅ Good
interface DashboardCardProps {
  title: string;
  value: number;
  icon?: React.ComponentType;
}

const DashboardCard = ({ title, value, icon: Icon }: DashboardCardProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {Icon && <Icon className="text-gray-500" />}
    </div>
  );
};

// ❌ Avoid
const DashboardCard = ({ title, value, icon }) => {
  // No TypeScript interface
  // No default props pattern
};
```

### File Naming

- **Components**: PascalCase (e.g., `SectionTitle.tsx`)
- **Utilities**: camelCase (e.g., `utility.ts`)
- **Tests**: Same name as component with `.test.tsx` suffix
- **Directories**: camelCase or kebab-case

## 🧪 Testing Guidelines

This project follows comprehensive testing guidelines documented in [`docs/test-cases-guidelines.md`](./docs/test-cases-guidelines.md).

### Key Principles

- **Semantic Selectors**: Use `getByRole`, `getByLabelText`, `getByText` over `data-testid`
- **User-Centric Testing**: Test user interactions and outcomes, not implementation details
- **100% Coverage Goal**: Aim for complete code coverage with meaningful tests
- **Fast Execution**: Keep test suites under 1 second per file

### Testing Commands

```bash
# Run all tests
yarn test

# Generate coverage report
yarn test:coverage
```

### Test Structure

```typescript
// ✅ Good test structure
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks and initial state
  });

  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(<ComponentName />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update Tests**: Ensure all tests pass and add new tests for new features
2. **Code Quality**: Run all quality checks
   ```bash
   yarn check-types && yarn lint
   ```
3. **Test Coverage**: Maintain or improve test coverage
4. **Documentation**: Update documentation for any API changes

### Creating a Pull Request

1. **Branch Naming**: Use descriptive names

   ```
   feature/add-dark-mode-toggle
   fix/mobile-navigation-bug
   docs/update-contributing-guide
   ```

2. **Commit Messages**: Follow conventional commits

   ```
   feat: add dark mode toggle component
   fix: resolve mobile navigation overflow
   docs: update installation instructions
   ```

3. **PR Description**: Include
   - **What** was changed and **why**
   - **Screenshots** for UI changes
   - **Testing instructions**
   - **Breaking changes** (if any)

4. **PR Size**: Keep PRs focused and reviewable (under 500 lines if possible)

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Approval**: PR approved and merged by maintainer
4. **Merge**: Squash merge with descriptive commit message

## 🤝 Code of Conduct

This project follows a code of conduct outlined in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## 🆘 Getting Help

### Communication Channels

- **Issues**: For bugs, features, and general discussion
- **Discussions**: For questions and longer-form conversations
- **Pull Request Comments**: For code review feedback

### Asking for Help

When asking for help, please:

- **Be Specific**: Include error messages, code snippets, and steps to reproduce
- **Share Context**: Explain what you're trying to achieve
- **Show Your Work**: Include what you've already tried

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev)

## 🙏 Recognition

Contributors will be recognized in:

- **Repository Contributors**: GitHub's contributor insights
- **Changelog**: For significant features and fixes
- **README**: Special mentions for major contributions

Thank you for contributing to FINTRAKR! Your efforts help make this project better for everyone. 🚀

---

_This contributing guide is inspired by open source best practices and adapted for the FINTRAKR financial portfolio tracker project._
