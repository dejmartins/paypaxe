import { boolean, literal, number, object, optional, string, TypeOf, union } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

export const addExpenseSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        amount: union([number(), string()])
            .refine(value => !isNaN(parseFloat(value as string)), {
                message: 'Must be a valid decimal number',
            })
            .transform(value => parseFloat(value as string))
            .refine(value => value > 0, {
                message: 'Amount must be greater than zero',
            }),
        category: string({
            required_error: 'Expense category is required',
        }),
        date: string({
            required_error: 'Date is required',
        }).refine(date => {
            const parsedDate = new Date(date);
            const currentDate = new Date();
            return parsedDate <= currentDate;
        }, {
            message: 'Date cannot be in the future',
        }),
        description: string({
            required_error: 'Expense description is required',
        }),
        isRecurring: boolean({
            required_error: 'isRecurring flag is required',
        }),
        frequency: optional(string().refine((val) => {
            const allowedFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
            return allowedFrequencies.includes(val);
        }, {
            message: "Frequency must be one of 'daily', 'weekly', 'monthly', 'yearly'",
        })),
        expenseSource: string({
            required_error: 'Expense source is required',
        }).refine(source => ['creditCard', 'netBalance'].includes(source), {
            message: "Expense source must be one of 'creditCard', 'netBalance'",
        }),
        cardId: optional(objectIdValidator)
    }).superRefine((data, ctx) => {
        if (data.isRecurring && !data.frequency) {
            ctx.addIssue({
                code: 'custom',
                message: 'Frequency is required for recurring expenses',
                path: ['frequency'],
            });
        }

        if (data.expenseSource === 'creditCard' && !data.cardId) {
            ctx.addIssue({
                code: 'custom',
                message: 'Card ID is required when the expense source is creditCard',
                path: ['cardId'],
            });
        }

        if (data.expenseSource === 'netBalance' && data.cardId) {
            ctx.addIssue({
                code: 'custom',
                message: 'Card ID should not be provided when the expense source is netBalance',
                path: ['cardId'],
            });
        }
    }),
});


export const getTotalExpenseSchema = object({
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
    })
});

export const getRecentExpensesSchema = object({
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

export const softDeleteExpenseSchema = object({
    params: object({
        accountId: objectIdValidator,
        expenseId: objectIdValidator,
    })
});

export const getDeletedExpensesSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    query: object({
        limit: optional(string().refine(value => !isNaN(parseInt(value, 10)), {
            message: 'Limit must be a number',
        }))
    })
});

export const updateExpenseSchema = object({
    params: object({
        accountId: objectIdValidator,
        expenseId: objectIdValidator,
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

export const exportExpenseSchema = object({
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



export type AddExpenseInput = TypeOf<typeof addExpenseSchema>;