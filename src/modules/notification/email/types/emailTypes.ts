export interface EmailTemplateParams {
    token: string;
    clientUrl: string;
}

export interface SubscriptionEmailParams {
    plan: string;
    numberOfMonths: number;
    clientUrl: string;
}

export interface PaymentFailureParams {
    reference: string;
    clientUrl: string;
}