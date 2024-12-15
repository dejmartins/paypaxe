import mongoose, { Types } from "mongoose";
import { AppError } from "../../../shared/utils/customErrors";
import { getTimeFrame } from "../../../shared/utils/time";
import { findAccount, updateNetBalance, validateAccount } from "../../account/service/account.service";
import IncomeModel, { IIncome } from "../model/income.model";
import { AddIncome, GetIncome, GetIncomeByTimeFrame, GetTotalIncome, IncomeBreakdown, SoftDeleteIncome, UpdateIncome } from "../types/incomeTypes";
import log from "../../../shared/utils/logger";
import { transferToGoal } from "../../financialGoal/service/financialGoal.service";
import { logActivity } from "../../activityLog/service/activityLog.service";

export async function addIncome(input: AddIncome): Promise<IIncome> {
    try {
        validateAccount(input.account);

        const { financialGoalId, savingsAmount, amount } = input;

        let amountToSave = 0;
        let amountToNetBalance = amount;

        if (financialGoalId) {
            if (!savingsAmount || savingsAmount <= 0) {
                throw new AppError("Savings amount must be greater than zero when financialGoalId is provided", 400);
            }

            if (savingsAmount > amount) {
                throw new AppError("Savings amount cannot exceed the income amount", 400);
            }

            amountToSave = savingsAmount;
            amountToNetBalance = amount - savingsAmount;

            await transferToGoal(financialGoalId, savingsAmount);
        }

        const income = await IncomeModel.create({
            ...input,
            amount: amountToNetBalance,
        });

        await updateNetBalance(input.account, amountToNetBalance);

        await logActivity({
            entityType: "Income",
            entityId: income._id,
            accountId: input.account,
            action: "Add",
            details: `Added income of ${amount} under category ${income.category}${
                financialGoalId ? `, with ${savingsAmount} saved to goal ${financialGoalId}` : ""
            }. Date received: ${income.dateReceived}${
                input.frequency ? `, Recurring frequency: ${income.frequency}` : ""
            }.`,
            
        });

        return income;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}


export async function getTotalIncome(input: GetTotalIncome): Promise<{ totalIncome: number, netBalance?: number }> {
    try {
        validateAccount(input.accountId);
        
        const { startDate: start, endDate: end } = input.timePeriod 
            ? getTimeFrame(input.timePeriod, input.startDate, input.endDate) 
            : { startDate: undefined, endDate: undefined };
        
        const matchConditions: any = { account: new mongoose.Types.ObjectId(input.accountId), status: "active" };

        if (start && end) {
            matchConditions.dateReceived = { $gte: new Date(start), $lte: new Date(end) };
        }

        const incomes = await IncomeModel.aggregate([
            { $match: matchConditions },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totalIncome = incomes.length > 0 ? incomes[0].totalAmount / 100 : 0;

        let netBalance;
        if (input.includeNetBalance) {
            const account = await findAccount(input.accountId);

            netBalance = account?.netBalance;
        }

        return { totalIncome, netBalance };
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function getRecentIncomes(input: GetIncome): Promise<IIncome[]> {
    try {
        validateAccount(input.accountId);

        const recentIncomes = await IncomeModel.find({ account: input.accountId, status: 'active' })
            .sort({ dateReceived: -1 })
            .limit(input.limit)
            .lean();

        return recentIncomes.map(income => ({
            ...income,
            amount: parseFloat((income.amount / 100).toFixed(2))
        })) as IIncome[];

    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}

export async function softDeleteIncome(input: SoftDeleteIncome) {
    try{
        validateAccount(input.accountId);
    
        const expense = IncomeModel.findByIdAndUpdate(input.incomeId, { status: 'deleted' })
    
        return expense;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getDeletedIncomes(input: GetIncome): Promise<IIncome[]> {
    try {
        validateAccount(input.accountId);

        const deletedIncomes = await IncomeModel.find({ account: input.accountId, status: 'deleted' })
            .sort({ date: -1 })
            .limit(input.limit)
            .lean();

        return deletedIncomes.map(income => ({
            ...income,
            amount: parseFloat((income.amount / 100).toFixed(2))
        })) as IIncome[];

    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}

export async function updateIncome(input: UpdateIncome) {
    try {
        validateAccount(input.accountId);
        
        const updatedIncome = await IncomeModel.findOneAndUpdate(
            { _id: input.incomeId, status: 'active' }, 
            { $set: input.updateFields }, 
            { new: true }
        );

        if (!updatedIncome) {
            throw new AppError("Income not found.", 404);
        }

        if (updatedIncome.status === 'deleted') {
            throw new AppError("Deleted Income cannot be updated.", 404);
        }

        return updatedIncome;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getIncomeByTimeFrame(input: GetIncomeByTimeFrame) {
    try {
        validateAccount(input.accountId);
        
        const { startDate: start, endDate: end } = getTimeFrame(input.timePeriod, input.startDate, input.endDate);
    
        const incomes = await IncomeModel.aggregate([
            {
                $match: {
                    account: new Types.ObjectId(input.accountId),
                    dateReceived: { $gte: new Date(start), $lte: new Date(end) },
                    status: 'active'
                }
            }
        ]);

        return incomes;
        
    } catch (error: any) {
        log.error(`Error getting income by time frame: ${error.message}`);
        throw new AppError(error.message, error.statusCode)
    }
}

export async function getIncomeBreakdown(accountId: string): Promise<IncomeBreakdown[]> {
    try {
        const breakdown = await IncomeModel.aggregate([
            { $match: { account: new mongoose.Types.ObjectId(accountId), status: "active" } },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    totalAmount: { $divide: ['$totalAmount', 100] },
                    _id: 0
                }
            }
        ]);

        return breakdown;
    } catch (error: any) {
        throw new AppError(error.message, error.statusCode || 500);
    }
}