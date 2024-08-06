import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { AddGoalInput } from "../schema/financialGoal.schema";
import { addGoal, getFinancialGoals, updateFinancialGoal } from "../service/financialGoal.service";
import { successResponse } from "../../../shared/utils/response";

export const addGoalHandler = asyncHandler(async (req: Request<{}, {}, AddGoalInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const goal = await addGoal({ account: accountId, ...req.body});
    return res.json(successResponse(goal, 'Financial Goal added successfully'));
});

export const getGoalsHandler = asyncHandler(async (req: Request<{}, {}, AddGoalInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const { limit, page } = req.query;

    // @ts-ignore
    const goals = await getFinancialGoals({ account: accountId, limit, page });

    return res.json(successResponse(goals, 'Financial Goals retrieved successfully'));
});

export const updateGoalHandler = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const { accountId, goalId } = req.params;

    const goal = await updateFinancialGoal({ account: accountId, goal: goalId, ...req.body });

    return res.json(successResponse(goal, 'Financial Goal updated successfully'));
})

// * PUT /accounts/{account_id}/assets/{asset_id}
