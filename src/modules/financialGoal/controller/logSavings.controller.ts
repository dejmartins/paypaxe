import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { LogSavingsInput } from "../schema/logSavings.schema";
import { logSavings } from "../service/savingsLog.service";
import { successResponse } from "../../../shared/utils/response";

export const logSavingsHandler = asyncHandler(
    async (req: Request<{}, {}, LogSavingsInput['body']>, res: Response) => {
         // @ts-ignore
        const { accountId, goalId } = req.params;

        const log = await logSavings({
            accountId,
            goalId,
            ...req.body,
        });
        return res.json(successResponse(log, 'Savings logged successfully'));
    }
);
