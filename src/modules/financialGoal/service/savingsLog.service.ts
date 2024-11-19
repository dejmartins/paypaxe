import { AppError } from "../../../shared/utils/customErrors";
import SavingsLogModel from "../model/savingsLog.model";
import { LogSavings } from "../types/savingsLogTypes";
import { findFinancialGoal, updateFinancialGoal } from "./financialGoal.service";

export async function logSavings(input: LogSavings) {
    try {
        const goal = await findFinancialGoal(input.goalId, input.accountId);

        // Add the savings amount to the current progress
        goal.currentProgress += Math.round(input.amount * 100); // Convert input amount to cents

        // Check if the goal is completed
        if (goal.currentProgress >= goal.targetAmount) {
            goal.status = 'completed';
        }

        // Update the financial goal
        const updatedGoal = await updateFinancialGoal({
            account: input.accountId,
            goal: input.goalId,
            updateFields: goal,
        });

        // Log the savings
        const log = await SavingsLogModel.create({
            account: input.accountId,
            goal: input.goalId,
            amount: input.amount, // Store amount as a float (dollars)
            date: input.date,
        });

        return { updatedGoal, log };
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}
