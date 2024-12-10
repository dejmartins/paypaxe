import CreditBuilderModel from "../model/creditBuilder.model";
import { AppError } from "../../../shared/utils/customErrors";
import { findAccount } from "../../account/service/account.service";
import { CheckOptInStatusInput, OptInCreditBuilderInput, OptOutCreditBuilderInput } from "../types/creditBuilderTypes";
import mongoose from "mongoose";

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

export async function findOne(accountId: string){
    try {
        const creditBuilder = await CreditBuilderModel.findOne({ account: accountId, isOptedIn: true });

        return creditBuilder;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function updateCreditBuilderAfterCardDeletion(
    accountId: string,
    cardId: string,
    creditLimit: number,
    utilizationAmount: number
) {
    try {
        const updatedCreditBuilder = await CreditBuilderModel.findOneAndUpdate(
            { account: new mongoose.Types.ObjectId(accountId) },
            {
                $pull: { activeCards: cardId },
                $inc: {
                    aggregateCreditLimit: -creditLimit,
                    aggregateUtilization: -utilizationAmount,
                },
            },
            { new: true }
        );

        if (!updatedCreditBuilder) {
            throw new AppError("CreditBuilder record not found for the account.", 404);
        }

        return updatedCreditBuilder;
    } catch (error: any) {
        throw new AppError(error.message, error.statusCode || 500);
    }
}

export async function checkOptInStatus(input: CheckOptInStatusInput): Promise<boolean> {
    const { accountId } = input;

    try {
        const creditBuilder = await CreditBuilderModel.findOne({ account: accountId });

        if (!creditBuilder) {
            throw new AppError("Credit Builder record not found for this account.", 404);
        }

        return creditBuilder.isOptedIn;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}
