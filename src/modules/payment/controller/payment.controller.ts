import { Request, Response } from 'express';
import asyncHandler from '../../../shared/utils/asyncHandler';
import { InitiatePaymentInput } from '../schema/payment.schema';
import { handleWebhookEvent, initiatePayment } from '../service/payment.service';
import { successResponse } from '../../../shared/utils/response';
import { verifyPayment } from '../service/paystack.service';

export const initiatePaymentHandler = asyncHandler(async (req: Request<{}, {}, InitiatePaymentInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;

    const authorizationUrl = await initiatePayment({ account: accountId, ...req.body });

    return res.json(successResponse(authorizationUrl, 'Payment initiated successfully'));
});

export const paystackWebhookHandler = asyncHandler(async (req: Request, res: Response) => {
    const event = req.body;

    const isValid = verifyPayment(event);

    if (!isValid) {
        return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    await handleWebhookEvent(event);

    return res.status(200).json({ message: 'Webhook processed successfully' });
});
