import { Request, Response, NextFunction } from 'express';
import orderController from '../../controllers/order.controller';
import orderService from '../../services/order.service';
import { mockOrderData, mockOrderInput } from '../helpers/mockData';

// Mock the order service
jest.mock('../../services/order.service', () => ({
    createOrder: jest.fn(),
    getOrders: jest.fn(),
    getOrderById: jest.fn(),
    updateOrderStatus: jest.fn(),
    updatePaymentStatus: jest.fn(),
    deleteOrder: jest.fn()
}));

describe('OrderController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            body: {},
            params: {},
            query: {},
            path: '',
            user: { id: 'user-123', role: 'user' }
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should create order successfully', async () => {
            mockRequest.body = mockOrderInput;
            (orderService.createOrder as jest.Mock).mockResolvedValue(mockOrderData);

            await orderController.createOrder(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(orderService.createOrder).toHaveBeenCalledWith(mockOrderInput);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockOrderData);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            (orderService.createOrder as jest.Mock).mockRejectedValue(error);

            await orderController.createOrder(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalledWith(error);
        });
    });

    describe('getOrders', () => {
        it('should get orders with pagination', async () => {
            const mockPaginatedResult = {
                orders: [mockOrderData],
                total: 1,
                page: 1,
                totalPages: 1,
                hasMore: false
            };
            
            mockRequest.query = {
                page: '1',
                limit: '10',
                sortBy: 'createdAt',
                sortOrder: 'DESC'
            };
            
            (orderService.getOrders as jest.Mock).mockResolvedValue(mockPaginatedResult);

            await orderController.getOrders(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(orderService.getOrders).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockPaginatedResult);
        });
    });

    describe('updateOrderStatus', () => {
        it('should update order status successfully', async () => {
            mockRequest.params = { id: 'order-123' };
            mockRequest.body = { status: 'processing' };
            
            (orderService.updateOrderStatus as jest.Mock).mockResolvedValue({
                ...mockOrderData,
                status: 'processing'
            });

            await orderController.updateOrderStatus(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(orderService.updateOrderStatus).toHaveBeenCalledWith('order-123', 'processing');
            expect(mockResponse.json).toHaveBeenCalled();
        });
    });

    describe('deleteOrder', () => {
        it('should delete order successfully', async () => {
            mockRequest.params = { id: 'order-123' };
            (orderService.deleteOrder as jest.Mock).mockResolvedValue(true);

            await orderController.deleteOrder(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
            );

            expect(orderService.deleteOrder).toHaveBeenCalledWith('order-123');
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });
    });
}); 