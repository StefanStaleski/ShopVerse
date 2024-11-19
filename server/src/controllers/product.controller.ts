import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';
import { ProductFilterOptions, PaginationOptions, ProductAttributes } from '../types';

class ProductController {
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { 
                categoryId, 
                minPrice, 
                maxPrice, 
                inStock, 
                searchQuery,
                page,
                limit,
                sortBy,
                sortOrder 
            } = req.query;

            const filters: ProductFilterOptions = {
                categoryId: categoryId as string,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                inStock: inStock === 'true',
                searchQuery: searchQuery as string
            };

            const pagination: PaginationOptions = {
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                sortBy: sortBy as keyof ProductAttributes,
                sortOrder: sortOrder as 'ASC' | 'DESC'
            };

            const products = await productService.getProducts(filters, pagination);
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const product = await productService.updateProduct(id, req.body);
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await productService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController(); 