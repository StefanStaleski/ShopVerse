import { Request, Response } from 'express';
import productService from '../services/product.service';
import { logger } from '../utils/logger';
import { ValidationError, NotFoundError } from '../utils/errors';
import { PaginationOptions, ProductAttributes, ProductFilterOptions } from '../types';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const filters: ProductFilterOptions = {
            categoryId: req.query.categoryId as string,
            minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
            inStock: req.query.inStock === 'true',
            searchQuery: req.query.search as string,
            isActive: true
        };

        const pagination: PaginationOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            sortBy: (req.query.sortBy as keyof ProductAttributes) || 'createdAt',
            sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC'
        };

        const result = await productService.getProducts(filters, pagination);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        logger.error('Error fetching product:', error);
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        logger.error('Error creating product:', error);
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to create product' });
        }
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json(product);
    } catch (error) {
        logger.error('Error updating product:', error);
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to update product' });
        }
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(204).send();
    } catch (error) {
        logger.error('Error deleting product:', error);
        if (error instanceof NotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }
}; 