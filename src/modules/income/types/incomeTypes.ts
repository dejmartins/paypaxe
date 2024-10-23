import { IIncome } from "../model/income.model";

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

export type GetIncome = {
    accountId: string,
    limit: number
}

export type SoftDeleteIncome = {
    accountId: string,
    incomeId: string
}

export type UpdateIncome = {
    accountId: string,
    incomeId: string,
    updateFields: Partial<IIncome>
}

export type GetIncomeByTimeFrame = {
    accountId: string,
    timePeriod: string,
    startDate?: string,
    endDate?: string
}