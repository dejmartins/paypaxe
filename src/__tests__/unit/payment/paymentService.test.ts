import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import * as PaymentService from '../../../modules/payment/service/payment.service';
import { accountId, createTransactionPayload, transactionReturnPayload } from "../../utils/fixtures";
import TransactionModel from "../../../modules/transaction/model/transaction.model";

jest.mock('axios');
jest.mock('../../../modules/transaction/model/transaction.model')
const mockAxios = new MockAdapter(axios)

describe('PaymentService - initiatePayment', () => {
    describe('given payment is initiated with plan and number of months', () => {
        it('should return paystack authotization url', async () => {
            const paystackInitiateMockResponse = {
                data: {
                    data: {
                        authorization_url: 'https://checkout.paystack.com/0peioxfhpn',
                        reference: 'mock_reference',
                    },
                },
            };

            (TransactionModel.create as jest.Mock).mockResolvedValue(transactionReturnPayload);

            mockAxios.onPost('https://api.paystack.co/transaction/initialize')
                .reply(200, paystackInitiateMockResponse);

            const authorizationUrl = await PaymentService.initiatePayment({
                user: 'dej@gmail.com',
                account: accountId,
                plan: 'basic',
                numberOfMonths: 1
            })

            expect(authorizationUrl).toBe('https://checkout.paystack.com/0peioxfhpn');
            expect(TransactionModel.create).toHaveBeenCalledWith(createTransactionPayload);
        })
    })
})