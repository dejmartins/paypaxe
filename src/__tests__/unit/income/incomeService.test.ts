import * as IncomeService from '../../../modules/income/service/income.service'
import IncomeModel from "../../../modules/income/model/income.model"
import { accountId, addIncomePayload, expectedTotalIncome, incomeReturnPayload } from "../../utils/fixtures"
import { accountExists } from '../../../modules/account/service/account.service'

jest.mock('../../../modules/income/model/income.model')
jest.mock('../../../modules/account/service/account.service');

describe('IncomeService - addIncome', () => {
    describe('given income details are valid', () => {
        it('should add the income linked to the user account type', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (IncomeModel.create as jest.Mock).mockResolvedValue(incomeReturnPayload);
            const result = await IncomeService.addIncome(addIncomePayload);

            console.log(incomeReturnPayload)

            expect(result).toStrictEqual(incomeReturnPayload);
            expect(IncomeModel.create).toHaveBeenCalledWith(addIncomePayload);
            expect(accountExists).toHaveBeenCalledWith(addIncomePayload.account);
        })
    })

    describe('given that the account does not exists', () => {
        it('should throw an error - Not Found', async () => {
            (accountExists as jest.Mock).mockResolvedValue(false);

            await expect(IncomeService.addIncome(addIncomePayload))
                .rejects.toThrow('Account not found');
            expect(accountExists).toHaveBeenCalledWith(addIncomePayload.account);
            expect(IncomeModel.create).not.toHaveBeenCalled();
        })
    })
})

describe('IncomeService - getTotalIncomeByDate', () => {
    describe('given the different time period', () => {
        it('should return sum total of income if month-specific', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (IncomeModel.aggregate as jest.Mock).mockReturnValue([{ totalAmount: expectedTotalIncome }]);

            const totalIncome = await IncomeService.getTotalIncome({ accountId, timePeriod: 'thisMonth' });

            expect(totalIncome).toBe(expectedTotalIncome / 100);
        })

        it('should return sum total of income if custom-specific', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (IncomeModel.aggregate as jest.Mock).mockResolvedValue([{ totalAmount: expectedTotalIncome }]);

            const totalIncome = await IncomeService.getTotalIncome({ accountId, timePeriod: 'custom', startDate: '2024-02-24', endDate: '2024-05-20' });
            expect(totalIncome).toBe(expectedTotalIncome / 100);
        })
    })
})