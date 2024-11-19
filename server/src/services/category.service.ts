import { Category } from "../models";
import { CategoryInput, CategoryOutput, CategoryAttributes } from "../types";
import { ValidationError, NotFoundError } from "../utils/errors";

class CategoryService {
    private static readonly MIN_NAME_LENGTH = 3;
    private static readonly MIN_DESCRIPTION_LENGTH = 10;

    private validateCategoryData(data: Partial<CategoryInput>): void {
        if (data.name !== undefined && data.name.length < CategoryService.MIN_NAME_LENGTH) {
            throw new ValidationError(`Name must be at least ${CategoryService.MIN_NAME_LENGTH} characters long`);
        }

        if (data.description !== undefined && data.description !== null && data.description.length < CategoryService.MIN_DESCRIPTION_LENGTH) {
            throw new ValidationError(`Description must be at least ${CategoryService.MIN_DESCRIPTION_LENGTH} characters long`);
        }

        if (data.imageUrl !== undefined && data.imageUrl !== null && !data.imageUrl.trim()) {
            throw new ValidationError('Image URL cannot be empty');
        }
    }

    async createCategory(data: CategoryInput): Promise<CategoryOutput> {
        try {
            this.validateCategoryData(data);

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
            if (error instanceof ValidationError) throw error;
            throw new Error("Error creating category");
        }
    }

    async getCategoryById(id: string): Promise<CategoryOutput> {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new NotFoundError('Category not found');
        }
        
        return {
            ...category.get(),
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };
    }

    async getCategories(): Promise<CategoryOutput[]> {
        try {
            const categories = await Category.findAll({
                where: { isActive: true }
            });
            return categories.map(category => ({
                ...category.get(),
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            }));
        } catch (error) {
            throw new Error("Error fetching categories");
        }
    }

    async updateCategory(id: string, data: Partial<CategoryInput>): Promise<CategoryOutput> {
        this.validateCategoryData(data);

        const category = await Category.findByPk(id);
        if (!category) {
            throw new NotFoundError('Category not found');
        }

        await category.update(data);
        return {
            ...category.get(),
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };
    }

    async deleteCategory(id: string): Promise<boolean> {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new NotFoundError('Category not found');
        }

        await category.destroy();
        return true;
    }
}

export default new CategoryService(); 