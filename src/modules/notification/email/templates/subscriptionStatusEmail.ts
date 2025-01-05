import { SubscriptionEmailParams, PaymentFailureParams } from "../types/emailTypes";

export function subscriptionConfirmationEmailTemplate({ plan, numberOfMonths, clientUrl }: SubscriptionEmailParams): string {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Subscription Successful</h2>
            <p>Thank you for subscribing to the <strong>${plan}</strong> plan for <strong>${numberOfMonths}</strong> month(s).</p>
            <p>Your subscription is now active. You can manage it through your dashboard.</p>
            <a href="${clientUrl}/dashboard" style="color: #1a73e8; text-decoration: none;">
                Go to Dashboard
            </a>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Thank you for choosing Paypaxe!</p>
        </div>
    `;
}

export function paymentFailureEmailTemplate({ reference, clientUrl }: PaymentFailureParams): string {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Payment Failed</h2>
            <p>Unfortunately, your payment with reference <strong>${reference}</strong> was not successful.</p>
            <p>Please try again or update your payment details.</p>
            <a href="${clientUrl}/subscriptions" style="color: #d93025; text-decoration: none;">
                Retry Payment
            </a>
            <p>If you continue to experience issues, feel free to contact our support team.</p>
            <p>Thank you for using Paypaxe!</p>
        </div>
    `;
}