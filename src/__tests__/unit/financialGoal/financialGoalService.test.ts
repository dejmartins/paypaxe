import * as FinancialGoalService from '../../../modules/financialGoal/service/financialGoal.service'
import { accountExists } from "../../../modules/account/service/account.service";
import FinancialGoalModel from "../../../modules/financialGoal/model/financialGoal.model";
import { financialGoalPayload, financialGoalReturnPayload } from "../../utils/fixtures";

jest.mock('../../../modules/account/service/account.service')
jest.mock('../../../modules/financialGoal/model/financialGoal.model')

describe('FinancialGoalService - addGoal', () => {
    describe('given the savings goal details are valid', () => {
        it('should create financial goal linked to an account', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (FinancialGoalModel.create as jest.Mock).mockResolvedValue(financialGoalReturnPayload);

            const result = await FinancialGoalService.addGoal(financialGoalPayload);

            expect(accountExists).toHaveBeenCalledWith(financialGoalPayload.account);
            expect(result).toStrictEqual(financialGoalReturnPayload);
            expect(FinancialGoalModel.create).toHaveBeenCalledWith(financialGoalPayload);
        })
    })
})