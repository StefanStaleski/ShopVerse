import "dotenv/config";

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET || 'your-default-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    database: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT)
    }
}; 