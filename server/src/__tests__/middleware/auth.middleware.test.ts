import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

jest.mock('jsonwebtoken');
jest.mock('../../config', () => ({
    config: {
        jwt: {
            secret: 'test-secret'
        }
    }
}));

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {},
            user: undefined
        };
        mockResponse = {};
        nextFunction = jest.fn();
    });

    describe('authenticate', () => {
        it('should authenticate valid token', async () => {
            const mockUser = { id: 'user-123', role: 'user' };
            mockRequest.headers = {
                authorization: 'Bearer valid-token'
            };
            (jwt.verify as jest.Mock).mockReturnValue(mockUser);

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(mockRequest.user).toEqual(mockUser);
            expect(nextFunction).toHaveBeenCalledWith();
        });

        it('should throw error when no token provided', async () => {
            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.any(UnauthorizedError)
            );
        });

        it('should throw error for invalid token format', async () => {
            mockRequest.headers = {
                authorization: 'InvalidFormat'
            };

            await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(
                expect.any(UnauthorizedError)
            );
        });
    });

    describe('authorize', () => {
        it('should authorize user with correct role', () => {
            mockRequest.user = { id: 'user-123', role: 'admin' };
            const authMiddleware = authorize('admin', 'staff');

            authMiddleware(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith();
        });

        it('should throw error for unauthorized role', () => {
            mockRequest.user = { id: 'user-123', role: 'user' };
            const authMiddleware = authorize('admin');

            expect(() => {
                authMiddleware(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction
                );
            }).toThrow(ForbiddenError);
        });

        it('should throw error when user is not authenticated', () => {
            const authMiddleware = authorize('admin');

            expect(() => {
                authMiddleware(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction
                );
            }).toThrow(UnauthorizedError);
        });
    });
}); 