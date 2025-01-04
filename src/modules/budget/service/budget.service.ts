import BudgetModel, { IBudget } from "../model/budget.model";
import { ActivateBudgetInput, CustomizeBudgetAmountInput, GetActiveBudgetInput } from "../types/budgetTypes";
import { AppError } from "../../../shared/utils/customErrors";
import { findAccount, getCurrentAllocationRules, updateBudgetStatus, updateBudgetStatusInAccounts } from "../../account/service/account.service";
import log from "../../../shared/utils/logger";

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

export async function customizeBudgetAmount(input: CustomizeBudgetAmountInput) {
    const { accountId, newBudgetAmount } = input;

    const activeBudget = await BudgetModel.findOne({ account: accountId, isActive: true });

    if (!activeBudget) {
        throw new AppError("No active budget found. Activate a budget before customizing.", 404);
    }

    const allocationRules = await getCurrentAllocationRules(accountId);

    // Recalculate allocations based on the new budget amount
    const needsAllocation = newBudgetAmount * allocationRules.needs;
    const wantsAllocation = newBudgetAmount * allocationRules.wants;
    const savingsAllocation = newBudgetAmount * allocationRules.savings;

    // Update the active budget with new amounts
    activeBudget.budgetAmount = newBudgetAmount;
    activeBudget.allocation = {
        needs: needsAllocation,
        wants: wantsAllocation,
        savings: savingsAllocation,
    };
    activeBudget.remainingAllocation = {
        needs: needsAllocation,
        wants: wantsAllocation,
        savings: savingsAllocation,
    };

    await activeBudget.save();

    return activeBudget;
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

export async function deductFromBudget(accountId: string, expenseAmount: number) {
    const budget = await getActiveBudget({ accountId });

    let remainingAmount = expenseAmount;

    if (budget.remainingAllocation.needs >= remainingAmount) {
        budget.remainingAllocation.needs -= remainingAmount;
        remainingAmount = 0;
    } else {
        remainingAmount -= budget.remainingAllocation.needs;
        budget.remainingAllocation.needs = 0;
    }

    if (remainingAmount > 0) {
        if (budget.remainingAllocation.wants >= remainingAmount) {
            budget.remainingAllocation.wants -= remainingAmount;
            remainingAmount = 0;
        } else {
            remainingAmount -= budget.remainingAllocation.wants;
            budget.remainingAllocation.wants = 0;
        }
    }

    if (remainingAmount > 0) {
        if (budget.remainingAllocation.savings >= remainingAmount) {
            budget.remainingAllocation.savings -= remainingAmount;
            remainingAmount = 0;
        } else {
            remainingAmount -= budget.remainingAllocation.savings;
            budget.remainingAllocation.savings = 0;
        }
    }

    if (remainingAmount > 0) {
        budget.negativeBalance += remainingAmount;
    }

    await budget.save();

    return budget;
}


export async function deactivateMonthlyBudgets() {
    try {
        log.info("Starting budget deactivation process.");

        const activeBudgets = await BudgetModel.find({ isActive: true });

        if (!activeBudgets.length) {
            log.info("No active budgets found to deactivate.");
            return;
        }

        const accountIds = new Set<string>();

        for (const budget of activeBudgets) {
            budget.isActive = false;
            await budget.save();
            accountIds.add(budget.account as string);
        }

        await updateBudgetStatusInAccounts(Array.from(accountIds), false);

        log.info(`Deactivated ${activeBudgets.length} budgets and updated associated account statuses.`);
    } catch (e: any) {
        log.error("Error during budget deactivation process:", e.message);
        throw e;
    }
}
