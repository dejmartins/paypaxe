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

export const getActiveBudgetSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
});

export const customizeBudgetSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        newBudgetAmount: number()
            .min(1, "Budget amount must be greater than zero")
            .max(100000000, "Budget amount is too high")
    })
});