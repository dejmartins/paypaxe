import BudgetModel, { IBudget } from "../model/budget.model";
import { ActivateBudgetInput } from "../types/budgetTypes";
import { AppError } from "../../../shared/utils/customErrors";
import { getCurrentAllocationRules } from "../../account/service/account.service";

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

    return budget;
}
