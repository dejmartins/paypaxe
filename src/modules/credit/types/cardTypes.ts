export interface AddCardInput {
    accountId: string;
    creditInstitution: string;
    creditLimit: number;
    utilizationAmount: number;
    paymentDueDate: string; // Format: YYYY-MM-DD
    cardNumber?: string;
}
