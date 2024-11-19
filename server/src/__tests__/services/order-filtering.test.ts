import { Order } from '../../models';
import orderService from '../../services/order.service';
import { OrderStatus, ProductAttributes } from '../../types';

jest.mock('../../models', () => ({
    Order: {
        findAndCountAll: jest.fn()
    }
}));

describe('Order Filtering and Pagination', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return paginated orders with filters', async () => {
        const mockOrders = [
            {
                id: 'order-123',
                status: 'pending',
                get: () => ({
                    id: 'order-123',
                    status: 'pending'
                })
            }
        ];

        (Order.findAndCountAll as jest.Mock).mockResolvedValue({
            rows: mockOrders,
            count: 1
        });

        const filterOptions = {
            userId: 'user-123',
            status: 'pending',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31')
        };

        const paginationOptions = {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'DESC'
        };

        const result = await orderService.getOrders({
            ...filterOptions,
            status: 'pending' as OrderStatus
        }, {
            ...paginationOptions,
            sortBy: 'createdAt' as keyof ProductAttributes,
            sortOrder: 'DESC' as 'DESC' | 'ASC'
        });

        expect(result.orders).toHaveLength(1);
        expect(result.total).toBe(1);
        expect(result.page).toBe(1);
        expect(result.hasMore).toBe(false);
        expect(Order.findAndCountAll).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.any(Object),
                limit: 10,
                offset: 0
            })
        );
    });
}); 