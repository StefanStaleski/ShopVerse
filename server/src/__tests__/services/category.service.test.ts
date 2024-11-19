import { Category } from '../../models';
import categoryService from '../../services/category.service';
import { ValidationError, NotFoundError } from '../../utils/errors';
import { mockCategoryData, mockCategoryInput } from '../helpers/mockData';

jest.mock('../../models', () => ({
    Category: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    }
}));

describe('CategoryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createCategory', () => {
        const validInput = {
            ...mockCategoryInput,
            imageUrl: 'test-image.jpg',
            parentId: null
        };

        it('should create category successfully', async () => {
            const mockCreatedCategory = {
                ...mockCategoryData,
                get: jest.fn().mockReturnValue(mockCategoryData)
            };
            
            (Category.create as jest.Mock).mockResolvedValue(mockCreatedCategory);

            const result = await categoryService.createCategory(validInput);

            expect(result).toEqual(mockCategoryData);
            expect(Category.create).toHaveBeenCalledWith(expect.objectContaining({
                ...validInput,
                isActive: true
            }));
        });

        it('should throw validation error for short name', async () => {
            const invalidData = {
                ...validInput,
                name: 'ab' // too short
            };

            await expect(
                categoryService.createCategory(invalidData)
            ).rejects.toThrow(ValidationError);
            expect(Category.create).not.toHaveBeenCalled();
        });

        it('should throw validation error for short description', async () => {
            const invalidData = {
                ...validInput,
                description: 'short' // too short
            };

            await expect(
                categoryService.createCategory(invalidData)
            ).rejects.toThrow(ValidationError);
            expect(Category.create).not.toHaveBeenCalled();
        });

        it('should throw validation error for empty image URL', async () => {
            const invalidData = {
                ...validInput,
                imageUrl: '   ' // empty or whitespace
            };

            await expect(
                categoryService.createCategory(invalidData)
            ).rejects.toThrow(ValidationError);
            expect(Category.create).not.toHaveBeenCalled();
        });
    });

    describe('getCategories', () => {
        it('should return all active categories', async () => {
            const mockCategories = [
                { ...mockCategoryData, get: () => mockCategoryData }
            ];
            (Category.findAll as jest.Mock).mockResolvedValue(mockCategories);

            const result = await categoryService.getCategories();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockCategoryData);
            expect(Category.findAll).toHaveBeenCalledWith({
                where: { isActive: true }
            });
        });
    });

    describe('updateCategory', () => {
        const updateData = {
            name: 'Updated Category'
        };

        it('should update category successfully', async () => {
            const mockCategory = {
                ...mockCategoryData,
                update: jest.fn(),
                get: jest.fn().mockReturnValue({
                    ...mockCategoryData,
                    name: updateData.name
                })
            };
            
            (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

            const result = await categoryService.updateCategory('category-123', updateData);

            expect(result.name).toBe(updateData.name);
            expect(mockCategory.update).toHaveBeenCalledWith(updateData);
        });

        it('should throw NotFoundError for non-existent category', async () => {
            (Category.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(
                categoryService.updateCategory('non-existent', updateData)
            ).rejects.toThrow(NotFoundError);
            expect(Category.update).not.toHaveBeenCalled();
        });

        it('should throw validation error for invalid update data', async () => {
            const invalidData = { name: 'ab' }; // too short
            const mockCategory = {
                ...mockCategoryData,
                update: jest.fn()
            };
            
            (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

            await expect(
                categoryService.updateCategory('category-123', invalidData)
            ).rejects.toThrow(ValidationError);
            expect(mockCategory.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteCategory', () => {
        it('should delete category successfully', async () => {
            const mockCategory = {
                ...mockCategoryData,
                destroy: jest.fn().mockResolvedValue(true)
            };
            
            (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

            const result = await categoryService.deleteCategory('category-123');

            expect(result).toBe(true);
            expect(mockCategory.destroy).toHaveBeenCalled();
        });

        it('should throw NotFoundError when category does not exist', async () => {
            (Category.findByPk as jest.Mock).mockResolvedValue(null);

            await expect(
                categoryService.deleteCategory('non-existent')
            ).rejects.toThrow(NotFoundError);
        });
    });
}); 