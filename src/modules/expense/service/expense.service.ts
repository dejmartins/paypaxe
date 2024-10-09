import { Types } from "mongoose";
import { AppError } from "../../../shared/utils/customErrors";
import log from "../../../shared/utils/logger";
import { getTimeFrame } from "../../../shared/utils/time";
import { validateAccount } from "../../account/service/account.service";
import ExpenseModel, { IExpense } from "../model/expense.model";
import { AddExpense, GetExpense, GetTotalExpense, SoftDeleteExpense } from "../types/expenseTypes";

export async function addExpense(input: AddExpense){
    try{
        validateAccount(input.account);

        const expense = await ExpenseModel.create(input);

        log.info(`Expense added for account ID: ${input.account}`);

        return expense;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getTotalExpense(input: GetTotalExpense){
    try {
        validateAccount(input.accountId);
        
        const { startDate: start, endDate: end } = getTimeFrame(input.timePeriod, input.startDate, input.endDate);
    
        const expenses = await ExpenseModel.aggregate([
            {
                $match: {
                    account: new Types.ObjectId(input.accountId),
                    date: { $gte: new Date(start), $lte: new Date(end) },
                    status: 'active'
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
    
        const totalExpense = expenses.length > 0 ? expenses[0].totalAmount : 0;
        return totalExpense / 100;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}

export async function getRecentExpenses(input: GetExpense): Promise<IExpense[]> {
    try {
        validateAccount(input.accountId);

        const recentExpenses = await ExpenseModel.find({ account: input.accountId, status: 'active' })
            .sort({ date: -1 })
            .limit(input.limit)
            .lean();

        return recentExpenses.map(expense => ({
            ...expense,
            amount: parseFloat((expense.amount / 100).toFixed(2))
        })) as IExpense[];

    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}

export async function softDeleteExpense(input: SoftDeleteExpense) {
    try{
        validateAccount(input.accountId);
    
        const expense = ExpenseModel.findByIdAndUpdate(input.expenseId, { status: 'deleted' })
    
        return expense;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getDeletedExpenses(input: GetExpense): Promise<IExpense[]> {
    try {
        validateAccount(input.accountId);

        const deletedExpenses = await ExpenseModel.find({ account: input.accountId, status: 'deleted' })
            .sort({ date: -1 })
            .limit(input.limit)
            .lean();

        return deletedExpenses.map(expense => ({
            ...expense,
            amount: parseFloat((expense.amount / 100).toFixed(2))
        })) as IExpense[];

    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}