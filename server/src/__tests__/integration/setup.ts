import testSequelize from '../utils/test-db';
import { logger } from '../../utils/logger';

beforeAll(async () => {
    try {
        await testSequelize.authenticate();
        logger.info('Database connected successfully');
        
        // Sync database - this will create tables based on models
        await testSequelize.sync({ force: true });
        logger.info('Database synced successfully');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
        throw error;
    }
});

beforeEach(async () => {
    // Clean all tables before each test
    const models = Object.values(testSequelize.models);
    for (const model of models) {
        await model.destroy({ 
            where: {}, 
            force: true,
            truncate: true,
            cascade: true
        });
    }
});

afterAll(async () => {
    try {
        // Drop all tables
        await testSequelize.drop();
        
        // Close all connections
        await testSequelize.close();
        logger.info('Database connection closed successfully');
        
        // Add a small delay to ensure all connections are properly closed
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        logger.error('Error closing database connection:', error);
        throw error;
    }
}); 