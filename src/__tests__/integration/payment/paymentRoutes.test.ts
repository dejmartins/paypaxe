import supertest from 'supertest';
import createServer from '../../../shared/utils/server';
import { accountId } from '../../utils/fixtures';
import * as PaymentService from '../../../modules/payment/service/payment.service';

const app = createServer();

describe('Payment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initiate payment and return authorization url', async () => {
        const authorizationUrl = 'https://checkout.paystack.com/0peioxfhpn';
        const initiatePaymentMock = jest
            .spyOn(PaymentService, 'initiatePayment')
            .mockResolvedValue(authorizationUrl);

        const { body, statusCode } = await supertest(app)
            .post(`/api/accounts/${accountId}/pay`)
            .send({
                user: 'dej@gmail.com',
                plan: 'basic',
                numberOfMonths: 1
            });

        expect(statusCode).toBe(200);
        expect(body.data).toBe(authorizationUrl);
        expect(initiatePaymentMock).toHaveBeenCalledWith({
            user: 'dej@gmail.com',
            account: accountId,
            plan: 'basic',
            numberOfMonths: 1
        });
    });
});
