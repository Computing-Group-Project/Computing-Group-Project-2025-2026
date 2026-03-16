import '@testing-library/jest-dom';

// Mock IntersectionObserver for jsdom (not available in test environment)
class MockIntersectionObserver {
  constructor(callback) { this._callback = callback; }
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = MockIntersectionObserver;
