import { Request, Response, NextFunction } from 'express';
import { validateAccountTypeAndPlan, validateSubscription } from '../../../shared/middlewares/validateAccount';
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

        const middleware = validateAccountTypeAndPlan(['individual', 'trader'], ['premium']);

        await middleware(req as Request, res as Response, next);

        expect(findAccount).toHaveBeenCalledWith(accountId);
        expect(next).toHaveBeenCalled();
    });

    it('should throw an error if account is not found', async () => {
        (findAccount as jest.Mock).mockResolvedValue(null);

        const middleware = validateAccountTypeAndPlan(['individual', 'trader'], ['premium']);
        await middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            error: 'Validation error',
            message: 'Account not found.'
        });

        expect(findAccount).toHaveBeenCalledWith(accountId);
        expect(next).not.toHaveBeenCalled();
    });

    it('should throw an error if account type is not allowed', async () => {
        (findAccount as jest.Mock).mockResolvedValue({
            accountType: 'family',
            subscriptionPlan: 'premium',
        });

        const middleware = validateAccountTypeAndPlan(['individual', 'trader'], ['premium']);

        await middleware(req as Request, res as Response, next);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            error: 'Validation error',
            message: 'This endpoint is only accessible by individual, trader accounts.'
        });

        expect(findAccount).toHaveBeenCalledWith(accountId);
        expect(next).not.toHaveBeenCalled();
    });

    it('should throw an error if subscription plan does not match', async () => {
        (findAccount as jest.Mock).mockResolvedValue({
            accountType: 'individual',
            subscriptionPlan: 'basic',
        });

        const middleware = validateAccountTypeAndPlan(['individual', 'trader'], ['premium']);

        await middleware(req as Request, res as Response, next);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            error: 'Validation error',
            message: 'This endpoint requires a premium plan.'
        });

        expect(findAccount).toHaveBeenCalledWith(accountId);
        expect(next).not.toHaveBeenCalled();
    });
});


describe('validateSubscription Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;

    beforeEach(() => {
        req = {
            params: {
                accountId: accountId
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    it('should return 404 if account is not found', async () => {
        (findAccount as jest.Mock).mockResolvedValue(null);

        await validateSubscription(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            error: 'Validation error',
            message: 'Account not found.'
        });
    });

    it('should return 403 if the subscription has expired', async () => {
        (findAccount as jest.Mock).mockResolvedValue({
            subscriptionEndDate: new Date('2022-01-01'),
        });

        await validateSubscription(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            status: 'fail',
            error: 'Validation error',
            message: 'Subscription has expired.'
        });
    });

    it('should call next if the subscription is active', async () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);

        (findAccount as jest.Mock).mockResolvedValue({
            subscriptionEndDate: futureDate,
        });

        await validateSubscription(req as Request, res as Response, next as NextFunction);

        expect(next).toHaveBeenCalled();
    });
});
