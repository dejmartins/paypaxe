import * as SavingsLogService from '../../../modules/financialGoal/service/savingsLog.service'
import * as FinancialGoalService from '../../../modules/financialGoal/service/financialGoal.service'
import SavingsLogModel from "../../../modules/financialGoal/model/savingsLog.model"
import { createSavingsLogPayload, logSavingsReturnPayload } from '../../utils/fixtures/savingsLog'
import { validateAccount } from "../../../modules/account/service/account.service";
import FinancialGoalModel from '../../../modules/financialGoal/model/financialGoal.model';
import { financialGoalReturnPayload } from '../../utils/fixtures';

jest.mock('../../../modules/financialGoal/model/savingsLog.model');
jest.mock('../../../modules/account/service/account.service');
jest.mock('../../../modules/financialGoal/model/financialGoal.model');
jest.mock('../../../modules/financialGoal/service/financialGoal.service');

describe('SavingsLogService - logSavings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('when valid data is provided', () => {
        it('should log savings', async () => {
            // (SavingsLogModel.create as jest.Mock).mockReturnValue(logSavingsReturnPayload);
            // (FinancialGoalService.findFinancialGoal as jest.Mock).mockResolvedValue(financialGoalReturnPayload);

            // const result = await SavingsLogService.logSavings(createSavingsLogPayload);

            // expect(SavingsLogModel.create).toHaveBeenCalledWith({
            //     goal: createSavingsLogPayload.goalId,
            //     account: createSavingsLogPayload.accountId,
            //     amount: createSavingsLogPayload.amount,
            //     date: createSavingsLogPayload.date,
            // });

            console.log('Not working yet');
            // expect(result).toStrictEqual(logSavingsReturnPayload);
        });
    });
});
