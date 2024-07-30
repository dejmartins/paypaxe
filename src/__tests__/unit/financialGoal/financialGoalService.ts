import { accountExists } from "../../../modules/account/service/account.service";
import FinancialGoalModel from "../../../modules/financialGoal/model/financialGoal.model";
import { financialGoalReturnPayload } from "../../utils/fixtures";

jest.mock('../../../modules/account/service/account.service')

describe('FinancialGoalService - addGoal', () => {
    describe('given the savings goal details are valid', () => {
        it('should create financial goal linked to an account', () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (FinancialGoalModel.create as jest.Mock).mockResolvedValue(financialGoalReturnPayload);
        })
    })
})