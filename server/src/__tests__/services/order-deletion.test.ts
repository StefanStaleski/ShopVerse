import { Order, OrderItem, Product } from '../../models';
import orderService from '../../services/order.service';

jest.mock('../../models', () => ({
    Order: {
        findByPk: jest.fn(),
        sequelize: {
            transaction: jest.fn(() => ({
                commit: jest.fn(),
                rollback: jest.fn()
            }))
        }
    },
    OrderItem: {},
    Product: {
        findByPk: jest.fn(),
        update: jest.fn()
    }
}));

describe('Order Deletion', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully delete a pending order', async () => {
        const mockOrder = {
            id: 'order-123',
            status: 'pending',
            OrderItems: [{
                productId: 'product-123',
                quantity: 2
            }],
            destroy: jest.fn()
        };

        const mockProduct = {
            id: 'product-123',
            stock: 10,
            update: jest.fn()
        };

        (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);
        (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

        const result = await orderService.deleteOrder('order-123');

        expect(result).toBe(true);
        expect(mockProduct.update).toHaveBeenCalledWith(
            { stock: 12 },
            expect.any(Object)
        );
        expect(mockOrder.destroy).toHaveBeenCalled();
    });

    it('should not delete a shipped order', async () => {
        const mockOrder = {
            id: 'order-123',
            status: 'shipped'
        };

        (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

        await expect(
            orderService.deleteOrder('order-123')
        ).rejects.toThrow('Only pending or cancelled orders can be deleted');
    });
}); 