import { AppError } from "../../../shared/utils/customErrors";
import { accountExists } from "../../account/service/account.service";
import FinancialGoalModel from "../model/financialGoal.model";
import { FinancialGoalInput } from "../types/financialGoalTypes";

export async function addGoal(input: FinancialGoalInput){
    try{
        const accountExist = await accountExists(input.account);
    
        if(!accountExist){
            throw new AppError('Account not found', 404);
        }

        const goal = await FinancialGoalModel.create(input);
        return goal;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}