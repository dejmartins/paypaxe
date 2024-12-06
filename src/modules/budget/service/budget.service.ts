import BudgetModel, { IBudget } from "../model/budget.model";
import { ActivateBudgetInput } from "../types/budgetTypes";
import { AppError } from "../../../shared/utils/customErrors";

export async function activateBudget(input: ActivateBudgetInput): Promise<IBudget> {
    const { accountId, budgetAmount } = input;

    const existingBudget = await BudgetModel.findOne({ account: accountId, isActive: true });
    if (existingBudget) {
        throw new AppError("An active budget already exists. Complete or cancel the current budget before starting a new one.", 400);
    }

    const needsAllocation = budgetAmount * 0.5;
    const wantsAllocation = budgetAmount * 0.3;
    const savingsAllocation = budgetAmount * 0.2;

    const budget = await BudgetModel.create({
        account: accountId,
        budgetAmount,
        allocation: {
            needs: needsAllocation,
            wants: wantsAllocation,
            savings: savingsAllocation,
        },
        remainingAllocation: {
            needs: needsAllocation,
            wants: wantsAllocation,
            savings: savingsAllocation,
        },
        startDate: new Date(),
    });

    return budget;
}
