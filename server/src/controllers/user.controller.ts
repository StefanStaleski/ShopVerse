import { Request, Response } from 'express';
import userService from '../services/user.service';
import { logger } from '../utils/logger';

export const listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.listUsers();
        res.status(200).json(users);
    } catch (error) {
        logger.error('Error listing users:', error);
        res.status(500).json({ error: 'Failed to list users' });
    }
};

export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await userService.deactivateUser(id);
        res.status(200).json(user);
    } catch (error) {
        logger.error('Error deactivating user:', error);
        res.status(500).json({ error: 'Failed to deactivate user' });
    }
};

export const activateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await userService.activateUser(id);
        res.status(200).json(user);
    } catch (error) {
        logger.error('Error activating user:', error);
        res.status(500).json({ error: 'Failed to activate user' });
    }
}; 