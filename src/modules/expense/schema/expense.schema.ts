import { literal, number, object, optional, string, TypeOf, union } from "zod";
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
            message: 'Amount must be greater than zero'
        }),
        category: string({
            required_error: 'Expense category is required'
        }),
        date: string({
            required_error: 'Date is required'
        }).refine(date => {
            const parsedDate = new Date(date);
            const currentDate = new Date();
            return parsedDate <= currentDate;
        }, {
            message: 'Date cannot be in the future'
        }) ,
        description: string({
            required_error: 'Expense description is required'
        })
    })
})

export const getTotalExpenseSchema = object({
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

export type AddExpenseInput = TypeOf<typeof addExpenseSchema>;