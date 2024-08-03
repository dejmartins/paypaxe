import * as FinancialGoalService from '../../../modules/financialGoal/service/financialGoal.service'
import { accountExists } from "../../../modules/account/service/account.service";
import FinancialGoalModel from "../../../modules/financialGoal/model/financialGoal.model";
import { accountId, addGoalPayload, financialGoalReturnPayload, financialGoalsList } from "../../utils/fixtures";

jest.mock('../../../modules/account/service/account.service')
jest.mock('../../../modules/financialGoal/model/financialGoal.model')

describe('FinancialGoalService - addGoal', () => {
    describe('given the savings goal details are valid', () => {
        it('should create financial goal - savings linked to an account', async () => {
            (accountExists as jest.Mock).mockResolvedValue(true);
            (FinancialGoalModel.create as jest.Mock).mockResolvedValue(financialGoalReturnPayload);

            const result = await FinancialGoalService.addGoal(addGoalPayload);

            expect(accountExists).toHaveBeenCalledWith(addGoalPayload.account);
            expect(result).toStrictEqual(financialGoalReturnPayload);
            expect(FinancialGoalModel.create).toHaveBeenCalledWith(addGoalPayload);
        })
    })

    describe('given that the account does not exists', () => {
        it('should throw an error - Not Found', async () => {
            (accountExists as jest.Mock).mockResolvedValue(false);

            await expect(FinancialGoalService.addGoal(addGoalPayload))
                .rejects.toThrow('Account not found');
            expect(accountExists).toHaveBeenCalledWith(addGoalPayload.account);
            expect(FinancialGoalModel.create).not.toHaveBeenCalled();
        })
    })
})

describe('FinancialGoalService - getFinancialGoals', () => {
    describe('given we have financial goals already set', () => {
        it('should fetch all financial goals paginated', async () => {
            const page = 1;
            const limit = 10;
            (accountExists as jest.Mock).mockResolvedValue(true);
            const mockFind = {
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(financialGoalsList)
            };

            (FinancialGoalModel.find as jest.Mock).mockReturnValue(mockFind);
            (FinancialGoalModel.countDocuments as jest.Mock).mockResolvedValue(financialGoalsList.length);

            const result = await FinancialGoalService.getFinancialGoals({ account: accountId, page, limit });

            expect(accountExists).toHaveBeenCalledWith(accountId);
            expect(FinancialGoalModel.find).toHaveBeenCalledWith({ account: accountId });
            expect(mockFind.skip).toHaveBeenCalledWith((page - 1) * limit);
            expect(mockFind.limit).toHaveBeenCalledWith(limit);
            expect(mockFind.lean).toHaveBeenCalled();
            expect(result.goals).toStrictEqual(financialGoalsList);
            expect(result.totalGoals).toBe(financialGoalsList.length);
            expect(result.totalPages).toBe(Math.ceil(financialGoalsList.length / limit));
            expect(result.currentPage).toBe(page);
        })
    })
})