import * as IncomeService from '../../../modules/income/service/income.service'
import IncomeModel from "../../../modules/income/model/income.model"
import { addIncomePayload, incomeReturnPayload } from "../../utils/fixtures"
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
            expect(accountExists).toHaveBeenCalledWith(addIncomePayload.accountId);
        })

        it("should ensure date is not in the future", async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            jest.useFakeTimers().setSystemTime(new Date('2024-07-20'));

            const futureDatePayload = {
                ...addIncomePayload,
                dateReceived: '2024-07-29'
            };
            
            await expect(IncomeService.addIncome(futureDatePayload))
                .rejects.toThrow('Invalid Date - date cannot be in the future')
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