import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { fetchActivityLogs } from "../service/activityLog.service";
import { successResponse } from "../../../shared/utils/response";

export const getActivityLogsHandler = asyncHandler(async (req: Request, res: Response) => {
    const { entityId } = req.params;
    const { accountId, entityType, limit, page } = req.query;

    const input = {
        accountId: accountId as string,
        entityId,
        entityType: entityType as "financialGoal" | "account" | "expense" | "income" | "other",
        limit: Number(limit),
        page: Number(page),
    };

    const logs = await fetchActivityLogs(input);

    return res.json(successResponse(logs, "Activity logs retrieved successfully"));
});
