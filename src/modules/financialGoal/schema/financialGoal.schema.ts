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
        startDate: string({
            required_error: "Start date is required",
        }).refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
        deadline: string({
            required_error: "Deadline is required",
        }).refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
        description: optional(string()),
        priority: optional(string()).refine(
            (val) => !val || ['high', 'medium', 'low'].includes(val),
            { message: "Invalid priority" }
        ),
        isRecurring: boolean({
            required_error: "isRecurring flag is required",
        }),
        frequency: string()
            .optional()
            .refine(
                (val) =>
                    !val || ["daily", "weekly", "monthly", "yearly"].includes(val),
                {
                    message: "Frequency must be one of 'daily', 'weekly', 'monthly', 'yearly'",
                }
            ),
        preferredTime: optional(
            string({
                required_error: "Preferred time is required",
            }).refine(
                (val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
                { message: "Preferred time must be in HH:mm format (e.g., '14:30')" }
            )
        ),
        amount: optional(
            number({
                required_error: "Amount is required for recurring goals",
            }).positive("Amount must be a positive number")
        ),
    }).superRefine((data, ctx) => {
        if (data.isRecurring && !data.frequency) {
            ctx.addIssue({
                code: "custom",
                message: "Frequency is required for recurring savings",
                path: ["frequency"],
            });
        }

        if (!data.isRecurring && data.frequency) {
            ctx.addIssue({
                code: "custom",
                message: "Frequency should not be provided for non-recurring savings",
                path: ["frequency"],
            });
        }

        if (data.isRecurring && !data.amount) {
            ctx.addIssue({
                code: "custom",
                message: "Amount is required for recurring savings",
                path: ["amount"],
            });
        }
    }),
});

export const getGoalsSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    query: object({
        limit: optional(
            string().refine((value) => !isNaN(parseInt(value)), {
                message: "Limit must be a valid number",
            }).transform((value) => parseInt(value))
        ),
        page: optional(
            string().refine((value) => !isNaN(parseInt(value)), {
                message: "Page must be a valid number",
            }).transform((value) => parseInt(value))
        ),
        status: optional(
            string().refine((value) => ["completed", "ongoing"].includes(value), {
                message: "Status must be either 'completed' or 'ongoing'",
            })
        ),
        title: optional(string())
    }),
});

export const getGoalByIdSchema = object({
    params: object({
        accountId: objectIdValidator,
        goalId: objectIdValidator,
    }),
});

export const getTotalCurrentProgressSchema = object({
    params: object({
        accountId: objectIdValidator,
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

export const calculateSavingsSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        targetAmount: number({
            required_error: "Target amount is required",
        }).positive("Target amount must be positive"),
        deadline: string({
            required_error: "Deadline is required",
        }).refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
        frequency: string({
            required_error: "Frequency is required",
        }).refine(
            (val) => ["daily", "weekly", "monthly", "yearly"].includes(val),
            { message: "Frequency must be one of 'daily', 'weekly', 'monthly', 'yearly'" }
        ),
        startDate: string({
            required_error: "Start date is required",
        })
            .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
            .refine((val) => {
                const inputDate = new Date(val).setHours(0, 0, 0, 0);
                const today = new Date().setHours(0, 0, 0, 0);
                return inputDate >= today;
            }, { message: "Start date must be today or a future date" }),
    }),
});


export const deleteFinancialGoalSchema = object({
    params: object({
        accountId: objectIdValidator,
        goalId: objectIdValidator,
    }),
});

export const transferFundsSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        sourceGoalId: objectIdValidator,
        destinationGoalId: objectIdValidator,
        transferAmount: number({
            required_error: "Transfer amount is required",
        }).positive("Transfer amount must be positive"),
    }),
});

export const transferFromNetBalanceSchema = object({
    params: object({
        accountId: objectIdValidator,
        goalId: objectIdValidator,
    }),
    body: object({
        transferAmount: number({
            required_error: "Transfer amount is required",
        })
        .positive("Transfer amount must be greater than zero"),
    }),
});

export const updatePauseStatusSchema = object({
    params: object({
        accountId: objectIdValidator,
        goalId: objectIdValidator,
    }),
    body: object({
        status: string({
            required_error: 'Pause status is required',
        }).refine((val) => ['paused', 'active'].includes(val), {
            message: "Status must be either 'paused' or 'active'",
        }),
    }),
});



export type CreateGoalInput = TypeOf<typeof addFinancialGoalSchema>;
