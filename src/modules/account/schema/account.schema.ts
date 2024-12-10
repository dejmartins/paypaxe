import { TypeOf, object, string, number } from "zod";
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

export const updateAllocationRuleSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        needs: number({
            required_error: "Needs allocation percentage is required.",
        })
            .min(0, "Needs allocation must be at least 0%.")
            .max(100, "Needs allocation cannot exceed 100%."),
        wants: number({
            required_error: "Wants allocation percentage is required.",
        })
            .min(0, "Wants allocation must be at least 0%.")
            .max(100, "Wants allocation cannot exceed 100%."),
        savings: number({
            required_error: "Savings allocation percentage is required.",
        })
            .min(0, "Savings allocation must be at least 0%.")
            .max(100, "Savings allocation cannot exceed 100%."),
    }).refine((data) => data.needs + data.wants + data.savings === 100, {
        message: "Allocation percentages must sum up to 100.",
    }),
});

export const customizeUtilizationThresholdSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        utilizationThreshold: number()
            .min(1, "Utilization threshold must be at least 1%")
            .max(100, "Utilization threshold cannot exceed 100%")
            .refine((val) => Number.isInteger(val), {
                message: "Utilization threshold must be a whole number",
            }),
    }),
});

export const getUtilizationThresholdSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
});

export type CreateAccountInput = TypeOf<typeof createAccountSchema>;
