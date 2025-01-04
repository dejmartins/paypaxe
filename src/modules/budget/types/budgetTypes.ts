export interface ActivateBudgetInput {
    accountId: string;
    budgetAmount: number;
}

export interface GetActiveBudgetInput {
    accountId: string;
}

export interface CustomizeBudgetAmountInput {
    accountId: string;
    newBudgetAmount: number;
}
