import AccountModel, { AccountInput } from '../model/account.model';

export async function createAccount(input: AccountInput) {
    return await AccountModel.create({user: input.userId, ...input});
}
