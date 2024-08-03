export interface AddExpense {
    account: string;
    amount: number;
    description: string
    category: string;
    date: string;
}

export type GetTotalExpense = {
    accountId: string,
    timePeriod: string,
    startDate?: string,
    endDate?: string
}

export type GetRecentExpense = {
    accountId: string,
    limit: number
}