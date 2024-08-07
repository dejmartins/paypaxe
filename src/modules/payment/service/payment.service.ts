import axios from "axios";
import { AppError } from "../../../shared/utils/customErrors";
import { InitiatePayment } from "../types/paymentTypes";
import config from "../../../../config/default";

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
            metadata: { accountId: input.account }
        }, {
            headers: {
                Authorization: config.paystackSecretKey
            }
        })

        return response.data.data.authorization_url;

    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}