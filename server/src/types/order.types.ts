import { Optional } from 'sequelize';
import { OrderItemOutput } from './order-item.types';

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    "pending": ["processing", "cancelled"],
    "processing": ["shipped", "cancelled"],
    "shipped": ["delivered", "cancelled"],
    "delivered": [],
    "cancelled": []
};

export const PAYMENT_STATUS_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
    "pending": ["paid", "failed"],
    "paid": ["failed"],
    "failed": ["pending"]
};

export interface OrderAttributes {
    id?: string;
    userId: string;
    status: OrderStatus;
    total: number;
    shippingAddress: string;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    notes: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderInput extends Optional<OrderAttributes, 
    'id' | 
    'createdAt' | 
    'updatedAt' | 
    'status' | 
    'paymentStatus' |
    'notes' |
    'total'
> {}

export interface OrderOutput extends Required<OrderAttributes> {
    OrderItems?: OrderItemOutput[];
}

export interface OrderItemData {
    productId: string;
    quantity: number;
}

export interface CreateOrderInput {
    userId: string;
    shippingAddress: string;
    paymentMethod: string;
    notes?: string;
    items: OrderItemData[];
}

export interface OrderFilterOptions {
    userId?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    startDate?: Date;
    endDate?: Date;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: keyof OrderAttributes;
    sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedOrdersResult {
    orders: OrderOutput[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
} 