export interface OrderAttributes {
    id: string;
    userId: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
    shippingAddress: string;
    paymentStatus: "pending" | "paid" | "failed";
    paymentMethod: string;
    notes?: string;
}

export interface OrderInput extends Omit<OrderAttributes, 'id' | 'status' | 'paymentStatus'> {}

export interface OrderOutput extends OrderAttributes {
    createdAt: Date;
    updatedAt: Date;
} 