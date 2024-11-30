export type AccountInput = {
    userId: string;
    accountType: string;
    subscriptionPlan: string;
}

export interface GetNetBalanceInput {
    accountId: string;
}