import { object, string, number, date } from "zod";

export const addCardSchema = object({
    params: object({
        accountId: string({
            required_error: "Account ID is required",
        }),
    }),
    body: object({
        creditInstitution: string({
            required_error: "Credit institution is required",
        }),
        creditLimit: number({
            required_error: "Credit limit is required",
        }).positive("Credit limit must be positive"),
        utilizationAmount: number({
            required_error: "Utilization amount is required",
        }).min(0, "Utilization amount cannot be negative"),
        paymentDueDate: string({
            required_error: "Payment due date is required",
        }).refine(
            (val) => !isNaN(Date.parse(val)),
            "Payment due date must be a valid date (YYYY-MM-DD)"
        ),
        cardNumber: string().optional(),
    }),
});
