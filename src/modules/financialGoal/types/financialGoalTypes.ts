import { IFinancialGoal } from "../model/financialGoal.model"

export interface FinancialGoalInput {
    account: string;
    title: string;
    category?: string;
    description?: string;
    targetAmount: number;
    priority?: string;
    deadline: string;
}

export type GetFinancialGoals = {
    account: string,
    limit: number,
    page: number,
    status?: string
}

export type GetGoalByIdParams = {
    goalId: string;
}

export type UpdateFinancialGoal = {
    account: string
    goal: string,
    updateFields: Partial<IFinancialGoal>
}