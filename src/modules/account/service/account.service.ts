import { AppError } from '../../../shared/utils/customErrors';
import log from '../../../shared/utils/logger';
import UserModel from '../../user/model/user.model';
import AccountModel, { IAccount } from '../model/account.model';
import { AccountInput, CustomizeUtilizationThresholdInput, GetNetBalanceInput, GetUtilizationThresholdInput, UpdateAllocationRuleInput } from '../types/accountTypes';

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
        const account = await AccountModel.findById(input.accountId);

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

export async function updateNetBalance(accountId: string, amount: number): Promise<void> {
    try {
        const updatedAccount = await AccountModel.findByIdAndUpdate(
            accountId,
            { $inc: { netBalance: amount } },
            { new: true }
        );

        if (!updatedAccount) {
            throw new AppError("Account not found", 404);
        }
    } catch (error: any) {
        throw new AppError(error.message, error.statusCode || 500);
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

export async function getCurrentAllocationRules(accountId: string): Promise<{ needs: number; wants: number; savings: number }> {
    validateAccount(accountId);

    const account = await findAccount(accountId) as IAccount;


    return { 
        needs: account.allocationRule.needs / 100, 
        wants: account.allocationRule.wants / 100,
        savings: account.allocationRule.savings / 100 
    };
}

export async function updateBudgetStatus(accountId: string, status: boolean): Promise<void> {
    try {
        validateAccount(accountId);

        await AccountModel.findByIdAndUpdate(
            accountId,
            { budgetStatus: status }
        );

    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function getBudgetStatus(accountId: string): Promise<boolean> {
    try {
        validateAccount(accountId);

        const account = await AccountModel.findById(accountId, { budgetStatus: 1 });

        return !!account?.budgetStatus;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function updateBudgetStatusInAccounts(accountIds: string[], status: boolean) {
    try {
        log.info(`Updating budget status for ${accountIds.length} accounts to ${status}.`);

        await AccountModel.updateMany(
            { _id: { $in: accountIds } },
            { budgetStatus: status }
        );

        log.info("Budget statuses updated successfully.");
    } catch (e: any) {
        log.error("Error updating budget statuses in accounts:", e.message);
        throw e;
    }
}

export async function updateAllocationRule(input: UpdateAllocationRuleInput) {
    try {
        const { needs, wants, savings } = input.allocationRule;

        if (needs + wants + savings !== 100) {
            throw new AppError("Allocation percentages must sum up to 100.", 400);
        }

        const account = await findAccount(input.accountId);

        if (!account) {
            throw new AppError("Account not found.", 404);
        }

        account.allocationRule = { needs, wants, savings };
        await account.save();

        return account;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function getUtilizationThreshold(input: GetUtilizationThresholdInput): Promise<number> {
    const account = await AccountModel.findById(input.accountId);

    if (!account) {
        throw new AppError("Account not found", 404);
    }

    return account.utilizationThreshold;
}

export async function customizeUtilizationThreshold(input: CustomizeUtilizationThresholdInput) {
    try {
        const account = await findAccount(input.accountId) as IAccount;

        account.utilizationThreshold = input.utilizationThreshold;
        
        await account.save();

        return account;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}