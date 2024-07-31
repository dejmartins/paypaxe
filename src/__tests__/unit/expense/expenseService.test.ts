import * as ExpenseService from '../../../modules/expense/service/expense.service'
import ExpenseModel from "../../../modules/expense/model/expense.model"
import { addExpensePayload, expenseReturnPayload } from "../../utils/fixtures"
import { accountExists } from '../../../modules/account/service/account.service'

jest.mock('../../../modules/expense/model/expense.model')
jest.mock('../../../modules/account/service/account.service');

describe('IncomeService - addIncome', () => {
    describe('given expense details are valid', () => {
        it('should add the expense linked to the user account type', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (ExpenseModel.create as jest.Mock).mockResolvedValue(expenseReturnPayload);
            const result = await ExpenseService.addExpense(addExpensePayload);

            expect(result).toStrictEqual(expenseReturnPayload);
            expect(ExpenseModel.create).toHaveBeenCalledWith(addExpensePayload);
            expect(accountExists).toHaveBeenCalledWith(addExpensePayload.accountId);
        })
    })

    describe('given that the account does not exists', () => {
        it('should throw an error - Not Found', async () => {
            (accountExists as jest.Mock).mockResolvedValue(false);

            await expect(ExpenseService.addExpense(addExpensePayload))
                .rejects.toThrow('Account not found');
            expect(accountExists).toHaveBeenCalledWith(addExpensePayload.accountId);
            expect(ExpenseModel.create).not.toHaveBeenCalled();
        })
    })
})