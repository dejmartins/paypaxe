import mongoose from "mongoose";
import { AppError } from "../../../shared/utils/customErrors";
import { validateAccount } from "../../account/service/account.service";
import FinancialGoalModel, { IFinancialGoal } from "../model/financialGoal.model";
import { CalculateSavingsInput, FinancialGoalInput, GetFinancialGoals, UpdateFinancialGoal } from "../types/financialGoalTypes";

export async function createFinancialGoal(input: FinancialGoalInput): Promise<IFinancialGoal> {
    try {
        validateAccount(input.account);

        const goal = await FinancialGoalModel.create(input);
        return goal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getFinancialGoals(input: GetFinancialGoals){
    try{
        validateAccount(input.account);

        const query: any = { account: input.account, deletionStatus: "active" };
        if (input.status) {
            query.status = input.status;
        }

        const goals = await FinancialGoalModel.find(query)
            .skip((input.page - 1) * input.limit)
            .limit(input.limit);

        const totalGoals = await FinancialGoalModel.countDocuments({ account: input.account });

        return {
            goals,
            totalGoals,
            totalPages: Math.ceil(totalGoals / input.limit),
            currentPage: input.page,
        };

        
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getFinancialGoal(goalId: string, accountId: string) {
    try {
        const goal = getActiveGoal(goalId, accountId);
    
        return goal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getTotalCurrentProgress(accountId: string): Promise<number> {
    try {
        const totalProgress = await FinancialGoalModel.aggregate([
            { $match: { account: new mongoose.Types.ObjectId(accountId), deletionStatus: "active", } },
            { $group: { _id: null, totalProgress: { $sum: "$currentProgress" } } },
        ]);

        return totalProgress.length > 0 ? totalProgress[0].totalProgress / 100 : 0;
    } catch (error: any) {
        throw new AppError(error.message, error.statusCode || 500);
    }
}

export async function updateFinancialGoal(input: UpdateFinancialGoal){
    try {
        validateAccount(input.account);

        const goal = await FinancialGoalModel.findById(input.goal);

        if (!goal) {
            throw new AppError('Financial goal not found', 404);
        }

        // @ts-ignore
        if (goal.account.toString() !== input.account) {
            throw new AppError('Financial goal does not belong to the specified account', 403);
        }

        const updatedGoal = await FinancialGoalModel.findByIdAndUpdate(input.goal, input.updateFields, { new: true });

        return updatedGoal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}


export async function updateGoalNotificationStatus(goalId: string, updateFields: Partial<IFinancialGoal>) {
    try {
        const goal = await FinancialGoalModel.findByIdAndUpdate(goalId, updateFields, { new: true });
        if (!goal) {
            throw new AppError('Financial goal not found', 404);
        }
        return goal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export function calculateSavingsAmount(input: CalculateSavingsInput): number {
    try {

        validateAccount(input.accountId);

        const { targetAmount, deadline, frequency } = input;
    
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
    
        if (deadlineDate <= currentDate) {
            throw new AppError("Deadline must be in the future", 400);
        }
    
        const timeDifference = deadlineDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
        let intervals: number;
    
        switch (frequency) {
            case "daily":
                intervals = daysRemaining;
                break;
            case "weekly":
                intervals = Math.ceil(daysRemaining / 7);
                break;
            case "monthly":
                intervals = Math.ceil(daysRemaining / 30);
                break;
            case "yearly":
                intervals = Math.ceil(daysRemaining / 365);
                break;
            default:
                throw new AppError("Invalid frequency provided", 400);
        }
    
        const amountPerInterval = targetAmount / intervals;
        return parseFloat(amountPerInterval.toFixed(2));
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

async function getActiveGoal(goalId: string, accountId: string) {
    validateAccount(accountId);

    const goal = await FinancialGoalModel.findOne({
        _id: goalId,
        account: accountId,
    });

    if (!goal) {
        throw new AppError("Financial goal not found", 404);
    }

    if (goal.deletionStatus === "deleted") {
        throw new AppError("Financial goal has been deleted", 400);
    }

    return goal;
}

