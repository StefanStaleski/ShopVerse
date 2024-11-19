import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { config } from '../config';
import { UserInput, UserOutput, AuthResponse, UserModel } from '../types';
import { UnauthorizedError, ValidationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

class AuthService {
    private formatUserOutput(user: UserModel): UserOutput {
        const userData = user.get();
        const { password, ...userOutput } = userData;
        
        return {
            ...userOutput,
            createdAt: user.createdAt!,
            updatedAt: user.updatedAt!,
            lastLogin: user.lastLogin
        } as UserOutput;
    }

    private generateToken(user: UserModel): string {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await User.findOne({ 
            where: { email }
        });
        
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedError('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedError('Account is inactive');
        }

        await user.update({ lastLogin: new Date() });

        const token = this.generateToken(user);
        const userOutput = this.formatUserOutput(user);

        return { token, user: userOutput };
    }

    async register(userData: UserInput & { role?: string }): Promise<AuthResponse> {
        const existingUser = await User.findOne({ 
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            const user = await User.create({
                id: uuidv4(),
                ...userData,
                password: hashedPassword,
                role: (userData.role || 'user') as 'admin' | 'user',
                isActive: true,
                lastLogin: null
                });

            const token = this.generateToken(user);
            const userOutput = this.formatUserOutput(user);

            return { token, user: userOutput };
        } catch (error) {
            throw new ValidationError('Registration failed');
        }
    }
}

export default new AuthService(); 