import orderService from '../../services/order.service';
import { Order } from '../../models';
import { ValidationError } from '../../utils/errors';
import { OrderStatus, PaymentStatus } from '../../types';
import { mockOrderData } from '../helpers/mockData';

jest.mock('../../models', () => ({
    Order: {
        findByPk: jest.fn()
    }
}));

describe('Order Status Transitions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper function to create mock order with Sequelize-like behavior
    const createMockOrder = (status: OrderStatus, paymentStatus: PaymentStatus = 'pending') => ({
        ...mockOrderData,
        status,
        paymentStatus,
        update: jest.fn().mockResolvedValue(true),
        get: jest.fn().mockReturnValue({
            ...mockOrderData,
            status,
            paymentStatus
        })
    });

    describe('Order Status Transitions', () => {
        const validTransitions = [
            { from: 'pending', to: 'processing' },
            { from: 'processing', to: 'shipped' },
            { from: 'shipped', to: 'delivered' },
            { from: 'pending', to: 'cancelled' },
            { from: 'processing', to: 'cancelled' },
            { from: 'shipped', to: 'cancelled' }
        ] as const;

        validTransitions.forEach(({ from, to }) => {
            it(`should allow transition from ${from} to ${to}`, async () => {
                const mockOrder = createMockOrder(from);
                (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

                await orderService.updateOrderStatus('order-123', to);
                
                expect(mockOrder.update).toHaveBeenCalledWith({ status: to });
                expect(mockOrder.get).toHaveBeenCalled();
            });
        });

        const invalidTransitions = [
            { from: 'delivered', to: 'processing' },
            { from: 'cancelled', to: 'processing' },
            { from: 'pending', to: 'delivered' },
            { from: 'delivered', to: 'cancelled' }
        ] as const;

        invalidTransitions.forEach(({ from, to }) => {
            it(`should not allow transition from ${from} to ${to}`, async () => {
                const mockOrder = createMockOrder(from);
                (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

                await expect(
                    orderService.updateOrderStatus('order-123', to)
                ).rejects.toThrow(ValidationError);
                
                expect(mockOrder.update).not.toHaveBeenCalled();
            });
        });
    });

    describe('Payment Status Transitions', () => {
        const validPaymentTransitions = [
            { from: 'pending', to: 'paid' },
            { from: 'pending', to: 'failed' },
            { from: 'failed', to: 'pending' }
        ] as const;

        validPaymentTransitions.forEach(({ from, to }) => {
            it(`should allow payment transition from ${from} to ${to}`, async () => {
                const mockOrder = createMockOrder('pending', from);
                (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

                await orderService.updatePaymentStatus('order-123', to);
                
                expect(mockOrder.update).toHaveBeenCalledWith({ paymentStatus: to });
                expect(mockOrder.get).toHaveBeenCalled();
            });
        });

        const invalidPaymentTransitions = [
            { from: 'paid', to: 'pending' },
            { from: 'failed', to: 'paid' }
        ] as const;

        invalidPaymentTransitions.forEach(({ from, to }) => {
            it(`should not allow payment transition from ${from} to ${to}`, async () => {
                const mockOrder = createMockOrder('pending', from);
                (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

                await expect(
                    orderService.updatePaymentStatus('order-123', to)
                ).rejects.toThrow(ValidationError);
                
                expect(mockOrder.update).not.toHaveBeenCalled();
            });
        });
    });
}); 