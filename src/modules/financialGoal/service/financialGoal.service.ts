import mongoose from "mongoose";
import { AppError } from "../../../shared/utils/customErrors";
import { findAccount, updateNetBalance, validateAccount } from "../../account/service/account.service";
import FinancialGoalModel, { IFinancialGoal } from "../model/financialGoal.model";
import { CalculateSavingsInput, DeleteFinancialGoalInput, FinancialGoalInput, GetFinancialGoals, TransferFundsInput, UpdateFinancialGoal, UpdatePauseStatusInput } from "../types/financialGoalTypes";
import log from "../../../shared/utils/logger";

export async function createFinancialGoal(input: FinancialGoalInput): Promise<IFinancialGoal> {
    try {
        validateAccount(input.account);

        const goal = await FinancialGoalModel.create(input);
        return goal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getFinancialGoals(input: GetFinancialGoals){
    try{
        validateAccount(input.account);

        const query: any = { account: input.account, deletionStatus: "active" };

        if (input.status) {
            query.status = input.status;
        }

        if (input.title) {
            query.title = { $regex: input.title, $options: 'i' };
        }

        const goals = await FinancialGoalModel.find(query)
            .skip((input.page - 1) * input.limit)
            .limit(input.limit);

        const totalGoals = await FinancialGoalModel.countDocuments({ account: input.account });

        return {
            goals,
            totalGoals,
            totalPages: Math.ceil(totalGoals / input.limit),
            currentPage: input.page,
        };

        
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getFinancialGoal(goalId: string, accountId: string) {
    try {
        const goal = getActiveGoal(goalId, accountId);
    
        return goal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getTotalCurrentProgress(accountId: string): Promise<number> {
    try {
        const totalProgress = await FinancialGoalModel.aggregate([
            { $match: { account: new mongoose.Types.ObjectId(accountId), deletionStatus: "active", } },
            { $group: { _id: null, totalProgress: { $sum: "$currentProgress" } } },
        ]);

        return totalProgress.length > 0 ? totalProgress[0].totalProgress / 100 : 0;
    } catch (error: any) {
        throw new AppError(error.message, error.statusCode || 500);
    }
}

export async function updateFinancialGoal(input: UpdateFinancialGoal){
    try {
        validateAccount(input.account);

        const goal = await FinancialGoalModel.findById(input.goal);

        if (!goal) {
            throw new AppError('Financial goal not found', 404);
        }

        // @ts-ignore
        if (goal.account.toString() !== input.account) {
            throw new AppError('Financial goal does not belong to the specified account', 403);
        }

        const updatedGoal = await FinancialGoalModel.findByIdAndUpdate(input.goal, input.updateFields, { new: true });

        return updatedGoal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}


export async function updateGoalNotificationStatus(goalId: string, updateFields: Partial<IFinancialGoal>) {
    try {
        const goal = await FinancialGoalModel.findByIdAndUpdate(goalId, updateFields, { new: true });
        if (!goal) {
            throw new AppError('Financial goal not found', 404);
        }
        return goal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export function calculateSavingsAmount(input: CalculateSavingsInput): number {
    try {

        validateAccount(input.accountId);

        const { targetAmount, deadline, frequency } = input;
    
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
    
        if (deadlineDate <= currentDate) {
            throw new AppError("Deadline must be in the future", 400);
        }
    
        const timeDifference = deadlineDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
        let intervals: number;
    
        switch (frequency) {
            case "daily":
                intervals = daysRemaining;
                break;
            case "weekly":
                intervals = Math.ceil(daysRemaining / 7);
                break;
            case "monthly":
                intervals = Math.ceil(daysRemaining / 30);
                break;
            case "yearly":
                intervals = Math.ceil(daysRemaining / 365);
                break;
            default:
                throw new AppError("Invalid frequency provided", 400);
        }
    
        const amountPerInterval = targetAmount / intervals;
        return parseFloat(amountPerInterval.toFixed(2));
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function deleteFinancialGoal(input: DeleteFinancialGoalInput) {
    try {
        const goal = await getActiveGoal(input.goalId, input.accountId)

        goal.deletionStatus = "deleted";
        await goal.save();

        return goal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function transferFunds(input: TransferFundsInput) {
    try {
        validateTransferInput(input);

        const sourceGoal = await FinancialGoalModel.findOne({
            _id: input.sourceGoalId,
            account: input.accountId,
            deletionStatus: "active",
        });

        const destinationGoal = await FinancialGoalModel.findOne({
            _id: input.destinationGoalId,
            account: input.accountId,
            deletionStatus: "active",
        });

        if (!sourceGoal) {
            throw new AppError("Source financial goal not found or inactive", 404);
        }

        if (!destinationGoal) {
            throw new AppError("Destination financial goal not found or inactive", 404);
        }

        checkFundsAvailability(sourceGoal, input.transferAmount);

        performFundTransfer(sourceGoal, destinationGoal, input.transferAmount);

        adjustGoalDeadline(sourceGoal);
        adjustGoalDeadline(destinationGoal);

        await saveGoals(sourceGoal, destinationGoal);

        return {
            sourceGoal,
            destinationGoal,
            transferAmount: input.transferAmount,
        };
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function updatePauseStatus(input: UpdatePauseStatusInput) {
    try {
        const goal = await getActiveGoal(input.goalId, input.accountId);

        goal.pauseStatus = input.status;

        if (input.status === 'active') {
            adjustGoalDeadline(goal);
        }

        await goal.save();

        return goal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}


// Helpers

async function getActiveGoal(goalId: string, accountId: string) {
    validateAccount(accountId);

    const goal = await FinancialGoalModel.findOne({
        _id: goalId,
        account: accountId,
    });

    if (!goal) {
        throw new AppError("Financial goal not found", 404);
    }

    if (goal.deletionStatus === "deleted") {
        throw new AppError("Financial goal has been deleted", 400);
    }

    return goal;
}

function validateTransferInput(input: TransferFundsInput) {
    if (input.sourceGoalId === input.destinationGoalId) {
        throw new AppError("Cannot transfer funds to the same goal", 400);
    }
}

function checkFundsAvailability(sourceGoal: IFinancialGoal, transferAmount: number) {
    if (sourceGoal.currentProgress < transferAmount) {
        throw new AppError(
            `Insufficient funds. Available balance: ${sourceGoal.currentProgress}`, 400
        );
    }
}

function performFundTransfer( sourceGoal: IFinancialGoal, destinationGoal: IFinancialGoal, transferAmount: number) {
    sourceGoal.currentProgress -= transferAmount;
    destinationGoal.currentProgress += transferAmount;

    sourceGoal.status =
        sourceGoal.currentProgress >= sourceGoal.targetAmount ? "completed" : "ongoing";
    destinationGoal.status =
        destinationGoal.currentProgress >= destinationGoal.targetAmount ? "completed" : "ongoing";
}

async function saveGoals(sourceGoal: IFinancialGoal, destinationGoal: IFinancialGoal) {
    await sourceGoal.save();
    await destinationGoal.save();
}

function adjustGoalDeadline(goal: IFinancialGoal) {
    if (!goal.isRecurring || !goal.amount || !goal.frequency) {
        return;
    }

    const newDeadline = calculateNewDeadline(
        goal.targetAmount,
        goal.currentProgress,
        goal.amount,
        goal.frequency
    );

    goal.deadline = new Date(newDeadline);
}


export function calculateNewDeadline(
    targetAmount: number,
    currentProgress: number,
    amount: number,
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
): string {
    const remainingAmount = targetAmount - currentProgress;
    const frequencyMap = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
    };

    if (!frequencyMap[frequency]) {
        throw new AppError("Invalid frequency", 400);
    }

    const daysPerFrequency = frequencyMap[frequency];
    const remainingFrequencies = Math.ceil(remainingAmount / amount);
    const remainingDays = remainingFrequencies * daysPerFrequency;

    const newDeadline = new Date();
    newDeadline.setDate(newDeadline.getDate() + remainingDays);

    return newDeadline.toISOString().split('T')[0];
}

// Cron

export async function incrementProgressForActiveGoals() {
    try {
        const now = new Date();
        const currentTime = now.toISOString().split("T")[1].slice(0, 5);

        const activeGoals = await FinancialGoalModel.find({
            deletionStatus: "active",
            pauseStatus: "active",
            isRecurring: true,
            status: { $ne: "completed" },
            preferredTime: currentTime,
        });

        if (!activeGoals.length) {
            log.info("No active financial goals found for increment.");
            return;
        }

        for (const goal of activeGoals) {
            const account = await findAccount(goal.account as string);

            if (!account) {
                log.error(`Account not found for goal ID: ${goal._id}`);
                continue;
            }

            if ((account.netBalance || 0) < (goal.amount || 0)) {
                log.warn(
                    `Insufficient net balance for goal ID: ${goal._id}. Skipping increment.`
                );
                continue;
            }

            const lastIncrementDate = goal.lastIncrementAt || goal.startDate;
            const timeDifference = now.getTime() - new Date(lastIncrementDate).getTime();

            const isDue = isIncrementDue(goal.frequency, timeDifference);

            if (isDue) {
                const incrementAmount = goal.amount || 0;
                const newProgress = goal.currentProgress + incrementAmount;

                if (newProgress < goal.targetAmount) {
                    goal.currentProgress = newProgress;
                } else {
                    goal.currentProgress = newProgress;
                    goal.status = "completed";
                }

                goal.lastIncrementAt = now;

                // Deduct from netBalance
                await updateNetBalance(account._id as string, -incrementAmount);

                await goal.save();
            }
        }

        log.info(`Processed ${activeGoals.length} active financial goals.`);
    } catch (e: any) {
        log.error("Error incrementing financial goals:", e.message);
        throw new AppError(e.message, e.statusCode || 500);
    }
}

function isIncrementDue(frequency: string | undefined, timeDifference: number): boolean {
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay; // Approximation
    const oneYear = 365 * oneDay; // Approximation

    switch (frequency) {
        case "daily":
            return timeDifference >= oneDay;
        case "weekly":
            return timeDifference >= oneWeek;
        case "monthly":
            return timeDifference >= oneMonth;
        case "yearly":
            return timeDifference >= oneYear;
        default:
            return false;
    }
}





