import supertest from 'supertest';
import * as IncomeService from '../../../modules/income/service/income.service';
import createServer from '../../../shared/utils/server';
import { accountId, addIncomePayload, incomeReturnPayload } from '../../utils/fixtures';

const app = createServer();

describe('Income', () => {
    describe('Income Creation', () => { 
        describe('given the accountId and income details are valid', () => {
            it('should return income payload', async () => {
                const addIncomeMock = jest
                    .spyOn(IncomeService, 'addIncome')
                    .mockResolvedValue(incomeReturnPayload);

                const { body, statusCode } = await supertest(app)
                    .post(`/api/accounts/${accountId}/incomes`)
                    .send(addIncomePayload)
                
                expect(statusCode).toBe(200);

                const actualIncome = body.data;
                const expectedIncome = incomeReturnPayload.toJSON();
                // @ts-ignore
                expectedIncome._id = expectedIncome._id.toString();
                expectedIncome.account = expectedIncome.account.toString();

                expect(actualIncome).toStrictEqual(expectedIncome);
                expect(addIncomeMock).toHaveBeenCalledWith(addIncomePayload);
            })
        })

        describe('given the dateReceived attribute is a future date', () => {
            it('should return error 400', async () => {
                jest.useFakeTimers().setSystemTime(new Date('2024-07-20'));

                const futureDatePayload = {
                    ...addIncomePayload,
                    dateReceived: '2024-07-29'
                };

                const { body, statusCode } = await supertest(app)
                    .post(`/api/accounts/${accountId}/incomes`)
                    .send(futureDatePayload)

                expect(statusCode).toBe(400);
                expect(body).toEqual(expect.objectContaining({
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            message: 'Date cannot be in the future',
                        })
                    ])
                }));
            })
        })
     })
})