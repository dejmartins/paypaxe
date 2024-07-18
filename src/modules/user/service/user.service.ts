import { omit } from "lodash";
import UserModel, { UserInput } from "../model/user.model";
import { generatePasswordResetToken, generateVerificationToken } from "../../../shared/utils/jwt.utils";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../email/services/email.service";

export async function createUser(input: UserInput){
    try {
        const user = await UserModel.create(input)
        const token = generateVerificationToken(user);
        await sendVerificationEmail(user.email, token);
        return user;
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

export async function requestPasswordReset(email: string) {
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    const token = generatePasswordResetToken(user);
    await sendPasswordResetEmail(user.email, token);
}