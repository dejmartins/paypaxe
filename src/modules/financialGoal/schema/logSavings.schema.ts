import { object, string, number, boolean, TypeOf } from "zod";
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
    }),
});

export type LogSavingsInput = TypeOf<typeof logSavingsSchema>;
