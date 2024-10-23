import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { successResponse } from "../../../shared/utils/response";
import { AddExpenseInput } from "../schema/expense.schema";
import { addExpense, getDeletedExpenses, getExpenseByTimeFrame, getRecentExpenses, getTotalExpense, softDeleteExpense, updateExpense } from "../service/expense.service";
import { AppError } from "../../../shared/utils/customErrors";
import { format } from '@fast-csv/format'
import PDFDocument from 'pdfkit'
import { IExpense } from "../model/expense.model";

export const addExpenseHandler = asyncHandler(async (req: Request<{}, {}, AddExpenseInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const expense = await addExpense({ account: accountId, ...req.body });
    return res.json(successResponse(expense, 'Expense added successfully'));
});

export const getTotalExpenseHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { timePeriod, startDate, endDate } = req.query;

    if (typeof timePeriod !== 'string' || (startDate && typeof startDate !== 'string') || (endDate && typeof endDate !== 'string')) {
        throw new AppError('Invalid query parameters', 400);
    }

    const expense = await getTotalExpense({ accountId: accountId, timePeriod, startDate, endDate });
    return res.json(successResponse({ totalExpense: expense }, 'Total Expense Calculated Successfully'));
});

export const getRecentExpensesHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { limit } = req.query;

    // @ts-ignore
    const recentExpenses = await getRecentExpenses({ accountId, limit });

    return res.json(successResponse(recentExpenses, 'Recent Expenses Retrieved Successfully'));
});

export const softDeleteExpenseHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId, expenseId } = req.params;

    const deletedExpense = await softDeleteExpense({ accountId: accountId, expenseId: expenseId })

    return res.json(successResponse(deletedExpense, 'Expense Deleted Successfully'));
})

export const getDeletedExpensesHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { limit } = req.query;

    // @ts-ignore
    const deletedExpenses = await getDeletedExpenses({ accountId, limit });

    return res.json(successResponse(deletedExpenses, 'Deleted Expenses Retrieved Successfully'));
});

export const updateExpenseHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId, expenseId } = req.params;

    const updatedExpense = await updateExpense({ accountId, expenseId, updateFields: {...req.body} });

    return res.json(successResponse(updatedExpense, 'Expenses Updated Successfully'));
});

export const exportExpenseHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { timePeriod, startDate, endDate, type } = req.query;

    if (typeof timePeriod !== 'string' || (startDate && typeof startDate !== 'string') || (endDate && typeof endDate !== 'string')) {
        throw new AppError('Invalid query parameters', 400);
    }

    const expenses = await getExpenseByTimeFrame({ accountId: accountId, timePeriod, startDate, endDate });

    if (!expenses || expenses.length === 0) {
        throw new AppError('No expenses found for the given time frame', 404);
    }

    if(type === 'csv') {
        await exportToCsv(res, expenses);
    } else if (type === 'pdf'){
        exportToPdf(res, expenses);
    }
});

async function exportToCsv(res: Response, expenses: IExpense[]) {
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    res.setHeader('Content-Type', 'text/csv');

    // Initialize CSV stream
    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    // Writing expense data to CSV
    expenses.forEach((expense) => {
        csvStream.write({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date,
            Description: expense.description,
            Status: expense.status,
        });
    });

    csvStream.end();
}

function exportToPdf(res: Response, expenses: IExpense[]) {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Expense Report', {
        align: 'center',
    });

    doc.moveDown();
    doc.fontSize(12).text(`Total Expenses: ${expenses.length}`, {
        align: 'left',
    });

    doc.moveDown();
    expenses.forEach((expense, index) => {
        doc.text(`${index + 1}. Category: ${expense.category}, Amount: ${expense.amount}, Date: ${expense.date}, Description: ${expense.description}`);
    });

    doc.end();
}