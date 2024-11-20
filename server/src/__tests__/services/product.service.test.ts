import { Product } from '../../models';
import productService from '../../services/product.service';
import { PaginationOptions, ProductFilterOptions } from '../../types';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { mockProductData, mockProductInput, mockSequelizeProduct } from '../helpers/mockData';

jest.mock('../../models', () => ({
    Product: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findAndCountAll: jest.fn(),
        destroy: jest.fn(),
        update: jest.fn()
    }
}));

describe('ProductService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validateProductData', () => {
        it('should throw error for invalid price', async () => {
            const invalidData = {
                ...mockProductInput,
                price: 0
            };

            await expect(
                productService.createProduct(invalidData)
            ).rejects.toThrow(ValidationError);
        });

        it('should throw error for invalid stock', async () => {
            const invalidData = {
                ...mockProductInput,
                stock: -1
            };

            await expect(
                productService.createProduct(invalidData)
            ).rejects.toThrow(ValidationError);
        });

        it('should throw error for short name', async () => {
            const invalidData = {
                ...mockProductInput,
                name: 'ab'
            };

            await expect(
                productService.createProduct(invalidData)
            ).rejects.toThrow(ValidationError);
        });

        it('should throw error for short description', async () => {
            const invalidData = {
                ...mockProductInput,
                description: 'short'
            };

            await expect(
                productService.createProduct(invalidData)
            ).rejects.toThrow(ValidationError);
        });
    });

    describe('createProduct', () => {
        it('should create product successfully', async () => {
            const mockCreatedProduct = {
                ...mockSequelizeProduct,
                get: jest.fn().mockReturnValue(mockProductData)
            };
            
            (Product.create as jest.Mock).mockResolvedValue(mockCreatedProduct);

            const result = await productService.createProduct(mockProductInput);

            expect(result).toEqual(mockProductData);
            expect(Product.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...mockProductInput,
                    isActive: true,
                    id: expect.any(String)
                })
            );
        });

        it('should handle database errors', async () => {
            (Product.create as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                productService.createProduct(mockProductInput)
            ).rejects.toThrow('Error creating product');
        });
    });

    describe('getProducts', () => {
        const defaultPagination: PaginationOptions = {
            page: 1,
            limit: 10,
            sortBy: 'id',
            sortOrder: 'DESC'
        };

        const mockFilters: ProductFilterOptions = {
            categoryId: 'category-123',
            minPrice: 10,
            maxPrice: 100,
            inStock: true,
            searchQuery: 'test',
            isActive: true
        };

        it('should get paginated products with filters', async () => {
            const mockProducts = [mockSequelizeProduct];
            (Product.findAndCountAll as jest.Mock).mockResolvedValue({
                rows: mockProducts,
                count: mockProducts.length
            });

            const result = await productService.getProducts(mockFilters, defaultPagination);

            expect(result.products).toHaveLength(1);
            expect(result.total).toBe(1);
            expect(result.page).toBe(1);
            expect(Product.findAndCountAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        categoryId: mockFilters.categoryId,
                        isActive: true,
                        price: expect.any(Object),
                        stock: expect.any(Object)
                    }),
                    limit: defaultPagination.limit,
                    offset: 0,
                    order: [[defaultPagination.sortBy, defaultPagination.sortOrder]]
                })
            );
        });

        it('should handle empty filters and use default pagination', async () => {
            const mockProducts = [{
                id: '1',
                name: 'Test Product',
                get: () => ({
                    id: '1',
                    name: 'Test Product'
                })
            }];
            
            (Product.findAndCountAll as jest.Mock).mockResolvedValue({
                rows: mockProducts,
                count: 1
            });

            const result = await productService.getProducts();

            expect(result.products).toHaveLength(1);
            expect(Product.findAndCountAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { isActive: true },
                    limit: 10,
                    offset: 0,
                    order: [['id', 'DESC']]
                })
            );
        });
    });

    describe('getProductById', () => {
        it('should return product when found', async () => {
            (Product.findOne as jest.Mock).mockResolvedValue(mockSequelizeProduct);

            const result = await productService.getProductById('product-123');

            expect(result).toEqual(mockSequelizeProduct.get());
            expect(Product.findOne).toHaveBeenCalledWith({
                where: { id: 'product-123', isActive: true }
            });
        });

        it('should throw NotFoundError when product not found', async () => {
            (Product.findOne as jest.Mock).mockResolvedValue(null);

            await expect(
                productService.getProductById('non-existent')
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe('updateProduct', () => {
        const updateData = {
            price: 199.99,
            stock: 50
        };

        it('should update product successfully', async () => {
            const mockUpdatedProduct = {
                ...mockSequelizeProduct,
                ...updateData,
                update: jest.fn().mockResolvedValue(true)
            };
            
            (Product.findByPk as jest.Mock).mockResolvedValue(mockUpdatedProduct);

            const result = await productService.updateProduct('product-123', updateData);

            expect(result).toEqual(mockUpdatedProduct.get());
            expect(mockUpdatedProduct.update).toHaveBeenCalledWith(updateData);
        });

        it('should throw NotFoundError when product does not exist', async () => {
            (Product.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(
                productService.updateProduct('non-existent', updateData)
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe('deleteProduct', () => {
        it('should soft delete product', async () => {
            const mockProduct = {
                ...mockSequelizeProduct,
                update: jest.fn().mockResolvedValue(true)
            };
            (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

            await productService.deleteProduct('product-123');

            expect(mockProduct.update).toHaveBeenCalledWith({ isActive: false });
        });

        it('should throw NotFoundError when product does not exist', async () => {
            (Product.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(
                productService.deleteProduct('non-existent')
            ).rejects.toThrow(NotFoundError);
        });
    });
}); 