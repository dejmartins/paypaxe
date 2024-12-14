import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { successResponse } from "../../../shared/utils/response";
import { addIncome, getDeletedIncomes, getIncomeBreakdown, getIncomeByTimeFrame, getRecentIncomes, getTotalIncome, softDeleteIncome, updateIncome } from "../service/income.service";
import { AddIncomeInput } from "../schema/income.schema";
import { AppError } from "../../../shared/utils/customErrors";
import { IIncome } from "../model/income.model";
import { format } from '@fast-csv/format'
import PDFDocument from 'pdfkit'

export const addIncomeHandler = asyncHandler(async (req: Request<{}, {}, AddIncomeInput['body']>, res: Response) => {
    // @ts-ignore
    const { accountId } = req.params;
    const income = await addIncome({ account: accountId, ...req.body });
    return res.json(successResponse(income, 'Income added successfully'));
});

export const getTotalIncomeHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { timePeriod, startDate, endDate, includeNetBalance } = req.query;

    if (timePeriod && typeof timePeriod !== 'string') {
        throw new AppError('Invalid timePeriod parameter', 400);
    }
    if (startDate && isNaN(Date.parse(startDate as string))) {
        throw new AppError('Invalid startDate parameter', 400);
    }
    if (endDate && isNaN(Date.parse(endDate as string))) {
        throw new AppError('Invalid endDate parameter', 400);
    }
    if (includeNetBalance && includeNetBalance !== 'true' && includeNetBalance !== 'false') {
        throw new AppError('Invalid includeNetBalance parameter', 400);
    }

    const income = await getTotalIncome({
        accountId,
        timePeriod: timePeriod as string | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        includeNetBalance: includeNetBalance === 'true',
    });

    return res.json(successResponse(income, 'Total Income Calculated Successfully'));
});


export const getRecentIncomesHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { limit } = req.query;

    // @ts-ignore
    const recentIncomes = await getRecentIncomes({ accountId, limit });

    return res.json(successResponse(recentIncomes, 'Recent Incomes Retrieved Successfully'));
});

export const softDeleteIncomeHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId, incomeId } = req.params;

    const deletedIncome = await softDeleteIncome({ accountId: accountId, incomeId: incomeId })

    return res.json(successResponse(deletedIncome, 'Income Deleted Successfully'));
})

export const getDeletedIncomesHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { limit } = req.query;

    // @ts-ignore
    const deletedIncomes = await getDeletedIncomes({ accountId, limit });

    return res.json(successResponse(deletedIncomes, 'Deleted Incomes Retrieved Successfully'));
});

export const updateIncomeHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId, incomeId } = req.params;

    const updatedIncome = await updateIncome({ accountId, incomeId, updateFields: {...req.body} });

    return res.json(successResponse(updatedIncome, 'Incomes Updated Successfully'));
});

export const getIncomeBreakdownHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    const incomeBreakdown = await getIncomeBreakdown(accountId);

    return res.json(successResponse(incomeBreakdown, 'Income Breakdown Retrieved Successfully'));
});

export const exportIncomeHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { timePeriod, startDate, endDate, type } = req.query;

    if (typeof timePeriod !== 'string' || (startDate && typeof startDate !== 'string') || (endDate && typeof endDate !== 'string')) {
        throw new AppError('Invalid query parameters', 400);
    }

    const incomes = await getIncomeByTimeFrame({ accountId: accountId, timePeriod, startDate, endDate });

    if (!incomes || incomes.length === 0) {
        throw new AppError('No incomes found for the given time frame', 404);
    }

    if(type === 'csv') {
        await exportToCsv(res, incomes);
    } else if (type === 'pdf'){
        exportToPdf(res, incomes);
    }
});

async function exportToCsv(res: Response, incomes: IIncome[]) {
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    res.setHeader('Content-Type', 'text/csv');

    // Initialize CSV stream
    const csvStream = format({ headers: true });
    csvStream.pipe(res);

    // Writing expense data to CSV
    incomes.forEach((income) => {
        csvStream.write({
            Category: income.category,
            Amount: income.amount,
            Date: income.dateReceived,
            Description: income.description,
            Status: income.status,
        });
    });

    csvStream.end();
}

function exportToPdf(res: Response, incomes: IIncome[]) {
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Income Report', {
        align: 'center',
    });

    doc.moveDown();
    doc.fontSize(12).text(`Total Income: ${incomes.length}`, {
        align: 'left',
    });

    doc.moveDown();
    incomes.forEach((income, index) => {
        doc.text(`${index + 1}. Category: ${income.category}, Amount: ${income.amount}, Date: ${income.dateReceived}, Description: ${income.description}`);
    });

    doc.end();
}