import { Sequelize } from 'sequelize';
import User from './user.model';
import Product from './product.model';
import Category from './category.model';
import Order from './order.model';
import OrderItem from './order-item.model';

export const initModels = (dbInstance: Sequelize) => {
    // Set up associations
    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User, { foreignKey: 'userId' });

    Category.hasMany(Product, { foreignKey: 'categoryId' });
    Product.belongsTo(Category, { foreignKey: 'categoryId' });

    Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
    Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

    Order.hasMany(OrderItem, { foreignKey: 'orderId' });
    OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

    Product.hasMany(OrderItem, { foreignKey: 'productId' });
    OrderItem.belongsTo(Product, { foreignKey: 'productId' });

    return {
        User,
        Product,
        Category,
        Order,
        OrderItem
    };
};

// Export models
export {
    User,
    Product,
    Category,
    Order,
    OrderItem
}; 