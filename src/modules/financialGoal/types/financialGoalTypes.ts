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