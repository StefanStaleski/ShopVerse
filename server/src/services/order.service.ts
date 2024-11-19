import { Order, OrderItem, Product } from "../models";
import { 
    OrderOutput, 
    OrderStatus, 
    PaymentStatus, 
    CreateOrderInput,
    OrderItemData,
    OrderFilterOptions,
    PaginationOptions,
    PaginatedOrdersResult
} from "../types";
import { Transaction } from "sequelize";
import { ORDER_STATUS_TRANSITIONS, PAYMENT_STATUS_TRANSITIONS } from "../types/order.types";
import { ValidationError, NotFoundError, AppError } from '../utils/errors';

class OrderService {
    private static readonly DEFAULT_STATUS: OrderStatus = "pending";
    private static readonly DEFAULT_PAYMENT_STATUS: PaymentStatus = "pending";
    private static readonly MIN_ORDER_TOTAL = 0;
    private static readonly MAX_ITEMS_PER_ORDER = 10;
    private static readonly MIN_QUANTITY_PER_ITEM = 1;
    private static readonly MAX_QUANTITY_PER_ITEM = 100;
    private static readonly MIN_ADDRESS_LENGTH = 10;

    private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
        const allowedTransitions = ORDER_STATUS_TRANSITIONS[currentStatus];
        return allowedTransitions.includes(newStatus);
    }

    private validatePaymentStatusTransition(currentStatus: PaymentStatus, newStatus: PaymentStatus): boolean {
        const allowedTransitions = PAYMENT_STATUS_TRANSITIONS[currentStatus];
        return allowedTransitions.includes(newStatus);
    }

    private validateOrderItems(items: OrderItemData[]): void {
        if (!items.length) {
            throw new ValidationError('Order must contain at least one item');
        }

        if (items.length > OrderService.MAX_ITEMS_PER_ORDER) {
            throw new ValidationError(`Order cannot contain more than ${OrderService.MAX_ITEMS_PER_ORDER} items`);
        }

        const uniqueProductIds = new Set(items.map(item => item.productId));
        if (uniqueProductIds.size !== items.length) {
            throw new ValidationError('Duplicate products are not allowed');
        }

        for (const item of items) {
            if (item.quantity < OrderService.MIN_QUANTITY_PER_ITEM || 
                item.quantity > OrderService.MAX_QUANTITY_PER_ITEM) {
                throw new ValidationError(
                    `Quantity must be between ${OrderService.MIN_QUANTITY_PER_ITEM} and ${OrderService.MAX_QUANTITY_PER_ITEM}`
                );
            }
        }
    }

    private validateShippingAddress(address: string): void {
        if (!address?.trim()) {
            throw new ValidationError('Shipping address cannot be empty');
        }
        if (address.length < OrderService.MIN_ADDRESS_LENGTH) {
            throw new ValidationError(`Shipping address must be at least ${OrderService.MIN_ADDRESS_LENGTH} characters long`);
        }
    }

    private validatePaymentMethod(method: string): void {
        const validMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer'];
        if (!validMethods.includes(method)) {
            throw new ValidationError('Invalid payment method');
        }
    }

    private async processOrderItems(
        orderId: string, 
        items: OrderItemData[], 
        transaction: Transaction
    ): Promise<number> {
        let total = 0;

        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            if (!product.isActive) {
                throw new Error(`Product ${product.name} is not available for purchase`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }

            const itemTotal = Number(product.price) * item.quantity;
            total += itemTotal;

            await OrderItem.create({
                orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            }, { transaction });

            await product.update({
                stock: product.stock - item.quantity
            }, { transaction });
        }

        if (total <= OrderService.MIN_ORDER_TOTAL) {
            throw new Error('Order total must be greater than zero');
        }

        return total;
    }
    private formatOrderOutput(order: Order): OrderOutput {
        const orderData = order.get();
        return {
            id: orderData.id ?? '',
            userId: orderData.userId,
            status: orderData.status,
            total: orderData.total,
            shippingAddress: orderData.shippingAddress,
            paymentStatus: orderData.paymentStatus,
            paymentMethod: orderData.paymentMethod,
            notes: order.notes ?? null,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            OrderItems: (order as any).OrderItems || []
        };
    }

    async createOrder(data: CreateOrderInput): Promise<OrderOutput> {
        this.validateOrderItems(data.items);
        this.validateShippingAddress(data.shippingAddress);
        this.validatePaymentMethod(data.paymentMethod);

        const t = await Order.sequelize!.transaction();

        try {
            const order = await Order.create({
                userId: data.userId,
                shippingAddress: data.shippingAddress,
                paymentMethod: data.paymentMethod,
                notes: data.notes ?? null,
                status: OrderService.DEFAULT_STATUS,
                paymentStatus: OrderService.DEFAULT_PAYMENT_STATUS,
                total: 0
            }, { transaction: t });

            const total = await this.processOrderItems(order.id, data.items, t);
            await order.update({ total }, { transaction: t });
            await t.commit();

            const createdOrder = await this.getOrderById(order.id);
            if (!createdOrder) {
                throw new Error("Failed to retrieve created order");
            }
            return createdOrder;
        } catch (error) {
            await t.rollback();
            throw new Error(`Error creating order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getOrderById(id: string): Promise<OrderOutput | null> {
        try {
            const order = await Order.findByPk(id, {
                include: [{
                    model: OrderItem,
                    include: [Product]
                }]
            });
            
            if (!order) {
                throw new NotFoundError('Order not found');
            }

            return this.formatOrderOutput(order);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new Error("Error fetching order");
        }
    }

    async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<OrderOutput> {
        const order = await Order.findByPk(id);
        if (!order) {
            throw new NotFoundError('Order not found');
        }
        
        if (!this.validateStatusTransition(order.status, newStatus)) {
            throw new ValidationError(`Invalid status transition from ${order.status} to ${newStatus}`);
        }

        await order.update({ status: newStatus });
        return this.formatOrderOutput(order);
    }

    async updatePaymentStatus(id: string, newStatus: PaymentStatus): Promise<OrderOutput> {
        const order = await Order.findByPk(id);
        if (!order) {
            throw new NotFoundError('Order not found');
        }
        
        if (!this.validatePaymentStatusTransition(order.paymentStatus, newStatus)) {
            throw new ValidationError(`Invalid payment status transition from ${order.paymentStatus} to ${newStatus}`);
        }

        await order.update({ paymentStatus: newStatus });
        return this.formatOrderOutput(order);
    }

    async deleteOrder(id: string): Promise<boolean> {
        const t = await Order.sequelize!.transaction();
        
        try {
            const order = await Order.findByPk(id, {
                include: [OrderItem],
                transaction: t
            });
            
            if (!order) return false;

            if (order.status !== 'pending' && order.status !== 'cancelled') {
                throw new Error('Only pending or cancelled orders can be deleted');
            }

            const orderItems = (order as any).OrderItems || [];
            for (const item of orderItems) {
                const product = await Product.findByPk(item.productId, { transaction: t });
                if (product) {
                    await product.update({
                        stock: product.stock + item.quantity
                    }, { transaction: t });
                }
            }

            await order.destroy({ transaction: t });
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw new Error(`Error deleting order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getOrders(
        filterOptions: OrderFilterOptions = {},
        paginationOptions: PaginationOptions = {}
    ): Promise<PaginatedOrdersResult> {
        try {
            const {
                userId,
                status,
                paymentStatus,
                startDate,
                endDate
            } = filterOptions;

            const {
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
            } = paginationOptions;

            const where: any = {};
            
            if (userId) where.userId = userId;
            if (status) where.status = status;
            if (paymentStatus) where.paymentStatus = paymentStatus;
            
            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate) where.createdAt.$gte = startDate;
                if (endDate) where.createdAt.$lte = endDate;
            }

            const { count, rows } = await Order.findAndCountAll({
                where,
                limit,
                offset: (page - 1) * limit,
                include: [{
                    model: OrderItem,
                    include: [Product]
                }],
                order: [[sortBy, sortOrder]]
            });

            const totalPages = Math.ceil(count / limit);

            return {
                orders: rows.map(order => this.formatOrderOutput(order)),
                total: count,
                page,
                totalPages,
                hasMore: page < totalPages
            };
        } catch (error) {
            throw new Error(
                `Error fetching orders: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }
}

export default new OrderService(); 