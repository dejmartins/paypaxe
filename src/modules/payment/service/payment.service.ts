import axios from "axios";
import { AppError } from "../../../shared/utils/customErrors";
import { InitiatePayment } from "../types/paymentTypes";
import config from "../../../../config/default";
import { createTransaction, findTransactionByReference } from "../../transaction/service/transaction.service";
import { findAccount } from "../../account/service/account.service";
import { sendPaymentFailureEmail, sendSubscriptionConfirmationEmail } from "../../notification/email/services/email.service";

export async function initiatePayment(input: InitiatePayment){
    try {
        let amount = 0;
    
        if (input.plan === 'basic') {
            amount = config.basicPlanFee * input.numberOfMonths;
        } else if (input.plan === 'premium') {
            amount = config.premiumPlanFee * input.numberOfMonths;
        } else {
            throw new AppError('Invalid plan selected', 400);
        }

        const response = await axios.post(config.paystackInitiatePayment, {
            email: input.user,
            amount: amount * 100,
            metadata: { 
                accountId: input.account,
                plan: input.plan,
                numberOfMonths: input.numberOfMonths,
                email: input.user
            }
        }, {
            headers: {
                Authorization: `Bearer ${config.paystackSecretKey}`
            }
        })

        await createTransaction({
            user: input.user,
            account: input.account,
            amount: amount,
            status: 'pending',
            reference: response.data.data.reference
        })

        return response.data.data.authorization_url;

    } catch (e: any) {
        throw new AppError(e.message, 500)
    }
}

export async function handleWebhookEvent(event: any) {
    try {
        const { reference, status, metadata } = event.data;

        const { plan, numberOfMonths, email } = metadata;
    
        const transaction = await findTransactionByReference(reference);
    
        if (!transaction) {
            throw new AppError('Transaction not found', 404);
        }
    
        transaction.status = status === 'success' ? 'success' : 'failed';
        await transaction.save();
    
        if (transaction.status === 'success') {
    
            // @ts-ignore
            await updateSubscription(transaction.account.toString(), plan, numberOfMonths);

            await sendSubscriptionConfirmationEmail(
                email,
                plan,
                numberOfMonths
            );
        } else {
            await sendPaymentFailureEmail(email, reference)
        }
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}

async function updateSubscription(accountId: string, plan: 'basic' | 'premium', numberOfMonths: number) {
    const account = await findAccount(accountId);

    if (!account) {
        throw new AppError('Account not found', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentEndDate = new Date(account.subscriptionEndDate);

    if (isNaN(currentEndDate.getTime())) {
        currentEndDate = today;
    }

    if (currentEndDate < today) {
        currentEndDate = today;
    }

    const additionalMilliseconds = numberOfMonths * 30 * 24 * 60 * 60 * 1000; 
    currentEndDate = new Date(currentEndDate.getTime() + additionalMilliseconds);

    account.subscriptionEndDate = currentEndDate;
    account.subscriptionPlan = plan;

    await account.save();
}
