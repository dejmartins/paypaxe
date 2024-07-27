import * as AccountService from '../../../modules/account/service/account.service';
import createServer from '../../../shared/utils/server';
import { accountReturnPayload, createAccountPayload } from '../../utils/fixtures';
import supertest from 'supertest'

const app = createServer()

describe('Account', () => {
    describe('Account Creation', () => {

        describe('given that the userId is valid and account details valid', () => {
            it('should return account payload', async () => {
                const createAccountServiceMock = jest
                    .spyOn(AccountService, 'createAccount')
                    .mockResolvedValue(accountReturnPayload);

                const { body, statusCode } = await supertest(app)
                    .post('/api/accounts')
                    .send(createAccountPayload)

                expect(statusCode).toBe(200);

                const actualAccount = body.data;
                const expectedAccount = accountReturnPayload.toJSON();
                expectedAccount._id = expectedAccount._id.toString();
                expectedAccount.user = expectedAccount.user.toString();
    
                expect(actualAccount).toStrictEqual(expectedAccount);
                expect(createAccountServiceMock).toHaveBeenCalledWith(createAccountPayload);
            })
        })
    })
})