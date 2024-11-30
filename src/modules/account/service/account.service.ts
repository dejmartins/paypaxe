import { AppError } from '../../../shared/utils/customErrors';
import log from '../../../shared/utils/logger';
import UserModel from '../../user/model/user.model';
import AccountModel, { IAccount } from '../model/account.model';
import { AccountInput, GetNetBalanceInput } from '../types/accountTypes';

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

export async function findAccount(accountId: string): Promise<IAccount | null> {
    try {
        const account = await AccountModel.findById(accountId);
        return account;
    } catch (e: any){
        throw new AppError(e.message, e.statusCode);
    }
}

export async function findAllUserAccounts(userId: string) {
    try {
        const accounts = await AccountModel.find({ user: userId });
        if (!accounts || accounts.length === 0) {
            log.info('No accounts found for user:', userId);
            return null;
        }
        return accounts;
    } catch (e: any){
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getNetBalance(input: GetNetBalanceInput): Promise<number> {
    try {
        const account = await AccountModel.findById(input.accountId).lean();

        if (!account) {
            throw new AppError('Account not found', 404);
        }

        return account.netBalance;
    } catch (error: any) {
        throw new AppError(error.message, error.statusCode || 500);
    }
}

export async function validateAccount(accountId: string) {
    const accountExist = await accountExists(accountId);
    
    if(!accountExist){
        throw new AppError('Account not found', 404);
    }
}

async function accountExists(accountId: string): Promise<boolean> {
    try {
        const account = await AccountModel.findById(accountId);
        return !!account;
    } catch (e: any){
        throw new AppError(e.message, e.statusCode);
    }
}
