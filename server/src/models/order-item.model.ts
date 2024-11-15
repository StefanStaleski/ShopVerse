import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { OrderItemAttributes } from "../types";

class OrderItem extends Model<OrderItemAttributes> implements OrderItemAttributes {
    public id!: string;
    public orderId!: string;
    public productId!: string;
    public quantity!: number;
    public price!: number;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OrderItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "OrderItem",
        tableName: "order_items",
        timestamps: true,
        underscored: true,
    }
);

export default OrderItem; 