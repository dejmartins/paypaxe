import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { CreateGoalInput } from "../schema/financialGoal.schema";
import { createFinancialGoal, findFinancialGoalById, getFinancialGoals, getTotalCurrentProgress, updateFinancialGoal } from "../service/financialGoal.service";
import { successResponse } from "../../../shared/utils/response";

export const createFinancialGoalHandler = asyncHandler(async (req: Request<{}, {}, CreateGoalInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const goal = await createFinancialGoal({ account: accountId, ...req.body});
    return res.json(successResponse(goal, 'Financial Goal added successfully'));
});

export const getFinancialGoalHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { limit, page, status } = req.query;

    const input = {
        account: accountId,
        limit: Number(limit),
        page: Number(page),
        status: status as 'completed' | 'ongoing' | undefined
    };

    const goals = await getFinancialGoals(input);

    return res.json(successResponse(goals, 'Financial Goals retrieved successfully'));
});


export const getFinancialGoalByIdHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { goalId } = req.params;
        const goal = await findFinancialGoalById(goalId);
        return res.json(successResponse(goal, "Financial goal retrieved successfully"));
    }
);

export const getTotalCurrentProgressHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    const totalCurrentProgress = await getTotalCurrentProgress(accountId);

    return res.json(successResponse({ totalCurrentProgress }, "Total current progress retrieved successfully"));
});

// export const updateGoalHandler = asyncHandler(async (req: Request, res: Response) => {
//     // @ts-ignore
//     const { accountId, goalId } = req.params;

//     const goal = await updateFinancialGoal({ account: accountId, goal: goalId, updateFields: req.body });

//     return res.json(successResponse(goal, 'Financial Goal updated successfully'));
// })
