import { literal, number, object, optional, string, TypeOf, union, boolean } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

export const addIncomeSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        amount: union([number(), string()])
            .refine(value => {
                const parsed = parseFloat(value as string);
                return !isNaN(parsed) && parsed > 0;
            }, {
                message: 'Amount must be a valid decimal number greater than zero',
            })
            .transform(value => parseFloat(value as string)),
        category: string({
            required_error: 'Income category is required',
        }),
        dateReceived: string({
            required_error: 'Date received is required',
        }).refine(date => {
            const parsedDate = new Date(date);
            const currentDate = new Date();
            return parsedDate <= currentDate;
        }, {
            message: 'Date cannot be in the future',
        }),
        description: optional(string().max(255, {
            message: 'Description cannot exceed 255 characters',
        })),
        isRecurring: boolean({
            required_error: 'isRecurring flag is required',
        }),
        frequency: optional(string().refine(val => {
            const allowedFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
            return allowedFrequencies.includes(val);
        }, {
            message: "Frequency must be one of 'daily', 'weekly', 'monthly', 'yearly'",
        })),
        financialGoalId: optional(string().refine(id => id.trim() !== '', {
            message: 'financialGoalId must not be empty if provided',
        })),
        savingsAmount: optional(
            union([number(), string()])
                .refine(value => {
                    const parsed = parseFloat(value as string);
                    return !isNaN(parsed) && parsed > 0;
                }, {
                    message: 'Savings amount must be a valid decimal number greater than zero',
                })
                .transform(value => parseFloat(value as string))
        ),
    }).superRefine((data, ctx) => {
        if (data.isRecurring && !data.frequency) {
            ctx.addIssue({
                code: 'custom',
                message: 'Frequency is required when income is recurring',
                path: ['frequency'],
            });
        }

        if (!data.isRecurring && data.frequency) {
            ctx.addIssue({
                code: 'custom',
                message: 'Frequency should not be specified for non-recurring incomes',
                path: ['frequency'],
            });
        }

        if (data.financialGoalId && !data.savingsAmount) {
            ctx.addIssue({
                code: 'custom',
                message: 'savingsAmount is required when financialGoalId is provided',
                path: ['savingsAmount'],
            });
        }

        if (data.savingsAmount && !data.financialGoalId) {
            ctx.addIssue({
                code: 'custom',
                message: 'financialGoalId is required when savingsAmount is provided',
                path: ['savingsTargetId'],
            });
        }
    }),
});


export const getTotalIncomeSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    query: object({
        timePeriod: optional(union([
            literal("thisWeek"),
            literal("lastWeek"),
            literal("thisMonth"),
            literal("lastMonth"),
            literal("lastTwoMonths"),
            literal("custom"),
        ])),
        startDate: optional(string().refine(date => !isNaN(Date.parse(date)), {
            message: "Invalid start date format",
        })),
        endDate: optional(string().refine(date => !isNaN(Date.parse(date)), {
            message: "Invalid end date format",
        })),
        includeNetBalance: optional(string().refine(val => ["true", "false"].includes(val), {
            message: "includeNetBalance must be 'true' or 'false'",
        }).transform(val => val === "true")),
    }),
});


export const getRecentIncomesSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    query: object({
        limit: string({
            required_error: "Limit is required"
        }).refine(value => !isNaN(parseInt(value, 10)), {
            message: 'Limit must be a number',
        })
    })
});

export const softDeleteIncomeSchema = object({
    params: object({
        accountId: objectIdValidator,
        incomeId: objectIdValidator,
    })
});

export const getDeletedIncomesSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    query: object({
        limit: optional(string().refine(value => !isNaN(parseInt(value, 10)), {
            message: 'Limit must be a number',
        }))
    })
});

export const updateIncomeSchema = object({
    params: object({
        accountId: objectIdValidator,
        incomeId: objectIdValidator,
    }),
    body: object({
        amount: optional(union([number(), string()]).refine(value => !isNaN(parseFloat(value as string)), {
            message: 'Must be a valid decimal number',
        }).transform(value => parseFloat(value as string))),
        category: optional(string()),
        description: optional(string()),
        isRecurring: optional(boolean()),
        frequency: optional(string().refine((val) => {
            const allowedFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
            return allowedFrequencies.includes(val);
        }, {
            message: "Frequency must be one of 'daily', 'weekly', 'monthly', 'yearly'",
        }))
    })
});

export const exportIncomeSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    query: object({
        timePeriod: string({
            required_error: 'Time period is required',
        }),
        startDate: optional(string().refine(date => !isNaN(Date.parse(date)), {
            message: 'Invalid start date format',
        })),
        endDate: optional(string().refine(date => !isNaN(Date.parse(date)), {
            message: 'Invalid end date format',
        })),
        type: string().refine((val) => ['csv', 'pdf'].includes(val), {
            message: 'Type must be either csv or pdf',
        })
    })
});

export type AddIncomeInput = TypeOf<typeof addIncomeSchema>;