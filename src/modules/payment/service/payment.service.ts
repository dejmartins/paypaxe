import axios from "axios";
import { AppError } from "../../../shared/utils/customErrors";
import { InitiatePayment } from "../types/paymentTypes";
import config from "../../../../config/default";
import { createTransaction, findTransactionByReference } from "../../transaction/service/transaction.service";
import { ITransaction } from "../../transaction/model/transaction.model";
import { findAccount } from "../../account/service/account.service";

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
                numberOfMonths: input.numberOfMonths
            }
        }, {
            headers: {
                Authorization: config.paystackSecretKey
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
        throw new AppError(e.message, e.statusCode)
    }
}

export async function handleWebhookEvent(event: any) {
    const { reference, status, metadata } = event.data;

    const transaction = await findTransactionByReference({ reference });

    if (!transaction) {
        throw new AppError('Transaction not found', 404);
    }

    transaction.status = status === 'success' ? 'success' : 'failed';
    await transaction.save();

    if (transaction.status === 'success') {
        const { plan, numberOfMonths } = metadata;

        // @ts-ignore
        await updateSubscription(transaction.account.toString(), plan, numberOfMonths);
    }
}

async function updateSubscription(accountId: string, plan: string, numberOfMonths: number) {
    const account = await findAccount(accountId);

    if (!account) {
        throw new AppError('Account not found', 404);
    }
    
}