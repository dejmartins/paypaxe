import { Request, Response, NextFunction } from 'express';
import { validateAccountTypeAndPlan } from '../../../shared/middlewares/validateAccount';
import { findAccount } from '../../../modules/account/service/account.service';
import { accountId } from '../../utils/fixtures';

jest.mock('../../../modules/account/service/account.service');

describe('validateAccountTypeAndPlan Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { params: { accountId: accountId } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should call next if account type and plan are valid', async () => {
        (findAccount as jest.Mock).mockResolvedValue({
            accountType: 'individual',
            subscriptionPlan: 'premium',
        });

        const middleware = validateAccountTypeAndPlan(['individual', 'trader'], 'premium');

        await middleware(req as Request, res as Response, next);

        expect(findAccount).toHaveBeenCalledWith(accountId);
        expect(next).toHaveBeenCalled();
    });

    it('should throw an error if account is not found', async () => {
        (findAccount as jest.Mock).mockResolvedValue(null);

        const middleware = validateAccountTypeAndPlan(['individual', 'trader'], 'premium');

        await expect(middleware(req as Request, res as Response, next)).rejects.toThrow('Account not found.');

        expect(findAccount).toHaveBeenCalledWith(accountId);
        expect(next).not.toHaveBeenCalled();
    });

    it('should throw an error if account type is not allowed', async () => {
        (findAccount as jest.Mock).mockResolvedValue({
            accountType: 'family',
            subscriptionPlan: 'premium',
        });

        const middleware = validateAccountTypeAndPlan(['individual', 'trader'], 'premium');

        await expect(middleware(req as Request, res as Response, next)).rejects.toThrow(
            'This endpoint is only accessible by individual, trader accounts.'
        );

        expect(findAccount).toHaveBeenCalledWith(accountId);
        expect(next).not.toHaveBeenCalled();
    });

    it('should throw an error if subscription plan does not match', async () => {
        (findAccount as jest.Mock).mockResolvedValue({
            accountType: 'individual',
            subscriptionPlan: 'basic',
        });

        const middleware = validateAccountTypeAndPlan(['individual', 'trader'], 'premium');

        await expect(middleware(req as Request, res as Response, next)).rejects.toThrow(
            'This endpoint requires a premium plan.'
        );

        expect(findAccount).toHaveBeenCalledWith(accountId);
        expect(next).not.toHaveBeenCalled();
    });
});
