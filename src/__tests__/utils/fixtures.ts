import mongoose from "mongoose";
import UserModel from "../../modules/user/model/user.model";

const userId = new mongoose.Types.ObjectId().toString();

export const userPayload = {
    "user": userId,
    "email": "dejalltime@gmail.com",
    "username": "dej"
}

export const createUserPayload = {
    email: "dej@gmail.com",
    name: "Dej Lok",
    password: "pass12345678"
}

export const createUserReturnPayload = new UserModel({
    _id: userId,
    name: "Dej Lok",
    verified: false,
    email: "dej@gmail.com"
})

export const sessionPayload = {
    _id: new mongoose.Types.ObjectId().toString(),
    user: userId,
    valid: true,
    userAgent: "PostmanRuntime/7.28.4",
    createdAt: new Date("2021-09-30T13:31:07.674Z"),
    updatedAt: new Date("2021-09-30T13:31:07.674Z"),
    __v: 0,
  };