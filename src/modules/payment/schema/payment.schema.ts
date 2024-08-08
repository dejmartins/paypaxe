import { object, string, number, TypeOf } from 'zod';
import { objectIdValidator } from '../../../shared/utils/validator';

export const initiatePaymentSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        user: string({
            required_error: 'User Email is required'
        }).email("Not a valid email address"),
        plan: string({
            required_error: 'Plan is required',
        }).refine(value => ['basic', 'premium'].includes(value), {
            message: 'Invalid plan selected',
        }),
        numberOfMonths: number({
            required_error: 'Number of months is required',
        }).min(1, 'Number of months must be at least 1'),
    })
});

export type InitiatePaymentInput = TypeOf<typeof initiatePaymentSchema>;
