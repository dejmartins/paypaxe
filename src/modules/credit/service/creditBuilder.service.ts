import CreditBuilderModel from "../model/creditBuilder.model";
import { AppError } from "../../../shared/utils/customErrors";
import { findAccount } from "../../account/service/account.service";
import { OptInCreditBuilderInput, OptOutCreditBuilderInput } from "../types/creditBuilderTypes";

export async function optInCreditBuilder(input: OptInCreditBuilderInput): Promise<void> {
    try {
        const { accountId } = input;
    
        const account = await findAccount(accountId);
        if (!account) {
            throw new AppError("Account not found", 404);
        }
    
        const creditBuilder = await CreditBuilderModel.findOne({ account: accountId });
        if (creditBuilder?.isOptedIn) {
            throw new AppError("You are already opted in for the credit builder.", 400);
        }
    
        if (!creditBuilder) {
            await CreditBuilderModel.create({
                account: accountId,
                isOptedIn: true,
            });
        } else {
            creditBuilder.isOptedIn = true;
            await creditBuilder.save();
        }
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function optOutCreditBuilder(input: OptOutCreditBuilderInput): Promise<void> {
    const { accountId } = input;

    const account = await findAccount(accountId);
    if (!account) {
        throw new AppError("Account not found", 404);
    }

    const creditBuilder = await CreditBuilderModel.findOne({ account: accountId });
    if (!creditBuilder?.isOptedIn) {
        throw new AppError("You are already opted out of the credit builder.", 400);
    }

    creditBuilder.isOptedIn = false;
    await creditBuilder.save();
}
