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
    const doc = new PDFDocument({ margin: 30 });

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=expense_report.pdf');

    // Pipe the PDF into the response
    doc.pipe(res);

    // Company Name and Details
    doc
        .fontSize(20)
        .text('Paypaxe', { align: 'right' })
        .fontSize(10)
        .text('22 Ober Street, V.I', { align: 'right' })
        .text('Lagos State, 10001', { align: 'right' })
        .text('Phone: (123) 456-7890', { align: 'right' })
        .moveDown(1.5); // Increased spacing after company details

    // Receipt Title - Centralized
    doc
        .fontSize(15)
        .text('Expense Report', {
            align: 'center',
            underline: true, // Adds underline to the title
        })
        .moveDown(0.5);

    // Date
    const currentDate = new Date();
    doc
        .fontSize(10)
        .text(`Date: ${currentDate.toISOString().split('T')[0]}`, { align: 'right' })
        .moveDown(1);

    // Add a horizontal line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(0.5);

    // Table Headers with Background Color
    const tableTop = doc.y + 10;
    const noX = 50;
    const categoryX = 80;
    const descriptionX = 180; // Moved Description after Category
    const amountX = 380; // Adjusted to allow more space for Description
    const dateX = 480; // Adjusted to prevent overlapping

    // Draw a rectangle for header background
    doc
        // .rect(noX - 10, tableTop - 5, 500, 20) // Adjusted width to accommodate Description
        // .fillColor('') // Light gray background
        // .fill();

    doc
        .fontSize(10)
        // .fillColor('black') // Reset fill color to black
        .font('Helvetica-Bold')
        .text('No.', noX, tableTop, { width: 30, align: 'left' })
        .text('Category', categoryX, tableTop, { width: 100, align: 'left' })
        .text('Description', descriptionX, tableTop, { width: 200, align: 'left' }) // Increased width for Description
        .text('Amount (N)', amountX, tableTop, { width: 70, align: 'right' })
        .text('Date', dateX, tableTop, { width: 70, align: 'right' });

    // Add a horizontal line below headers
    doc.moveTo(noX, tableTop + 15).lineTo(550, tableTop + 15).stroke().moveDown(0.5);

    // Table Rows
    const rowSpacing = 10; // Reduced row spacing to accommodate wrapped text
    let y = tableTop + 25;

    expenses.forEach((expense, index: any) => {
        const { category, description, amount, date } = expense;

        // Calculate the height needed for the description
        const descriptionOptions = {
            width: 250,
            align: 'left',
        };
        // @ts-ignore
        const descriptionHeight = doc.heightOfString(description, descriptionOptions);

        // Determine the maximum height needed for the row
        const rowHeight = Math.max(20, descriptionHeight + 5); // Minimum row height

        // Draw the row
        doc
            .fontSize(10)
            .font('Helvetica')
            .text(index + 1, noX, y, { width: 30, align: 'left' })
            .text(category, categoryX, y, { width: 100, align: 'left' })
            .text(description, descriptionX, y, { width: 200, align: 'left' })
            .text(amount.toFixed(2), amountX, y, { width: 70, align: 'right' })
            .text(new Date(date).toISOString().split('T')[0], dateX, y, { width: 70, align: 'right' });

        // Move y position down by the row height
        y += rowHeight + rowSpacing;
    });

    // Add a horizontal line after the table
    doc.moveTo(noX, y - rowSpacing).lineTo(550, y - rowSpacing).stroke().moveDown(1);

    // Summary Section
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Total', amountX - 70, y, { width: 70, align: 'left' })
        .text(totalAmount.toFixed(2), amountX, y, { width: 70, align: 'right' })
        .moveDown(1);
    // Additional Notes or Footer
    doc
        .fontSize(10)
        .font('Helvetica')
        .text('Thank you for using our services!', 50, y + 30, { align: 'center', width: 500 });

    // Finalize the PDF and end the stream
    doc.end();
}
