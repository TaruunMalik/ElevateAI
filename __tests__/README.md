# Testing Guide for ElevateAI

This project uses **Jest** and **React Testing Library** for testing server actions and components.

## Setup

Jest is already configured with:
- `jest.config.js` - Main Jest configuration
- `jest.setup.js` - Global test setup with mocks for Next.js, Clerk, Prisma, and Google Generative AI

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- __tests__/actions/interview.test.js
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="saveQuizResult"
```

## Test Structure

Tests are organized in `__tests__` directory matching the source structure:

```
__tests__/
├── actions/
│   ├── interview.test.js    - Tests for generateQuiz, saveQuizResult
│   ├── resume.test.js       - Tests for saveResume, getResume, improveWithAI
│   └── user.test.js         - Tests for updateUser, onboardingstatus
```

## Writing Tests

### Basic Test Template

```javascript
import { yourFunction } from '@/actions/yourFile';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

jest.mock('@clerk/nextjs/server');
jest.mock('@/lib/prisma');

describe('Your Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something', async () => {
    // Arrange
    auth.mockResolvedValueOnce({ userId: 'test-user-123' });
    db.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });

    // Act
    const result = await yourFunction({ data: 'test' });

    // Assert
    expect(result).toEqual(expectedValue);
    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { clerkUserId: 'test-user-123' },
    });
  });
});
```

## Key Testing Patterns

### Mocking Authentication
```javascript
auth.mockResolvedValueOnce({ userId: 'test-user-123' });
```

### Mocking Database Queries
```javascript
db.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
db.assessment.create.mockResolvedValueOnce({ id: 'assessment-123' });
```

### Mocking Gemini AI
```javascript
const mockGenerativeModel = {
  generateContent: jest.fn(() =>
    Promise.resolve({
      response: {
        text: () => 'AI generated response',
      },
    })
  ),
};

const mockGenAI = {
  getGenerativeModel: jest.fn(() => mockGenerativeModel),
};

GoogleGenerativeAI.mockImplementation(() => mockGenAI);
```

### Testing Error Handling
```javascript
it('should throw error on API failure', async () => {
  const mockGenerativeModel = {
    generateContent: jest.fn(() =>
      Promise.reject(new Error('API Error'))
    ),
  };

  const mockGenAI = {
    getGenerativeModel: jest.fn(() => mockGenerativeModel),
  };

  GoogleGenerativeAI.mockImplementation(() => mockGenAI);

  await expect(generateQuiz()).rejects.toThrow('Failed to generate quiz questions');
});
```

## Currently Tested Actions

### Interview Actions (`interview.test.js`)
- ✅ `generateQuiz()` - Generates quiz questions using Gemini AI
- ✅ `saveQuizResult()` - Saves quiz results to database

### Resume Actions (`resume.test.js`)
- ✅ `saveResume()` - Creates/updates user resume
- ✅ `getResume()` - Retrieves user resume
- ✅ `improveWithAI()` - Improves resume content using AI

### User Actions (`user.test.js`)
- ✅ `updateUser()` - Updates user profile and industry
- ✅ `onboardingstatus()` - Checks if user has completed onboarding

## Test Coverage

Current test coverage:
- **Authentication checks** - All functions validate user is authenticated
- **Authorization checks** - All functions verify user exists in database
- **Success paths** - Happy path workflows
- **Error handling** - Database and API errors
- **Edge cases** - Missing data, null values

## Adding More Tests

### New Test File Template

Create a new file in `__tests__/actions/`:

```javascript
import { yourFunction } from '@/actions/yourFile';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

jest.mock('@clerk/nextjs/server');
jest.mock('@/lib/prisma');

describe('Your Feature Name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Add your tests here
});
```

### Then run:
```bash
npm test -- __tests__/actions/yourFile.test.js
```

## Troubleshooting

### Tests not running
```bash
# Clear Jest cache and reinstall
npm run postinstall
npm test -- --clearCache
```

### Module not found errors
Ensure path aliases in `jest.config.js` match `jsconfig.json`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### Mock not working
Always call `jest.clearAllMocks()` in `beforeEach`:
```javascript
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Best Practices

1. **Clear mocks between tests** - Prevents test pollution
2. **Use descriptive test names** - Makes failures easy to diagnose
3. **Arrange-Act-Assert pattern** - Organized test structure
4. **Mock external dependencies** - Isolate what you're testing
5. **Test error paths** - Not just happy paths
6. **Mock at the module level** - Before importing components
7. **Use `mockResolvedValue` for async** - For Promise-based functions
8. **Use `mockRejectedValue` for errors** - Test error handling

## CI/CD Integration

To run tests in CI/CD pipeline, add to your workflow:

```bash
npm test -- --coverage --watchAll=false
```

## Resources

- [Jest Documentation](https://jestjs.io)
- [React Testing Library](https://testing-library.com/react)
- [Testing Node.js Applications](https://jestjs.io/docs/getting-started)
