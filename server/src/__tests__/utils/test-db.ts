import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initModels } from '../../models';

dotenv.config({ path: '.env.test' });

const testSequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const setupTestDb = async (): Promise<void> => {
    try {
        await testSequelize.authenticate();
        initModels(testSequelize);
        await testSequelize.sync({ force: true });
    } catch (error) {
        console.error('Test database setup failed:', error);
        throw error;
    }
};

export const clearTestDb = async (): Promise<void> => {
    try {
        await testSequelize.sync({ force: true });
    } catch (error) {
        console.error('Failed to clear test database:', error);
        throw error;
    }
};

export const closeTestDb = async (): Promise<void> => {
    await testSequelize.close();
};

export default testSequelize; 