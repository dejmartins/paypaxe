import { Types } from "mongoose";
import { AppError } from "../../../shared/utils/customErrors";
import { getTimeFrame } from "../../../shared/utils/time";
import { accountExists } from "../../account/service/account.service";
import IncomeModel, { IIncome } from "../model/income.model";
import { AddIncome, GetTotalIncome } from "../types/incomeTypes";

export async function addIncome(input: AddIncome): Promise<IIncome>{
    try{
        const currentDate = new Date();
        const incomeDate = new Date(input.dateReceived);

        if(incomeDate > currentDate){
            throw new AppError('Invalid Date - date cannot be in the future', 400);
        }
        
        const accountExist = await accountExists(input.account);

        if(!accountExist){
            throw new AppError('Account not found', 404);
        }

        const income = await IncomeModel.create(input);
        return income;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}

export async function getTotalIncome(input: GetTotalIncome){
    try {
        const accountExist = await accountExists(input.accountId);

        if(!accountExist){
            throw new AppError('Account not found', 404);
        }
        
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

