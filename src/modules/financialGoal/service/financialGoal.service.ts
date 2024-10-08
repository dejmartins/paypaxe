import { AppError } from "../../../shared/utils/customErrors";
import log from "../../../shared/utils/logger";
import { validateAccount } from "../../account/service/account.service";
import FinancialGoalModel, { IFinancialGoal } from "../model/financialGoal.model";
import { FinancialGoalInput, GetFinancialGoals, UpdateFinancialGoal } from "../types/financialGoalTypes";

export async function addGoal(input: FinancialGoalInput): Promise<IFinancialGoal> {
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

        const goals = await FinancialGoalModel.find({ account: input.account })
            .skip((input.page - 1) * input.limit)
            .limit(input.limit)
            .lean();

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
