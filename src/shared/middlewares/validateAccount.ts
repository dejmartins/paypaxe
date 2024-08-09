import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/utils/customErrors';
import { findAccount } from '../../modules/account/service/account.service';

export const validateAccountTypeAndPlan = (
    allowedTypes: Array<'individual' | 'family' | 'trader' | 'business'>,
    requiredPlan?: 'basic' | 'premium'
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { accountId } = req.params;

        if (!accountId) {
            throw new AppError('Account ID is required.', 400);
        }

        const account = await findAccount(accountId);

        if (!account) {
            throw new AppError('Account not found.', 404);
        }

        const accountType = account.accountType;
        const subscriptionPlan = account.subscriptionPlan;

        if (!allowedTypes.includes(accountType)) {
            throw new AppError(`This endpoint is only accessible by ${allowedTypes.join(', ')} accounts.`, 403);
        }

        if (requiredPlan && subscriptionPlan !== requiredPlan) {
            throw new AppError(`This endpoint requires a ${requiredPlan} plan.`, 403);
        }

        next();
    };
};
