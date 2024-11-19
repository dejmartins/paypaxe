import mongoose from "mongoose";
import { accountId, financialGoalId } from "../fixtures";

export const savingsLogId = new mongoose.Types.ObjectId().toString();

export const createSavingsLogPayload = {
    goalId: financialGoalId,
    accountId: accountId,
    amount: 400.50,
    date: '2024-07-20'
}

export const logSavingsReturnPayload = {
    goalId: financialGoalId,
    accountId: accountId,
    amount: 400.50,
    date: '2024-07-20'
}