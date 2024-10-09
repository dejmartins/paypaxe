export type AddIncome = {
    account: string;
    amount: number;
    category: string;
    dateReceived: string;
}

export type GetTotalIncome = {
    accountId: string,
    timePeriod: string,
    startDate?: string,
    endDate?: string
}

export type GetRecentIncome = {
    accountId: string,
    limit: number
}

export type SoftDeleteIncome = {
    accountId: string,
    incomeId: string
}