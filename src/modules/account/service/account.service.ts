import { AppError } from '../../../shared/utils/customErrors';
import UserModel from '../../user/model/user.model';
import AccountModel from '../model/account.model';
import { AccountInput } from '../types/accountTypes';

export async function createAccount(input: AccountInput) {
    try {
        const user = await UserModel.findById(input.userId);

        if (!user) {
            throw new AppError('User not found', 400);
        }

        const existingAccount = await AccountModel.findOne({ user: input.userId, accountType: input.accountType });

        if (existingAccount) {
            throw new AppError(`User already has the ${input.accountType} account`, 400);
        }

        return await AccountModel.create({ user: input.userId, ...input });
    } catch (e: any){
        throw new AppError(e.message, e.statusCode, true);
    }
}
