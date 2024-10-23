import * as ExpenseService from '../../../modules/expense/service/expense.service'
import ExpenseModel from "../../../modules/expense/model/expense.model"
import { accountId, addExpensePayload, deletedExpensesReturnPayload, expectedTotalExpense, expenseId, expenseReturnPayload, recentExpensesReturnPayload } from "../../utils/fixtures"
import { validateAccount } from '../../../modules/account/service/account.service'
import { AppError } from '../../../shared/utils/customErrors'

jest.mock('../../../modules/expense/model/expense.model')
jest.mock('../../../modules/account/service/account.service');

describe('ExpenseService - addExpense', () => {
    describe('given expense details are valid', () => {
        it('should add the expense linked to the user account type', async () => {
            (ExpenseModel.create as jest.Mock).mockResolvedValue(expenseReturnPayload);
            const result = await ExpenseService.addExpense(addExpensePayload);

            expect(result).toStrictEqual(expenseReturnPayload);
            expect(ExpenseModel.create).toHaveBeenCalledWith(addExpensePayload);
            expect(validateAccount).toHaveBeenCalledWith(addExpensePayload.account);
        })
    })

    describe('given that the account does not exists', () => {
        it('should throw an error - Not Found', async () => {
            (validateAccount as jest.Mock).mockImplementation(() => {
                throw new AppError('Account not found', 404)
            });

            await expect(ExpenseService.addExpense(addExpensePayload))
                .rejects.toThrow('Account not found');
            expect(validateAccount).toHaveBeenCalledWith(addExpensePayload.account);
            expect(ExpenseModel.create).not.toHaveBeenCalled();
        })
    })
})

describe('ExpenseService - getTotalExpenseByDate', () => {
    describe('given the different time period', () => {
        it('should return sum total of expense of month-specific', async () => {
            (ExpenseModel.aggregate as jest.Mock).mockReturnValue([{ totalAmount: expectedTotalExpense }]);

            const totalExpense = await ExpenseService.getTotalExpense({ accountId, timePeriod: 'thisMonth' });

            expect(totalExpense).toBe(expectedTotalExpense / 100);
        })

        it('should return sum total of expense if custom-specific', async () => {
            (ExpenseModel.aggregate as jest.Mock).mockResolvedValue([{ totalAmount: expectedTotalExpense }]);

            const totalExpense = await ExpenseService.getTotalExpense({ accountId, timePeriod: 'custom', startDate: '2024-02-24', endDate: '2024-05-20' });
            expect(totalExpense).toBe(expectedTotalExpense / 100);
        })
    })
})

describe('ExpenseService - getRecentExpenses', () => {
    describe('given there are expenses already inputed', () => {
        it('should return limited recent expenses', async () => {
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
            expect(validateAccount).toHaveBeenCalledWith(accountId);
            expect(ExpenseModel.find).toHaveBeenCalledWith({ account: accountId,  status: 'active' });
        })
    })
})

describe('ExpenseService - softDeleteExpense', () => {
    describe('given there is an active expense', () => {
        it('should return a deleted expense', async () => {
            (ExpenseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({...expenseReturnPayload, status: 'deleted'});

            const deletedExpense = await ExpenseService.softDeleteExpense({ accountId: accountId, expenseId: expenseId });

            expect(deletedExpense).toEqual({...expenseReturnPayload, status: 'deleted'});
            expect(validateAccount).toHaveBeenCalledWith(accountId);
            expect(ExpenseModel.findByIdAndUpdate).toHaveBeenCalledWith(expenseId, {status: "deleted"});
        })
    })
})

describe('ExpenseService - getDeletedExpenses', () => {
    describe('given there are expenses already soft-deleted', () => {
        it('should return limited deleted expenses', async () => {
            (ExpenseModel.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue(deletedExpensesReturnPayload),
                }),
            });

            const deletedExpenses = await ExpenseService.getDeletedExpenses({ accountId, limit: 5 });

            expect(deletedExpenses).toEqual(deletedExpensesReturnPayload
                .map(expense => ({
                    ...expense,
                    amount: parseFloat((expense.amount / 100).toFixed(2))
                }))
            );
            expect(validateAccount).toHaveBeenCalledWith(accountId);
            expect(ExpenseModel.find).toHaveBeenCalledWith({ account: accountId,  status: 'deleted' });
        })
    })
})

describe('ExpenseService - updateExpense', () => {
    describe('given that an expense was already added', () => {
        it('should update and return the updated Expense', async () => {
            (ExpenseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(expenseReturnPayload);

            const updateFields = { category: "food" };
            const updatedExpense = await ExpenseService.updateExpense({accountId, expenseId, updateFields});

            expect(updatedExpense).toEqual(expenseReturnPayload)
            
            expect(validateAccount).toHaveBeenCalledWith(accountId);
            expect(ExpenseModel.findByIdAndUpdate).toHaveBeenCalledWith(
                expenseId, 
                { $set: updateFields }, 
                { new: true }
            );
        })
    })
})

describe('ExpenseService - handleRecurringExpense', () => {
    describe('given that an expense is recurring and not deleted', () => {
        it('should create new expense at intervals based on frequency', async () => {
            (ExpenseModel.find as jest.Mock).mockResolvedValue(recentExpensesReturnPayload);

            await ExpenseService.handleRecurringExpenses();
            
            expect(ExpenseModel.create).toHaveBeenCalledTimes(2);
        })
    })
})

describe('ExpenseService - getExpenseByTimeFrame', () => {
    describe('given the time frame/period', () => {
        it('should return all expense in that time frame', async () => {
            (ExpenseModel.aggregate as jest.Mock).mockReturnValue(expenseReturnPayload);

            const filteredExpense = await ExpenseService.getExpenseByTimeFrame({ accountId, timePeriod: 'thisMonth' });

            expect(filteredExpense).toBe(expenseReturnPayload);

            expect(ExpenseModel.aggregate).toHaveBeenCalledTimes(1);
        })
    })
})