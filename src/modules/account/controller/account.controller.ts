import { Request, Response } from 'express';
import { createAccount } from '../service/account.service';
import { CreateAccountInput } from '../schema/account.schema';
import asyncHandler from '../../../shared/utils/asyncHandler';
import { successResponse } from '../../../shared/utils/response';

export const createAccountHandler = asyncHandler(async (req: Request<{}, {}, CreateAccountInput['body']>, res: Response) => {
    const account = await createAccount(req.body);
    return res.json(successResponse(account, 'Account successfully created'));
})
