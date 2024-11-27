import { IFinancialGoal } from "../model/financialGoal.model"

export interface FinancialGoalInput {
    account: string;
    title: string;
    category?: string;
    description?: string;
    targetAmount: number;
    startDate: string;
    deadline: string;
    priority?: string;
    isRecurring: boolean;
    frequency?: string;
    preferredTime?: string; // Optional preferred time for reminders (format: HH:mm)
    amount?: number;
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

export interface CalculateSavingsInput {
    accountId: string;
    targetAmount: number;
    deadline: string;
    frequency: "daily" | "weekly" | "monthly" | "yearly";
}

export interface DeleteFinancialGoalInput {
    accountId: string;
    goalId: string;
}
