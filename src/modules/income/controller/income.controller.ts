import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { successResponse } from "../../../shared/utils/response";
import { addIncome, getRecentIncomes, getTotalIncome } from "../service/income.service";
import { AddIncomeInput } from "../schema/income.schema";
import { AppError } from "../../../shared/utils/customErrors";

export const addIncomeHandler = asyncHandler(async (req: Request<{}, {}, AddIncomeInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const income = await addIncome({ account: accountId, ...req.body });
    return res.json(successResponse(income, 'Income added successfully'));
});

export const getTotalIncomeHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { timePeriod, startDate, endDate } = req.query;

    if (typeof timePeriod !== 'string' || (startDate && typeof startDate !== 'string') || (endDate && typeof endDate !== 'string')) {
        throw new AppError('Invalid query parameters', 400);
    }

    const income = await getTotalIncome({ accountId: accountId, timePeriod, startDate, endDate });
    return res.json(successResponse({ totalIncome: income }, 'Total Income Calculated Successfully'));
});

export const getRecentIncomesHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { limit } = req.query;

    // @ts-ignore
    const recentIncomes = await getRecentIncomes({ accountId, limit });

    return res.json(successResponse(recentIncomes, 'Recent Incomes Retrieved Successfully'));
});