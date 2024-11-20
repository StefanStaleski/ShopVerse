import { Request, Response, NextFunction } from 'express';
import { validateCreateProduct } from '../../../middleware/validation/product.validation';

describe('Product Validation Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            body: {}
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        nextFunction = jest.fn();
    });

    describe('validateCreateProduct', () => {
        it('should reject when required fields are missing', () => {
            mockRequest.body = {};
            
            validateCreateProduct(mockRequest as Request, mockResponse as Response, nextFunction);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'All fields are required'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });
}); 