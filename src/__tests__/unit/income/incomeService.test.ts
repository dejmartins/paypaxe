import * as IncomeService from '../../../modules/income/service/income.service'
import IncomeModel from "../../../modules/income/model/income.model"
import { addIncomePayload, incomeReturnPayload } from "../../utils/fixtures"
import { accountExists } from '../../../modules/account/service/account.service'

jest.mock('../../../modules/income/model/income.model')
jest.mock('../../../modules/account/service/account.service');

describe('Income Service - addIncome', () => {
    describe('given income details are valid', () => {
        it('should add the income linked to the user account type', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (IncomeModel.create as jest.Mock).mockResolvedValue(incomeReturnPayload);
            const result = await IncomeService.addIncome(addIncomePayload);

            console.log(incomeReturnPayload)

            expect(result).toStrictEqual(incomeReturnPayload);
            expect(IncomeModel.create).toHaveBeenCalledWith(addIncomePayload);
            expect(accountExists).toHaveBeenCalledWith(addIncomePayload.accountId);
        })
    })

    describe('given that the account does not exists', () => {
        it('should throw an error - Not Found', async () => {
            (accountExists as jest.Mock).mockResolvedValue(false);

            await expect(IncomeService.addIncome(addIncomePayload))
                .rejects.toThrow('Account not found');
            expect(accountExists).toHaveBeenCalledWith(addIncomePayload.accountId);
            expect(IncomeModel.create).not.toHaveBeenCalled();
        })
    })
})