import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order.service';
import { CreateOrderInput, OrderAttributes, OrderStatus, PaymentStatus, ProductAttributes } from '../types';

class OrderController {
    async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const orderData: CreateOrderInput = req.body;
            const order = await orderService.createOrder(orderData);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    async getOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                userId = req.user?.id,
                status,
                paymentStatus,
                startDate,
                endDate,
                page,
                limit,
                sortBy,
                sortOrder
            } = req.query;

            // If route is /my-orders, force userId to be current user's id
            const forcedUserId = req.path === '/my-orders' ? req.user?.id : userId;

            const filterOptions = {
                userId: forcedUserId as string,
                status: status as OrderStatus,
                paymentStatus: paymentStatus as PaymentStatus,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined
            };

            const paginationOptions = {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined,
                sortBy: sortBy as keyof OrderAttributes | undefined,
                sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC'
            };

            // Cast sortBy to keyof ProductAttributes since that's what the service expects
            const orders = await orderService.getOrders(filterOptions, {
                ...paginationOptions,
                sortBy: paginationOptions.sortBy as keyof ProductAttributes
            });
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }

    async getOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(id);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await orderService.updateOrderStatus(id, status);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { paymentStatus } = req.body;
            const order = await orderService.updatePaymentStatus(id, paymentStatus);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async deleteOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await orderService.deleteOrder(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController(); 