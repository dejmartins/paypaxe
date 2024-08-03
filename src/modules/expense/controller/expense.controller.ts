import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { successResponse } from "../../../shared/utils/response";
import { AddExpenseInput } from "../schema/expense.schema";
import { addExpense, getRecentExpenses, getTotalExpense } from "../service/expense.service";
import { AppError } from "../../../shared/utils/customErrors";

export const addExpenseHandler = asyncHandler(async (req: Request<{}, {}, AddExpenseInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const expense = await addExpense({ account: accountId, ...req.body});
    return res.json(successResponse(expense, 'Expense added successfully'));
});

export const getTotalExpenseHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { timePeriod, startDate, endDate } = req.query;

    if (typeof timePeriod !== 'string' || (startDate && typeof startDate !== 'string') || (endDate && typeof endDate !== 'string')) {
        throw new AppError('Invalid query parameters', 400);
    }

    const expense = await getTotalExpense({ accountId: accountId, timePeriod, startDate, endDate });
    return res.json(successResponse({ totalExpense: expense }, 'Total Expense Calculated Successfully'));
});

export const getRecentExpensesHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { limit } = req.query;

    // @ts-ignore
    const recentExpenses = await getRecentExpenses({ accountId, limit });

    return res.json(successResponse(recentExpenses, 'Recent Expenses Retrieved Successfully'));
});