import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { activateBudget, getActiveBudget } from "../service/budget.service";
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
