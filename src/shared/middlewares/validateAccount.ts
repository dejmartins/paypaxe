import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/utils/customErrors';
import { findAccount } from '../../modules/account/service/account.service';

export const validateAccountTypeAndPlan = (
    allowedTypes: Array<'individual' | 'family' | 'trader' | 'business'>,
    allowedPlans?: Array<'basic' | 'premium'>
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
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
                throw new AppError(`This feature is only accessible by ${allowedTypes.join(', ')} accounts.`, 403);
            }

            if (allowedPlans && !allowedPlans.includes(subscriptionPlan)) {
                throw new AppError(
                    `This feature requires one of the following plans: ${allowedPlans.join(', ')}.`,
                    403
                );
            }

            next();
        } catch (e: any) {
            return res.status(e.statusCode || 400).json({
                status: 'fail',
                error: 'Validation error',
                message: e.message,
            });
        }
    };
};


export const validateSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accountId } = req.params;

        if (!accountId) {
            throw new AppError('Account ID is required.', 400);
        }

        const account = await findAccount(accountId);

        if (!account) {
            throw new AppError('Account not found.', 404);
        }

        const today = new Date();
        if (account.subscriptionEndDate < today) {
            throw new AppError('Subscription has expired.', 403);
        }

        next();
    } catch (e: any) {
        return res.status(e.statusCode || 400).json({
            status: 'fail',
            error: 'Validation error',
            message: e.message
        });
    }
}
