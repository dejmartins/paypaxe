import UserModel, { IUser, UserInput } from "../model/user.model";

export async function createUser(input: UserInput){
    try {
        return await UserModel.create(input)
    } catch (e: any){
        throw new Error(e)
    }
}