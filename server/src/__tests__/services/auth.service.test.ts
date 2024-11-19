import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models';
import authService from '../../services/auth.service';
import { UnauthorizedError, ValidationError } from '../../utils/errors';
import { mockUserData, mockUserInput, mockSequelizeUser } from '../helpers/mockData';

// Mock the User model
jest.mock('../../models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
    }
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn()
}));

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should successfully login a user with valid credentials', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(mockSequelizeUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await authService.login(mockUserData.email, mockUserData.password);

            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.user).not.toHaveProperty('password');
            expect(mockSequelizeUser.update).toHaveBeenCalledWith({ 
                lastLogin: expect.any(Date) 
            });
        });

        it('should throw UnauthorizedError for invalid credentials', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(
                authService.login(mockUserData.email, mockUserData.password)
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should throw UnauthorizedError for incorrect password', async () => {
            const mockUser = {
                ...mockUserData,
                get: () => mockUserData,
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                authService.login(mockUserData.email, mockUserData.password)
            ).rejects.toThrow(UnauthorizedError);
        });
    });

    describe('register', () => {
        it('should successfully register a new user', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce(null);
            const hashedPassword = 'hashedPassword123';
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            
            const mockCreatedUser = {
                ...mockSequelizeUser,
                password: hashedPassword
            };
            (User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

            const result = await authService.register(mockUserInput);

            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.user).not.toHaveProperty('password');
            expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
                email: mockUserInput.email,
                password: hashedPassword,
                role: 'user',
                isActive: true
            }));
        });
    });
}); 