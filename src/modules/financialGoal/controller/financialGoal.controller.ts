import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AddGoalInput } from "../schema/financialGoal.schema";
import { addGoal } from "../service/financialGoal.service";
import { successResponse } from "../../../shared/utils/response";

export const addGoalHandler = asyncHandler(async (req: Request<{}, {}, AddGoalInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const expense = await addGoal({ account: accountId, ...req.body});
    return res.json(successResponse(expense, 'Expense added successfully'));
});