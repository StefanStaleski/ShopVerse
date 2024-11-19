import request from 'supertest';
import app from '../../app';
import { User } from '../../models';
import { UserInput } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

describe('Profile Management Integration Tests', () => {
    let userToken: string;
    const testUser = {
        email: 'test@example.com',
        password: 'Test123!@#',
        firstName: 'Test',
        lastName: 'User'
    };

    beforeEach(async () => {
        // Clean up the users table
        await User.destroy({ where: {}, force: true });

        // Create test user directly in the database
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        const user = await User.create({
            id: uuidv4(),
            ...testUser,
            password: hashedPassword,
            role: 'user',
            isActive: true,
            lastLogin: null
        });

        // Get token through login
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
        
        userToken = loginResponse.body.token;
    });

    describe('Profile Operations', () => {
        it('should get user profile', async () => {
            const response = await request(app)
                .get('/api/profile')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                email: testUser.email,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                role: 'user',
                isActive: true
            });
            expect(response.body).not.toHaveProperty('password');
        });

        it('should update profile information', async () => {
            const updateData = {
                firstName: 'Updated',
                lastName: 'Name'
            };

            const response = await request(app)
                .patch('/api/profile')
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(updateData);

            // Verify changes in database
            const user = await User.findOne({ 
                where: { email: testUser.email },
                attributes: { exclude: ['password'] }
            });
            expect(user!.firstName).toBe(updateData.firstName);
            expect(user!.lastName).toBe(updateData.lastName);
        });

        it('should change password', async () => {
            const newPassword = 'NewPass123!@#';
            const response = await request(app)
                .patch('/api/profile/password')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: testUser.password,
                    newPassword: newPassword
                });

            expect(response.status).toBe(200);

            // Verify can login with new password
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: newPassword
                });

            expect(loginResponse.status).toBe(200);
            expect(loginResponse.body).toHaveProperty('token');
        });

        it('should reject invalid current password', async () => {
            const response = await request(app)
                .patch('/api/profile/password')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: 'wrongpassword',
                    newPassword: 'NewPass123!@#'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Current password is incorrect');
        });

        it('should reject requests without authentication', async () => {
            const response = await request(app)
                .get('/api/profile');

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid token');
        });
    });

    afterEach(async () => {
        await User.destroy({ where: {}, force: true });
    });
}); 