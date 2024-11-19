import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middleware/error.middleware';
import { AppError, ValidationError, UnauthorizedError } from '../../utils/errors';
import { logger } from '../../utils/logger';

jest.mock('../../utils/logger');

describe('Error Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            method: 'GET',
            url: '/test',
            params: {},
            query: {},
            body: {},
            user: { id: 'user-123', role: 'user' }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    it('should handle AppError instances', () => {
        const error = new ValidationError('Validation failed');

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'fail',
            error: 'Validation failed'
        });
        expect(logger.warn).toHaveBeenCalled();
    });

    it('should handle unexpected errors', () => {
        const error = new Error('Unexpected error');

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            error: 'Internal server error'
        });
        expect(logger.error).toHaveBeenCalled();
    });

    it('should include request details in logs', () => {
        const error = new UnauthorizedError('Unauthorized');

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(logger.warn).toHaveBeenCalledWith(
            expect.objectContaining({
                request: {
                    method: 'GET',
                    url: '/test',
                    params: {},
                    query: {},
                    body: {},
                    userId: 'user-123'
                }
            })
        );
    });
}); 