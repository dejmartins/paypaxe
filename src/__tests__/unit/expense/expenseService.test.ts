import * as ExpenseService from '../../../modules/expense/service/expense.service'
import ExpenseModel from "../../../modules/expense/model/expense.model"
import { accountId, addExpensePayload, expectedTotalExpense, expenseReturnPayload, recentExpensesReturnPayload } from "../../utils/fixtures"
import { accountExists } from '../../../modules/account/service/account.service'

jest.mock('../../../modules/expense/model/expense.model')
jest.mock('../../../modules/account/service/account.service');

describe('ExpenseService - addExpense', () => {
    describe('given expense details are valid', () => {
        it('should add the expense linked to the user account type', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (ExpenseModel.create as jest.Mock).mockResolvedValue(expenseReturnPayload);
            const result = await ExpenseService.addExpense(addExpensePayload);

            expect(result).toStrictEqual(expenseReturnPayload);
            expect(ExpenseModel.create).toHaveBeenCalledWith(addExpensePayload);
            expect(accountExists).toHaveBeenCalledWith(addExpensePayload.account);
        })
    })

    describe('given that the account does not exists', () => {
        it('should throw an error - Not Found', async () => {
            (accountExists as jest.Mock).mockResolvedValue(false);

            await expect(ExpenseService.addExpense(addExpensePayload))
                .rejects.toThrow('Account not found');
            expect(accountExists).toHaveBeenCalledWith(addExpensePayload.account);
            expect(ExpenseModel.create).not.toHaveBeenCalled();
        })
    })
})

describe('ExpenseService - getTotalExpenseByDate', () => {
    describe('given the different time period', () => {
        it('should return sum total of expense if month-specific', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (ExpenseModel.aggregate as jest.Mock).mockReturnValue([{ totalAmount: expectedTotalExpense }]);

            const totalExpense = await ExpenseService.getTotalExpense({ accountId, timePeriod: 'thisMonth' });

            expect(totalExpense).toBe(expectedTotalExpense / 100);
        })

        it('should return sum total of expense if custom-specific', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (ExpenseModel.aggregate as jest.Mock).mockResolvedValue([{ totalAmount: expectedTotalExpense }]);

            const totalExpense = await ExpenseService.getTotalExpense({ accountId, timePeriod: 'custom', startDate: '2024-02-24', endDate: '2024-05-20' });
            expect(totalExpense).toBe(expectedTotalExpense / 100);
        })
    })
})

describe('ExpenseService - getRecentExpenses', () => {
    describe('given there are expenses already inputted', () => {
        it('should return limited recent expenses', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (ExpenseModel.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue(recentExpensesReturnPayload),
                }),
            });

            const recentExpenses = await ExpenseService.getRecentExpenses({ accountId, limit: 5 });

            expect(recentExpenses).toEqual(recentExpensesReturnPayload
                .map(expense => ({
                    ...expense,
                    amount: parseFloat((expense.amount / 100).toFixed(2))
                }))
            );
            expect(accountExists).toHaveBeenCalledWith(accountId);
            expect(ExpenseModel.find).toHaveBeenCalledWith({ account: accountId });
        })
    })
})