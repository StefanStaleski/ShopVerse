import { Request, Response } from 'express';
import { login, register } from '../../controllers/auth.controller';
import authService from '../../services/auth.service';
import { UnauthorizedError } from '../../utils/errors';

jest.mock('../../services/auth.service');
jest.mock('../../utils/logger');

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
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should successfully login user', async () => {
            const expectedResponse = {
                token: 'test-token',
                user: {
                    id: '1',
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User'
                }
            };
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            (authService.login as jest.Mock).mockResolvedValue(expectedResponse);

            await login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle unauthorized error', async () => {
            const error = new UnauthorizedError('Invalid credentials');
            mockRequest.body = {
                email: 'wrong@example.com',
                password: 'wrongpass'
            };
            (authService.login as jest.Mock).mockRejectedValue(error);

            await login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Invalid credentials'
            });
        });

        it('should handle internal server error', async () => {
            const error = new Error('Database error');
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123'
            };
            (authService.login as jest.Mock).mockRejectedValue(error);

            await login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Internal server error'
            });
        });
    });

    describe('register', () => {
        it('should successfully register user', async () => {
            const registerData = {
                email: 'new@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User'
            };
            const expectedResponse = {
                token: 'test-token',
                user: {
                    id: '1',
                    email: 'new@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'user'
                }
            };

            mockRequest.body = registerData;
            (authService.register as jest.Mock).mockResolvedValue(expectedResponse);

            await register(mockRequest as Request, mockResponse as Response);

            expect(authService.register).toHaveBeenCalledWith(registerData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
        });

        it('should handle duplicate email error', async () => {
            const error = new Error('Email already exists');
            mockRequest.body = {
                email: 'existing@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User'
            };
            (authService.register as jest.Mock).mockRejectedValue(error);

            await register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Email already exists'
            });
        });
    });
}); 