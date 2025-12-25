# Test Cases Guidelines

## Core Principles

### 1. Selector Best Practices

**Avoid `data-testid` for assertions.** Use semantic and accessible selectors instead.

**Preference order:**

- Accessible queries: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
- Semantic HTML and ARIA attributes
- User-centric selectors over implementation details

```javascript
// ❌ Avoid
const button = screen.getByTestId("submit-button");

// ✅ Prefer
const button = screen.getByRole("button", { name: /submit/i });
```

### 2. Consistency and Pattern Matching

**Analyze existing test patterns before writing new tests.** Maintain consistency by:

- Reviewing similar test files in the module
- Matching naming conventions and assertion styles
- Following established setup/teardown patterns
- Using consistent mocking strategies

### 3. Code Quality Standards

**Ensure all test files are error-free:**

- ✅ No TypeScript errors
- ✅ No linting violations
- ✅ Proper formatting
- ✅ Type-safe mocks and assertions

```bash
npm run type-check && npm run lint && npm run format
```

### 4. Coverage-Driven Testing

**Target 100% code coverage while keeping tests lean.** Stop adding tests once full coverage is achieved. Focus on meaningful cases, not redundant ones.

**Coverage goals:** Branches, Functions, Lines, Statements = 100%

```bash
npm run test:coverage
```

### 5. Test Organization and Naming

**Use descriptive test names** that explain expected behavior:

- `it('should disable submit button when form is invalid')`
- Follow Arrange-Act-Assert (AAA) pattern
- Group related tests with `describe` blocks
- Use Given-When-Then for complex scenarios

### 6. Async Testing Best Practices

**Handle asynchronous operations properly:**

- Use `waitFor` and `findBy*` queries for async operations
- Avoid arbitrary timeouts (`setTimeout`) - use proper async utilities
- Test loading and error states explicitly
- Clean up async operations in `afterEach` hooks

```javascript
// ✅ Good
const element = await screen.findByRole("button", { name: /submit/i });
await waitFor(() => expect(mockFn).toHaveBeenCalled());

// ❌ Avoid
await new Promise((resolve) => setTimeout(resolve, 1000));
```

### 7. Performance Considerations

**Keep test suites fast and efficient:**

- Aim for <1 second per test file
- Avoid unnecessary renders or component mounting
- Use `screen.debug()` sparingly (debugging only)
- Consider test parallelization for large suites

---

## Summary

Write **lean, clean, and consistent** tests that prioritize user experience, maintain code quality, achieve comprehensive coverage, and run fast.
