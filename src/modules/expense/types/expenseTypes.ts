import { IExpense } from "../model/expense.model";

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

export type UpdateExpense = {
    accountId: string,
    expenseId: string,
    updateFields: Partial<IExpense>
}