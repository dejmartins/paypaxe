import { object, string, number } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

export const activateBudgetSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        budgetAmount: number({
            required_error: "Budget amount is required",
        })
        .positive("Budget amount must be a positive number"),
    }),
});
