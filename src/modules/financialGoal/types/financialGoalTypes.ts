import { IFinancialGoal } from "../model/financialGoal.model"

export interface FinancialGoalInput {
    account: string;
    title: string;
    type: 'savings' | 'investment' | 'retirement' | 'debtRepayment' | 'other';
    category?: string;
    description?: string;
    targetAmount: number;
    startDate: string;
    deadline: string;
    priority?: 'high' | 'medium' | 'low';
    isRecurring: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
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