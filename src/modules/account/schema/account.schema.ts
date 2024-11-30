import { TypeOf, object, string } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

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

export const getNetBalanceSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
});

export type CreateAccountInput = TypeOf<typeof createAccountSchema>;
