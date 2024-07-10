import { Request, Response } from 'express';
import log from '../../../shared/utils/logger';
import { createAccount } from '../service/account.service';
import { CreateAccountInput } from '../schema/account.schema';

export async function createAccountHandler(req: Request<{}, {}, CreateAccountInput['body']>, res: Response) {
    try {
        const account = await createAccount(req.body);
        return res.status(201).json(account);
    } catch (e: any) {
        log.error(e);
        return res.status(409).json({ message: e.message });
    }
}
