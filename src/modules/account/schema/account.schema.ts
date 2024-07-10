import { TypeOf, object, string } from "zod";
import mongoose from "mongoose";

const objectIdValidator = string({
    required_error: 'User ID is required'
}).refine(value => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid User ID format'
});

export const createAccountSchema = object({
    body: object({
        userId: objectIdValidator,
        accountType: string({
            required_error: 'Account type is required'
        }).refine(value => ['individual', 'family', 'trader', 'business'].includes(value), {
            message: 'Invalid account type'
        }),
        subscriptionPlan: string({
            required_error: 'Subscription plan is required'
        }).refine(value => ['basic', 'premium'].includes(value), {
            message: 'Invalid subscription plan'
        })
    })
});

export type CreateAccountInput = TypeOf<typeof createAccountSchema>;
