import express, { Express, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { connectDatabase } from "./config/database";
import { errorHandler } from './middleware/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';

class Server {
    private app: Express;
    private port: number | string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.middlewares();
        this.routes();
        this.errorHandling();
    }

    private middlewares(): void {
        // Security middlewares
        this.app.use(helmet());
        this.app.use(cors());
        
        // Request parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        
        // Logging in development
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
        }
    }

    private routes(): void {
        // API routes
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/orders', orderRoutes);

        // Health check route
        this.app.get("/healthcheck", (req: Request, res: Response) => {
            res.status(200).json({
                status: "success",
                message: "Server is running!"
            });
        });

        // Handle undefined routes
        this.app.all("*", (req: Request, res: Response) => {
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
                console.log(`🚀 Server is running on port ${this.port}`);
                console.log(`📝 Environment: ${process.env.NODE_ENV}`);
            });
        } catch (error) {
            console.error("❌ Error starting server:", error);
            process.exit(1);
        }
    }
}

const server = new Server();
server.start(); 