import { User } from "../models";
import { UserInput, UserOutput, UserAttributes } from "../types";

class UserService {
    async createUser(data: UserInput): Promise<UserOutput> {
        try {
            const user = await User.create({
                ...data,
                role: "user",
                isActive: true
            } as UserAttributes);
            
            const { password, ...userOutput } = user.get() as UserAttributes;
            return {
                ...userOutput,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            throw new Error("Error creating user");
        }
    }

    async getUserById(id: string): Promise<UserOutput | null> {
        try {
            const user = await User.findByPk(id);
            if (!user) return null;
            
            const { password, ...userOutput } = user.get() as UserAttributes;
            return {
                ...userOutput,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            throw new Error("Error fetching user");
        }
    }

    async updateUser(id: string, data: Partial<UserInput>): Promise<UserOutput | null> {
        try {
            const user = await User.findByPk(id);
            if (!user) return null;

            await user.update(data);
            const { password, ...userOutput } = user.get() as UserAttributes;
            return {
                ...userOutput,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        } catch (error) {
            throw new Error("Error updating user");
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const deleted = await User.destroy({ where: { id } });
            return deleted > 0;
        } catch (error) {
            throw new Error("Error deleting user");
        }
    }
}

export default new UserService(); 