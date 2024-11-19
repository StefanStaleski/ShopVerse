import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { ValidationError, UnauthorizedError } from '../utils/errors';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        logger.error('Registration error:', error);
        
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof UnauthorizedError) {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Registration failed' });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Login error:', error);

        if (error instanceof UnauthorizedError) {
            if (error.message === 'Account is inactive') {
                res.status(401).json({ error: 'Account is inactive' });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(500).json({ error: 'Login failed' });
        }
    }
};

export default {
    register,
    login
}; 