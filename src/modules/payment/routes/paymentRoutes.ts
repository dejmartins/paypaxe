import { Router } from 'express';
import { initiatePaymentHandler, paystackWebhookHandler } from '../controller/payment.controller';
import validate from '../../../shared/middlewares/validateResource';
import { initiatePaymentSchema } from '../schema/payment.schema';

const router = Router();

router.post('/accounts/:accountId/pay', validate(initiatePaymentSchema), initiatePaymentHandler);
router.post('/webhook/paystack', paystackWebhookHandler);

export default router;
