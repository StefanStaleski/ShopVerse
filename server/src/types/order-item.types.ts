import { Optional } from 'sequelize';

export interface OrderItemAttributes {
    id?: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderItemInput extends Optional<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface OrderItemOutput extends Required<OrderItemAttributes> {}

export interface OrderItemWithProduct extends OrderItemOutput {
    Product?: {
        id: string;
        name: string;
        price: number;
        stock: number;
        isActive: boolean;
    };
} 