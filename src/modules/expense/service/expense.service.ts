import { Types } from "mongoose";
import { AppError } from "../../../shared/utils/customErrors";
import log from "../../../shared/utils/logger";
import { getTimeFrame } from "../../../shared/utils/time";
import { validateAccount } from "../../account/service/account.service";
import ExpenseModel, { IExpense } from "../model/expense.model";
import { AddExpense, GetExpense, GetExpenseByTimeFrame, GetTotalExpense, SoftDeleteExpense, UpdateExpense } from "../types/expenseTypes";

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

export async function updateExpense(input: UpdateExpense) {
    try {
        validateAccount(input.accountId);
        
        const updatedExpense = await ExpenseModel.findOneAndUpdate(
            { _id: input.expenseId, status: 'active' },
            { $set: input.updateFields },
            { new: true }
        );

        if (!updatedExpense) {
            throw new AppError("Expense not found.", 404);
        }

        return updatedExpense;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}

export async function getExpenseByTimeFrame(input: GetExpenseByTimeFrame) {
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
            }
        ]);

        return expenses;
        
    } catch (error: any) {
        log.error(`Error getting expense by time frame: ${error.message}`);
        throw new AppError(error.message, error.statusCode)
    }
}

export async function handleRecurringExpenses() {
    try {
        const recurringExpenses = await ExpenseModel.find({
            isRecurring: true,
            status: 'active'
        });

        const now = new Date();

        for (const expense of recurringExpenses) {
            if (shouldAddRecurringExpense(expense, now)) {
                const newExpenseData = {
                    amount: expense.amount,
                    category: expense.category,
                    description: expense.description,
                    isRecurring: expense.isRecurring,
                    frequency: expense.frequency,
                    _id: undefined,
                    createdAt: undefined,
                    updatedAt: undefined,
                    date: now
                };

                await ExpenseModel.create(newExpenseData);
                log.info(`Recurring expense added for account ID: ${expense.account}`);
            }
        }
    } catch (error: any) {
        log.error(`Error handling recurring expenses: ${error.message}`);
    }
}

function shouldAddRecurringExpense(expense: IExpense, now: Date): boolean {
    const lastAddedDate = new Date(expense.date);
    const frequency = expense.frequency;

    switch (frequency) {
        case 'daily':
            return lastAddedDate < new Date(now.setDate(now.getDate() - 1));
        case 'weekly':
            return lastAddedDate < new Date(now.setDate(now.getDate() - 7));
        case 'monthly':
            return lastAddedDate < new Date(now.setMonth(now.getMonth() - 1));
        case 'yearly':
            return lastAddedDate < new Date(now.setFullYear(now.getFullYear() - 1));
        default:
            return false;
    }
}