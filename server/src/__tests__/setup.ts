import { config } from '../config';
import { setupTestDb, clearTestDb, closeTestDb } from './utils/test-db';

// Load test environment variables before anything else
process.env.NODE_ENV = 'test';
config.jwt.secret = 'test-secret';

// Increase timeout for database operations
jest.setTimeout(30000);

beforeAll(async () => {
    await setupTestDb();
});

beforeEach(async () => {
    await clearTestDb();
});

afterAll(async () => {
    await closeTestDb();
});