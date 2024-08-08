import { AppError } from '../../../shared/utils/customErrors';
import log from '../../../shared/utils/logger';
import UserModel from '../../user/model/user.model';
import AccountModel, { IAccount } from '../model/account.model';
import { AccountInput } from '../types/accountTypes';

export async function createAccount(input: AccountInput): Promise<IAccount> {
    try {
        const user = await UserModel.findById(input.userId);

        if (!user) {
            throw new AppError('User not found', 400);
        }

        const existingAccount = await AccountModel.findOne({ user: input.userId, accountType: input.accountType });

        if (existingAccount) {
            throw new AppError(`User already has the ${input.accountType} account`, 400);
        }

        const account = await AccountModel.create({ user: input.userId, ...input });

        log.info(`${input.accountType} account created for user with ID: ${input.userId}`);

        return account;
    } catch (e: any){
        throw new AppError(e.message, e.statusCode);
    }
}

export async function accountExists(accountId: string): Promise<boolean> {
    try {
        const account = await AccountModel.findById(accountId);
        return !!account;
    } catch (e: any){
        throw new AppError(e.message, e.statusCode);
    }
}

export async function findAccount(accountId: string): Promise<IAccount> {
    try {
        const account = await AccountModel.findById(accountId).lean();
        return account as IAccount;
    } catch (e: any){
        throw new AppError(e.message, e.statusCode);
    }
}
