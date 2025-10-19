# Contributing to BCA AuthKit

Thank you for your interest in contributing to BCA AuthKit! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Expo CLI (for testing)
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/bca-authkit.git
   cd bca-authkit
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🏗️ Development Workflow

### Building the Package

```bash
# Build TypeScript files
npm run build

# Watch for changes during development
npm run build:watch
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix
```

### Testing Changes

1. Build the package:
   ```bash
   npm run build
   ```

2. Test in a sample Expo app:
   ```bash
   # Create a test app
   npx create-expo-app TestAuthKit
   cd TestAuthKit
   
   # Install your local package
   npm install file:../bca-authkit
   ```

## 📝 Code Guidelines

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Export types that consumers might need
- Use strict TypeScript configuration

### Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and small

### Component Guidelines

- Use functional components with hooks
- Provide comprehensive prop types
- Include proper default props
- Support custom styling through props
- Handle loading and error states

### Example Component Structure

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface MyComponentProps {
  title: string;
  onPress?: () => void;
  customStyles?: {
    container?: object;
    text?: object;
  };
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
  customStyles = {},
}) => {
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      ...customStyles.container,
    },
    text: {
      fontSize: 16,
      ...customStyles.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all public APIs
- Test error conditions
- Mock external dependencies
- Use descriptive test names

### Example Test

```typescript
import { AuthStorage } from '../src/storage';

// Mock Expo SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('AuthStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should store tokens securely', async () => {
    const tokens = {
      accessToken: 'test-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() + 3600000,
    };

    await AuthStorage.storeTokens(tokens);

    expect(SecureStore.setItemAsync).toHaveBeenCalled();
  });
});
```

### Integration Tests

- Test component interactions
- Test authentication flows
- Test error scenarios

## 📚 Documentation

### README Updates

When adding new features:
- Update the README.md with usage examples
- Add new props to the API documentation
- Include troubleshooting information if needed

### JSDoc Comments

```typescript
/**
 * Authenticates user with biometric authentication
 * @param promptMessage - Custom prompt message for biometric dialog
 * @returns Promise that resolves when authentication succeeds
 * @throws Error when biometric authentication fails or is not available
 */
static async authenticate(promptMessage?: string): Promise<void> {
  // Implementation
}
```

## 🔄 Pull Request Process

### Before Submitting

1. Run all tests: `npm test`
2. Run linting: `npm run lint`
3. Build the package: `npm run build`
4. Update documentation if needed
5. Test changes in a real Expo app

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Tested in sample Expo app

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. Automated tests must pass
2. Code review by maintainers
3. Manual testing if needed
4. Documentation review
5. Approval and merge

## 🐛 Bug Reports

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Expo SDK version:
- React Native version:
- Device/Simulator:
- OS version:

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## 📦 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- PATCH: Bug fixes
- MINOR: New features (backward compatible)
- MAJOR: Breaking changes

### Release Steps

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release
6. Automated workflow publishes to GitHub Packages

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards other community members

### Enforcement

Unacceptable behavior may be reported to the project maintainers. All reports will be reviewed and investigated.

## 📞 Getting Help

- 💬 GitHub Discussions for questions
- 🐛 GitHub Issues for bugs
- 📧 Email maintainers for security issues

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to BCA AuthKit! 🎉