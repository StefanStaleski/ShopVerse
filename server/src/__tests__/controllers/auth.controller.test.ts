import { Request, Response } from 'express';
import authController from '../../controllers/auth.controller';
import authService from '../../services/auth.service';

jest.mock('../../services/auth.service');

describe('AuthController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {
            body: {}
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('login', () => {
        it('should successfully login user', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };
            const expectedResponse = {
                token: 'jwt-token',
                user: { id: '1', email: 'test@example.com' }
            };

            mockRequest.body = loginData;
            (authService.login as jest.Mock).mockResolvedValue(expectedResponse);

            await authController.login(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(authService.login).toHaveBeenCalledWith(
                loginData.email,
                loginData.password
            );
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle login failure', async () => {
            const error = new Error('Invalid credentials');
            mockRequest.body = {
                email: 'wrong@example.com',
                password: 'wrongpass'
            };
            (authService.login as jest.Mock).mockRejectedValue(error);

            await authController.login(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Invalid credentials'
            });
        });
    });

    describe('register', () => {
        it('should successfully register user', async () => {
            const registerData = {
                email: 'new@example.com',
                password: 'password123',
                name: 'Test User'
            };
            const expectedResponse = {
                id: '1',
                email: 'new@example.com',
                name: 'Test User'
            };

            mockRequest.body = registerData;
            (authService.register as jest.Mock).mockResolvedValue(expectedResponse);

            await authController.register(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(authService.register).toHaveBeenCalledWith(registerData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle registration failure', async () => {
            const error = new Error('Email already exists');
            mockRequest.body = {
                email: 'existing@example.com',
                password: 'password123'
            };
            (authService.register as jest.Mock).mockRejectedValue(error);

            await authController.register(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Email already exists'
            });
        });
    });
}); 