import { IFinancialGoal } from "../model/financialGoal.model"

export interface FinancialGoalInput {
    account: string;
    title: string;
    category?: string;
    description?: string;
    targetAmount: number;
    priority?: string;
    currentProgress: number;
    deadline: string;
    isRecurring: boolean;
    frequency?: string;
}

export type GetFinancialGoals = {
    account: string,
    limit: number,
    page: number
}

export type UpdateFinancialGoal = {
    account: string
    goal: string,
    updateFields: Partial<IFinancialGoal>
}