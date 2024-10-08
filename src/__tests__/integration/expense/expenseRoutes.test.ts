import supertest from 'supertest';
import * as ExpenseService from '../../../modules/expense/service/expense.service';
import createServer from '../../../shared/utils/server';
import { accountId, addExpensePayload, deletedExpenseReturnPayload, expectedTotalExpense, expenseId, expenseReturnPayload, recentExpensesReturnPayload } from '../../utils/fixtures';
import { NextFunction, Request, Response } from 'express';

jest.mock('../../../shared/middlewares/validateAccount', () => ({
    validateAccountTypeAndPlan: () => (req: Request, res: Response, next: NextFunction) => next(),
    validateSubscription: (req: Request, res: Response, next: NextFunction) => next()
}));

const app = createServer();

describe('Expense', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Expense Creation', () => { 
        describe('given the accountId and expense details are valid', () => {
            it('should return expense payload', async () => {
                const addExpenseMock = jest
                    .spyOn(ExpenseService, 'addExpense')
                    .mockResolvedValue(expenseReturnPayload);

                const { body, statusCode } = await supertest(app)
                    .post(`/api/accounts/${accountId}/expenses`)
                    .send(addExpensePayload)
                
                expect(statusCode).toBe(200);

                const actualExpense = body.data;
                const expectedExpense = expenseReturnPayload.toJSON();
                // @ts-ignore
                expectedExpense._id = expectedExpense._id.toString();
                expectedExpense.account = expectedExpense.account.toString();

                expect(actualExpense).toStrictEqual(expectedExpense);
                expect(addExpenseMock).toHaveBeenCalledWith(addExpensePayload);
            })
        })

        describe('given the date attribute is a future date', () => {
            it('should return error 400', async () => {
                jest.useFakeTimers().setSystemTime(new Date('2024-07-20'));

                const futureDatePayload = {
                    ...addExpensePayload,
                    date: '2024-07-29'
                };

                const { body, statusCode } = await supertest(app)
                    .post(`/api/accounts/${accountId}/expenses`)
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

        describe('given the expense amount is zero', () => {
            it('should return error 400', async () => {
                const futureDatePayload = {
                    ...addExpensePayload,
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


    describe('Get Total Expense', () => {
        describe('given the timePeriod - thisMonth', () => {
            it('should return total expense for this month', async () => {
                const getTotalExpenseMock = jest
                    .spyOn(ExpenseService, 'getTotalExpense')
                    .mockResolvedValue(expectedTotalExpense);
    
                const { body, statusCode } = await supertest(app)
                    .get(`/api/accounts/${accountId}/expenses/total`)
                    .query({ timePeriod: 'thisMonth' });
    
                expect(statusCode).toBe(200);
                expect(body.data.totalExpense).toBe(expectedTotalExpense);
                expect(getTotalExpenseMock).toHaveBeenCalledWith({
                    accountId, 
                    timePeriod: 'thisMonth', 
                    startDate: undefined, 
                    endDate: undefined
                });
            });
        })
    })

    describe('Get Recent Expenses', () => {
        it('should return recent expenses', async () => {
            const getRecentExpensesMock = jest
                .spyOn(ExpenseService, 'getRecentExpenses')
                // @ts-ignore
                .mockResolvedValue(recentExpensesReturnPayload);

            const { body, statusCode } = await supertest(app)
                .get(`/api/accounts/${accountId}/expenses/recent`)
                .query({ limit: 5 });

            expect(statusCode).toBe(200);
            expect(body.data).toStrictEqual(recentExpensesReturnPayload);
            expect(getRecentExpensesMock).toHaveBeenCalledWith({ accountId, limit: '5' });
        });
    });

    describe('Soft Delete Expense', () => {
        it('should return recent expenses', async () => {
            const getDeletedExpenseMock = jest
                .spyOn(ExpenseService, 'softDeleteExpense')
                .mockResolvedValue(deletedExpenseReturnPayload);

            const { body, statusCode } = await supertest(app)
                .patch(`/api/accounts/${accountId}/expenses/${expenseId}`)

            expect(statusCode).toBe(200);

            expect(body.data.status).toStrictEqual(deletedExpenseReturnPayload.toJSON().status);
            expect(getDeletedExpenseMock).toHaveBeenCalledWith({ accountId, expenseId });
        });
    });
})