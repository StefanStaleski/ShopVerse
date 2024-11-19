import express, { Express, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import fs from 'fs';
import path from 'path';
import { connectDatabase } from "./config/database";
import { errorHandler } from './middleware/error.middleware';
import { logger, stream } from './utils/logger';

// Import routes
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';

class Server {
    private app: Express;
    private port: number | string;
    private logDir: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.logDir = 'logs';
        this.setupLogging();
        this.middlewares();
        this.routes();
        this.errorHandling();
    }

    private setupLogging(): void {
        // Create logs directory if it doesn't exist
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }

        // Log uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        // Log unhandled promise rejections
        process.on('unhandledRejection', (reason: any) => {
            logger.error('Unhandled Rejection:', reason);
            process.exit(1);
        });
    }

    private middlewares(): void {
        // Security middlewares
        this.app.use(helmet());
        this.app.use(cors());
        
        // Request parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        
        // Logging middleware
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev', { stream }));
        } else {
            this.app.use(morgan('combined', { stream }));
        }

        // Log all requests
        this.app.use((req: Request, res: Response, next) => {
            logger.info(`Incoming ${req.method} request to ${req.url}`, {
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
                userId: req.user?.id
            });
            next();
        });
    }

    private routes(): void {
        // API routes
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/orders', orderRoutes);

        // Health check route
        this.app.get("/healthcheck", (req: Request, res: Response) => {
            logger.info('Health check request received');
            res.status(200).json({
                status: "success",
                message: "Server is running!"
            });
        });

        // Handle undefined routes
        this.app.all("*", (req: Request, res: Response) => {
            logger.warn(`Attempted to access undefined route: ${req.originalUrl}`);
            res.status(404).json({
                status: "fail",
                message: `Route: ${req.originalUrl} does not exist on this server`
            });
        });
    }

    private errorHandling(): void {
        this.app.use(errorHandler);
    }

    public async start(): Promise<void> {
        try {
            await connectDatabase();
            this.app.listen(this.port, () => {
                logger.info(`🚀 Server is running on port ${this.port}`);
                logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
            });
        } catch (error) {
            logger.error("❌ Error starting server:", error);
            process.exit(1);
        }
    }
}

const server = new Server();
server.start(); 