import { Request, Response } from 'express';
import { createAccount, customizeUtilizationThreshold, getCurrentAllocationRules, getNetBalance, getUtilizationThreshold, updateAllocationRule } from '../service/account.service';
import { CreateAccountInput } from '../schema/account.schema';
import asyncHandler from '../../../shared/utils/asyncHandler';
import { successResponse } from '../../../shared/utils/response';

export const createAccountHandler = asyncHandler(async (req: Request<{}, {}, CreateAccountInput['body']>, res: Response) => {
    const account = await createAccount(req.body);
    return res.json(successResponse(account, 'Account successfully created'));
})

export const getNetBalanceHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    const netBalance = await getNetBalance({ accountId });

    return res.json(successResponse({ netBalance }, 'Net balance retrieved successfully'));
});

export const updateAllocationRuleHandler = asyncHandler(async (req: Request, res: Response) => {
        const { accountId } = req.params;
        const updatedAccount = await updateAllocationRule({ accountId, allocationRule: req.body });
        return res.json(successResponse(updatedAccount, "Allocation rule updated successfully."));
    }
);

export const customizeUtilizationThresholdHandler = asyncHandler(async (req: Request, res: Response) => {
        const { accountId } = req.params;
        const { utilizationThreshold } = req.body;

        const updatedAccount = await customizeUtilizationThreshold({ accountId, utilizationThreshold });

        return res.json(successResponse(updatedAccount, "Utilization threshold updated successfully"));
    }
);

export const getUtilizationThresholdHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    const threshold = await getUtilizationThreshold({accountId});

    return res.json(successResponse({ utilizationThreshold: threshold }, "Utilization threshold retrieved successfully"));
});

export const getAllocationRulesHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    const allocationRules = await getCurrentAllocationRules(accountId);

    const allocationInPercentage = {
        needs: allocationRules.needs * 100,
        wants: allocationRules.wants * 100,
        savings: allocationRules.savings * 100
    };

    return res.json(successResponse(allocationInPercentage, "Allocation rules retrieved successfully"));
});
