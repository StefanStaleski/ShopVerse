import { Request, Response, NextFunction } from 'express';

export const validatePasswordUpdate = (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        return res.status(400).json({ error: 'Invalid password format' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return res.status(400).json({ 
            error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
        });
    }

    next();
};

export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email } = req.body;

    if (email && (typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const nameRegex = /^[A-Za-z\s]{2,}$/;
    if (firstName && !nameRegex.test(firstName)) {
        return res.status(400).json({ error: 'First name must be at least 2 characters long and contain only letters' });
    }
    if (lastName && !nameRegex.test(lastName)) {
        return res.status(400).json({ error: 'Last name must be at least 2 characters long and contain only letters' });
    }

    next();
}; 