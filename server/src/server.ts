import "dotenv/config";
import fs from 'fs';
import { connectDatabase } from "./config/database";
import { logger, stream } from './utils/logger';
import app from './app';
import { Request, Response } from "express";
import morgan from "morgan";

class Server {
    private port: number | string;
    private logDir: string;

    constructor() {
        this.port = process.env.PORT || 5000;
        this.logDir = 'logs';
        this.setupLogging();
        this.setupRequestLogging();
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

    private setupRequestLogging(): void {
        // Log all requests
        app.use((req: Request, res: Response, next) => {
            logger.info(`Incoming ${req.method} request to ${req.url}`, {
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
                userId: req.user?.id
            });
            next();
        });

        // Add combined logging for production
        if (process.env.NODE_ENV !== 'development') {
            app.use(morgan('combined', { stream }));
        }
    }

    public async start(): Promise<void> {
        try {
            await connectDatabase();
            app.listen(this.port, () => {
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