import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { AppError } from '../utils/customErrors';

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    if (!err.isOperational) {
        return res.status(500).json(errorResponse('Something went wrong on server', 500));
    }

    return res.status(err.statusCode).json(errorResponse(err.message, err.statusCode));
};

export default errorHandler;