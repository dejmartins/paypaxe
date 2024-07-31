import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { successResponse } from "../../../shared/utils/response";
import { addIncome } from "../service/income.service";
import { AddIncomeInput } from "../schema/income.schema";

export const addIncomeHandler = asyncHandler(async (req: Request<{}, {}, AddIncomeInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const income = await addIncome({ accountId: accountId, ...req.body });
    return res.json(successResponse(income, 'Income added successfully'));
});