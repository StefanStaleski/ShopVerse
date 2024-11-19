export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public status: string = 'error'
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(404, message, 'fail');
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
        super(401, message, 'fail');
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden access') {
        super(403, message, 'fail');
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message, 'fail');
    }
} 