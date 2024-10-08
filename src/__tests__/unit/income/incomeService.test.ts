import * as IncomeService from '../../../modules/income/service/income.service'
import IncomeModel from "../../../modules/income/model/income.model"
import { accountId, addIncomePayload, expectedTotalIncome, incomeReturnPayload, recentIncomesReturnPayload } from "../../utils/fixtures"
import {  validateAccount } from '../../../modules/account/service/account.service'
import { AppError } from '../../../shared/utils/customErrors'

jest.mock('../../../modules/income/model/income.model')
jest.mock('../../../modules/account/service/account.service');

describe('IncomeService - addIncome', () => {
    describe('given income details are valid', () => {
        it('should add the income linked to the user account type', async () => {
            // (accountExists as jest.Mock).mockResolvedValue(true);
            (IncomeModel.create as jest.Mock).mockResolvedValue(incomeReturnPayload);
            const result = await IncomeService.addIncome(addIncomePayload);

            expect(result).toStrictEqual(incomeReturnPayload);
            expect(IncomeModel.create).toHaveBeenCalledWith(addIncomePayload);
            expect(validateAccount).toHaveBeenCalledWith(addIncomePayload.account);
        })
    })

    describe('given that the account does not exists', () => {
        it('should throw an error - Not Found', async () => {
            (validateAccount as jest.Mock).mockImplementation(() => {
                throw new AppError('Account not found', 404);
            });


            await expect(IncomeService.addIncome(addIncomePayload))
                .rejects.toThrow('Account not found');
            expect(IncomeModel.create).not.toHaveBeenCalled();
        })
    })
})

describe('IncomeService - getTotalIncomeByDate', () => {
    describe('given the different time period', () => {
        it('should return sum total of income if month-specific', async () => {
            // (accountExists as jest.Mock).mockResolvedValue(true);
            (IncomeModel.aggregate as jest.Mock).mockReturnValue([{ totalAmount: expectedTotalIncome }]);

            const totalIncome = await IncomeService.getTotalIncome({ accountId, timePeriod: 'thisMonth' });

            expect(totalIncome).toBe(expectedTotalIncome / 100);
        })

        it('should return sum total of income if custom-specific', async () => {
            // (accountExists as jest.Mock).mockResolvedValue(true);
            (IncomeModel.aggregate as jest.Mock).mockResolvedValue([{ totalAmount: expectedTotalIncome }]);

            const totalIncome = await IncomeService.getTotalIncome({ accountId, timePeriod: 'custom', startDate: '2024-02-24', endDate: '2024-05-20' });
            expect(totalIncome).toBe(expectedTotalIncome / 100);
        })
    })
})

describe('IncomeService - getRecentIncomes', () => {
    describe('given there are incomes already inputted', () => {
        it('should return limited recent incomes', async () => {
            // (accountExists as jest.Mock).mockResolvedValue(true);
            (IncomeModel.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue(recentIncomesReturnPayload),
                }),
            });

            const recentIncomes = await IncomeService.getRecentIncomes({ accountId, limit: 5 });

            expect(recentIncomes).toEqual(recentIncomesReturnPayload
                .map(income => ({
                    ...income,
                    amount: parseFloat((income.amount / 100).toFixed(2))
                }))
            );
            expect(validateAccount).toHaveBeenCalledWith(accountId);
            expect(IncomeModel.find).toHaveBeenCalledWith({ account: accountId });
        })
    })
})