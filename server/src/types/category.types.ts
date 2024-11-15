export interface CategoryAttributes {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
    parentId: string | null;
}

export interface CategoryInput extends Omit<CategoryAttributes, 'id' | 'isActive'> {}

export interface CategoryOutput extends CategoryAttributes {
    createdAt: Date;
    updatedAt: Date;
} 