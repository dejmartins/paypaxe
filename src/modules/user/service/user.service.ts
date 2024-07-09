import UserModel, { IUser } from "../model/user.model";

type UserInput = Omit<IUser, 'createdAt' | 'updatedAt' | 'comparePassword'>;

export async function createUser(input: UserInput){
    try {
        return await UserModel.create(input)
    } catch (e: any){
        throw new Error(e)
    }
}