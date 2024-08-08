import { Types } from "mongoose";
import { AppError } from "../../../shared/utils/customErrors";
import { getTimeFrame } from "../../../shared/utils/time";
import { validateAccount } from "../../account/service/account.service";
import IncomeModel, { IIncome } from "../model/income.model";
import { AddIncome, GetRecentIncome, GetTotalIncome } from "../types/incomeTypes";

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

export async function getRecentIncomes(input: GetRecentIncome): Promise<IIncome[]> {
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
