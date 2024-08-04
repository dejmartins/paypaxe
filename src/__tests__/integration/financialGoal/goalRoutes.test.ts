import createServer from "../../../shared/utils/server";
import * as GoalService from '../../../modules/financialGoal/service/financialGoal.service';
import { accountId, addGoalPayload, financialGoalReturnPayload } from "../../utils/fixtures";
import supertest from "supertest";

const app = createServer();

describe('FinancialGoal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('Goal Creation', () => { 
        describe('given the accountId and financial goal details are valid', () => {
            it('should return goal payload', async () => {
                // jest.useFakeTimers().setSystemTime(new Date('2024-07-20'));

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
})
