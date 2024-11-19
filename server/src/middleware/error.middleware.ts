import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log request details
    const requestDetails = {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        body: req.body,
        userId: req.user?.id,
    };

    if (err instanceof AppError) {
        logger.warn({
            message: err.message,
            statusCode: err.statusCode,
            status: err.status,
            request: requestDetails
        });

        return res.status(err.statusCode).json({
            status: err.status,
            error: err.message
        });
    }

    // Log unexpected errors
    logger.error({
        message: err.message,
        stack: err.stack,
        request: requestDetails
    });

    return res.status(500).json({
        status: 'error',
        error: 'Internal server error'
    });
}; 