import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const connectDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");
        
        // Sync database (in development)
        if (process.env.NODE_ENV === "development") {
            await sequelize.sync({ alter: true });
            console.log("✅ Database synchronized");
        }
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        process.exit(1);
    }
};

export default sequelize;
