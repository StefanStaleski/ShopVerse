import { Request, Response } from 'express';
import profileService from '../services/profile.service';
import { logger } from '../utils/logger';
import { UnauthorizedError, ValidationError } from '../utils/errors';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const profile = await profileService.getProfile(req.user!.id);
        res.status(200).json(profile);
    } catch (error) {
        logger.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedProfile = await profileService.updateProfile(req.user!.id, req.body);
        res.status(200).json(updatedProfile);
    } catch (error) {
        logger.error('Error updating profile:', error);
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        await profileService.updatePassword(req.user!.id, currentPassword, newPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        logger.error('Error updating password:', error);
        if (error instanceof UnauthorizedError) {
            res.status(401).json({ error: error.message });
        } else if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to update password' });
        }
    }
}; 