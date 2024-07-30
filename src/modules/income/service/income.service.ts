import { AppError } from "../../../shared/utils/customErrors";
import { accountExists } from "../../account/service/account.service";
import IncomeModel from "../model/income.model";
import { IncomeType } from "../types/incomeTypes";

export async function addIncome(input: IncomeType){
    try{
        const accountExist = await accountExists(input.accountId);

        if(!accountExist){
            throw new AppError('Account not found', 404);
        }

        const income = await IncomeModel.create(input);
        return income;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode)
    }
}