import '@testing-library/jest-dom';
import 'jest-styled-components';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn()
};
global.localStorage = localStorageMock;

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver
});

// Suppress React 18 Strict Mode warnings during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning.*React does not recognize the.*prop/.test(args[0])
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Add this to the existing setupTests.ts file
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes('React Router')) return;
  originalWarn.apply(console, args);
}; 