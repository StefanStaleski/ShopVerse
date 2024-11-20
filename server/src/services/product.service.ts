import { Op } from 'sequelize';
import { Product } from '../models';
import { ProductInput, ProductOutput, PaginationOptions, ProductFilterOptions } from '../types';
import { ValidationError, NotFoundError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

class ProductService {
    private static readonly MIN_NAME_LENGTH = 3;
    private static readonly MIN_DESCRIPTION_LENGTH = 10;

    private validateProductData(data: Partial<ProductInput>): void {
        if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length < ProductService.MIN_NAME_LENGTH)) {
            throw new ValidationError(`Name must be at least ${ProductService.MIN_NAME_LENGTH} characters long`);
        }

        if (data.description !== undefined && (typeof data.description !== 'string' || data.description.length < ProductService.MIN_DESCRIPTION_LENGTH)) {
            throw new ValidationError(`Description must be at least ${ProductService.MIN_DESCRIPTION_LENGTH} characters long`);
        }

        if (data.price !== undefined && (typeof data.price !== 'number' || data.price <= 0)) {
            throw new ValidationError('Price must be greater than 0');
        }

        if (data.stock !== undefined && (typeof data.stock !== 'number' || data.stock < 0)) {
            throw new ValidationError('Stock cannot be negative');
        }

        if (data.categoryId !== undefined && (typeof data.categoryId !== 'string' || !data.categoryId.trim())) {
            throw new ValidationError('Invalid category ID');
        }
    }

    async createProduct(data: ProductInput): Promise<ProductOutput> {
        this.validateProductData(data);

        try {
            const product = await Product.create({
                id: uuidv4(),
                ...data,
                isActive: true
            });

            return product.get({ plain: true }) as ProductOutput;
        } catch (error) {
            throw new Error('Error creating product');
        }
    }

    async getProducts(
        filters: ProductFilterOptions = {},
        pagination: PaginationOptions = { page: 1, limit: 10, sortBy: 'id', sortOrder: 'DESC' }
    ) {
        const where: any = { isActive: true };

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined) where.price[Op.gte] = filters.minPrice;
            if (filters.maxPrice !== undefined) where.price[Op.lte] = filters.maxPrice;
        }

        if (filters.inStock) {
            where.stock = { [Op.gt]: 0 };
        }

        if (filters.searchQuery) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${filters.searchQuery}%` } },
                { description: { [Op.iLike]: `%${filters.searchQuery}%` } }
            ];
        }

        const { rows: products, count: total } = await Product.findAndCountAll({
            where,
            limit: pagination.limit ?? 10,
            offset: ((pagination.page ?? 1) - 1) * (pagination.limit ?? 10),
            order: [[pagination.sortBy ?? 'createdAt', pagination.sortOrder ?? 'DESC']]
        });

        return {
            products: products.map(product => product.get()),
            total,
            page: pagination.page ?? 1,
            totalPages: Math.ceil(total / (pagination.limit ?? 10))
        };
    }

    async getProductById(id: string): Promise<ProductOutput> {
        const product = await Product.findOne({
            where: { id, isActive: true }
        });

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        return product.get() as ProductOutput;
    }

    async updateProduct(id: string, data: Partial<ProductInput>): Promise<ProductOutput> {
        this.validateProductData(data);

        const product = await Product.findByPk(id);
        if (!product) {
            throw new NotFoundError('Product not found');
        }
        await product.update(data);
        return product.get() as ProductOutput;
    }

    async deleteProduct(id: string): Promise<void> {
        const product = await Product.findByPk(id);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        // Soft delete by setting isActive to false
        await product.update({ isActive: false });
    }
}

export default new ProductService(); 