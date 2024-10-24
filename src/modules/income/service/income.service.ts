import { Types } from "mongoose";
import { AppError } from "../../../shared/utils/customErrors";
import { getTimeFrame } from "../../../shared/utils/time";
import { validateAccount } from "../../account/service/account.service";
import IncomeModel, { IIncome } from "../model/income.model";
import { AddIncome, GetIncome, GetIncomeByTimeFrame, GetTotalIncome, SoftDeleteIncome, UpdateIncome } from "../types/incomeTypes";
import log from "../../../shared/utils/logger";

export async function addIncome(input: AddIncome): Promise<IIncome>{
    try{    
        validateAccount(input.account);

        const income = await IncomeModel.create(input);
        return income;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}

export async function getTotalIncome(input: GetTotalIncome){
    try {
        validateAccount(input.accountId);
        
        const { startDate: start, endDate: end } = getTimeFrame(input.timePeriod, input.startDate, input.endDate);
    
        const incomes = await IncomeModel.aggregate([
            {
                $match: {
                    account: new Types.ObjectId(input.accountId),
                    dateReceived: { $gte: new Date(start), $lte: new Date(end) }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
    
        const totalIncome = incomes.length > 0 ? incomes[0].totalAmount : 0;
        return totalIncome / 100;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}

export async function getRecentIncomes(input: GetIncome): Promise<IIncome[]> {
    try {
        validateAccount(input.accountId);

        const recentIncomes = await IncomeModel.find({ account: input.accountId })
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