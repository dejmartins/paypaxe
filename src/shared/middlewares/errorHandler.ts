import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { AppError } from '../utils/customErrors';
import log from '../utils/logger';

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    log.error(`Error: ${err.message}`, { stack: err.stack });

    if (!(err instanceof AppError)) {
        err = new AppError('Something went wrong on server', 500, false);
    }

    return res.status(err.statusCode).json(errorResponse(err.message, err.statusCode));
};

export default errorHandler;