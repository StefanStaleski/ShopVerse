import { Op } from 'sequelize';
import { Product } from '../models';
import { 
    ProductInput, 
    ProductOutput, 
    ProductFilterOptions,
    PaginationOptions,
    PaginatedProductsResult 
} from '../types';
import { ValidationError, NotFoundError } from '../utils/errors';

class ProductService {
    private static readonly MIN_PRICE = 0.01;
    private static readonly MAX_PRICE = 999999.99;
    private static readonly MIN_STOCK = 0;
    private static readonly MAX_STOCK = 99999;

    private validateProductData(data: Partial<ProductInput>): void {
        if (data.price !== undefined && (data.price < ProductService.MIN_PRICE || data.price > ProductService.MAX_PRICE)) {
            throw new ValidationError(`Price must be between ${ProductService.MIN_PRICE} and ${ProductService.MAX_PRICE}`);
        }

        if (data.stock !== undefined && (data.stock < ProductService.MIN_STOCK || data.stock > ProductService.MAX_STOCK)) {
            throw new ValidationError(`Stock must be between ${ProductService.MIN_STOCK} and ${ProductService.MAX_STOCK}`);
        }

        if (data.name && data.name.length < 3) {
            throw new ValidationError('Product name must be at least 3 characters long');
        }

        if (data.description && data.description.length < 10) {
            throw new ValidationError('Product description must be at least 10 characters long');
        }
    }

    async createProduct(data: ProductInput): Promise<ProductOutput> {
        try {
            this.validateProductData(data);
            const product = await Product.create({
                id: require('crypto').randomUUID(),
                ...data,
                isActive: true
            });
            const productData = product.get({ plain: true }) as ProductOutput;
            return productData;
        } catch (error) {
            if (error instanceof ValidationError) throw error;
            throw new Error('Error creating product');
        }
    }

    async getProducts(
        filters: ProductFilterOptions = {},
        pagination: PaginationOptions = {}
    ): Promise<PaginatedProductsResult> {
        const { 
            categoryId, 
            minPrice, 
            maxPrice, 
            inStock, 
            searchQuery,
            isActive = true 
        } = filters;

        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;

        const offset = (page - 1) * limit;
        const where: any = { isActive };

        if (categoryId) where.categoryId = categoryId;
        if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
        if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };
        if (inStock) where.stock = { [Op.gt]: 0 };
        if (searchQuery) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${searchQuery}%` } },
                { description: { [Op.iLike]: `%${searchQuery}%` } }
            ];
        }

        const { rows: products, count: total } = await Product.findAndCountAll({
            where,
            limit,
            offset,
            order: [[sortBy, sortOrder]]
        });
        return {
            products: products.map(p => p.get({ plain: true })) as ProductOutput[],
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total
        };
    }

    async getProductById(id: string): Promise<ProductOutput> {
        const product = await Product.findOne({ 
            where: { id, isActive: true } 
        });

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        return product.get({ plain: true }) as ProductOutput;
    }

    async updateProduct(id: string, data: Partial<ProductInput>): Promise<ProductOutput> {
        const product = await Product.findByPk(id);
        
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        this.validateProductData(data);
        await product.update(data);
        
        return product.get({ plain: true }) as ProductOutput;
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