import axios from "axios";
import { AppError } from "../../../shared/utils/customErrors";
import { InitiatePayment } from "../types/paymentTypes";

export async function initiatePayment(input: InitiatePayment){
    try {
        const response = axios.post('', {})
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}