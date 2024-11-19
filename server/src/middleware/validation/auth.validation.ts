import { Request, Response, NextFunction } from 'express';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    next();
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (typeof firstName !== 'string' || firstName.length < 2) {
        return res.status(400).json({ error: 'First name must be at least 2 characters long' });
    }

    if (typeof lastName !== 'string' || lastName.length < 2) {
        return res.status(400).json({ error: 'Last name must be at least 2 characters long' });
    }

    next();
}; 