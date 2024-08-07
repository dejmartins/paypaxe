import axios from "axios";
import * as PaymentService from '../../../modules/payment/service/payment.service';
import { accountId, createTransactionPayload, transactionReturnPayload } from "../../utils/fixtures";
import TransactionModel from "../../../modules/transaction/model/transaction.model";
import MockAdapter from "axios-mock-adapter";

jest.mock('../../../modules/transaction/model/transaction.model')
const mockAxios = new MockAdapter(axios)

describe('PaymentService - initiatePayment', () => {
    beforeEach(() => {
        mockAxios.reset();
        jest.clearAllMocks();
    });

    describe('given payment is initiated with plan and number of months', () => {
        it('should return paystack authotization url', async () => {
            const paystackInitiateMockResponse = {
                data: {
                    authorization_url: 'https://checkout.paystack.com/0peioxfhpn',
                    reference: '7PVGX8MEk85tgeEpVDtD',
                },
            };

            mockAxios.onPost('https://api.paystack.co/transaction/initialize')
                .reply(200, paystackInitiateMockResponse);

            (TransactionModel.create as jest.Mock).mockResolvedValue(transactionReturnPayload);

            const authorizationUrl = await PaymentService.initiatePayment({
                user: 'dej@gmail.com',
                account: accountId,
                plan: 'basic',
                numberOfMonths: 1
            })

            expect(TransactionModel.create).toHaveBeenCalledTimes(1);
            expect(authorizationUrl).toBe('https://checkout.paystack.com/0peioxfhpn');
            expect(TransactionModel.create).toHaveBeenCalledWith(createTransactionPayload);
        })
    })
})