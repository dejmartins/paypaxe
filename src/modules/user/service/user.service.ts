import { omit } from "lodash";
import UserModel, { UserInput } from "../model/user.model";

export async function createUser(input: UserInput){
    try {
        return await UserModel.create(input)
    } catch (e: any){
        throw new Error(e)
    }
}

export async function validatePassword({email, password}: {email: string, password: string}){
    const user = await UserModel.findOne({ email });

    if(!user){
        return false;
    }

    const isValid = await user.comparePassword(password);

    if(!isValid) {
        return false;
    }

    return omit(user.toJSON(), "password");
}