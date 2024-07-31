import mongoose from "mongoose";
import UserModel from "../../modules/user/model/user.model";
import SessionModel from "../../modules/session/model/session.model";
import AccountModel from "../../modules/account/model/account.model";
import IncomeModel from "../../modules/income/model/income.model";
import FinancialGoalModel from "../../modules/financialGoal/model/financialGoal.model";
import ExpenseModel from "../../modules/expense/model/expense.model";

export const userId = new mongoose.Types.ObjectId().toString();
export const accountId = new mongoose.Types.ObjectId().toString();
export const incomeId = new mongoose.Types.ObjectId().toString();
export const expenseId = new mongoose.Types.ObjectId().toString();
export const financialGoalId = new mongoose.Types.ObjectId().toString();

export const createUserPayload = {
    email: "dej@gmail.com",
    name: "Dej Lok",
    password: "pass12345678"
}

export const userReturnPayload = new UserModel({
    _id: userId,
    name: "Dej Lok",
    verified: false,
    email: "dej@gmail.com"
})

export const createAccountPayload = {
    userId: userId,
    accountType: "family",
    subscriptionPlan: "basic"
}

export const accountReturnPayload = new AccountModel({
    _id: accountId,
    user: userId,
    accountType: "family",
    subscriptionPlan: "basic"
})

export const addIncomePayload = {
    accountId: accountId,
    amount: 400.50,
    category: "salary",
    dateReceived: "2024-07-20"
}

export const incomeReturnPayload  = new IncomeModel({
    _id: incomeId,
    account: accountId,
    amount: 400.50,
    category: "salary",
    description: "",
    dateReceived: '2024-07-20'
})

export const addExpensePayload = {
    accountId: accountId,
    amount: 400.50,
    category: "salary",
    description: "",
    date: "25-07-2024"
}

export const expenseReturnPayload  = new ExpenseModel({
    _id: expenseId,
    account: accountId,
    amount: 400.50,
    category: "salary",
    description: "",
    date: '25-07-2024'
})

export const addGoalPayload = {
    accountId: accountId,
    title: 'New Car Purchase',
    description: "",
    targetAmount: 400.50,
    currentProgress: 100.50,
    deadline: '25-07-2024'
}

export const financialGoalReturnPayload = new FinancialGoalModel({
    _id: financialGoalId,
    account: accountId,
    tyoe: 'savings',
    title: 'New Car Purchase',
    targetAmount: 400.50,
    currentProgress: 100.50,
    description: "",
    deadline: '25-07-2024'
})

export const sessionPayload = new SessionModel({
    _id: new mongoose.Types.ObjectId().toString(),
    user: userId,
    valid: true,
    userAgent: "PostmanRuntime/7.28.4",
    createdAt: new Date("2021-09-30T13:31:07.674Z"),
    updatedAt: new Date("2021-09-30T13:31:07.674Z"),
    __v: 0,
  })