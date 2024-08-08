import { Request } from 'express';
import crypto from 'crypto';
import config from '../../../../config/default';
import { AppError } from '../../../shared/utils/customErrors';

export const verifyPayment = (req: Request): boolean => {
    try {
        const secret = config.paystackSecretKey;
        const hash = crypto.createHmac('sha512', secret)
                           .update(JSON.stringify(req.body))
                           .digest('hex');
        return hash === req.headers['x-paystack-signature'];
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
};
