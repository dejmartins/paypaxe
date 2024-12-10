import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { checkOptInStatus, optInCreditBuilder, optOutCreditBuilder } from "../service/creditBuilder.service";
import { successResponse } from "../../../shared/utils/response";

export const optInCreditBuilderHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    await optInCreditBuilder({ accountId });

    return res.status(200).json(successResponse({}, "Successfully opted in for credit builder."));
});

export const optOutCreditBuilderHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    await optOutCreditBuilder({ accountId });

    return res.status(200).json(successResponse({}, "Successfully opted out of credit builder."));
});

export const checkOptInStatusHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    const isOptedIn = await checkOptInStatus({ accountId });

    return res.json(successResponse({ isOptedIn }, "Opt-in status retrieved successfully."));
});
