import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { errorHandler } from './middleware/error.middleware';
import { stream } from './utils/logger';

// Import routes
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import profileRoutes from './routes/profile.routes';

const app: Express = express();

// Security middlewares
app.use(helmet());
app.use(cors());

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', { stream }));
} else {
    app.use(morgan('combined', { stream }));
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);

// Health check route
app.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({
        status: "success",
        message: "Server is running!"
    });
});

// Handle undefined routes
app.all("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: "fail",
        message: `Route: ${req.originalUrl} does not exist on this server`
    });
});

// Error handling
app.use(errorHandler);

export default app; 