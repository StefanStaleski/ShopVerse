export interface OrderItemAttributes {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
}

export interface OrderItemInput extends Omit<OrderItemAttributes, 'id'> {}

export interface OrderItemOutput extends OrderItemAttributes {
    createdAt: Date;
    updatedAt: Date;
} 