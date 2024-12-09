export interface AddCardInput {
    accountId: string;
    creditInstitution: string;
    creditLimit: number;
    utilizationAmount: number;
    paymentDueDate: string; // Format: YYYY-MM-DD
    cardNumber?: string;
}

export interface GetAllCardsInput {
    accountId: string;
}

export interface GetCardInput {
    accountId: string;
    cardId: string;
}

export interface EditCardInput {
    accountId: string;
    cardId: string;
    creditInstitution?: string;
    creditLimit?: number;
    utilizationAmount?: number;
    paymentDueDate?: string;
}

