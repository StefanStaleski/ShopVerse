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

export interface ProductFilterOptions {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    searchQuery?: string;
    isActive?: boolean;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: keyof ProductAttributes;
    sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedProductsResult {
    products: ProductOutput[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
} 