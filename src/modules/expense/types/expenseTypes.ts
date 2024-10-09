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

export type GetExpense = {
    accountId: string,
    limit: number
}

export type SoftDeleteExpense = {
    accountId: string,
    expenseId: string
}