import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { activateBudget, customizeBudgetAmount, getActiveBudget } from "../service/budget.service";
import { successResponse } from "../../../shared/utils/response";

export const activateBudgetHandler = asyncHandler(async (req: Request, res: Response) => {
        const { accountId } = req.params;
        const { budgetAmount } = req.body;

        const budget = await activateBudget({ accountId, budgetAmount });

        return res.status(201).json(successResponse(budget, "Budget activated successfully"));
    }
);

export const getActiveBudgetHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    const activeBudget = await getActiveBudget({ accountId });

    return res.json(successResponse(activeBudget, "Active budget retrieved successfully."));
});

export const customizeBudgetAmountHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { newBudgetAmount } = req.body;

    const updatedBudget = await customizeBudgetAmount({ accountId, newBudgetAmount });

    return res.json(successResponse(updatedBudget, "Budget amount updated successfully"));
});
