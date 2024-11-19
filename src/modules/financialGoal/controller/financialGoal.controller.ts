import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { CreateGoalInput } from "../schema/financialGoal.schema";
import { createFinancialGoal, findFinancialGoalById, getFinancialGoals, updateFinancialGoal } from "../service/financialGoal.service";
import { successResponse } from "../../../shared/utils/response";
import log from "../../../shared/utils/logger";
import { GetFinancialGoals, GetGoalByIdParams } from "../types/financialGoalTypes";

export const createFinancialGoalHandler = asyncHandler(async (req: Request<{}, {}, CreateGoalInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const goal = await createFinancialGoal({ account: accountId, ...req.body});
    return res.json(successResponse(goal, 'Financial Goal added successfully'));
});

export const getFinancialGoalHandler = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const { limit, page } = req.query;

    // @ts-ignore
    const goals = await getFinancialGoals({ account: accountId, limit, page });

    return res.json(successResponse(goals, 'Financial Goals retrieved successfully'));
});

export const getFinancialGoalByIdHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { goalId } = req.params;
        const goal = await findFinancialGoalById(goalId);
        return res.json(successResponse(goal, "Financial goal retrieved successfully"));
    }
);

// export const updateGoalHandler = asyncHandler(async (req: Request, res: Response) => {
//     // @ts-ignore
//     const { accountId, goalId } = req.params;

//     const goal = await updateFinancialGoal({ account: accountId, goal: goalId, updateFields: req.body });

//     return res.json(successResponse(goal, 'Financial Goal updated successfully'));
// })
