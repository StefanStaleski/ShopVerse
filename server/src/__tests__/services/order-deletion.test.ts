import orderService from '../../services/order.service';
import sequelize from '../../config/database';
import { Order } from '../../models';
import { OrderStatus } from '../../types';
import { mockOrderData } from '../helpers/mockData';

// Mock the models and database
jest.mock('../../models', () => ({
    Order: {
        findByPk: jest.fn(),
        sequelize: {
            transaction: jest.fn()
        }
    },
    OrderItem: {
        create: jest.fn()
    },
    Product: {
        findByPk: jest.fn(),
        update: jest.fn()
    }
}));

describe('Order Deletion', () => {
    const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (Order.sequelize!.transaction as jest.Mock).mockImplementation((callback) => {
            if (callback) {
                return callback(mockTransaction);
            }
            return mockTransaction;
        });
    });

    it('should successfully delete a pending order', async () => {
        const mockOrder = {
            ...mockOrderData,
            id: 'order-123',
            status: 'pending',
            OrderItems: [],
            destroy: jest.fn().mockResolvedValue(true),
            get: jest.fn().mockReturnThis()
        };

        (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

        const result = await orderService.deleteOrder('order-123');

        expect(result).toBe(true);
        expect(mockOrder.destroy).toHaveBeenCalledWith({ 
            transaction: mockTransaction 
        });
        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });
}); 