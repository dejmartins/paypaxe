import createServer from "../../../shared/utils/server";
import * as GoalService from '../../../modules/financialGoal/service/financialGoal.service';
import { accountId, addGoalPayload, financialGoalId, financialGoalReturnPayload, financialGoalsList, updatedFinancialGoalPayload } from "../../utils/fixtures";
import supertest from "supertest";

const app = createServer();

describe('FinancialGoal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('Goal Creation', () => { 
        describe('given the accountId and financial goal details are valid', () => {
            it('should return goal payload', async () => {
                jest.useFakeTimers().setSystemTime(new Date('2024-07-20'));

                const addGoalMock = jest
                    .spyOn(GoalService, 'addGoal')
                    .mockResolvedValue(financialGoalReturnPayload);

                const { body, statusCode } = await supertest(app)
                    .post(`/api/accounts/${accountId}/goals`)
                    .send(addGoalPayload);

                expect(statusCode).toBe(200);

                const actualGoal = body.data;
                const expectedGoal = financialGoalReturnPayload.toJSON();
                // @ts-ignore
                expectedGoal._id = expectedGoal._id.toString();
                expectedGoal.account = expectedGoal.account.toString();

                expect(actualGoal).toStrictEqual(expectedGoal);
                expect(addGoalMock).toHaveBeenCalledWith(addGoalPayload);
            })
        })
    })

    describe('Get Financial Goals', () => {
        describe('given the limit and page', () => { 
            it('should return paginated goals', async () => {
                const getGoalsMock = jest
                    .spyOn(GoalService, 'getFinancialGoals')
                    .mockResolvedValue({
                        // @ts-ignore
                        goals: financialGoalsList,
                        totalGoals: financialGoalsList.length,
                        totalPages: 1,
                        currentPage: 1
                    });
    
                const { body, statusCode } = await supertest(app)
                    .get(`/api/accounts/${accountId}/goals`)
                    .query({ limit: '3', page: '1' });
    
                expect(statusCode).toBe(200);
                expect(body.data.goals).toStrictEqual(financialGoalsList);
                expect(body.data.totalGoals).toBe(financialGoalsList.length);
                expect(body.data.totalPages).toBe(1);
                expect(body.data.currentPage).toBe(1);
                expect(getGoalsMock).toHaveBeenCalledWith({ account: accountId, limit: '3', page: '1' });
            });
         })
    });

    describe('Update Financial Goals', () => {
        describe('given new values for goal attributes', () => { 
            it('should return updated goals', async () => {
                const updateGoalsMock = jest
                    .spyOn(GoalService, 'updateFinancialGoal')
                    .mockResolvedValue(updatedFinancialGoalPayload);
    
                const { body, statusCode } = await supertest(app)
                    .put(`/api/accounts/${accountId}/goals/${financialGoalId}`)
                    .send({
                        title: 'Vacation Fund'
                    })
    
                expect(statusCode).toBe(200);
                expect(body.data.title).toStrictEqual(updatedFinancialGoalPayload.toJSON().title);
                expect(updateGoalsMock).toHaveBeenCalledWith({ account: accountId, goal: financialGoalId, updateFields: { title: 'Vacation Fund' } });
            });
         })
    });
})
