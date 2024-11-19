import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { CategoryAttributes } from "../types";

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
    public id!: string;
    public name!: string;
    public description!: string | null;
    public imageUrl!: string | null;
    public isActive!: boolean;
    public parentId!: string | null;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Category.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: "Category",
        tableName: "categories",
        timestamps: true,
        underscored: true,
    }
);

export default Category; 