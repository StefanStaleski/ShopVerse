import { Request, Response, NextFunction } from 'express';
import { validateCreateOrder, validateUpdateOrderStatus, validateUpdatePaymentStatus } from '../../../middleware/validation/order.validation';
import { ValidationError } from '../../../utils/errors';

describe('Order Validation Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
    });

    describe('validateCreateOrder', () => {
        it('should pass validation with valid order data', () => {
            mockRequest.body = {
                userId: 'user-123',
                shippingAddress: '123 Test Street, City, Country',
                paymentMethod: 'credit_card',
                items: [
                    { productId: 'product-123', quantity: 2 }
                ]
            };

            validateCreateOrder(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should throw error when required fields are missing', () => {
            mockRequest.body = {
                userId: 'user-123',
                // missing other required fields
            };

            expect(() => {
                validateCreateOrder(mockRequest as Request, mockResponse as Response, nextFunction);
            }).toThrow(ValidationError);
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should throw error when items array is empty', () => {
            mockRequest.body = {
                userId: 'user-123',
                shippingAddress: '123 Test Street',
                paymentMethod: 'credit_card',
                items: []
            };

            expect(() => {
                validateCreateOrder(mockRequest as Request, mockResponse as Response, nextFunction);
            }).toThrow(ValidationError);
        });
    });

    describe('validateUpdateOrderStatus', () => {
        it('should pass validation with valid status', () => {
            mockRequest.body = { status: 'processing' };

            validateUpdateOrderStatus(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should throw error with invalid status', () => {
            mockRequest.body = { status: 'invalid_status' };

            expect(() => {
                validateUpdateOrderStatus(mockRequest as Request, mockResponse as Response, nextFunction);
            }).toThrow(ValidationError);
        });
    });

    describe('validateUpdatePaymentStatus', () => {
        it('should pass validation with valid payment status', () => {
            mockRequest.body = { paymentStatus: 'paid' };

            validateUpdatePaymentStatus(mockRequest as Request, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should throw error with invalid payment status', () => {
            mockRequest.body = { paymentStatus: 'invalid_status' };

            expect(() => {
                validateUpdatePaymentStatus(mockRequest as Request, mockResponse as Response, nextFunction);
            }).toThrow(ValidationError);
        });
    });
}); 