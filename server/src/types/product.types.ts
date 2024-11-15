export interface ProductAttributes {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
    isActive: boolean;
    categoryId: string;
}

export interface ProductInput extends Omit<ProductAttributes, 'id' | 'isActive'> {}

export interface ProductOutput extends ProductAttributes {
    createdAt: Date;
    updatedAt: Date;
} 