import { Request, Response, NextFunction } from 'express';
import { validateCreateProduct, validateUpdateProduct } from '../../../middleware/validation/product.validation';

describe('Product Validation Middleware', () => {
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

    describe('validateCreateProduct', () => {
        it('should pass validation with valid product data', () => {
            mockRequest.body = {
                name: 'Test Product',
                description: 'Valid product description',
                price: 99.99,
                stock: 100,
                categoryId: 'valid-category-id'
            };

            validateCreateProduct(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should reject when required fields are missing', () => {
            validateCreateProduct(mockRequest as Request, mockResponse as Response, nextFunction);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'All fields are required'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should reject invalid price', () => {
            mockRequest.body = {
                name: 'Test Product',
                description: 'Valid product description',
                price: -10,
                stock: 100,
                categoryId: 'valid-category-id'
            };

            validateCreateProduct(mockRequest as Request, mockResponse as Response, nextFunction);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Price must be greater than 0'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should reject invalid stock', () => {
            mockRequest.body = {
                name: 'Test Product',
                description: 'Valid product description',
                price: 99.99,
                stock: -1,
                categoryId: 'valid-category-id'
            };

            validateCreateProduct(mockRequest as Request, mockResponse as Response, nextFunction);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Stock cannot be negative'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should reject invalid categoryId format', () => {
            mockRequest.body = {
                name: 'Test Product',
                description: 'Valid product description',
                price: 99.99,
                stock: 100,
                categoryId: ''
            };

            validateCreateProduct(mockRequest as Request, mockResponse as Response, nextFunction);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Invalid category ID'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });

    describe('validateUpdateProduct', () => {
        it('should pass validation with valid partial update data', () => {
            mockRequest.body = {
                price: 149.99,
                stock: 200
            };

            validateUpdateProduct(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should reject invalid price in update', () => {
            mockRequest.body = {
                price: -10
            };

            validateUpdateProduct(mockRequest as Request, mockResponse as Response, nextFunction);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Price must be greater than 0'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });
}); 