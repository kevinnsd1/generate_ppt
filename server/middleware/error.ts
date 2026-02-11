import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';

interface CustomError extends Error {
    status?: number;
    code?: number;
    errors?: any;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    let error: any = { ...err };

    error.message = err.message;
    console.log(error);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    let message = 'ERROR';
    let status = 'ERROR';
    const map = [{ error: error.message }];
    let statusCode = '500 OK';

    if (statusCode == '400') {
        statusCode = '400 OK';
        status = 'BAD_REQUEST';
    } else if (statusCode == '404') {
        statusCode = '404 OK';
        status = 'NOT_FOUND';
    } else if (statusCode == '401') {
        statusCode = '401 OK';
        status = 'UNAUTHORIZED';
    } else if (statusCode == '500') {
        statusCode = '500 OK';
        status = 'INTERNAL_SERVER_ERROR';
    }

    res.status(error.status || 500).json({
        status: status,
        message: message,
        errors: map,
        statusCode: statusCode,
    });
};

export default errorHandler;
