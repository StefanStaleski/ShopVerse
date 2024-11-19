import { Request, Response } from 'express';
import authService from '../services/auth.service';

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({
                error: error instanceof Error ? error.message : 'Authentication failed'
            });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : 'Registration failed'
            });
        }
    }
}

export default new AuthController(); 