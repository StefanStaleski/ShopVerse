import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err.message
        });
    }

    // Log unexpected errors
    console.error('Unexpected error:', err);

    return res.status(500).json({
        status: 'error',
        error: 'Internal server error'
    });
}; 