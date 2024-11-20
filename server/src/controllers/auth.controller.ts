import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { UnauthorizedError } from '../utils/errors';
import { logger } from '../utils/logger';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Login error:', error);
        if (error instanceof UnauthorizedError) {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        logger.error('Registration error:', error);
        if (error instanceof Error && error.message.includes('Email already exists')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}; 