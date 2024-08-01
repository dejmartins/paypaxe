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