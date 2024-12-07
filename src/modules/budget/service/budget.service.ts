import BudgetModel, { IBudget } from "../model/budget.model";
import { ActivateBudgetInput, GetActiveBudgetInput } from "../types/budgetTypes";
import { AppError } from "../../../shared/utils/customErrors";
import { getCurrentAllocationRules, updateBudgetStatus } from "../../account/service/account.service";

export async function activateBudget(input: ActivateBudgetInput): Promise<IBudget> {
    const { accountId, budgetAmount } = input;

    const existingBudget = await BudgetModel.findOne({ account: accountId, isActive: true });
    if (existingBudget) {
        throw new AppError("An active budget already exists. Complete or cancel the current budget before starting a new one.", 400);
    }

    const allocationRules = await getCurrentAllocationRules(accountId);

    const needsAllocation = budgetAmount * allocationRules.needs;
    const wantsAllocation = budgetAmount * allocationRules.wants;
    const savingsAllocation = budgetAmount * allocationRules.savings;

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

    await updateBudgetStatus(accountId, true);

    return budget;
}

export async function getActiveBudget(input: GetActiveBudgetInput) {
    const activeBudget = await BudgetModel.findOne({
        account: input.accountId,
        isActive: true,
    });

    if (!activeBudget) {
        throw new AppError("No active budget found for this account.", 404);
    }

    return activeBudget;
}
