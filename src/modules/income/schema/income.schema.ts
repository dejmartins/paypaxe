import { literal, number, object, optional, string, TypeOf, union, boolean } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";
import { incomeId } from "../../../__tests__/utils/fixtures";

export const addIncomeSchema = object({
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
            message: 'Amount must be greater than zero'
        }),
        category: string({
            required_error: 'Income category is required'
        }),
        dateReceived: string({
            required_error: 'Date received is required'
        }).refine(date => {
            const parsedDate = new Date(date);
            const currentDate = new Date();
            return parsedDate <= currentDate;
        }, {
            message: 'Date cannot be in the future'
        }),
        description: optional(string({
            required_error: 'Income description is required'
        })),
        isRecurring: boolean({
            required_error: 'isRecurring flag is required'
        }),
        frequency: optional(string().refine((val) => {
            const allowedFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
            return allowedFrequencies.includes(val);
        }, {
            message: "Frequency must be one of 'daily', 'weekly', 'monthly', 'yearly'"
        }))
    }).superRefine((data, ctx) => {
        if (data.isRecurring && !data.frequency) {
            ctx.addIssue({
                code: 'custom',
                message: 'Frequency is required for recurring incomes',
                path: ['frequency'],
            });
        }
    }),
});

export const getTotalIncomeSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    query: object({
        timePeriod: union([
            literal("thisWeek"),
            literal("lastWeek"),
            literal("thisMonth"),
            literal("lastMonth"),
            literal("lastTwoMonths"),
            literal("custom"),
        ]),
        startDate: optional(string().refine(date => !isNaN(Date.parse(date)), {
            message: "Invalid start date format",
        })),
        endDate: optional(string().refine(date => !isNaN(Date.parse(date)), {
            message: "Invalid end date format",
        })),
    })
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