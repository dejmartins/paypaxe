import { Types } from "mongoose";
import { AppError } from "../../../shared/utils/customErrors";
import log from "../../../shared/utils/logger";
import { getTimeFrame } from "../../../shared/utils/time";
import { accountExists } from "../../account/service/account.service";
import ExpenseModel, { IExpense } from "../model/expense.model";
import { AddExpense, GetRecentExpense, GetTotalExpense } from "../types/expenseTypes";

export async function addExpense(input: AddExpense){
    try{
        const accountExist = await accountExists(input.account);
    
        if(!accountExist){
            throw new AppError('Account not found', 404);
        }

        const expense = await ExpenseModel.create(input);

        log.info(`Expense added for account ID: ${input.account}`);

        return expense;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getTotalExpense(input: GetTotalExpense){
    try {
        const accountExist = await accountExists(input.accountId);

        if(!accountExist){
            throw new AppError('Account not found', 404);
        }
        
        const { startDate: start, endDate: end } = getTimeFrame(input.timePeriod, input.startDate, input.endDate);
    
        const expenses = await ExpenseModel.aggregate([
            {
                $match: {
                    account: new Types.ObjectId(input.accountId),
                    date: { $gte: new Date(start), $lte: new Date(end) }
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

export async function getRecentExpenses(input: GetRecentExpense): Promise<IExpense[]> {
    try {
        const accountExist = await accountExists(input.accountId);

        if(!accountExist){
            throw new AppError('Account not found', 404);
        }

        const recentExpenses = await ExpenseModel.find({ account: input.accountId })
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