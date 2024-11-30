import supertest from 'supertest';
import * as IncomeService from '../../../modules/income/service/income.service';
import createServer from '../../../shared/utils/server';
import { accountId, addIncomePayload, expectedTotalIncome, incomeReturnPayload, recentIncomesReturnPayload } from '../../utils/fixtures';
import { NextFunction, Request, Response } from 'express';
import IncomeModel from '../../../modules/income/model/income.model';

jest.mock('../../../shared/middlewares/validateAccount', () => ({
    validateAccountTypeAndPlan: () => (req: Request, res: Response, next: NextFunction) => next(),
    validateSubscription: (req: Request, res: Response, next: NextFunction) => next()
}));

const app = createServer();

describe('Income', () => {
    describe('Income Creation', () => { 
        describe('given the accountId and income details are valid', () => {
            const returnPayload = new IncomeModel(incomeReturnPayload);
            it('should return income payload', async () => {
                const addIncomeMock = jest
                    .spyOn(IncomeService, 'addIncome')
                    .mockResolvedValue(returnPayload);

                const { body, statusCode } = await supertest(app)
                    .post(`/api/accounts/${accountId}/incomes`)
                    .send(addIncomePayload)
                
                expect(statusCode).toBe(200);

                const actualIncome = body.data;
                const expectedIncome = returnPayload.toJSON();
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

        describe('given the income amount is zero', () => {
            it('should return error 400', async () => {
                const futureDatePayload = {
                    ...addIncomePayload,
                    amount: 0.0
                };

                const { body, statusCode } = await supertest(app)
                    .post(`/api/accounts/${accountId}/incomes`)
                    .send(futureDatePayload)

                expect(statusCode).toBe(400);
                expect(body).toEqual(expect.objectContaining({
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            message: 'Amount must be greater than zero',
                        })
                    ])
                }));
            })
        })
     })


    //  describe('Get Total Income', () => {
    //     describe('given the timePeriod - thisMonth', () => {
    //         it('should return total income for this month', async () => {
    //             const getTotalIncomeMock = jest
    //                 .spyOn(IncomeService, 'getTotalIncome')
    //                 .mockResolvedValue(expectedTotalIncome);
    
    //             const { body, statusCode } = await supertest(app)
    //                 .get(`/api/accounts/${accountId}/incomes/total`)
    //                 .query({ timePeriod: 'thisMonth' });
    
    //             expect(statusCode).toBe(200);
    //             expect(body.data.totalIncome).toBe(expectedTotalIncome);
    //             expect(getTotalIncomeMock).toHaveBeenCalledWith({
    //                 accountId, 
    //                 timePeriod: 'thisMonth', 
    //                 startDate: undefined, 
    //                 endDate: undefined
    //             });
    //         });
    //     })
    //  })

     describe('Get Recent Incomes', () => {
        it('should return recent incomes', async () => {
            const getRecentIncomesMock = jest
                .spyOn(IncomeService, 'getRecentIncomes')
                // @ts-ignore
                .mockResolvedValue(recentIncomesReturnPayload);

            const { body, statusCode } = await supertest(app)
                .get(`/api/accounts/${accountId}/incomes/recent`)
                .query({ limit: 5 });

            expect(statusCode).toBe(200);
            expect(body.data).toStrictEqual(recentIncomesReturnPayload);
            expect(getRecentIncomesMock).toHaveBeenCalledWith({ accountId, limit: '5' });
        });
    });
})