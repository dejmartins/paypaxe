import { number, object, string, TypeOf, union } from "zod";
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
        .transform(value => parseFloat(value as string)),
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

export type AddIncomeInput = TypeOf<typeof addIncomeSchema>;