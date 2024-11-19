import { User } from '../../models';
import userService from '../../services/user.service';
import { mockUserData, mockUserInput, mockSequelizeUser } from '../helpers/mockData';

// Mock the User model
jest.mock('../../models', () => ({
    User: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
    }
}));

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should successfully create a user', async () => {
            (User.create as jest.Mock).mockResolvedValue(mockSequelizeUser);

            const result = await userService.createUser(mockUserInput);

            expect(result).not.toHaveProperty('password');
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('createdAt');
            expect(result).toHaveProperty('updatedAt');
            expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
                ...mockUserInput,
                role: 'user',
                isActive: true
            }));
        });

        it('should throw error when creation fails', async () => {
            (User.create as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                userService.createUser(mockUserInput)
            ).rejects.toThrow('Error creating user');
        });
    });

    describe('updateUser', () => {
        it('should successfully update a user', async () => {
            const updatedUser = {
                ...mockSequelizeUser,
                firstName: 'Jane',
                get: () => ({ ...mockSequelizeUser, firstName: 'Jane' })
            };
            (User.findByPk as jest.Mock).mockResolvedValue(updatedUser);

            const result = await userService.updateUser(mockUserData.id, { firstName: 'Jane' });

            expect(result).not.toHaveProperty('password');
            expect(result?.firstName).toBe('Jane');
        });

        it('should return null when user not found', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            const result = await userService.updateUser(mockUserData.id, { firstName: 'Jane' });

            expect(result).toBeNull();
        });
    });

    describe('deleteUser', () => {
        it('should successfully delete a user', async () => {
            (User.destroy as jest.Mock).mockResolvedValue(1);

            const result = await userService.deleteUser(mockUserData.id);

            expect(result).toBe(true);
            expect(User.destroy).toHaveBeenCalledWith({
                where: { id: mockUserData.id }
            });
        });

        it('should return false when user not found', async () => {
            (User.destroy as jest.Mock).mockResolvedValue(0);

            const result = await userService.deleteUser(mockUserData.id);

            expect(result).toBe(false);
        });

        it('should throw error when deletion fails', async () => {
            (User.destroy as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                userService.deleteUser(mockUserData.id)
            ).rejects.toThrow('Error deleting user');
        });
    });

    describe('getUserById', () => {
        it('should return user when found', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(mockSequelizeUser);

            const result = await userService.getUserById(mockUserData.id);

            expect(result).not.toHaveProperty('password');
            expect(result?.id).toBe(mockUserData.id);
            expect(User.findByPk).toHaveBeenCalledWith(mockUserData.id);
        });

        it('should return null when user not found', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            const result = await userService.getUserById('non-existent-id');

            expect(result).toBeNull();
        });

        it('should throw error when fetching fails', async () => {
            (User.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                userService.getUserById(mockUserData.id)
            ).rejects.toThrow('Error fetching user');
        });
    });
}); 