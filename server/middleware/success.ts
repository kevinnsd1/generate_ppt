import { Request, Response, NextFunction } from 'express';
// import SuccessResponse from '../utils/successResponse';

interface CustomError extends Error {
    status?: number;
    code?: number;
    errors?: any;
}

const successHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    let error: any = { ...err };

    error.message = err.message;

    // Note: SuccessResponse class has methods, not a constructor
    // The original code usage appears incorrect

    let message = 'ERROR';
    let status = '';
    const map = [{ error: error.message }];
    let statusCode: any = error.status;

    if (statusCode == 400) {
        statusCode = '400 OK';
        status = 'BAD_REQUEST';
    } else if (statusCode == 404) {
        statusCode = '404 OK';
        status = 'NOT_FOUND';
    } else if (statusCode == 401) {
        statusCode = '401 OK';
        status = 'UNAUTHORIZED';
    }

    res.status(error.status || 500).json({
        status: status,
        message: message,
        errors: map,
        statusCode: statusCode,
    });
};

export default successHandler;
