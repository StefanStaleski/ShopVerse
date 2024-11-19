import { Request, Response, NextFunction } from 'express';
import { OrderStatus, PaymentStatus } from '../../types';
import { ValidationError } from '../../utils/errors';

export const validateCreateOrder = (req: Request, res: Response, next: NextFunction) => {
    const { userId, shippingAddress, paymentMethod, items } = req.body;

    if (!userId || !shippingAddress || !paymentMethod || !items) {
        throw new ValidationError('Missing required fields');
    }

    if (!Array.isArray(items) || items.length === 0) {
        throw new ValidationError('Order must contain at least one item');
    }

    for (const item of items) {
        if (!item.productId || typeof item.quantity !== 'number' || item.quantity < 1) {
            throw new ValidationError('Invalid item data');
        }
    }

    next();
};

export const validateUpdateOrderStatus = (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const validStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
        throw new ValidationError('Invalid order status');
    }

    next();
};

export const validateUpdatePaymentStatus = (req: Request, res: Response, next: NextFunction) => {
    const { paymentStatus } = req.body;
    const validStatuses: PaymentStatus[] = ['pending', 'paid', 'failed'];

    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
        throw new ValidationError('Invalid payment status');
    }

    next();
}; 