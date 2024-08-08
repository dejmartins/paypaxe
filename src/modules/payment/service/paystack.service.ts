import { Request } from 'express';
import crypto from 'crypto';
import config from '../../../../config/default';

export const verifyPayment = (req: Request): boolean => {
    const secret = config.paystackSecretKey;
    const hash = crypto.createHmac('sha512', secret)
                       .update(JSON.stringify(req.body))
                       .digest('hex');
    return hash === req.headers['x-paystack-signature'];
};
