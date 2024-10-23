import * as IncomeService from '../../../modules/income/service/income.service'
import IncomeModel from "../../../modules/income/model/income.model"
import { accountId, addIncomePayload, deletedIncomesReturnPayload, expectedTotalIncome, incomeId, incomeReturnPayload, recentIncomesReturnPayload } from "../../utils/fixtures"
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

describe('IncomeService - softDeleteIncome', () => {
    describe('given there is an active income', () => {
        it('should return a deleted income', async () => {
            (IncomeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({...incomeReturnPayload, status: 'deleted'});

            const deletedIncome = await IncomeService.softDeleteIncome({ accountId: accountId, incomeId: incomeId });

            expect(deletedIncome).toEqual({...incomeReturnPayload, status: 'deleted'});
            expect(validateAccount).toHaveBeenCalledWith(accountId);
            expect(IncomeModel.findByIdAndUpdate).toHaveBeenCalledWith(incomeId, {status: "deleted"});
        })
    })
})

describe('IncomeService - getDeletedIncomes', () => {
    describe('given there are incomes already soft-deleted', () => {
        it('should return limited deleted incomes', async () => {
            (IncomeModel.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue(deletedIncomesReturnPayload),
                }),
            });

            const deletedIncomes = await IncomeService.getDeletedIncomes({ accountId, limit: 5 });

            expect(deletedIncomes).toEqual(deletedIncomesReturnPayload
                .map(income => ({
                    ...income,
                    amount: parseFloat((income.amount / 100).toFixed(2))
                }))
            );
            expect(validateAccount).toHaveBeenCalledWith(accountId);
            expect(IncomeModel.find).toHaveBeenCalledWith({ account: accountId,  status: 'deleted' });
        })
    })
})

describe('IncomeService - updateIncome', () => {
    describe('given that an income was already added', () => {
        it('should update and return the updated Income', async () => {
            (IncomeModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(incomeReturnPayload);

            const updateFields = { category: "salary" };
            const updatedIncome = await IncomeService.updateIncome({accountId, incomeId, updateFields});

            expect(updatedIncome).toEqual(incomeReturnPayload)
            
            expect(validateAccount).toHaveBeenCalledWith(accountId);
            expect(IncomeModel.findByIdAndUpdate).toHaveBeenCalledWith(
                incomeId, 
                { $set: updateFields }, 
                { new: true }
            );
        })
    })
})

describe('IncomeService - getIncomeByTimeFrame', () => {
    describe('given the time frame/period', () => {
        it('should return all expense in that time frame', async () => {
            (IncomeModel.aggregate as jest.Mock).mockReturnValue(incomeReturnPayload);

            const filteredIncome = await IncomeService.getIncomeByTimeFrame({ accountId, timePeriod: 'thisMonth' });

            expect(filteredIncome).toBe(incomeReturnPayload);

            expect(IncomeModel.aggregate).toHaveBeenCalledTimes(1);
        })
    })
})