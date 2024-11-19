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
                password: 'password123'
            };

            validateLogin(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should reject missing fields', () => {
            validateLogin(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Email and password are required'
            });
        });

        it('should reject invalid email format', () => {
            mockRequest.body = {
                email: 'invalid-email',
                password: 'password123'
            };

            validateLogin(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Invalid email format'
            });
        });
    });

    describe('validateRegister', () => {
        it('should pass valid registration data', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe'
            };

            validateRegister(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
        });

        it('should reject missing fields', () => {
            validateRegister(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'All fields are required'
            });
        });

        it('should reject short names', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'J',
                lastName: 'D'
            };

            validateRegister(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'First name must be at least 2 characters long'
            });
        });
    });
}); 