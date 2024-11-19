import { Category } from "../models";
import { CategoryInput, CategoryOutput, CategoryAttributes } from "../types";

class CategoryService {
    async createCategory(data: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await Category.create({
                ...data,
                isActive: true
            } as CategoryAttributes);
            
            return {
                ...category.get(),
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            };
        } catch (error) {
            throw new Error("Error creating category");
        }
    }

    async getCategoryById(id: string): Promise<CategoryOutput | null> {
        try {
            const category = await Category.findByPk(id);
            if (!category) return null;
            
            return {
                ...category.get(),
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            };
        } catch (error) {
            throw new Error("Error fetching category");
        }
    }

    async updateCategory(id: string, data: Partial<CategoryInput>): Promise<CategoryOutput | null> {
        try {
            const category = await Category.findByPk(id);
            if (!category) return null;

            await category.update(data);
            return {
                ...category.get(),
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            };
        } catch (error) {
            throw new Error("Error updating category");
        }
    }

    async deleteCategory(id: string): Promise<boolean> {
        try {
            const deleted = await Category.destroy({ where: { id } });
            return deleted > 0;
        } catch (error) {
            throw new Error("Error deleting category");
        }
    }
}

export default new CategoryService(); 