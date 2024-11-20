import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../utils/errors';

export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, stock, categoryId } = req.body;

    if (!name || !description || price === undefined || stock === undefined || !categoryId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    if (typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({ error: 'Stock cannot be negative' });
    }

    if (typeof name !== 'string' || name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long' });
    }

    if (typeof description !== 'string' || description.length < 10) {
        return res.status(400).json({ error: 'Description must be at least 10 characters long' });
    }

    if (typeof categoryId !== 'string' || !categoryId.trim()) {
        return res.status(400).json({ error: 'Invalid category ID' });
    }

    next();
};

export const validateUpdateProduct = (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, stock, categoryId } = req.body;

    // Validate price if provided
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'Price must be greater than 0' });
        }
    }

    // Validate stock if provided
    if (stock !== undefined) {
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: 'Stock cannot be negative' });
        }
    }

    // Validate name length if provided
    if (name !== undefined) {
        if (typeof name !== 'string' || name.length < 3) {
            return res.status(400).json({ error: 'Name must be at least 3 characters long' });
        }
    }

    // Validate description length if provided
    if (description !== undefined) {
        if (typeof description !== 'string' || description.length < 10) {
            return res.status(400).json({ error: 'Description must be at least 10 characters long' });
        }
    }

    // Validate categoryId if provided
    if (categoryId !== undefined) {
        if (typeof categoryId !== 'string' || !categoryId.trim()) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
    }

    next();
}; 