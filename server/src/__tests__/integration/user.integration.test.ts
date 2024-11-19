import request from 'supertest';
import app from '../../app';
import { User } from '../../models';
import { UserInput } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

describe('User Management Integration Tests', () => {
    let authToken: string;
    const adminUser = {
        email: 'admin@example.com',
        password: 'Admin123!@#',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
    };

    const regularUser = {
        email: 'user@example.com',
        password: 'User123!@#',
        firstName: 'Test',
        lastName: 'User'
    };

    beforeEach(async () => {
        try {
            // Create admin user directly in the database with hashed password
            const hashedPassword = await bcrypt.hash(adminUser.password, 10);
            await User.create({
                id: uuidv4(),
                ...adminUser,
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                lastLogin: null
            });

            // Get admin token through login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: adminUser.email,
                    password: adminUser.password
                });

            authToken = loginResponse.body.token;
        } catch (error) {
            console.error('Setup failed:', error);
            throw error;
        }
    });

    describe('User Listing', () => {
        it('should allow admin to list all users', async () => {
            // Create additional test user
            await request(app)
                .post('/api/auth/register')
                .send(regularUser);

            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThanOrEqual(1);
            expect(response.body[0]).toHaveProperty('email');
            expect(response.body[0]).not.toHaveProperty('password');
        });

        it('should not allow regular users to list all users', async () => {
            // Register regular user and get token
            const userResponse = await request(app)
                .post('/api/auth/register')
                .send(regularUser);
            const userToken = userResponse.body.token;

            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(403);
        });
    });

    describe('User Management', () => {
        it('should allow admin to deactivate user', async () => {
            // Create user to deactivate
            const createResponse = await request(app)
                .post('/api/auth/register')
                .send(regularUser);
            
            const userId = createResponse.body.user.id;

            const response = await request(app)
                .patch(`/api/users/${userId}/deactivate`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.isActive).toBe(false);

            // Verify user can't login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: regularUser.email,
                    password: regularUser.password
                });

            expect(loginResponse.status).toBe(401);
            expect(loginResponse.body.error).toBe('Account is inactive');
        });
    });

    afterEach(async () => {
        try {
            // Explicitly wait for any pending operations
            await Promise.all([
                User.destroy({ where: {}, force: true }),
                new Promise(resolve => setTimeout(resolve, 100)) // Small delay to ensure cleanup
            ]);
        } catch (error) {
            console.error('Cleanup failed:', error);
        }
    });
}); 