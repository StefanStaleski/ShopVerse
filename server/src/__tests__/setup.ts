import { config } from '../config';

// Set test environment
process.env.NODE_ENV = 'test';

// Mock JWT secret for testing
config.jwt.secret = 'test-secret';

// Global beforeAll/afterAll hooks can be added here 