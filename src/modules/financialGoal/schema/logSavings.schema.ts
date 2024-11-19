import { object, string, number, TypeOf } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

export const logSavingsSchema = object({
    params: object({
        accountId: objectIdValidator,
        goalId: objectIdValidator,
    }),
    body: object({
        amount: number({
            required_error: "Amount is required",
        }).positive("Amount must be a positive number"),
        date: string({
            required_error: "Date is required",
        }).refine(
            (value) => !isNaN(Date.parse(value)),
            { message: "Invalid date format" }
        ),
    }),
});

export type LogSavingsInput =  TypeOf<typeof logSavingsSchema>;
