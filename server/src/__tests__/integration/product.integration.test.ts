import request from 'supertest';
import app from '../../app';
import { Product, Category, User } from '../../models';
import { mockProductInput, mockCategoryInput } from '../helpers/mockData';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

describe('Product Integration Tests', () => {
    let adminToken: string;
    let userToken: string;
    let categoryId: string;

    beforeEach(async () => {
        // Clean up the database
        await Product.destroy({ where: {}, force: true });
        await Category.destroy({ where: {}, force: true });
        await User.destroy({ where: {}, force: true });
        // Create a category
        const category = await Category.create({
            id: uuidv4(),
            ...mockCategoryInput,
            isActive: true
        });
        categoryId = category.id;

        // Create admin user
        const adminUser = await User.create({
            id: uuidv4(),
            email: 'admin@test.com',
            password: await bcrypt.hash('Admin123!@#', 10),
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isActive: true
        });

        // Create regular user
        const regularUser = await User.create({
            id: uuidv4(),
            email: 'user@test.com',
            password: await bcrypt.hash('User123!@#', 10),
            firstName: 'Regular',
            lastName: 'User',
            role: 'user',
            isActive: true
        });

        // Get tokens
        const adminResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@test.com',
                password: 'Admin123!@#'
            });
        adminToken = adminResponse.body.token;

        const userResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user@test.com',
                password: 'User123!@#'
            });
        userToken = userResponse.body.token;
    });

    describe('Product CRUD Operations', () => {
        it('should allow admin to create a product', async () => {
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    ...mockProductInput,
                    categoryId
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(mockProductInput.name);
            expect(response.body.categoryId).toBe(categoryId);
        });

        it('should not allow regular users to create products', async () => {
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send(mockProductInput);

            expect(response.status).toBe(403);
        });

        it('should list products with pagination and filters', async () => {
            // Create test product
            await Product.create({
                id: uuidv4(),
                ...mockProductInput,
                categoryId,
                isActive: true
            });

            const response = await request(app)
                .get('/api/products')
                .query({
                    page: 1,
                    limit: 10,
                    categoryId,
                    minPrice: 10,
                    maxPrice: 100
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('products');
            expect(response.body).toHaveProperty('total');
            expect(response.body).toHaveProperty('page');
            expect(response.body.products).toBeInstanceOf(Array);
        });
        it('should get product by id', async () => {
            const product = await Product.create({
                id: uuidv4(),
                ...mockProductInput,
                categoryId,
                isActive: true
            });

            const response = await request(app)
                .get(`/api/products/${product.id}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(product.id);
        });
        it('should allow admin to update product', async () => {
            const product = await Product.create({
                id: uuidv4(),
                ...mockProductInput,
                categoryId,
                isActive: true
            });

            const response = await request(app)
                .put(`/api/products/${product.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Updated Product',
                    price: 199.99
                });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Updated Product');
            expect(response.body.price).toBe(199.99);
        });
        it('should allow admin to delete product', async () => {
            const product = await Product.create({
                id: uuidv4(),
                ...mockProductInput,
                categoryId,
                isActive: true
            });

            const response = await request(app)
                .delete(`/api/products/${product.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(204);

            const deletedProduct = await Product.findByPk(product.id);
            expect(deletedProduct).toBeNull();
        });
    });
}); 