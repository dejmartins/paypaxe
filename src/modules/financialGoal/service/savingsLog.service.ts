import { AppError } from "../../../shared/utils/customErrors";
import SavingsLogModel from "../model/savingsLog.model";
import { LogSavings } from "../types/savingsLogTypes";
import { findFinancialGoal, updateFinancialGoal } from "./financialGoal.service";

export async function logSavings(input: LogSavings) {
    try {
        const goal = await findFinancialGoal(input.goalId, input.accountId);

        const newProgress = goal.currentProgress + input.amount;
        goal.currentProgress = newProgress;

        if (newProgress >= goal.targetAmount) {
            goal.status = 'completed';
        }

        const updatedGoal = await updateFinancialGoal({
            account: input.accountId,
            goal: input.goalId,
            updateFields: {
                currentProgress: goal.currentProgress,
                status: goal.status,
            },
        });

        const log = await SavingsLogModel.create({
            account: input.accountId,
            goal: input.goalId,
            amount: input.amount,
            date: input.date,
        });

        return { updatedGoal, log };
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}
