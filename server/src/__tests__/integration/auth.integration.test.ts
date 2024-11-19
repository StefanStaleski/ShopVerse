import request from 'supertest';
import app from '../../app';
import { User } from '../../models';
import { UserInput } from '../../types';

describe('Authentication Integration Tests', () => {
    const testUser: UserInput = {
        email: 'test@example.com',
        password: 'Test123!@#',
        firstName: 'Test',
        lastName: 'User'
    };

    beforeEach(async () => {
        // Clean up the users table before each test
        await User.destroy({ where: {}, force: true });
    });

    describe('Registration Flow', () => {
        it('should successfully register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toMatchObject({
                email: testUser.email,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                role: 'user',
                isActive: true
            });
            expect(response.body.user).not.toHaveProperty('password');

            // Verify user was created in database
            const user = await User.findOne({ 
                where: { email: testUser.email },
                attributes: { exclude: ['password'] }
            });
            expect(user).toBeTruthy();
            expect(user!.isActive).toBe(true);
        });

        it('should prevent duplicate email registration', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send(testUser);

            // Attempt duplicate registration
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email already registered');
        });

        it('should validate password requirements', async () => {
            const weakPassword = { 
                ...testUser, 
                password: 'weak' 
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(weakPassword);

            expect(response.status).toBe(400);
            expect(response.body.error).toMatch(/password/i);
        });
    });

    describe('Login Flow', () => {
        beforeEach(async () => {
            // Create test user before each login test
            await request(app)
                .post('/api/auth/register')
                .send(testUser);
        });

        it('should successfully login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toMatchObject({
                email: testUser.email,
                firstName: testUser.firstName,
                lastName: testUser.lastName
            });
            expect(response.body.user).not.toHaveProperty('password');
        });

        it('should reject invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });

        it('should reject inactive users', async () => {
            // Deactivate user
            await User.update(
                { isActive: false },
                { where: { email: testUser.email } }
            );

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Account is inactive');
        });
    });
}); 