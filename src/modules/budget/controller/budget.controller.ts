import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { activateBudget } from "../service/budget.service";
import { successResponse } from "../../../shared/utils/response";

export const activateBudgetHandler = asyncHandler(async (req: Request, res: Response) => {
        const { accountId } = req.params;
        const { budgetAmount } = req.body;

        const budget = await activateBudget({ accountId, budgetAmount });

        return res.status(201).json(successResponse(budget, "Budget activated successfully"));
    }
);
