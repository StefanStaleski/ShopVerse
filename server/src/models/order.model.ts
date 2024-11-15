import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { OrderAttributes } from "../types";

class Order extends Model<OrderAttributes> implements OrderAttributes {
    public id!: string;
    public userId!: string;
    public status!: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    public total!: number;
    public shippingAddress!: string;
    public paymentStatus!: "pending" | "paid" | "failed";
    public paymentMethod!: string;
    public notes!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Order.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM("pending", "processing", "shipped", "delivered", "cancelled"),
            defaultValue: "pending",
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        shippingAddress: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.ENUM("pending", "paid", "failed"),
            defaultValue: "pending",
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: true,
        underscored: true,
    }
);

export default Order; 