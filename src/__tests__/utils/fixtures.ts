import mongoose from "mongoose";
import UserModel from "../../modules/user/model/user.model";
import SessionModel from "../../modules/session/model/session.model";
import AccountModel from "../../modules/account/model/account.model";

export const userId = new mongoose.Types.ObjectId().toString();
export const accountId = new mongoose.Types.ObjectId().toString();

export const createUserPayload = {
    email: "dej@gmail.com",
    name: "Dej Lok",
    password: "pass12345678"
}

export const createAccountPayload = {
    userId: userId,
    accountType: "family",
    subscriptionPlan: "basic"
}

export const userReturnPayload = new UserModel({
    _id: userId,
    name: "Dej Lok",
    verified: false,
    email: "dej@gmail.com"
})

export const accountReturnPayload = new AccountModel({
    _id: accountId,
    user: userId,
    accountType: "family",
    subscriptionPlan: "basic"
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