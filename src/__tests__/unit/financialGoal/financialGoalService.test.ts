import * as FinancialGoalService from '../../../modules/financialGoal/service/financialGoal.service'
import { accountExists } from "../../../modules/account/service/account.service";
import FinancialGoalModel from "../../../modules/financialGoal/model/financialGoal.model";
import { addGoalPayload, financialGoalReturnPayload } from "../../utils/fixtures";

jest.mock('../../../modules/account/service/account.service')
jest.mock('../../../modules/financialGoal/model/financialGoal.model')

describe('FinancialGoalService - addGoal', () => {
    describe('given the savings goal details are valid', () => {
        it('should create financial goal linked to an account', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (FinancialGoalModel.create as jest.Mock).mockResolvedValue(financialGoalReturnPayload);

            const result = await FinancialGoalService.addGoal(addGoalPayload);

            expect(accountExists).toHaveBeenCalledWith(addGoalPayload.accountId);
            expect(result).toStrictEqual(financialGoalReturnPayload);
            expect(FinancialGoalModel.create).toHaveBeenCalledWith(addGoalPayload);
        })
    })

    describe('given that the account does not exists', () => {
        it('should throw an error - Not Found', async () => {
            (accountExists as jest.Mock).mockResolvedValue(false);

            await expect(FinancialGoalService.addGoal(addGoalPayload))
                .rejects.toThrow('Account not found');
            expect(accountExists).toHaveBeenCalledWith(addGoalPayload.accountId);
            expect(FinancialGoalModel.create).not.toHaveBeenCalled();
        })
    })
})