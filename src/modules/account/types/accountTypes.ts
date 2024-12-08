export type AccountInput = {
    userId: string;
    accountType: string;
    subscriptionPlan: string;
}

export interface GetNetBalanceInput {
    accountId: string;
}

export interface UpdateAllocationRuleInput {
    accountId: string;
    allocationRule: {
        needs: number;
        wants: number;
        savings: number;
    }
}