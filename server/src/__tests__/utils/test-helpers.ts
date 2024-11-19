import request from 'supertest';
import app from '../../app';
import { UserInput } from '../../types';

export const createTestUser = async (userData: UserInput = {
    email: 'test@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User'
}) => {
    const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
    
    return {
        user: response.body.user,
        token: response.body.token
    };
};

export const loginTestUser = async (credentials: { email: string; password: string }) => {
    const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);
    
    return {
        user: response.body.user,
        token: response.body.token
    };
}; 