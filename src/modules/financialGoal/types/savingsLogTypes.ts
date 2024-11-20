export interface LogSavings {
    accountId: string;
    goalId: string;
    amount: number;
    date: string;
    isRecurring: boolean;
    frequency?: string;
}