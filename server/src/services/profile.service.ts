import bcrypt from 'bcryptjs';
import { User } from '../models';
import { UserOutput } from '../types';
import { UnauthorizedError, ValidationError, NotFoundError } from '../utils/errors';

class ProfileService {
    async getProfile(userId: string): Promise<UserOutput> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const userData = user.get();
        const { password, ...userOutput } = userData;
        return {
            ...userOutput,
            createdAt: user.createdAt!,
            updatedAt: user.updatedAt!
        } as UserOutput;
    }

    async updateProfile(userId: string, updateData: Partial<UserOutput>): Promise<UserOutput> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        // Prevent updating sensitive fields
        const { role, isActive, ...allowedUpdates } = updateData;

        await user.update(allowedUpdates);
        const userData = user.get();
        const { password: _, ...userOutput } = userData;
        return {
            ...userOutput,
            createdAt: user.createdAt!,
            updatedAt: user.updatedAt!
        } as UserOutput;
    }

    async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedError('Current password is incorrect');
        }

        if (newPassword.length < 8) {
            throw new ValidationError('New password must be at least 8 characters long');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
    }
}

export default new ProfileService(); 