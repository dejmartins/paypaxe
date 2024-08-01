import { literal, number, object, optional, string, TypeOf, union } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

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
        }) 
    })
})

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

export type AddIncomeInput = TypeOf<typeof addIncomeSchema>;