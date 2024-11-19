import { UserAttributes, UserInput, UserOutput } from '../../types';

export const mockUserData: UserAttributes = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isActive: true,
    lastLogin: undefined
};

export const mockUserInput: UserInput = {
    email: mockUserData.email,
    password: mockUserData.password,
    firstName: mockUserData.firstName,
    lastName: mockUserData.lastName
};

export const mockUserOutput: UserOutput = {
    id: mockUserData.id,
    email: mockUserData.email,
    firstName: mockUserData.firstName,
    lastName: mockUserData.lastName,
    role: mockUserData.role,
    isActive: mockUserData.isActive,
    lastLogin: mockUserData.lastLogin,
    createdAt: new Date(),
    updatedAt: new Date()
};

export const mockSequelizeUser = {
    ...mockUserData,
    update: jest.fn().mockResolvedValue(true),
    get: () => ({ ...mockUserData }),
    createdAt: new Date(),
    updatedAt: new Date()
};

export const mockOrderData = {
    id: 'order-123',
    userId: 'user-123',
    status: 'pending' as const,
    total: 99.99,
    shippingAddress: '123 Test St',
    paymentStatus: 'pending' as const,
    paymentMethod: 'credit_card',
    notes: 'Test order',
    createdAt: new Date(),
    updatedAt: new Date()
};

export const mockOrderInput = {
    userId: 'user-123',
    shippingAddress: '123 Test St',
    paymentMethod: 'credit_card',
    notes: 'Test order',
    items: [
        {
            productId: 'product-123',
            quantity: 2
        }
    ]
};

export const mockSequelizeProduct = {
    id: 'product-123',
    name: 'Test Product', 
    description: 'Test Description',
    price: 49.99,
    stock: 10,
    isActive: true,
    get: function() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            stock: this.stock,
            isActive: this.isActive
        };
    }
};

export const mockProductInput = {
    name: 'Test Product',
    description: 'This is a test product description',
    price: 99.99,
    stock: 100,
    categoryId: 'category-123'
};

export const mockProductData = {
    id: 'product-123',
    ...mockProductInput,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
};

export const mockCategoryInput = {
    name: 'Test Category',
    description: 'This is a test category'
};

export const mockCategoryData = {
    id: 'category-123',
    ...mockCategoryInput,
    createdAt: new Date(),
    updatedAt: new Date()
};
 