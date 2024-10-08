import { AppError } from "../../../shared/utils/customErrors";
import TransactionModel, { ITransaction } from "../model/transaction.model";
import { CreateTransaction } from "../types/transactionTypes";

export async function createTransaction(input: CreateTransaction){
    try {
        const transaction = await TransactionModel.create(input);
        return transaction;
    } catch(e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function findTransactionByReference(reference: string): Promise<ITransaction | null> {
    try {
        const transaction = await TransactionModel.findOne({ reference });
        return transaction;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}