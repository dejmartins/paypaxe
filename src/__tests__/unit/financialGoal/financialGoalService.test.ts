import * as FinancialGoalService from '../../../modules/financialGoal/service/financialGoal.service'
import { accountExists } from "../../../modules/account/service/account.service";
import FinancialGoalModel from "../../../modules/financialGoal/model/financialGoal.model";
import { accountId, addGoalPayload, financialGoalId, financialGoalReturnPayload, financialGoalsList, updateFinancialGoalFields } from "../../utils/fixtures";
import { checkGoalsForNotifications } from '../../../modules/notification/service/goal.notification';
import { sendEmailNotification } from '../../../modules/notification/email/services/email.service';

jest.mock('../../../modules/account/service/account.service')
jest.mock('../../../modules/financialGoal/model/financialGoal.model')
jest.mock('../../../modules/notification/email/services/email.service');

describe('FinancialGoalService - addGoal', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('given the savings goal details are valid', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

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

    describe('given the goal deadline is today', () => {
        it('should send a notification that goal deadline has reached', async () => {
            const mockGoals = [
                {
                    _id: financialGoalId,
                    title: 'Emergency Fund',
                    account: {
                        user: {
                            email: 'dej@gmail.com'
                        }
                    },
                    deadline: new Date(),
                    currentProgress: 1000,
                    targetAmount: 2000,
                    deadlineNotificationSent: false,
                }
            ];

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockGoals),
            };
    
            (FinancialGoalModel.find as jest.Mock).mockReturnValue(mockQuery);
            (FinancialGoalModel.findByIdAndUpdate as jest.Mock).mockReturnValue({ deadlineNotificationSent: true, ...mockQuery });
    
            await checkGoalsForNotifications();
    
            expect(sendEmailNotification).toHaveBeenCalledWith(
                'dej@gmail.com',
                'Goal Deadline Reminder',
                'Your goal "Emergency Fund" has a deadline today. Please review your progress.'
            );

            expect(sendEmailNotification).toHaveBeenCalledTimes(1);
        })
    })

    describe('given the goal has been achieved', () => {
        it('should send a notification that the goal has been achieved', async () => {
            const mockGoals = [
                {
                    _id: financialGoalId,
                    title: 'Vacation Fund',
                    account: {
                        user: {
                            email: 'dej@gmail.com'
                        }
                    },
                    deadline: new Date('2024-12-31'),
                    currentProgress: 3000,
                    targetAmount: 3000,
                    deadlineNotificationSent: false,
                    goalAchievedNotificationSent: false,
                }
            ];

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockGoals),
            };

            (FinancialGoalModel.find as jest.Mock).mockReturnValue(mockQuery);
            (FinancialGoalModel.findByIdAndUpdate as jest.Mock).mockReturnValue({ goalAchievedNotificationSent: true, ...mockQuery });

            await checkGoalsForNotifications();

            expect(sendEmailNotification).toHaveBeenCalledWith(
                'dej@gmail.com',
                'Congratulations! Goal Achieved',
                'Congratulations! You have achieved your goal "Vacation Fund". Keep up the great work!'
            );
            expect(sendEmailNotification).toHaveBeenCalledTimes(1);
        });

        it('should update the goalAchievedNotificationSent attribute to true', async () => {
            const mockGoals = [
                {
                    _id: financialGoalId,
                    title: 'Vacation Fund',
                    account: {
                        user: {
                            email: 'dej@gmail.com'
                        }
                    },
                    deadline: new Date('2024-12-31'),
                    currentProgress: 3000,
                    targetAmount: 3000,
                    deadlineNotificationSent: false,
                    goalAchievedNotificationSent: false,
                }
            ];

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockGoals),
            };

            (FinancialGoalModel.find as jest.Mock).mockReturnValue(mockQuery);
            (FinancialGoalModel.findByIdAndUpdate as jest.Mock).mockReturnValue({ goalAchievedNotificationSent: true, ...mockQuery });

            await checkGoalsForNotifications();

            expect(FinancialGoalModel.findByIdAndUpdate).toHaveBeenCalledWith(
                financialGoalId,
                { goalAchievedNotificationSent: true },
                {"new": true}
            );
        });
    });

    describe('given the goal deadline is not today and has not reached the target', () => {
        it('should not send any notifications', async () => {
            const mockGoals = [
                {
                    _id: financialGoalId,
                    title: 'Retirement Fund',
                    account: {
                        user: {
                            email: 'dej@gmail.com'
                        }
                    },
                    deadline: new Date('2040-01-01'),
                    currentProgress: 50000,
                    targetAmount: 100000,
                }
            ];

            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockGoals),
            };

            (FinancialGoalModel.find as jest.Mock).mockReturnValue(mockQuery);

            await checkGoalsForNotifications();

            expect(sendEmailNotification).not.toHaveBeenCalled();
        });
    });
})

describe('FinancialGoalService - updateFinancialGoal', () => {
    describe('given new values for financial goal attributes', () => { 
        it('should update the already existing financial goal', async () => {
            const updatedFinancialGoal = {
                ...financialGoalReturnPayload,
                updateFinancialGoalFields
            };

            (accountExists as jest.Mock).mockResolvedValue(true);
            (FinancialGoalModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedFinancialGoal);

            const result = await FinancialGoalService.updateFinancialGoal({ account: accountId, goal: financialGoalId, updateFields: updateFinancialGoalFields});

            expect(result).toEqual(updatedFinancialGoal);
            expect(accountExists).toHaveBeenCalledWith(accountId);
            expect(FinancialGoalModel.findByIdAndUpdate).toHaveBeenCalledWith(financialGoalId, updateFinancialGoalFields, {new: true})
        })
     })
});