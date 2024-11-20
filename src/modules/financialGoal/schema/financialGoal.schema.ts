import { number, object, optional, string, TypeOf, union, boolean } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

export const addFinancialGoalSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        title: string({
            required_error: "Title is required",
        }),
        type: optional(string({
            required_error: "Type is required",
        }).refine(
            (val) => !val || ['savings', 'investment', 'retirement', 'debtRepayment', 'other'].includes(val),
            { message: "Invalid type" }
        )),
        category: optional(string()),
        targetAmount: number({
            required_error: "Target amount is required",
        }).positive("Target amount must be positive"),
        currentProgress: number({
            required_error: "Current progress is required",
        }).min(0, "Current progress cannot be negative"),
        deadline: string({
            required_error: "Deadline is required",
        }).refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
        description: optional(string()),
        priority: optional(string()).refine(
            (val) => !val || ['high', 'medium', 'low'].includes(val),
            { message: "Invalid priority" }
        )
    })
});

export const getGoalsSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    query: object({
        limit: string().refine(value => !isNaN(parseInt(value)), {
            message: 'Limit must be a valid number',
        }).transform(value => parseInt(value)),
        page: string().refine(value => !isNaN(parseInt(value)), {
            message: 'Page must be a valid number',
        }).transform(value => parseInt(value)),
    })
});

export const getGoalByIdSchema = object({
    params: object({
        accountId: objectIdValidator,
        goalId: objectIdValidator,
    }),
});

export const updateFinancialGoalSchema = object({
    params: object({
        accountId: objectIdValidator,
        goalId: objectIdValidator,
    }),
    body: object({
        title: string().optional(),
        description: string().optional(),
        targetAmount: union([number(), string()])
            .refine(value => !isNaN(parseFloat(value as string)), {
                message: 'Must be a valid decimal number',
            })
            .transform(value => parseFloat(value as string))
            .refine(value => value > 0, {
                message: 'Target amount must be greater than zero'
            }).optional(),
        currentProgress: union([number(), string()])
            .refine(value => !isNaN(parseFloat(value as string)), {
                message: 'Must be a valid decimal number',
            })
            .transform(value => parseFloat(value as string))
            .refine(value => value >= 0, {
                message: 'Current progress must be greater than or equal to zero'
            }).optional(),
        deadline: optional(string().refine(date => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getDate());
        }, {
            message: 'Invalid date format'
        })),
        type: string().optional(),
    })
});


export type CreateGoalInput = TypeOf<typeof addFinancialGoalSchema>;
