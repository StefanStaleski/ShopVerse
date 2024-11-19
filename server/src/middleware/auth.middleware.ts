import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { config } from '../config/index';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            }
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            throw new UnauthorizedError('No token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedError('Invalid token format');
        }

        const decoded = verify(token, config.jwt.secret) as { id: string; role: string };
        req.user = decoded;
        
        next();
    } catch (error) {
        next(new UnauthorizedError('Invalid token'));
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new UnauthorizedError('Not authenticated');
        }

        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError('Not authorized');
        }

        next();
    };
}; 