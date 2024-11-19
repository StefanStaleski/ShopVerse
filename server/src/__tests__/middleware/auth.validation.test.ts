import { Request, Response, NextFunction } from 'express';
import { validateLogin, validateRegister } from '../../middleware/validation/auth.validation';

describe('Auth Validation Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            body: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    describe('validateLogin', () => {
        it('should pass valid login data', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'ValidPass123!'
            };

            validateLogin(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should reject missing fields', () => {
            validateLogin(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Email and password are required'
            });
        });

        it('should reject invalid email format', () => {
            mockRequest.body = {
                email: 'invalid-email',
                password: 'ValidPass123!'
            };

            validateLogin(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Invalid email format'
            });
        });

        it('should reject password shorter than 8 characters', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'short'
            };

            validateLogin(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Password must be at least 8 characters long'
            });
        });
    });

    describe('validateRegister', () => {
        it('should pass valid registration data', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'ValidPass123!',
                firstName: 'John',
                lastName: 'Doe'
            };

            validateRegister(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should reject missing fields', () => {
            validateRegister(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'All fields are required'
            });
        });

        it('should reject short names', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'ValidPass123!',
                firstName: 'J',
                lastName: 'Doe'
            };

            validateRegister(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'First name must be at least 2 characters long and contain only letters'
            });
        });

        it('should reject names with special characters', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'ValidPass123!',
                firstName: 'John@',
                lastName: 'Doe'
            };

            validateRegister(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'First name must be at least 2 characters long and contain only letters'
            });
        });

        it('should reject password without uppercase letter', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'validpass123!',
                firstName: 'John',
                lastName: 'Doe'
            };

            validateRegister(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should reject password without lowercase letter', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'VALIDPASS123!',
                firstName: 'John',
                lastName: 'Doe'
            };

            validateRegister(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should reject password without number', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'ValidPass!',
                firstName: 'John',
                lastName: 'Doe'
            };

            validateRegister(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        it('should reject password without special character', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'ValidPass123',
                firstName: 'John',
                lastName: 'Doe'
            };

            validateRegister(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });
}); 