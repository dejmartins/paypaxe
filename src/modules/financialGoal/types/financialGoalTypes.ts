import { IFinancialGoal } from "../model/financialGoal.model"

export interface FinancialGoalInput{
    account: string,
    title: string,
    description: string,
    targetAmount: number,
    currentProgress: number,
    deadline: string
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