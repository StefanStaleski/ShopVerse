import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { config } from '../config';
import { UserInput, UserOutput } from '../types';
import { UnauthorizedError, ValidationError } from '../utils/errors';

class AuthService {
    async login(email: string, password: string): Promise<{ token: string; user: UserOutput }> {
        const user = await User.findOne({ where: { email } });
        
        if (!user || !user.isActive) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedError('Invalid credentials');
        }

        await user.update({ lastLogin: new Date() });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        const { password: _, ...userOutput } = user.get();
        return { token, user: userOutput as UserOutput };
    }

    async register(userData: UserInput): Promise<{ token: string; user: UserOutput }> {
        const existingUser = await User.findOne({ 
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
            id: require('crypto').randomUUID(),
            ...userData,
            password: hashedPassword,
            role: 'user',
            isActive: true
        });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        const { password: _, ...userOutput } = user.get();
        return { token, user: userOutput as UserOutput };
    }
}

export default new AuthService(); 