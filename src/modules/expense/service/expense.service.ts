import { AppError } from "../../../shared/utils/customErrors";
import { accountExists } from "../../account/service/account.service";
import ExpenseModel from "../model/expense.model";
import { AddExpense } from "../types/expenseTypes";

export async function addExpense(input: AddExpense){
    try{
        const accountExist = await accountExists(input.accountId);
    
        if(!accountExist){
            throw new AppError('Account not found', 404);
        }

        const expense = await ExpenseModel.create(input);
        return expense;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode);
    }
}