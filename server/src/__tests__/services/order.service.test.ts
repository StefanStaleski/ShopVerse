import { Order, OrderItem, Product } from '../../models';
import orderService from '../../services/order.service';
import { mockOrderData, mockOrderInput, mockProductData } from '../helpers/mockData';

// Mock all required models
jest.mock('../../models', () => ({
    Order: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
        sequelize: {
            transaction: jest.fn(() => ({
                commit: jest.fn(),
                rollback: jest.fn()
            }))
        }
    },
    OrderItem: {
        create: jest.fn(),
        bulkCreate: jest.fn()
    },
    Product: {
        findByPk: jest.fn(),
        update: jest.fn()
    }
}));

describe('OrderService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should successfully create an order', async () => {
            const mockTransaction = {
                commit: jest.fn(),
                rollback: jest.fn()
            };

            // Mock the product findByPk to return a valid product
            (Product.findByPk as jest.Mock).mockResolvedValue({
                ...mockProductData,
                update: jest.fn().mockResolvedValue(true)
            });

            const mockCreatedOrder = {
                ...mockOrderData,
                id: 'order-123',
                update: jest.fn().mockResolvedValue(true),
                get: () => ({ ...mockOrderData })
            };

            (Order.sequelize!.transaction as jest.Mock).mockResolvedValue(mockTransaction);
            (Order.create as jest.Mock).mockResolvedValue(mockCreatedOrder);
            
            // Mock OrderItem.bulkCreate
            (OrderItem.bulkCreate as jest.Mock).mockResolvedValue([{
                id: 'item-1',
                orderId: 'order-123',
                productId: mockProductData.id,
                quantity: 2,
                price: mockProductData.price,
                get: () => ({
                    id: 'item-1',
                    orderId: 'order-123',
                    productId: mockProductData.id,
                    quantity: 2,
                    price: mockProductData.price
                })
            }]);

            // Mock the findByPk for retrieving the created order
            (Order.findByPk as jest.Mock).mockResolvedValue({
                ...mockCreatedOrder,
                OrderItems: [{
                    id: 'item-1',
                    orderId: 'order-123',
                    productId: mockProductData.id,
                    quantity: 2,
                    price: mockProductData.price,
                    Product: mockProductData,
                    get: () => ({
                        id: 'item-1',
                        orderId: 'order-123',
                        productId: mockProductData.id,
                        quantity: 2,
                        price: mockProductData.price,
                        Product: mockProductData
                    })
                }]
            });

            const result = await orderService.createOrder(mockOrderInput);

            expect(result).toHaveProperty('id');
            expect(result.userId).toBe(mockOrderInput.userId);
            expect(Order.create).toHaveBeenCalled();
            expect(OrderItem.bulkCreate).toHaveBeenCalled();
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(mockTransaction.rollback).not.toHaveBeenCalled();
        });
    });
}); 